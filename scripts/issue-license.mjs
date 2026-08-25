#!/usr/bin/env node
/**
 * NotchIA — émission manuelle d'une clé de licence Pro.
 *
 * Sert aux cas hors Stripe : test interne, presse, geste commercial, remplacement
 * d'une clé perdue. Utilise exactement le même format et la même signature que le
 * webhook Stripe (functions/api/license/_crypto.js), donc l'app la valide hors ligne.
 *
 * ⚠️  Une clé signée ne suffit PAS : l'app interroge /api/license/validate, et si
 *     la clé est absente de la base D1 la réponse est `not_found`, ce qui déclenche
 *     `deleteKeyFromKeychain()` + `state = .proRevoked` côté app. Il faut donc
 *     TOUJOURS insérer la ligne en base — c'est ce que fait --insert.
 *
 * La clé privée n'est jamais passée en argument (elle resterait dans l'historique
 * du shell) : elle est lue dans la variable d'environnement LICENSE_PRIVATE_KEY.
 *
 * Usage :
 *   read -rs LICENSE_PRIVATE_KEY && export LICENSE_PRIVATE_KEY
 *   node scripts/issue-license.mjs --email test@notchia.app --days 7 --insert
 *   unset LICENSE_PRIVATE_KEY
 *
 * Options :
 *   --email <adresse>   destinataire de la licence (obligatoire)
 *   --days <n>          durée de validité en jours (défaut : 7 ; 0 = à vie)
 *   --devices <n>       nombre de Mac autorisés (défaut : 1)
 *   --label <texte>     trace stockée dans stripe_session_id (défaut : manual)
 *   --insert            insère la ligne dans la base D1 via wrangler
 *   --db <nom>          base D1 (défaut : notchia-licenses)
 */

import { execFileSync } from "node:child_process";
import { generateLicenseKey, shortHash } from "../functions/api/license/_crypto.js";

function arg(name, fallback = null) {
  const i = process.argv.indexOf("--" + name);
  if (i === -1) return fallback;
  const v = process.argv[i + 1];
  return v && !v.startsWith("--") ? v : true;
}

const email = arg("email");
const days = Number(arg("days", 7));
const devices = Number(arg("devices", 1));
const label = arg("label", "manual");
const doInsert = arg("insert") === true;
const db = arg("db", "notchia-licenses");

if (!email || email === true || !email.includes("@")) {
  console.error("❌ --email <adresse> est obligatoire.");
  process.exit(1);
}
if (!Number.isFinite(days) || days < 0) {
  console.error("❌ --days doit être un nombre de jours (0 = licence à vie).");
  process.exit(1);
}

const privateKey = process.env.LICENSE_PRIVATE_KEY;
if (!privateKey) {
  console.error(`❌ LICENSE_PRIVATE_KEY absente de l'environnement.

   Elle est stockée chiffrée dans Cloudflare Pages (illisible après création) :
   récupère-la depuis ta sauvegarde, puis :

     read -rs LICENSE_PRIVATE_KEY && export LICENSE_PRIVATE_KEY
     node scripts/issue-license.mjs --email ${email === true ? "…" : email} --days ${days} --insert
     unset LICENSE_PRIVATE_KEY

   (\`read -rs\` masque la saisie et n'écrit rien dans l'historique du shell.)`);
  process.exit(2);
}

const now = Math.floor(Date.now() / 1000);
// « monthly » est le plan à durée limitée du webhook ; « lifetime » n'a pas d'exp.
const plan = days === 0 ? "lifetime" : "monthly";
const exp = days === 0 ? null : now + days * 86400;
const jti = await shortHash(`${label}:${email}:${now}`);

const payload = { sub: email, plan, iat: now, jti, max: devices };
if (exp) payload.exp = exp;

const key = await generateLicenseKey(payload, privateKey);
const sessionId = `${label}_${jti}`;
const fmt = (t) => new Date(t * 1000).toLocaleString("fr-FR", { dateStyle: "full", timeStyle: "short" });

console.log("\n═══════════════════════════════════════════════════════════════");
console.log("  Licence NotchIA Pro émise");
console.log("═══════════════════════════════════════════════════════════════\n");
console.log(`  Destinataire : ${email}`);
console.log(`  Plan         : ${plan}${days ? ` (${days} jour${days > 1 ? "s" : ""})` : " — sans expiration"}`);
console.log(`  Émise le     : ${fmt(now)}`);
console.log(`  Expire le    : ${exp ? fmt(exp) : "jamais"}`);
console.log(`  Mac autorisés: ${devices}`);
console.log(`  Référence    : ${sessionId}\n`);
console.log("  Clé à coller dans NotchIA → Réglages → Licence :\n");
console.log("  " + key + "\n");

const sql = `INSERT OR IGNORE INTO licenses
  (key, email, plan, status, stripe_customer_id, stripe_subscription_id,
   stripe_session_id, created_at, updated_at, expires_at, active_devices, max_devices)
VALUES ('${key}', '${email.replace(/'/g, "''")}', '${plan}', 'active', NULL, NULL,
        '${sessionId}', ${now}, ${now}, ${exp ?? "NULL"}, 0, ${devices});`;

if (!doInsert) {
  console.log("───────────────────────────────────────────────────────────────");
  console.log("  ⚠️  Sans la ligne en base, l'app révoquera la clé au premier");
  console.log("      contrôle en ligne. Relance avec --insert, ou exécute :\n");
  console.log(`  npx wrangler d1 execute ${db} --remote --command "${sql.replace(/\n\s*/g, " ")}"\n`);
  process.exit(0);
}

console.log("───────────────────────────────────────────────────────────────");
console.log("  Insertion dans la base D1…\n");
try {
  const out = execFileSync("npx", ["wrangler", "d1", "execute", db, "--remote", "--command", sql.replace(/\n\s*/g, " ")], { encoding: "utf-8" });
  console.log(/rows_written":\s*1|"changes":\s*1/.test(out) || /Executed/.test(out)
    ? "  ✅ Licence enregistrée : l'app la validera en ligne comme une clé Stripe."
    : "  ⚠️  Commande exécutée mais résultat inattendu, vérifie la table `licenses`.");
} catch (e) {
  console.error("  ❌ Insertion échouée :", e?.message?.split("\n")[0]);
  console.error("     Exécute la commande SQL ci-dessus à la main.");
  process.exit(3);
}
