// Deploy bump pour rebuild après changement de CONTACT_FROM (2026-05-18).
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
 * Rate limit : 1/min, 5/h, 8/jour par IP (voir _ratelimit.js).
 */

import { checkRate, MINUTE, HOUR, DAY } from "./_ratelimit.js";

const MAX_NAME = 80;
const MAX_EMAIL = 120;
const MAX_MESSAGE = 4000;

// Le quota Resend est de 100 mails/jour, partagé : une seule IP ne doit pas
// pouvoir l'épuiser et priver les vrais visiteurs du formulaire. Un humain
// n'envoie pas 8 messages par jour au support.
const CONTACT_LIMITS = [
  { ms: MINUTE, max: 1 },
  { ms: HOUR, max: 5 },
  { ms: DAY, max: 8 },
];

const VALID_CATEGORIES = ["support", "bug", "license", "press", "partnership", "feedback", "other"];

function corsHeaders(origin = "https://notchia.app") {
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

  // 2. Rate limit par IP (minute / heure / jour)
  const ip = request.headers.get("CF-Connecting-IP") || request.headers.get("X-Forwarded-For") || "unknown";
  const rate = checkRate("contact", ip, CONTACT_LIMITS);
  if (rate.limited) {
    return json(
      { error: `Trop d'envois récents. Réessaie dans ${rate.retryAfter} secondes.`, retryAfter: rate.retryAfter },
      429,
      { "Retry-After": String(rate.retryAfter) }
    );
  }

  // 3. Vérifier la config Resend
  if (!env.RESEND_API_KEY || !env.CONTACT_TO) {
    return json(
      { error: "Formulaire non configuré côté serveur. Écris à notchia.app@gmail.com en attendant." },
      503
    );
  }

  const from = (env.CONTACT_FROM || "onboarding@resend.dev").trim();
  const to = env.CONTACT_TO.trim();
  const ua = request.headers.get("User-Agent") || "unknown";
  // Nettoie la clé Resend (retire un éventuel "❯ " ou espace collé depuis un prompt)
  const resendKey = (() => { const s = String(env.RESEND_API_KEY).trim(); const i = s.indexOf("re_"); return i >= 0 ? s.slice(i) : s; })();

  // Mode test : ?test=1 → renvoie ok sans appeler Resend.
  // Permet d'isoler les bugs Resend vs bugs function (routing, env, etc.).
  const url = new URL(request.url);
  if (url.searchParams.get("test") === "1") {
    return json({ ok: true, test: true, would_send: { from, to, subject: `[NotchIA · ${category}] ${name}` } });
  }

  // 4. Envoi via Resend avec timeout strict
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
    "Pour repondre, utilise Reply — expediteur d'origine en Reply-To.",
  ].join("\n");

  // AbortController force le rejet du fetch après 12 s, bien avant les 30 s
  // du timeout Cloudflare Pages Functions. Évite que CF kill notre worker
  // et renvoie sa propre page 502 HTML (intercept impossible côté code).
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12_000);

  let resendStatus = 0;
  let resendBody = "";

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `NotchIA contact <${from}>`,
        to: [to],
        reply_to: email,
        subject,
        text: body,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    resendStatus = res.status;
    resendBody = await res.text().catch(() => "(unread)");

    if (!res.ok) {
      console.log("Resend error", resendStatus, resendBody, "from", from);
      return json({
        error: "Envoi impossible. Reessaie ou ecris a notchia.app@gmail.com.",
      }, 502);
    }
    return json({ ok: true, resend_status: resendStatus });
  } catch (e) {
    clearTimeout(timeoutId);
    const isAbort = e?.name === "AbortError";
    console.log("Resend fetch threw", e?.name, e?.message, "partial_status", resendStatus);
    return json({
      error: isAbort ? "Le service email a mis trop longtemps a repondre. Reessaie." : "Service email indisponible. Reessaie dans un moment.",
    }, 502);
  }
}

// Health check
export async function onRequestGet({ env }) {
  return json({
    status: "ok",
    configured: Boolean(env.RESEND_API_KEY && env.CONTACT_TO),
    has_api_key: Boolean(env.RESEND_API_KEY),
    has_to: Boolean(env.CONTACT_TO),
    from: env.CONTACT_FROM || "(default onboarding@resend.dev)",
    to_masked: env.CONTACT_TO ? env.CONTACT_TO.replace(/(?<=.{2}).+(?=@)/, "***") : null,
    docs: "POST { name, email, category, message, lang } to this endpoint.",
  });
}
