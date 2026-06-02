/**
 * NotchIA — License validation endpoint
 *
 * POST /api/license/validate
 * Body : { key: "nia_live_xxx", device_id?: "xxx" }
 * Reply : {
 *   valid: true,
 *   email, plan, status,
 *   active_devices, max_devices,
 *   expires_at?
 * } | { valid: false, reason }
 *
 * Appelé par l'app macOS pour :
 *   - vérifier qu'une clé est bien signée par notre Ed25519
 *   - vérifier qu'elle est encore active en base (pas remboursée / annulée)
 *   - éventuellement incrémenter active_devices si nouveau device_id
 *
 * Pour la vérification OFFLINE (sans réseau), l'app doit faire la même
 * signature Ed25519 avec la clé publique embarquée, sans appel à cet
 * endpoint. Cet endpoint sert uniquement à confirmer le statut serveur
 * (remboursement, annulation) — à appeler périodiquement (ex: hebdo).
 */

import { verifyLicenseKey } from "./_crypto.js";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "https://notchia.app",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}
function json(b, s = 200) {
  return new Response(JSON.stringify(b), { status: s, headers: { "Content-Type": "application/json; charset=utf-8", ...corsHeaders() } });
}

export async function onRequestOptions() { return new Response(null, { status: 204, headers: corsHeaders() }); }

export async function onRequestPost({ request, env }) {
  if (!env.LICENSE_PUBLIC_KEY) return json({ valid: false, reason: "server_misconfigured" }, 503);
  if (!env.DB)                 return json({ valid: false, reason: "server_misconfigured" }, 503);

  let payload;
  try { payload = await request.json(); } catch { return json({ valid: false, reason: "invalid_json" }, 400); }

  const key = (payload?.key || "").trim();
  const deviceId = (payload?.device_id || "").trim().slice(0, 64);
  if (!key || !key.startsWith("nia_live_")) {
    return json({ valid: false, reason: "format" }, 400);
  }

  // 1. Vérif signature Ed25519
  const sigCheck = await verifyLicenseKey(key, env.LICENSE_PUBLIC_KEY);
  if (!sigCheck.valid) {
    return json({ valid: false, reason: sigCheck.reason });
  }

  // 2. Lookup status en base
  const row = await env.DB
    .prepare("SELECT email, plan, status, active_devices, max_devices, expires_at, activation_log FROM licenses WHERE key = ?")
    .bind(key).first();

  if (!row) {
    return json({ valid: false, reason: "not_found" }, 404);
  }
  // 'past_due' reste valide tant que expires_at n'est pas dépassé : c'est le
  // grace period pendant les Smart Retries Stripe. L'expiration naturelle est
  // gérée juste en dessous via expires_at. Les statuts cancelled/refunded/expired
  // sont rejetés.
  if (row.status !== "active" && row.status !== "past_due") {
    return json({ valid: false, reason: `status_${row.status}`, status: row.status });
  }
  if (row.expires_at && Math.floor(Date.now() / 1000) > row.expires_at) {
    return json({ valid: false, reason: "expired", expires_at: row.expires_at });
  }

  // 3. Gestion des devices : si device_id fourni et inconnu, on incrémente
  let activeDevices = row.active_devices;
  if (deviceId) {
    let log = [];
    try { log = JSON.parse(row.activation_log || "[]"); } catch {}
    const known = log.some(e => e.device_id === deviceId);
    if (!known) {
      if (activeDevices >= row.max_devices) {
        return json({
          valid: false,
          reason: "device_limit",
          active_devices: activeDevices,
          max_devices: row.max_devices,
        });
      }
      activeDevices += 1;
      log.push({ device_id: deviceId, first_seen: Math.floor(Date.now() / 1000) });
      // Garde max 5 entrées dans le log
      if (log.length > 5) log = log.slice(-5);
      await env.DB
        .prepare("UPDATE licenses SET active_devices = ?, activation_log = ?, updated_at = ? WHERE key = ?")
        .bind(activeDevices, JSON.stringify(log), Math.floor(Date.now() / 1000), key)
        .run();
    }
  }

  return json({
    valid: true,
    email: row.email,
    plan: row.plan,
    status: row.status,
    active_devices: activeDevices,
    max_devices: row.max_devices,
    expires_at: row.expires_at || null,
  });
}
