/**
 * Crypto helpers pour les licences NotchIA.
 *
 * Signature Ed25519 via WebCrypto (natif Cloudflare Workers).
 * Pas de dépendance externe.
 *
 * Clé de licence = JWT-like compact :
 *   nia_live_<base64url(payload)>.<base64url(signature)>
 *
 * Payload (JSON) :
 *   {
 *     v:   1,                  // version du format
 *     sub: "user@example.com", // subject = email du client
 *     plan: "monthly" | "lifetime",
 *     iat: 1747500000,         // issued at (epoch seconds)
 *     exp: 1779036000,         // expires at (NULL pour lifetime → champ absent)
 *     jti: "8f3a-...",         // unique ID = première moitié du SHA256(session_id)
 *     max: 1 | 2               // max devices
 *   }
 */

const PREFIX = "nia_live_";

function b64urlEncode(buf) {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlDecode(s) {
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function b64StandardDecode(s) {
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

/**
 * Importe la clé privée Ed25519 depuis le format PKCS#8 base64.
 * @param {string} pkcs8Base64 - LICENSE_PRIVATE_KEY env var
 */
async function importPrivateKey(pkcs8Base64) {
  const der = b64StandardDecode(pkcs8Base64);
  return crypto.subtle.importKey(
    "pkcs8",
    der,
    { name: "Ed25519" },
    false,
    ["sign"]
  );
}

/**
 * Importe la clé publique Ed25519 depuis le format SPKI base64.
 * @param {string} spkiBase64 - LICENSE_PUBLIC_KEY env var
 */
async function importPublicKey(spkiBase64) {
  const der = b64StandardDecode(spkiBase64);
  return crypto.subtle.importKey(
    "spki",
    der,
    { name: "Ed25519" },
    false,
    ["verify"]
  );
}

/**
 * Génère une clé de licence signée Ed25519.
 *
 * @param {Object} payload    - { sub, plan, iat, exp?, jti, max }
 * @param {string} privateKeyB64 - LICENSE_PRIVATE_KEY (PKCS#8 base64)
 * @returns {Promise<string>} - clé de la forme "nia_live_<payload>.<sig>"
 */
export async function generateLicenseKey(payload, privateKeyB64) {
  if (!privateKeyB64) throw new Error("LICENSE_PRIVATE_KEY missing");

  const fullPayload = { v: 1, ...payload };
  const payloadJson = JSON.stringify(fullPayload);
  const payloadBytes = new TextEncoder().encode(payloadJson);
  const payloadB64 = b64urlEncode(payloadBytes);

  const key = await importPrivateKey(privateKeyB64);
  const sigBuf = await crypto.subtle.sign({ name: "Ed25519" }, key, payloadBytes);
  const sigB64 = b64urlEncode(sigBuf);

  return PREFIX + payloadB64 + "." + sigB64;
}

/**
 * Vérifie une clé de licence.
 *
 * @param {string} licenseKey - "nia_live_<payload>.<sig>"
 * @param {string} publicKeyB64 - LICENSE_PUBLIC_KEY (SPKI base64)
 * @returns {Promise<{valid: boolean, payload?: Object, reason?: string}>}
 */
export async function verifyLicenseKey(licenseKey, publicKeyB64) {
  if (!licenseKey || !licenseKey.startsWith(PREFIX)) {
    return { valid: false, reason: "format" };
  }
  const stripped = licenseKey.slice(PREFIX.length);
  const dotIdx = stripped.indexOf(".");
  if (dotIdx < 0) return { valid: false, reason: "format" };

  const payloadB64 = stripped.slice(0, dotIdx);
  const sigB64 = stripped.slice(dotIdx + 1);

  let payloadBytes, payload;
  try {
    payloadBytes = b64urlDecode(payloadB64);
    payload = JSON.parse(new TextDecoder().decode(payloadBytes));
  } catch {
    return { valid: false, reason: "payload_decode" };
  }

  if (payload.v !== 1) return { valid: false, reason: "version" };

  let sig;
  try {
    sig = b64urlDecode(sigB64);
  } catch {
    return { valid: false, reason: "signature_decode" };
  }

  try {
    const key = await importPublicKey(publicKeyB64);
    const ok = await crypto.subtle.verify(
      { name: "Ed25519" },
      key,
      sig,
      payloadBytes
    );
    if (!ok) return { valid: false, reason: "signature" };
  } catch (e) {
    return { valid: false, reason: "verify_error:" + (e?.message || "") };
  }

  // Vérif expiration
  if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) {
    return { valid: false, payload, reason: "expired" };
  }

  return { valid: true, payload };
}

/**
 * Vérifie une signature de webhook Stripe (HMAC-SHA256).
 * Stripe envoie un header : "Stripe-Signature: t=TIMESTAMP,v1=SIGNATURE"
 *
 * @param {string} payload - body brut du webhook
 * @param {string} sigHeader - valeur du header Stripe-Signature
 * @param {string} secret - STRIPE_WEBHOOK_SECRET (whsec_xxx)
 * @param {number} toleranceSec - tolérance temporelle (5 min par défaut)
 * @returns {Promise<boolean>}
 */
export async function verifyStripeSignature(payload, sigHeader, secret, toleranceSec = 300) {
  if (!sigHeader || !secret) return false;
  const parts = Object.fromEntries(sigHeader.split(",").map(p => p.split("=")));
  const t = parseInt(parts.t, 10);
  const v1 = parts.v1;
  if (!t || !v1) return false;
  if (Math.abs(Date.now() / 1000 - t) > toleranceSec) return false;

  const signedPayload = `${t}.${payload}`;
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sigBuf = await crypto.subtle.sign("HMAC", key, enc.encode(signedPayload));
  const hex = Array.from(new Uint8Array(sigBuf)).map(b => b.toString(16).padStart(2, "0")).join("");

  // Comparison constant-time
  if (hex.length !== v1.length) return false;
  let diff = 0;
  for (let i = 0; i < hex.length; i++) diff |= hex.charCodeAt(i) ^ v1.charCodeAt(i);
  return diff === 0;
}

/**
 * Génère un jti court à partir d'un identifiant Stripe.
 * SHA-256 puis tronque à 16 chars hex.
 */
export async function shortHash(input) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf)).slice(0, 8).map(b => b.toString(16).padStart(2, "0")).join("");
}
