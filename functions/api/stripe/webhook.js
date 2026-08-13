/**
 * NotchIA — Stripe webhook handler
 *
 * POST /api/stripe/webhook  (appelé par Stripe, body raw)
 *
 * Events traités :
 *   - checkout.session.completed   → crée la licence + envoie l'email
 *   - invoice.payment_succeeded    → étend l'expiration mensuelle
 *   - invoice.payment_failed       → marque la licence 'expired'
 *   - customer.subscription.deleted → marque 'cancelled'
 *   - charge.refunded              → marque 'refunded' + révoque
 *
 * Env vars requises :
 *   STRIPE_WEBHOOK_SECRET  (whsec_xxx)
 *   STRIPE_SECRET_KEY      (pour requêtes Stripe API si besoin)
 *   LICENSE_PRIVATE_KEY    (signature Ed25519 des licences)
 *   RESEND_API_KEY         (envoi email)
 *   CONTACT_FROM           (ex: contact@notchia.app)
 *
 * Bindings requis :
 *   DB  (Cloudflare D1, base "notchia-licenses")
 */

import { generateLicenseKey, verifyStripeSignature, shortHash } from "../license/_crypto.js";

const MONTHLY_PERIOD_DAYS = 31; // marge sur le mois civil
const MAX_DEVICES = { monthly: 1, lifetime: 2 };

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

export async function onRequestPost({ request, env }) {
  // 1. Validation env
  if (!env.STRIPE_WEBHOOK_SECRET) return json({ error: "webhook secret missing" }, 503);
  if (!env.LICENSE_PRIVATE_KEY)   return json({ error: "license key missing" }, 503);
  if (!env.DB)                    return json({ error: "D1 binding missing" }, 503);

  // 2. Lecture body brut + vérif signature Stripe
  const rawBody = await request.text();
  const sigHeader = request.headers.get("Stripe-Signature");
  const sigOk = await verifyStripeSignature(rawBody, sigHeader, env.STRIPE_WEBHOOK_SECRET);
  if (!sigOk) {
    console.log("Stripe sig invalid", sigHeader?.slice(0, 60));
    return json({ error: "invalid signature" }, 400);
  }

  let event;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return json({ error: "invalid json" }, 400);
  }

  // 3. Idempotence — si on a déjà traité cet event, ack 200 sans rejouer
  const existing = await env.DB
    .prepare("SELECT id, processed FROM webhook_events WHERE id = ?")
    .bind(event.id).first();
  if (existing && existing.processed === 1) {
    return json({ ok: true, duplicate: true });
  }
  await env.DB
    .prepare("INSERT OR IGNORE INTO webhook_events (id, type, received_at, processed) VALUES (?, ?, ?, 0)")
    .bind(event.id, event.type, Math.floor(Date.now() / 1000))
    .run();

  // 4. Dispatch par type
  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object, env);
        break;
      case "invoice.payment_succeeded":
        await handleInvoicePaid(event.data.object, env);
        break;
      case "invoice.payment_failed":
        await handlePaymentFailed(event.data.object, env);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object, env);
        break;
      case "charge.refunded":
        await handleChargeRefunded(event.data.object, env);
        break;
      default:
        // Event non géré → on ack quand même pour pas que Stripe retry
        console.log("Webhook unhandled event", event.type);
    }
    await env.DB.prepare("UPDATE webhook_events SET processed = 1 WHERE id = ?").bind(event.id).run();
    return json({ ok: true });
  } catch (e) {
    console.log("Webhook handler error", event.type, e?.message);
    await env.DB.prepare("UPDATE webhook_events SET processed = 2 WHERE id = ?").bind(event.id).run();
    // On renvoie 500 → Stripe va retry. Si l'erreur est permanente (bug code),
    // les retries finiront par stopper après 3 jours.
    return json({ error: e?.message || "handler failed" }, 500);
  }
}

// ────────────────────────────────────────────────────────────────────────
// Handlers
// ────────────────────────────────────────────────────────────────────────

