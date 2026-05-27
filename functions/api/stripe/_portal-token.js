/**
 * NotchIA — Stripe Customer Portal magic-link token
 *
 * Format compact :
 *   base64url(payload).base64url(hmac)
 *
 * payload = JSON { cid: "<stripe_customer_id>", exp: <unix_ms> }
 * hmac    = HMAC-SHA256(secret, payload_b64).base64url
 *
 * On signe le `payload_b64` (et pas le JSON brut) → l'opération de
 * vérification ne nécessite jamais de re-sérialiser un objet pour
 * recalculer la signature : pas d'ambiguïté JSON.
 *
 * Pas d'algo paramétrable, pas de "alg":"none" possible : ce n'est PAS
 * un JWT. Le secret n'apparaît jamais dans le token.
 *
 * Constant-time comparison obligatoire côté vérif.
 */

const TOKEN_TTL_MS = 15 * 60 * 1000; // 15 minutes

function b64urlEncode(buf) {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlDecodeToBytes(s) {
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function b64urlDecodeToString(s) {
  return new TextDecoder().decode(b64urlDecodeToBytes(s));
}

async function hmacSign(secret, msg) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode(msg)));
}

/**
 * Comparaison constant-time de deux strings ASCII de même longueur.
 * Retourne false dès que les longueurs diffèrent, mais sans early-exit
 * sur le contenu.
 */
function constantTimeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/**
 * Génère un magic-link token signé pour un customer Stripe.
 *
 * @param {string} customerId  - ex: "cus_1234..."
 * @param {string} secret      - env.PORTAL_TOKEN_SECRET (32+ bytes hex)
 * @param {number} [ttlMs]     - durée de vie (défaut 15 min)
 * @returns {Promise<string>}  - token court (≤ ~200 chars)
 */
export async function signPortalToken(customerId, secret, ttlMs = TOKEN_TTL_MS) {
  if (!customerId || typeof customerId !== "string") {
    throw new Error("signPortalToken: customerId required");
  }
  if (!secret || typeof secret !== "string" || secret.length < 32) {
    throw new Error("signPortalToken: secret missing or too short");
  }
  const payload = { cid: customerId, exp: Date.now() + ttlMs };
  const payloadJson = JSON.stringify(payload);
  const payloadB64 = b64urlEncode(new TextEncoder().encode(payloadJson));
  const sig = await hmacSign(secret, payloadB64);
  return payloadB64 + "." + b64urlEncode(sig);
}

/**
 * Vérifie un token portail.
 * Renvoie { valid: true, customerId } ou { valid: false, reason }.
 * Aucune info exploitable n'est exposée dans `reason` côté API publique :
 * l'appelant doit traiter tout `valid:false` comme un échec générique.
 *
 * @param {string} token
 * @param {string} secret  - env.PORTAL_TOKEN_SECRET
 * @returns {Promise<{valid: boolean, customerId?: string, reason?: string}>}
 */
export async function verifyPortalToken(token, secret) {
  if (!token || typeof token !== "string") return { valid: false, reason: "format" };
  if (!secret || typeof secret !== "string") return { valid: false, reason: "secret_missing" };

  const dot = token.indexOf(".");
  if (dot <= 0 || dot === token.length - 1) return { valid: false, reason: "format" };

  const payloadB64 = token.slice(0, dot);
  const sigB64 = token.slice(dot + 1);

  // Recalcul de la signature attendue depuis le payload base64url BRUT.
  let expectedSig;
  try {
    expectedSig = await hmacSign(secret, payloadB64);
  } catch {
    return { valid: false, reason: "hmac_error" };
  }
  const expectedB64 = b64urlEncode(expectedSig);

  // Constant-time compare.
  if (!constantTimeEqual(expectedB64, sigB64)) {
    return { valid: false, reason: "signature" };
  }

  // À ce stade la signature est valide → on peut décoder le payload.
  let payload;
  try {
    payload = JSON.parse(b64urlDecodeToString(payloadB64));
  } catch {
    return { valid: false, reason: "payload_decode" };
  }
  if (!payload || typeof payload.cid !== "string" || typeof payload.exp !== "number") {
    return { valid: false, reason: "payload_shape" };
  }
  if (Date.now() > payload.exp) {
    return { valid: false, reason: "expired" };
  }
  return { valid: true, customerId: payload.cid };
}
