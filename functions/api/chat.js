/**
 * NotchIA chatbot — Cloudflare Pages Function
 *
 * POST /api/chat
 * Body : { messages: [{role: 'user'|'assistant', content: '...'}], lang?: 'fr'|'en'|'es'|'de' }
 * Reply : { reply: '...' }  OR  { error: '...' }
 *
 * Env var requise (Cloudflare Pages → Settings → Environment variables) :
 *   GEMINI_API_KEY = clé gratuite générée sur https://aistudio.google.com/apikey
 */

// Free-tier quotas (au 2026-05) :
//   gemini-2.5-flash-lite : 30 RPM, 1000 RPD  ← choisi (RPM 2x meilleur)
//   gemini-2.0-flash      : 15 RPM, 1500 RPD
//   gemini-2.5-flash      : 10 RPM, 250 RPD
// Le bottleneck visiteurs simultanés = RPM. Lite donne le plus de souffle.
const MODEL = "gemini-2.5-flash-lite";
const RETRY_ON_429_MS = 1500; // backoff avant 1 seul retry sur quota
const MAX_USER_MSG_LEN = 1000;
const MAX_HISTORY = 12; // messages échangés gardés en contexte
const MAX_OUTPUT_TOKENS = 500;
// Garde-fous anti-abus : sans eux, `messages` accepte un historique arbitraire
// (seul le DERNIER message était borné) → un client forgé pouvait envoyer 12
// messages de plusieurs Mo et faire exploser le prompt envoyé à Gemini.
const MAX_MESSAGES_IN = 40;         // avant slice — refuse les payloads absurdes
const MAX_ASSISTANT_MSG_LEN = 4000; // nos propres réponses (500 tokens) tiennent largement dedans
const MAX_TOTAL_CHARS = 24000;      // budget de l'historique transmis au modèle

// Rate limit par IP (même approche mémoire que /api/contact : réinitialisé au
// cold start, suffisant pour du spam opportuniste). Le quota Gemini free tier
// est de 30 req/min et 1000 req/jour PARTAGÉ entre tous les visiteurs : sans
// limite, un seul script pouvait griller la journée entière du chatbot.
const RATE_PER_MIN = 6;
const RATE_PER_HOUR = 40;
const ipHits = new Map(); // ip -> timestamps (ms) de la dernière heure

function checkRate(ip) {
  const now = Date.now();
  const hits = (ipHits.get(ip) || []).filter((t) => now - t < 3_600_000);
  const lastMin = hits.filter((t) => now - t < 60_000);
  if (lastMin.length >= RATE_PER_MIN) {
    return { limited: true, retryAfter: Math.max(1, Math.ceil((60_000 - (now - lastMin[0])) / 1000)) };
  }
  if (hits.length >= RATE_PER_HOUR) {
    return { limited: true, retryAfter: Math.max(1, Math.ceil((3_600_000 - (now - hits[0])) / 1000)) };
  }
  hits.push(now);
  ipHits.set(ip, hits);
  // Purge défensive : empêche la Map de croître indéfiniment sur un worker chaud
  if (ipHits.size > 5000) {
    for (const [k, v] of ipHits) {
      if (!v.length || now - v[v.length - 1] > 3_600_000) ipHits.delete(k);
    }
  }
  return { limited: false };
}

// L'endpoint ne sert que le chatbot de notchia.app (l'app macOS n'appelle que
// /api/license/validate). Un navigateur envoie toujours Origin sur un POST :
// exiger un Origin connu écarte les scripts qui tapent l'API directement.
function originAllowed(request) {
  const o = request.headers.get("Origin");
  if (!o) return false;
  try {
    const h = new URL(o).hostname;
    return (
      h === "notchia.app" || h === "www.notchia.app" ||
      h.endsWith(".notchia.pages.dev") || h.endsWith(".pages.dev") ||
      h === "localhost" || h === "127.0.0.1"
    );
  } catch {
    return false;
  }
}