async function handleCheckoutCompleted(session, env) {
  // session = objet Checkout Session complet
  const plan = session?.metadata?.plan;
  const lang = session?.metadata?.lang || "fr";
  const email = session?.customer_details?.email || session?.customer_email;
  if (!plan || !email) {
    console.log("checkout.session.completed missing plan/email", session.id);
    return;
  }
  if (!["monthly", "lifetime"].includes(plan)) {
    console.log("Unknown plan in metadata", plan);
    return;
  }

  // Génération licence Ed25519
  // iat DÉTERMINISTE (basé sur session.created, stable entre rejeux webhook) :
  // la même session régénère toujours la même licenseKey → un rejeu Stripe
  // collisionne sur la PRIMARY KEY `licenses.key` et ne crée pas de doublon.
  const now = Math.floor(Date.now() / 1000);
  const iat = session.created || now;
  const jti = await shortHash(session.id);
  const max = MAX_DEVICES[plan];
  const exp = plan === "monthly" ? iat + MONTHLY_PERIOD_DAYS * 86400 : null;

  const payload = { sub: email, plan, iat, jti, max };
  if (exp) payload.exp = exp;

  const licenseKey = await generateLicenseKey(payload, env.LICENSE_PRIVATE_KEY);

  // Insert en D1 — INSERT OR IGNORE : si la clé existe déjà (rejeu webhook ou
  // livraison concurrente du même event), aucune ligne n'est créée (changes=0).
  const insert = await env.DB
    .prepare(`
      INSERT OR IGNORE INTO licenses
        (key, email, plan, status, stripe_customer_id, stripe_subscription_id,
         stripe_session_id, created_at, updated_at, expires_at, active_devices, max_devices)
      VALUES (?, ?, ?, 'active', ?, ?, ?, ?, ?, ?, 0, ?)
    `)
    .bind(
      licenseKey, email, plan,
      session.customer || null,
      session.subscription || null,
      session.id,
      now, now, exp, max
    )
    .run();

  // Aucune ligne insérée → licence déjà émise pour cette session : on n'envoie
  // PAS un second email (évite le double-mail sur rejeu/concurrence Stripe).
  if (insert?.meta?.changes === 0) {
    console.log("license already issued, skip duplicate email", session.id);
    return;
  }

  // Email de livraison via Resend
  await sendLicenseEmail(env, email, licenseKey, plan, lang);
}

async function handleInvoicePaid(invoice, env) {
  // Renouvellement mensuel — étend l'expiration de 31 j
  const subId = invoice?.subscription;
  if (!subId) return;
  const now = Math.floor(Date.now() / 1000);
  const newExp = now + MONTHLY_PERIOD_DAYS * 86400;
  await env.DB
    .prepare(`
      UPDATE licenses
      SET expires_at = ?, status = 'active', updated_at = ?
      WHERE stripe_subscription_id = ?
    `)
    .bind(newExp, now, subId)
    .run();
}

async function handlePaymentFailed(invoice, env) {
  // Échec de paiement : on NE coupe PAS immédiatement (grace period pendant les
  // Smart Retries Stripe). On passe en 'past_due' — encore valide tant que
  // expires_at n'est pas dépassé (cf. validate.js). La coupure définitive vient
  // de customer.subscription.deleted quand Stripe abandonne les retries.
  const subId = invoice?.subscription;
  if (!subId) return;
  const now = Math.floor(Date.now() / 1000);
  await env.DB
    .prepare(`UPDATE licenses SET status = 'past_due', updated_at = ? WHERE stripe_subscription_id = ? AND status = 'active'`)
    .bind(now, subId)
    .run();
}

async function handleSubscriptionDeleted(subscription, env) {
  const subId = subscription?.id;
  if (!subId) return;
  const now = Math.floor(Date.now() / 1000);
  await env.DB
    .prepare(`UPDATE licenses SET status = 'cancelled', updated_at = ? WHERE stripe_subscription_id = ?`)
    .bind(now, subId)
    .run();
}

