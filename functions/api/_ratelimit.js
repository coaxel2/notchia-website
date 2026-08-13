/**
 * NotchIA — rate limit multi-fenêtres, partagé par les endpoints publics.
 *
 * Compteur en mémoire du Worker (réinitialisé à chaque cold start). Ça n'arrête
 * pas une attaque distribuée — pour ça il faut une règle Cloudflare WAF — mais
 * ça bloque le cas réel : un script lancé depuis une machine qui épuise un
 * quota tiers (Gemini 1000 req/jour, Resend 100 mails/jour) partagé par tous
 * les visiteurs.
 *
 * Usage :
 *   import { checkRate, MINUTE, HOUR, DAY } from "../_ratelimit.js";
 *   const r = checkRate("chat", ip, [{ ms: MINUTE, max: 6 }, { ms: HOUR, max: 40 }]);
 *   if (r.limited) return json({ error: ..., retryAfter: r.retryAfter }, 429);
 */

export const MINUTE = 60_000;
export const HOUR = 3_600_000;
export const DAY = 86_400_000;

const MAX_TRACKED_KEYS = 5000; // garde-fou mémoire par bucket

const buckets = new Map(); // nom du bucket -> Map(clé -> timestamps ms)

/**
 * @param {string} name    bucket logique ("chat", "contact"…) — isole les compteurs
 * @param {string} key     clé de comptage (IP appelante)
 * @param {{ms:number,max:number}[]} windows  fenêtres à respecter, toutes vérifiées
 * @returns {{limited:boolean, retryAfter:number}} retryAfter en secondes
 */
export function checkRate(name, key, windows) {
  if (!windows?.length) return { limited: false, retryAfter: 0 };
  const now = Date.now();
  let bucket = buckets.get(name);
  if (!bucket) {
    bucket = new Map();
    buckets.set(name, bucket);
  }

  const widest = Math.max(...windows.map((w) => w.ms));
  const hits = (bucket.get(key) || []).filter((t) => now - t < widest);

  for (const w of windows) {
    const inWindow = hits.filter((t) => now - t < w.ms);
    if (inWindow.length >= w.max) {
      // On ne consomme PAS de hit quand on refuse : sinon un client qui insiste
      // repousse indéfiniment sa propre fenêtre.
      bucket.set(key, hits);
      return {
        limited: true,
        retryAfter: Math.max(1, Math.ceil((w.ms - (now - inWindow[0])) / 1000)),
      };
    }
  }

  hits.push(now);
  bucket.set(key, hits);

  if (bucket.size > MAX_TRACKED_KEYS) {
    for (const [k, v] of bucket) {
      if (!v.length || now - v[v.length - 1] > widest) bucket.delete(k);
    }
  }
  return { limited: false, retryAfter: 0 };
}

/** Réinitialise un bucket (tests uniquement). */
export function _resetRate(name) {
  if (name) buckets.delete(name);
  else buckets.clear();
}

/**
 * Version persistante, à privilégier : le compteur mémoire ci-dessus est local
 * à un isolate Worker. Mesuré en production le 2026-08-13 : sur 8 requêtes
 * consécutives depuis la même IP, seules 2 étaient bloquées — les autres
 * tombaient sur d'autres isolates, chacun repartant d'un compteur vierge.
 * D1 donne un compteur unique pour tout le trafic.
 *
 * Fenêtre fixe (window_start = début du créneau) : une seule requête par
 * fenêtre, atomique grâce au UPSERT … RETURNING.
 *
 * Table :
 *   CREATE TABLE rate_limits (bucket TEXT, k TEXT, window_start INTEGER,
 *                             hits INTEGER, PRIMARY KEY (bucket, k, window_start));
 *
 * En cas d'indisponibilité de D1, on retombe sur le compteur mémoire : mieux
 * vaut une limite approximative qu'un endpoint ouvert ou en panne.
 */
export async function checkRateD1(db, name, key, windows) {
  if (!db) return checkRate(name, key, windows);
  const now = Date.now();
  try {
    for (const w of windows) {
      const windowStart = Math.floor(now / w.ms) * w.ms;
      const row = await db
        .prepare(
          `INSERT INTO rate_limits (bucket, k, window_start, hits)
           VALUES (?1, ?2, ?3, 1)
           ON CONFLICT(bucket, k, window_start) DO UPDATE SET hits = hits + 1
           RETURNING hits`
        )
        .bind(`${name}:${w.ms}`, key, windowStart)
        .first();
      const hits = Number(row?.hits ?? 1);
      if (hits > w.max) {
        // Fenêtre fixe : insister n'allonge pas l'attente, elle décroît.
        return { limited: true, retryAfter: Math.max(1, Math.ceil((windowStart + w.ms - now) / 1000)) };
      }
    }
    // Purge occasionnelle des créneaux périmés (≈ 1 requête sur 50)
    if (now % 50 === 0) {
      await db.prepare("DELETE FROM rate_limits WHERE window_start < ?1").bind(now - DAY).run();
    }
    return { limited: false, retryAfter: 0 };
  } catch (e) {
    console.log("rate limit D1 indisponible, repli mémoire —", e?.message);
    return checkRate(name, key, windows);
  }
}