const SYSTEM_PROMPTS = {
  fr: `Tu es l'assistant officiel de NotchIA, application macOS qui transforme l'encoche du MacBook en centre de contrôle interactif.

Règles strictes :
- Réponds UNIQUEMENT à partir des informations du contexte ci-dessous (llms.txt de notchia.app).
- Si la question est hors-scope (pas liée à NotchIA, macOS, l'app), réponds poliment que tu ne peux aider que sur NotchIA et propose le formulaire https://notchia.app/contact.
- Sois concis : 2 à 5 phrases maximum, sauf si on te demande explicitement plus de détail.
- Pas de blabla marketing. Direct, factuel, utile.
- Garde le ton d'Axel : précis, technique, francophone, légèrement décontracté.
- Jamais d'invention. Si une info manque, dis-le et redirige vers https://notchia.app/install ou l'email.
- N'écris JAMAIS de Markdown lourd (pas de **gras**, pas de ###). Texte brut + retours à la ligne simples.
- Ne mentionne jamais "Boring Notch" — NotchIA est une app indépendante.

Contexte (llms.txt) :
{{LLMS}}`,
  en: `You are the official assistant for NotchIA, a macOS app that turns the MacBook notch into an interactive control center.

Strict rules:
- Answer ONLY based on the context below (llms.txt from notchia.app).
- If the question is out of scope (not about NotchIA, macOS, the app), politely say you can only help with NotchIA and suggest the form at https://notchia.app/contact.
- Be concise: 2 to 5 sentences max, unless more detail is explicitly requested.
- No marketing fluff. Direct, factual, useful.
- Match Axel's tone: precise, technical, slightly casual.
- Never invent. If info is missing, say so and redirect to https://notchia.app/install or the email.
- NEVER use heavy Markdown (no **bold**, no ###). Plain text with simple line breaks.
- Never mention "Boring Notch" — NotchIA is an independent app.

Context (llms.txt):
{{LLMS}}`,
  es: `Eres el asistente oficial de NotchIA, app macOS que transforma la muesca del MacBook en centro de control interactivo.

Reglas estrictas:
- Responde SOLO con la información del contexto a continuación (llms.txt de notchia.app).
- Si la pregunta está fuera de alcance, di que solo puedes ayudar con NotchIA y sugiere el formulario https://notchia.app/contact.
- Sé conciso: 2 a 5 frases máximo.
- Sin paja de marketing. Directo, factual, útil.
- Nunca inventes. Si falta info, dilo y redirige a https://notchia.app/install o al email.
- NUNCA uses Markdown pesado. Texto plano con saltos de línea simples.
- Nunca menciones "Boring Notch" — NotchIA es una app independiente.

Contexto (llms.txt):
{{LLMS}}`,
  de: `Du bist der offizielle Assistent von NotchIA, einer macOS-App, die die MacBook-Kerbe in ein interaktives Kontrollzentrum verwandelt.

Strenge Regeln:
- Antworte NUR auf Basis des Kontexts unten (llms.txt von notchia.app).
- Wenn die Frage außerhalb des Themas ist, sag höflich, dass du nur zu NotchIA helfen kannst, und schlage das Formular https://notchia.app/contact vor.
- Sei knapp: 2 bis 5 Sätze max.
- Kein Marketing-Geschwafel. Direkt, sachlich, nützlich.
- Nichts erfinden. Wenn Info fehlt, sag es und verweise auf https://notchia.app/install oder die E-Mail.
- NIEMALS schweres Markdown. Klartext mit einfachen Zeilenumbrüchen.
- Erwähne NIEMALS "Boring Notch" — NotchIA ist eine eigenständige App.

Kontext (llms.txt):
{{LLMS}}`,
};

// Cache du llms.txt (1 fetch par cold start, garde en mémoire du worker)
let llmsCache = null;
let llmsCacheAt = 0;
const LLMS_TTL_MS = 60 * 60 * 1000; // 1h

