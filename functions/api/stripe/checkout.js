// Trigger redeploy : env vars Stripe au complet (2026-05-19).
/**
 * NotchIA — Stripe Checkout session creator
 *
 * POST /api/stripe/checkout
 * Body : { plan: "monthly" | "lifetime", email?: string, lang?: string }
 * Reply : { url: "https://checkout.stripe.com/..." } | { error }
 *
 * Env vars Cloudflare Pages :
 *   STRIPE_SECRET_KEY     = sk_live_xxx (Restricted key avec write:checkout_sessions)
 *   STRIPE_PRICE_MONTHLY  = price_xxx (Pro mensuel 2,99 €/mois)
 *   STRIPE_PRICE_LIFETIME = price_xxx (Pro à vie 24,99 € one-time)
 */

const ALLOWED_PLANS = ["monthly", "lifetime"];

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...corsHeaders() },
  });
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function onRequestPost({ request, env }) {
  if (!env.STRIPE_SECRET_KEY) {
    return json({ error: "Stripe non configuré côté serveur." }, 503);
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: "Requête invalide." }, 400);
  }

  const plan = (payload?.plan || "").trim();
  const email = (payload?.email || "").trim();
  const lang = ["fr", "en", "es", "de"].includes(payload?.lang) ? payload.lang : "fr";

  if (!ALLOWED_PLANS.includes(plan)) {
    return json({ error: "Plan invalide. Attendu : 'monthly' ou 'lifetime'." }, 400);
  }

  const priceId = plan === "monthly" ? env.STRIPE_PRICE_MONTHLY : env.STRIPE_PRICE_LIFETIME;
  if (!priceId) {
    return json({ error: `Price ID manquant pour le plan ${plan}.` }, 503);
  }

  const origin = new URL(request.url).origin;
  const mode = plan === "monthly" ? "subscription" : "payment";

  // Construction du body x-www-form-urlencoded attendu par Stripe REST API
  const params = new URLSearchParams();
  params.set("mode", mode);
  params.set("line_items[0][price]", priceId);
  params.set("line_items[0][quantity]", "1");
  params.set("success_url", `${origin}/account?session_id={CHECKOUT_SESSION_ID}`);
  params.set("cancel_url", `${origin}/pricing?status=cancelled`);
  params.set("locale", lang === "fr" ? "fr" : lang === "es" ? "es" : lang === "de" ? "de" : "en");
  params.set("allow_promotion_codes", "true");
  if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    params.set("customer_email", email);
  }
  // Métadonnées : on récupère le plan côté webhook pour générer la bonne licence
  params.set("metadata[plan]", plan);
  params.set("metadata[lang]", lang);
  // En subscription mode, mêmes metadata sur la subscription pour les events suivants
  if (mode === "subscription") {
    params.set("subscription_data[metadata][plan]", plan);
    params.set("subscription_data[metadata][lang]", lang);
  }
  // Collect VAT / billing address pour conformité TVA (même si franchise en base)
  params.set("billing_address_collection", "auto");

  // Renoncement EXPRÈS au droit de rétractation de 14 jours (art. L221-28 13°
  // du Code de la consommation français). Obligatoire pour livrer la clé de
  // licence immédiatement après paiement sans risque de demande de
  // remboursement dans les 14 jours.
  //
  // Stripe affiche une case à cocher OBLIGATOIRE liée aux CGV configurées
  // dans Stripe Dashboard → Settings → Public details → Terms of Service URL.
  // Le texte affiché AU-DESSUS de cette case est défini par custom_text.
  params.set("consent_collection[terms_of_service]", "required");
  const waiverMsg = {
    fr: "En cochant ci-dessous, j'accepte les CGV de NotchIA et **renonce expressément à mon droit de rétractation de 14 jours** (art. L221-28 13° du Code de la consommation), afin de permettre la délivrance immédiate de ma clé de licence par email.",
    en: "By checking the box below, I accept NotchIA's Terms of Sale and **expressly waive my 14-day right of withdrawal** (French Consumer Code, art. L221-28 13°), to allow immediate delivery of my license key by email.",
    es: "Al marcar la casilla siguiente, acepto las CGV de NotchIA y **renuncio expresamente a mi derecho de retracto de 14 días** (Código del consumidor francés, art. L221-28 13°), para permitir la entrega inmediata de mi clave de licencia por email.",
    de: "Mit Aktivierung des Kontrollkästchens unten akzeptiere ich die AGB von NotchIA und **verzichte ausdrücklich auf mein 14-tägiges Widerrufsrecht** (französisches Verbrauchergesetzbuch, art. L221-28 13°), um die sofortige Lieferung meines Lizenzschlüssels per E-Mail zu ermöglichen.",
  }[lang];
  params.set("custom_text[terms_of_service_acceptance][message]", waiverMsg);

  // Trace pour le webhook : on garde la preuve du renoncement dans la metadata
  params.set("metadata[withdrawal_waiver]", "L221-28-13");
  if (mode === "subscription") {
    params.set("subscription_data[metadata][withdrawal_waiver]", "L221-28-13");
  }

  try {
    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.log("Stripe checkout error", res.status, JSON.stringify(data).slice(0, 500));
      return json({ error: data?.error?.message || "Stripe a refusé la session." }, 502);
    }
    return json({ url: data.url, id: data.id });
  } catch (e) {
    console.log("Stripe checkout fetch error", e?.message);
    return json({ error: "Service de paiement indisponible." }, 502);
  }
}

// Health check
export async function onRequestGet({ env }) {
  return json({
    status: "ok",
    configured: Boolean(env.STRIPE_SECRET_KEY && env.STRIPE_PRICE_MONTHLY && env.STRIPE_PRICE_LIFETIME),
    has_secret: Boolean(env.STRIPE_SECRET_KEY),
    has_monthly: Boolean(env.STRIPE_PRICE_MONTHLY),
    has_lifetime: Boolean(env.STRIPE_PRICE_LIFETIME),
    docs: "POST { plan: 'monthly'|'lifetime', email?, lang? }",
  });
}