/**
 * Retrouve la Checkout Session à l'origine d'une charge.
 *
 * `charge.payment_intent` est un `pi_…` : il ne peut JAMAIS être égal à la
 * colonne `stripe_session_id` (`cs_…`). Il faut donc demander à Stripe la
 * session correspondant à ce PaymentIntent. La clé restreinte a le scope
 * Checkout Sessions: Write, qui couvre la lecture.
 *
 * Renvoie null si la session est introuvable (cas normal pour les factures
 * d'abonnement récurrentes : elles n'ont pas de Checkout Session).
 */
async function resolveSessionId(charge, env) {
  const pi = typeof charge?.payment_intent === "string"
    ? charge.payment_intent
    : charge?.payment_intent?.id;
  if (!pi || !env.STRIPE_SECRET_KEY) return null;
  try {
    const res = await fetch(
      `https://api.stripe.com/v1/checkout/sessions?payment_intent=${encodeURIComponent(pi)}&limit=1`,
      { headers: { Authorization: `Bearer ${String(env.STRIPE_SECRET_KEY).trim()}` } }
    );
    if (!res.ok) {
      console.log("stripe session lookup failed", res.status, (await res.text().catch(() => "")).slice(0, 200));
      return null;
    }
    const data = await res.json();
    return data?.data?.[0]?.id || null;
  } catch (e) {
    console.log("stripe session lookup threw", e?.message);
    return null;
  }
}

async function handleChargeRefunded(charge, env) {
  // 1. Stripe émet charge.refunded pour TOUT remboursement, y compris partiel
  //    (geste commercial de quelques euros). Révoquer dans ce cas couperait
  //    l'accès d'un client qui a payé l'essentiel de sa licence.
  const amount = Number(charge?.amount ?? 0);
  const refunded = Number(charge?.amount_refunded ?? 0);
  const fullyRefunded = charge?.refunded === true || (amount > 0 && refunded >= amount);
  if (!fullyRefunded) {
    console.log("charge.refunded partiel — pas de révocation", charge?.id, `${refunded}/${amount}`);
    return;
  }

  // 2. Cibler LA licence concernée, jamais « toutes celles du client » :
  //    un même client peut cumuler un abonnement et un achat à vie, ou avoir
  //    acheté deux licences. L'ancienne requête (OR stripe_customer_id = ?)
  //    les révoquait toutes d'un coup.
  const sessionId = charge?.metadata?.session_id || (await resolveSessionId(charge, env));
  if (!sessionId) {
    // Cas attendu pour un remboursement de facture d'abonnement (pas de
    // Checkout Session) : la coupure viendra de customer.subscription.deleted.
    console.log(
      "charge.refunded : aucune session résolue, révocation manuelle si besoin",
      charge?.id, charge?.payment_intent, charge?.customer
    );
    return;
  }

  const now = Math.floor(Date.now() / 1000);
  const res = await env.DB
    .prepare(`
      UPDATE licenses
      SET status = 'refunded', updated_at = ?
      WHERE stripe_session_id = ?
    `)
    .bind(now, sessionId)
    .run();

  const changed = res?.meta?.changes ?? 0;
  console.log(
    changed > 0
      ? `license revoked after refund (session ${sessionId})`
      : `charge.refunded : aucune licence pour la session ${sessionId}`
  );
}

// ────────────────────────────────────────────────────────────────────────
// Email de livraison
// ────────────────────────────────────────────────────────────────────────

const EMAIL_SUBJECTS = {
  fr: "Ta clé NotchIA Pro 🦉",
  en: "Your NotchIA Pro key 🦉",
  es: "Tu clave NotchIA Pro 🦉",
  de: "Dein NotchIA-Pro-Schlüssel 🦉",
};

