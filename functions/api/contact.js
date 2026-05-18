/**
 * NotchIA contact form — Cloudflare Pages Function
 *
 * POST /api/contact
 * Body : { name, email, category, message, lang? }
 * Reply : { ok: true } | { error: "...", retryAfter?: N }
 *
 * Env vars (Cloudflare Pages → Settings → Environment variables) :
 *   RESEND_API_KEY = clé API Resend (https://resend.com/api-keys, free 100/day)
 *   CONTACT_TO     = email destinataire (ex: notchia.app@gmail.com)
 *   CONTACT_FROM   = email expéditeur vérifié sur Resend (ex: contact@notchia.app)
 *                    ou onboarding@resend.dev en attendant la vérif domaine
 *
 * Rate limit : 1 envoi / 60 sec / IP (en mémoire — suffisant pour ce volume).
 */

const MAX_NAME = 80;
const MAX_EMAIL = 120;
const MAX_MESSAGE = 4000;
const RATE_LIMIT_SEC = 60;

const VALID_CATEGORIES = ["support", "bug", "license", "press", "partnership", "feedback", "other"];

// In-memory rate limit (réinitialisé à chaque cold start du Worker, suffisant
// pour 99% des cas — un user qui veut spam doit tomber sur le même Worker chaud)
const ipLastSubmit = new Map();

function corsHeaders(origin = "*") {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

function json(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...corsHeaders(), ...extraHeaders },
  });
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

function isValidEmail(s) {
  // Validation minimale — pas de regex à rallonge, ça filtre déjà 99%
  return typeof s === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) && s.length <= MAX_EMAIL;
}

export async function onRequestPost(context) {
  const { request, env } = context;

  // 1. Parse + valider le body
  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: "Requête invalide." }, 400);
  }

  const name = (payload?.name || "").trim();
  const email = (payload?.email || "").trim();
  const category = (payload?.category || "other").trim();
  const message = (payload?.message || "").trim();
  const lang = ["fr", "en", "es", "de"].includes(payload?.lang) ? payload.lang : "fr";

  if (!name || name.length > MAX_NAME) {
    return json({ error: `Nom requis (max ${MAX_NAME} caractères).` }, 400);
  }
  if (!isValidEmail(email)) {
    return json({ error: "Email invalide." }, 400);
  }
  if (!VALID_CATEGORIES.includes(category)) {
    return json({ error: "Catégorie invalide." }, 400);
  }
  if (!message || message.length < 10 || message.length > MAX_MESSAGE) {
    return json({ error: `Message requis (10 à ${MAX_MESSAGE} caractères).` }, 400);
  }

  // 2. Rate limit par IP
  const ip = request.headers.get("CF-Connecting-IP") || request.headers.get("X-Forwarded-For") || "unknown";
  const now = Date.now();
  const last = ipLastSubmit.get(ip) || 0;
  const sinceLast = (now - last) / 1000;
  if (sinceLast < RATE_LIMIT_SEC) {
    const wait = Math.ceil(RATE_LIMIT_SEC - sinceLast);
    return json(
      { error: `Trop d'envois récents. Réessaie dans ${wait} secondes.`, retryAfter: wait },
      429,
      { "Retry-After": String(wait) }
    );
  }
  ipLastSubmit.set(ip, now);

  // 3. Vérifier la config Resend
  if (!env.RESEND_API_KEY || !env.CONTACT_TO) {
    return json(
      { error: "Formulaire non configuré côté serveur. Écris à notchia.app@gmail.com en attendant." },
      503
    );
  }

  const from = env.CONTACT_FROM || "onboarding@resend.dev";
  const to = env.CONTACT_TO;
  const ua = request.headers.get("User-Agent") || "unknown";

  // 4. Envoi via Resend
  const subject = `[NotchIA · ${category}] ${name}`;
  const body = [
    `De     : ${name} <${email}>`,
    `Cat.   : ${category}`,
    `Langue : ${lang}`,
    `IP     : ${ip}`,
    `UA     : ${ua}`,
    "",
    "Message :",
    "----------------------------------------------------------------------",
    message,
    "----------------------------------------------------------------------",
    "",
    "Pour répondre, utilise simplement Reply — l'expéditeur d'origine est en Reply-To.",
  ].join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `NotchIA contact <${from}>`,
        to: [to],
        reply_to: email,
        subject,
        text: body,
      }),
    });
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.log("Resend error", res.status, errText);
      return json({ error: "Envoi impossible. Réessaie ou écris à notchia.app@gmail.com." }, 502);
    }
    return json({ ok: true });
  } catch (e) {
    console.log("Resend fetch error", e?.message);
    return json({ error: "Service email indisponible. Réessaie dans un moment." }, 502);
  }
}

// Health check
export async function onRequestGet({ env }) {
  return json({
    status: "ok",
    configured: Boolean(env.RESEND_API_KEY && env.CONTACT_TO),
    docs: "POST { name, email, category, message, lang } to this endpoint.",
  });
}
