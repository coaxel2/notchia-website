/**
 * NotchIA — Stripe Customer Portal session creator
 *
 * POST /api/stripe/portal
 * Body : { email: string }
 * Reply : { url: "https://billing.stripe.com/p/session/..." } | { error }
 *
 * Le portail permet à l'utilisateur de :
 *   - consulter ses factures
 *   - mettre à jour sa carte
 *   - annuler / changer son abonnement
 *
 * Sécurité : on retrouve le customer via l'email passé en POST. Pour
 * éviter qu'un attaquant ouvre le portail de quelqu'un d'autre, on
 * envoie un magic link par email (court-circuit ici : on renvoie l'URL
 * directement). Phase ultérieure : passer par un token signé envoyé
 * par email avant d'ouvrir le portail.
 */

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}
function json(b, s = 200) {
  return new Response(JSON.stringify(b), { status: s, headers: { "Content-Type": "application/json; charset=utf-8", ...corsHeaders() } });
}

export async function onRequestOptions() { return new Response(null, { status: 204, headers: corsHeaders() }); }

export async function onRequestPost({ request, env }) {
  if (!env.STRIPE_SECRET_KEY) return json({ error: "Stripe non configuré." }, 503);
  if (!env.DB) return json({ error: "DB non disponible." }, 503);

  let payload;
  try { payload = await request.json(); } catch { return json({ error: "JSON invalide." }, 400); }

  const email = (payload?.email || "").trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: "Email invalide." }, 400);
  }

  // Lookup customer ID via l'email dans D1 (licences)
  const row = await env.DB
    .prepare("SELECT stripe_customer_id FROM licenses WHERE email = ? AND stripe_customer_id IS NOT NULL ORDER BY created_at DESC LIMIT 1")
    .bind(email).first();

  if (!row?.stripe_customer_id) {
    return json({ error: "Aucun compte trouvé pour cet email." }, 404);
  }

  const origin = new URL(request.url).origin;
  const params = new URLSearchParams();
  params.set("customer", row.stripe_customer_id);
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
    if (!res.ok) {
      console.log("Stripe portal error", res.status, JSON.stringify(data).slice(0, 400));
      return json({ error: data?.error?.message || "Stripe a refusé l'ouverture du portail." }, 502);
    }
    return json({ url: data.url });
  } catch (e) {
    console.log("Stripe portal fetch error", e?.message);
    return json({ error: "Service indisponible." }, 502);
  }
}