function emailBody(licenseKey, plan, lang) {
  const planLabel = {
    fr: { monthly: "Pro mensuel", lifetime: "Pro à vie" },
    en: { monthly: "Pro monthly",  lifetime: "Pro lifetime" },
    es: { monthly: "Pro mensual",  lifetime: "Pro de por vida" },
    de: { monthly: "Pro monatlich",lifetime: "Pro lebenslang" },
  }[lang] || { monthly: "Pro monthly", lifetime: "Pro lifetime" };

  const T = {
    fr: {
      h1: `Bienvenue dans NotchIA ${planLabel[plan]}`,
      p1: "Merci pour ton achat. Ta clé de licence est juste en dessous — colle-la dans NotchIA via Réglages → Licence pour débloquer les fonctionnalités Pro.",
      label: "Clé de licence",
      p2: "Cette clé est unique et signée cryptographiquement. Ne la partage pas. Tu peux l'utiliser sur " + (plan === "lifetime" ? "2 Mac" : "1 Mac") + ".",
      p3: "Si tu n'as pas encore installé NotchIA, télécharge-la ici :",
      link_dl: "Télécharger NotchIA",
      manage: "Gérer mon compte / facturation",
      help_q: "Besoin d'aide ?",
      help_a: 'Écris-nous via <a href="https://notchia.app/contact">notchia.app/contact</a>. On répond sous 48h ouvrées.',
      footer: "© 2026 NotchIA · COURTY Axel · Talence, France",
    },
    en: {
      h1: `Welcome to NotchIA ${planLabel[plan]}`,
      p1: "Thanks for your purchase. Your license key is right below — paste it into NotchIA via Settings → License to unlock Pro features.",
      label: "License key",
      p2: "This key is unique and cryptographically signed. Don't share it. You can use it on " + (plan === "lifetime" ? "2 Macs" : "1 Mac") + ".",
      p3: "If you haven't installed NotchIA yet, get it here:",
      link_dl: "Download NotchIA",
      manage: "Manage account / billing",
      help_q: "Need help?",
      help_a: 'Write to us via <a href="https://notchia.app/contact">notchia.app/contact</a>. We reply within 48 business hours.',
      footer: "© 2026 NotchIA · COURTY Axel · Talence, France",
    },
    es: {
      h1: `Bienvenido a NotchIA ${planLabel[plan]}`,
      p1: "Gracias por tu compra. Tu clave de licencia está justo debajo — pégala en NotchIA en Ajustes → Licencia para desbloquear las funciones Pro.",
      label: "Clave de licencia",
      p2: "Esta clave es única y está firmada criptográficamente. No la compartas. Puedes usarla en " + (plan === "lifetime" ? "2 Mac" : "1 Mac") + ".",
      p3: "Si aún no has instalado NotchIA, descárgala aquí:",
      link_dl: "Descargar NotchIA",
      manage: "Gestionar cuenta / facturación",
      help_q: "¿Necesitas ayuda?",
      help_a: 'Escríbenos a <a href="https://notchia.app/contact">notchia.app/contact</a>. Respondemos en 48h laborables.',
      footer: "© 2026 NotchIA · COURTY Axel · Talence, Francia",
    },
    de: {
      h1: `Willkommen bei NotchIA ${planLabel[plan]}`,
      p1: "Danke für deinen Kauf. Dein Lizenzschlüssel ist gleich unten — füge ihn in NotchIA unter Einstellungen → Lizenz ein, um die Pro-Funktionen freizuschalten.",
      label: "Lizenzschlüssel",
      p2: "Dieser Schlüssel ist eindeutig und kryptografisch signiert. Teile ihn nicht. Du kannst ihn auf " + (plan === "lifetime" ? "2 Macs" : "1 Mac") + " verwenden.",
      p3: "Wenn du NotchIA noch nicht installiert hast, hol es dir hier:",
      link_dl: "NotchIA herunterladen",
      manage: "Konto / Abrechnung verwalten",
      help_q: "Hilfe benötigt?",
      help_a: 'Schreib uns über <a href="https://notchia.app/contact">notchia.app/contact</a>. Wir antworten innerhalb von 48 Werktagen.',
      footer: "© 2026 NotchIA · COURTY Axel · Talence, Frankreich",
    },
  }[lang] || T?.en;

  // HTML email simple, mobile-friendly, sans dépendance CSS externe
  return `<!DOCTYPE html>
<html lang="${lang}"><head><meta charset="UTF-8"><title>${T.h1}</title></head>
<body style="margin:0;padding:0;background:#F5F2EA;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#0B0D12;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F5F2EA;padding:32px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 8px 24px rgba(0,0,0,0.06);">
        <tr><td style="padding:32px 32px 8px 32px;">
          <div style="font-size:24px;font-weight:600;line-height:1.3;">${T.h1}</div>
        </td></tr>
        <tr><td style="padding:8px 32px 16px 32px;font-size:15px;line-height:1.55;color:#3A3A3A;">${T.p1}</td></tr>
        <tr><td style="padding:8px 32px 8px 32px;">
          <div style="font-size:11px;font-family:ui-monospace,Menlo,monospace;text-transform:uppercase;letter-spacing:0.15em;color:#7A7A7A;margin-bottom:6px;">${T.label}</div>
          <div style="font-family:ui-monospace,Menlo,monospace;font-size:13px;background:#F5F2EA;border:1px solid #E0DCD0;border-radius:10px;padding:14px 16px;word-break:break-all;line-height:1.5;">${licenseKey}</div>
        </td></tr>
        <tr><td style="padding:16px 32px 8px 32px;font-size:14px;line-height:1.55;color:#5A5A5A;">${T.p2}</td></tr>
        <tr><td style="padding:16px 32px 8px 32px;font-size:14px;line-height:1.55;color:#3A3A3A;">${T.p3}</td></tr>
        <tr><td style="padding:8px 32px 16px 32px;">
          <a href="https://notchia.app/install" style="display:inline-block;background:linear-gradient(90deg,#A855F7 0%,#FF4D88 30%,#FF7A2D 60%,#4DA8FF 100%);color:#0B0D12;text-decoration:none;font-weight:700;padding:12px 24px;border-radius:999px;">${T.link_dl}</a>
        </td></tr>
        <tr><td style="padding:24px 32px 8px 32px;font-size:14px;line-height:1.55;color:#3A3A3A;">
          <a href="https://notchia.app/account" style="color:#FF7A2D;">${T.manage}</a>
        </td></tr>
        <tr><td style="padding:24px 32px 16px 32px;border-top:1px solid #EFE9DD;font-size:13px;line-height:1.55;color:#5A5A5A;">
          <strong>${T.help_q}</strong> ${T.help_a}
        </td></tr>
        <tr><td style="padding:16px 32px 32px 32px;font-size:11px;line-height:1.5;color:#9A9A9A;font-family:ui-monospace,Menlo,monospace;">
          ${T.footer}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

// Nettoie une clé Resend : retire espaces et tout caractère parasite avant
// le "re_" (ex: un "❯ " collé depuis un prompt terminal). Évite l'erreur
// "API key is invalid" / header Authorization non-ASCII.
function cleanResendKey(raw) {
  if (!raw) return "";
  const s = String(raw).trim();
  const i = s.indexOf("re_");
  return i >= 0 ? s.slice(i) : s;
}

async function sendLicenseEmail(env, email, licenseKey, plan, lang) {
  const apiKey = cleanResendKey(env.RESEND_API_KEY);
  if (!apiKey) {
    console.log("RESEND_API_KEY missing — license generated but email NOT sent for", email);
    return;
  }
  const from = (env.CONTACT_FROM || "contact@notchia.app").trim();
  const subject = EMAIL_SUBJECTS[lang] || EMAIL_SUBJECTS.en;
  const html = emailBody(licenseKey, plan, lang);

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `NotchIA <${from}>`,
        to: [email],
        subject,
        html,
      }),
    });
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      console.log("Resend send license error", res.status, t.slice(0, 300));
    }
  } catch (e) {
    console.log("Resend send license threw", e?.message);
  }
}

// redeploy: reload RESEND_API_KEY (fixed ❯ prefix) 2026-05-21
