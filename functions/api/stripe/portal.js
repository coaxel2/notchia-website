/**
 * NotchIA — Stripe Customer Portal (étape 2 : ouverture via magic-link)
 *
 * GET /api/stripe/portal?token=<hmac_token>
 *   → vérifie le token, ouvre une Billing Portal Session pour le
 *     `customerId` qu'il contient, et redirige (HTTP 303) vers
 *     `session.url`.
 *
 * Tout autre cas (token manquant, invalide, expiré, ou Stripe KO) →
 * redirection vers /account?portal=error pour rester générique côté
 * UX et ne PAS divulguer la raison réelle de l'échec.
 *
 * IMPORTANT : la méthode POST (ancienne version qui prenait juste un
 * email) a été SUPPRIMÉE. Toute requête non-GET reçoit 405.
 *
 * Étape 1 (demande de magic-link) : voir
 *   functions/api/stripe/portal/request.js
 *
 * Env vars / bindings requis :
 *   STRIPE_SECRET_KEY      — clé API Stripe live restricted
 *   PORTAL_TOKEN_SECRET    — secret HMAC (32+ bytes hex)
 */

import { verifyPortalToken } from "./_portal-token.js";

function genericRedirect(origin, reason = "error") {
  // Pas de leak. `reason` reste générique côté URL.
  const url = `${origin}/account?portal=${encodeURIComponent(reason)}`;
  return Response.redirect(url, 303);
}

function methodNotAllowed() {
  return new Response("Method Not Allowed", {
    status: 405,
    headers: { "Allow": "GET", "Content-Type": "text/plain; charset=utf-8" },
  });
}

// Toutes les méthodes non-GET → 405. La version "POST email" est morte.
export const onRequestPost = methodNotAllowed;
export const onRequestPut = methodNotAllowed;
export const onRequestDelete = methodNotAllowed;
export const onRequestPatch = methodNotAllowed;

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Allow": "GET, OPTIONS",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const origin = url.origin;

  if (!env.STRIPE_SECRET_KEY || !env.PORTAL_TOKEN_SECRET) {
    // On ne divulgue PAS quelle env var manque dans la réponse.
    console.error("portal GET: missing STRIPE_SECRET_KEY or PORTAL_TOKEN_SECRET");
    return genericRedirect(origin, "error");
  }

  const token = url.searchParams.get("token");
  if (!token) return genericRedirect(origin, "invalid");

  const check = await verifyPortalToken(token, env.PORTAL_TOKEN_SECRET);
  if (!check.valid) {
    // On loggue la raison côté serveur (utile pour debug) mais on
    // renvoie une réponse générique côté client.
    console.error("portal GET: token invalid", check.reason);
    return genericRedirect(origin, check.reason === "expired" ? "expired" : "invalid");
  }

  const params = new URLSearchParams();
  params.set("customer", check.customerId);
  params.set("return_url", `${origin}/account`);

  try {
    const res = await fetch("https://api.stripe.com/v1/billing_portal/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data?.url) {
      console.error("portal GET: stripe refused", res.status, data?.error?.code || "");
      return genericRedirect(origin, "error");
    }
    return Response.redirect(data.url, 303);
  } catch (e) {
    console.error("portal GET: fetch threw", e?.message);
    return genericRedirect(origin, "error");
  }
}