async function getLlmsContext(origin) {
  const now = Date.now();
  if (llmsCache && now - llmsCacheAt < LLMS_TTL_MS) return llmsCache;
  try {
    const res = await fetch(`${origin}/llms.txt`, { cf: { cacheTtl: 3600 } });
    if (!res.ok) throw new Error(`llms.txt fetch ${res.status}`);
    llmsCache = await res.text();
    llmsCacheAt = now;
    return llmsCache;
  } catch (e) {
    return "(llms.txt indisponible — utilise tes connaissances générales sur NotchIA mais préviens l'utilisateur que tu n'as pas accès au contexte produit complet.)";
  }
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "https://notchia.app",
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

export async function onRequestPost(context) {
  const { request, env } = context;

  if (!env.GEMINI_API_KEY) {
    return json({ error: "Chatbot non configuré (clé API absente)." }, 503);
  }

  if (!originAllowed(request)) {
    return json({ error: "Origine non autorisée." }, 403);
  }

  const ip = request.headers.get("CF-Connecting-IP") || request.headers.get("X-Forwarded-For") || "unknown";
  const rate = checkRate(ip);
  if (rate.limited) {
    return json(
      { error: `Trop de questions d'affilée. Réessaie dans ${rate.retryAfter} secondes.`, retryAfter: rate.retryAfter },
      429,
      { "Retry-After": String(rate.retryAfter) }
    );
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: "JSON invalide." }, 400);
  }

  const messages = Array.isArray(payload?.messages) ? payload.messages : null;
  const lang = SYSTEM_PROMPTS[payload?.lang] ? payload.lang : "fr";

  if (!messages || messages.length === 0) {
    return json({ error: "Aucun message fourni." }, 400);
  }
  if (messages.length > MAX_MESSAGES_IN) {
    return json({ error: "Historique trop long." }, 400);
  }

  // Validation taille messages
  const last = messages[messages.length - 1];
  if (last?.role !== "user" || typeof last.content !== "string") {
    return json({ error: "Le dernier message doit être de l'utilisateur." }, 400);
  }
  if (last.content.length > MAX_USER_MSG_LEN) {
    return json({ error: `Message trop long (max ${MAX_USER_MSG_LEN} caractères).` }, 400);
  }

  // Garde les N derniers messages, alterne user/assistant correctement
  const kept = messages.slice(-MAX_HISTORY).filter(
    (m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string"
  );

  // Chaque message de l'historique est borné, pas seulement le dernier : sinon
  // un client forgé glisse un message géant en avant-dernière position.
  const tooLong = kept.some((m) =>
    m.content.length > (m.role === "assistant" ? MAX_ASSISTANT_MSG_LEN : MAX_USER_MSG_LEN)
  );
  if (tooLong) {
    return json({ error: `Message trop long (max ${MAX_USER_MSG_LEN} caractères).` }, 400);
  }

  // Budget global : on tronque par le début (on garde le contexte récent) au
  // lieu de rejeter — une longue conversation légitime ne doit jamais casser.
  const trimmed = [];
  let budget = MAX_TOTAL_CHARS;
  for (let i = kept.length - 1; i >= 0; i--) {
    budget -= kept[i].content.length;
    if (budget < 0 && trimmed.length > 0) break;
    trimmed.unshift(kept[i]);
  }

  const origin = new URL(request.url).origin;
  const llms = await getLlmsContext(origin);
  const systemPrompt = SYSTEM_PROMPTS[lang].replace("{{LLMS}}", llms);

  // Format Gemini : { contents: [{role: 'user'|'model', parts: [{text}]}], systemInstruction: {parts:[{text}]} }
  const contents = trimmed.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${env.GEMINI_API_KEY}`;

  const requestBody = JSON.stringify({
    systemInstruction: { parts: [{ text: systemPrompt }] },
    contents,
    generationConfig: {
      temperature: 0.6,
      maxOutputTokens: MAX_OUTPUT_TOKENS,
      topP: 0.9,
    },
    safetySettings: [
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
    ],
  });

  // Premier appel, puis 1 retry après backoff si 429 (limite RPM dépassée
  // momentanément — souvent provoqué par un utilisateur qui spamme).
  async function callGemini() {
    return fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: requestBody,
    });
  }

  let geminiRes;
  try {
    geminiRes = await callGemini();
    if (geminiRes.status === 429) {
      await new Promise((r) => setTimeout(r, RETRY_ON_429_MS));
      geminiRes = await callGemini();
    }
  } catch (e) {
    return json({ error: "Service IA indisponible. Réessaie dans un moment." }, 502);
  }

  if (!geminiRes.ok) {
    const status = geminiRes.status;
    if (status === 429) {
      // Retry-After permet au frontend d'afficher un vrai compte à rebours.
      // Gemini ne renvoie pas toujours ce header ; on met 10 s en fallback.
      const ra = geminiRes.headers.get("Retry-After") || "10";
      return json(
        { error: `Limite de questions atteinte. Réessaie dans ${ra} secondes.`, retryAfter: parseInt(ra, 10) || 10 },
        429,
        { "Retry-After": ra }
      );
    }
    return json({ error: `Erreur IA (${status}). Réessaie plus tard.` }, 502);
  }

  let data;
  try {
    data = await geminiRes.json();
  } catch {
    return json({ error: "Réponse IA illisible." }, 502);
  }

  const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!reply) {
    return json({ error: "Pas de réponse générée. Reformule ta question." }, 502);
  }

  return json({ reply: reply.trim() });
}

// GET utilitaire (health check)
export async function onRequestGet() {
  return json({
    status: "ok",
    model: MODEL,
    docs: "POST { messages: [{role, content}], lang } to this endpoint.",
  });
}
