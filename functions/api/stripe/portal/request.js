/**
 * NotchIA — Stripe Customer Portal (étape 1 : demande de magic-link)
 *
 * POST /api/stripe/portal/request
 * Body JSON : { email: string, lang?: "fr"|"en"|"es"|"de" }
 *
 * - Si l'email correspond à un Stripe Customer existant → on génère un
 *   token HMAC-SHA256 (TTL 15 min) et on envoie un email Resend
 *   contenant l'URL `https://notchia.app/api/stripe/portal?token=...`
 * - Sinon → on ne fait rien.
 *
 * Dans TOUS les cas la réponse est { ok: true }. Anti-énumération :
 * un attaquant ne peut PAS déduire si un email a un compte Stripe.
 *
 * Bindings / env vars requis :
 *   STRIPE_SECRET_KEY      — clé API Stripe live (read Customers)
 *   PORTAL_TOKEN_SECRET    — secret HMAC (32+ bytes hex)
 *   RESEND_API_KEY         — pour envoyer l'email
 *   CONTACT_FROM           — ex: "contact@notchia.app"
 */

import { signPortalToken } from "../_portal-token.js";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "https://notchia.app",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...CORS_HEADERS },
  });
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

function methodNotAllowed() {
  return new Response("Method Not Allowed", {
    status: 405,
    headers: { "Allow": "POST", "Content-Type": "text/plain; charset=utf-8" },
  });
}
export const onRequestGet = methodNotAllowed;
export const onRequestPut = methodNotAllowed;
export const onRequestDelete = methodNotAllowed;
export const onRequestPatch = methodNotAllowed;

export async function onRequestPost({ request, env }) {
  // On répond toujours { ok: true } côté client pour éviter
  // l'énumération d'emails. On ne signale que les vraies erreurs de
  // config service (503) — pas liées à l'existence d'un compte.
  if (!env.STRIPE_SECRET_KEY || !env.PORTAL_TOKEN_SECRET) {
    console.error("portal/request: missing STRIPE_SECRET_KEY or PORTAL_TOKEN_SECRET");
    return json({ error: "Service indisponible." }, 503);
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: "JSON invalide." }, 400);
  }

  const email = (payload?.email || "").trim().toLowerCase();
  if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: "Email invalide." }, 400);
  }

  const allowedLangs = ["fr", "en", "es", "de"];
  let lang = (payload?.lang || "").toString().toLowerCase();
  if (!allowedLangs.includes(lang)) lang = "fr";

  // Lookup Stripe Customer par email. On NE révèle JAMAIS le résultat.
  let customerId = null;
  try {
    const lookupUrl = new URL("https://api.stripe.com/v1/customers");
    lookupUrl.searchParams.set("email", email);
    lookupUrl.searchParams.set("limit", "1");
    const r = await fetch(lookupUrl.toString(), {
      headers: { "Authorization": `Bearer ${env.STRIPE_SECRET_KEY}` },
    });
    if (r.ok) {
      const j = await r.json().catch(() => ({}));
      const first = Array.isArray(j?.data) ? j.data[0] : null;
      if (first?.id && typeof first.id === "string") {
        customerId = first.id;
        // Si le customer expose une locale, on l'utilise plutôt
        // que le param lang fourni par l'appelant.
        const meta = first.metadata || {};
        const candidate = (first.preferred_locales?.[0] || meta.lang || "")
          .toString().toLowerCase().slice(0, 2);
        if (allowedLangs.includes(candidate)) lang = candidate;
      }
    } else {
      console.error("portal/request: stripe list customers status", r.status);
    }
  } catch (e) {
    console.error("portal/request: stripe lookup threw", e?.message);
  }

  if (customerId) {
    try {
      const token = await signPortalToken(customerId, env.PORTAL_TOKEN_SECRET);
      const link = `https://notchia.app/api/stripe/portal?token=${encodeURIComponent(token)}`;
      await sendPortalEmail(env, email, link, lang);
    } catch (e) {
      // On loggue côté serveur mais on ne propage RIEN au client :
      // toujours `{ ok: true }`.
      console.error("portal/request: sign/send failed", e?.message);
    }
  }

  // Réponse générique systématique.
  return json({ ok: true });
}

// ────────────────────────────────────────────────────────────────────────
// Email magic-link
// ────────────────────────────────────────────────────────────────────────

const SUBJECTS = {
  fr: "Votre lien d'accès au portail NotchIA",
  en: "Your NotchIA portal access link",
  es: "Tu enlace de acceso al portal NotchIA",
  de: "Dein NotchIA-Portal-Zugangslink",
};

const BODY_TEXTS = {
  fr: {
    intro: "Cliquez sur ce lien pour gérer votre abonnement / vos factures.",
    expires: "Il expire dans 15 minutes.",
    ignore: "Si vous n'avez pas demandé cet email, ignorez-le.",
    cta: "Ouvrir le portail",
  },
  en: {
    intro: "Click this link to manage your subscription / invoices.",
    expires: "It expires in 15 minutes.",
    ignore: "If you didn't request this email, just ignore it.",
    cta: "Open the portal",
  },
  es: {
    intro: "Haz clic en este enlace para gestionar tu suscripción / facturas.",
    expires: "Caduca en 15 minutos.",
    ignore: "Si no solicitaste este correo, ignóralo.",
    cta: "Abrir el portal",
  },
  de: {
    intro: "Klicke auf diesen Link, um dein Abo / deine Rechnungen zu verwalten.",
    expires: "Er läuft in 15 Minuten ab.",
    ignore: "Wenn du diese E-Mail nicht angefordert hast, ignoriere sie einfach.",
    cta: "Portal öffnen",
  },
};

function plainTextBody(link, lang) {
  const t = BODY_TEXTS[lang] || BODY_TEXTS.en;
  return `${t.intro}\n\n${link}\n\n${t.expires}\n\n${t.ignore}\n\n— NotchIA`;
}

function htmlBody(link, lang) {
  const t = BODY_TEXTS[lang] || BODY_TEXTS.en;
  return `<!DOCTYPE html>
<html lang="${lang}"><head><meta charset="UTF-8"><title>NotchIA</title></head>
<body style="margin:0;padding:0;background:#F5F2EA;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#0B0D12;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F5F2EA;padding:32px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 8px 24px rgba(0,0,0,0.06);">
        <tr><td style="padding:32px 32px 8px 32px;font-size:20px;font-weight:600;line-height:1.3;">NotchIA</td></tr>
        <tr><td style="padding:8px 32px 16px 32px;font-size:15px;line-height:1.55;color:#3A3A3A;">${t.intro}</td></tr>
        <tr><td style="padding:8px 32px 16px 32px;">
          <a href="${link}" style="display:inline-block;background:linear-gradient(90deg,#A855F7 0%,#FF4D88 30%,#FF7A2D 60%,#4DA8FF 100%);color:#0B0D12;text-decoration:none;font-weight:700;padding:12px 24px;border-radius:999px;">${t.cta}</a>
        </td></tr>
        <tr><td style="padding:0 32px 16px 32px;font-family:ui-monospace,Menlo,monospace;font-size:12px;background:#F5F2EA;border:1px solid #E0DCD0;border-radius:10px;padding:14px 16px;word-break:break-all;line-height:1.5;color:#5A5A5A;">${link}</td></tr>
        <tr><td style="padding:16px 32px 8px 32px;font-size:13px;line-height:1.55;color:#5A5A5A;">${t.expires}</td></tr>
        <tr><td style="padding:8px 32px 24px 32px;font-size:13px;line-height:1.55;color:#5A5A5A;">${t.ignore}</td></tr>
        <tr><td style="padding:12px 32px 28px 32px;border-top:1px solid #EFE9DD;font-size:11px;line-height:1.5;color:#9A9A9A;font-family:ui-monospace,Menlo,monospace;">© 2026 NotchIA · COURTY Axel · Talence, France</td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

// Réutilise le pattern de cleanResendKey() du webhook.
function cleanResendKey(raw) {
  if (!raw) return "";
  const s = String(raw).trim();
  const i = s.indexOf("re_");
  return i >= 0 ? s.slice(i) : s;
}

async function sendPortalEmail(env, email, link, lang) {
  const apiKey = cleanResendKey(env.RESEND_API_KEY);
  if (!apiKey) {
    console.error("portal/request: RESEND_API_KEY missing, email not sent");
    return;
  }
  const from = (env.CONTACT_FROM || "contact@notchia.app").trim();
  const subject = SUBJECTS[lang] || SUBJECTS.en;

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
      text: plainTextBody(link, lang),
      html: htmlBody(link, lang),
    }),
  });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    console.error("portal/request: resend error", res.status, t.slice(0, 200));
  }
}
