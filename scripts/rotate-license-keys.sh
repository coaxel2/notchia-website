#!/bin/bash
# NotchIA — Rotation de la paire Ed25519 utilisée pour signer les licences.
#
# Génère une NOUVELLE paire (`new_priv`, `new_pub`) et affiche la procédure
# pas-à-pas pour basculer les env vars Cloudflare Pages sans invalider les
# licences existantes (compat via `LICENSE_VERIFY_KEY_OLD`).
#
# Quand utiliser ce script ?
#   - Suspicion de compromission de LICENSE_PRIVATE_KEY (leak terminal, employé qui part…)
#   - Audit annuel de sécurité (recommandation NIST SP 800-57 : rotation périodique)
#   - Migration cryptographique (changement d'algo)
#
# ⚠️ Garde TOUJOURS l'ancienne pub en LICENSE_VERIFY_KEY_OLD pendant au moins
#   60 jours (= durée d'une licence mensuelle + marge). Sinon les licences
#   mensuelles signées avant la rotation seront invalidées.
#
# Pré-requis :
#   - node (déjà requis par scripts/generate-license-keypair.sh)
#   - wrangler CLI authentifié (`wrangler login` une fois)
#   - Code des Functions adapté pour accepter 2 verify keys (voir étape 1).

set -euo pipefail

# ─── Couleurs ──────────────────────────────────────────────────────────────
if [[ -t 1 ]]; then
  BOLD=$'\033[1m'; DIM=$'\033[2m'; CYAN=$'\033[36m'; YEL=$'\033[33m'; RED=$'\033[31m'; GRN=$'\033[32m'; RST=$'\033[0m'
else
  BOLD=""; DIM=""; CYAN=""; YEL=""; RED=""; GRN=""; RST=""
fi

# ─── Sanity checks ─────────────────────────────────────────────────────────
if ! command -v node >/dev/null 2>&1; then
  echo "${RED}node introuvable. Installe-le via Homebrew : brew install node${RST}" >&2
  exit 1
fi

if ! command -v openssl >/dev/null 2>&1; then
  echo "${RED}openssl introuvable.${RST}" >&2
  exit 1
fi

# ─── Génération de la nouvelle paire ───────────────────────────────────────
echo "${BOLD}${CYAN}═════════════════════════════════════════════════════════════════${RST}"
echo "${BOLD}${CYAN}  NotchIA — rotation de la paire Ed25519 (licences)${RST}"
echo "${BOLD}${CYAN}═════════════════════════════════════════════════════════════════${RST}"
echo

# On utilise Node (déjà disponible) plutôt qu'OpenSSL pur, parce que les
# Functions importent la clé via WebCrypto au format PKCS#8 base64 — identique
# au format que Node produit nativement avec privateKey.export({ type: 'pkcs8', format: 'der' }).
#
# Alternative OpenSSL pure (équivalent) :
#   openssl genpkey -algorithm Ed25519 -outform DER -out priv.der
#   openssl pkey -in priv.der -inform DER -pubout -outform DER -out pub.der
#   base64 -i priv.der  # → LICENSE_PRIVATE_KEY (PKCS#8 base64)
#   base64 -i pub.der   # → LICENSE_PUBLIC_KEY  (SPKI base64)
# La sortie sera strictement compatible avec les Functions actuelles.

KEYPAIR=$(node -e "
const c = require('crypto');
const { privateKey, publicKey } = c.generateKeyPairSync('ed25519');
const priv = privateKey.export({ type: 'pkcs8', format: 'der' }).toString('base64');
const pub  = publicKey.export({ type: 'spki',  format: 'der' }).toString('base64');
const pubRaw = publicKey.export({ type: 'spki', format: 'der' }).slice(-32).toString('hex');
process.stdout.write(priv + '|' + pub + '|' + pubRaw);
")

NEW_PRIV="${KEYPAIR%%|*}"
REST="${KEYPAIR#*|}"
NEW_PUB="${REST%%|*}"
NEW_PUB_HEX="${REST#*|}"

# Empreinte de la nouvelle clé pour traçabilité
FP=$(echo -n "$NEW_PUB" | shasum -a 256 | cut -c1-16)

TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# ─── Affichage des clés ────────────────────────────────────────────────────
cat <<EOF

${BOLD}1) Nouvelle paire générée${RST}    ${DIM}(empreinte SHA-256 pub: ${FP}, généré ${TIMESTAMP})${RST}

   ${BOLD}LICENSE_PRIVATE_KEY${RST} (PKCS#8 base64) :

     ${NEW_PRIV}

   ${BOLD}LICENSE_PUBLIC_KEY${RST}  (SPKI base64) :

     ${NEW_PUB}

   ${BOLD}Public raw 32 bytes hex${RST} (pour Swift CryptoKit / NotchIA.app) :

     ${NEW_PUB_HEX}

EOF

# ─── Procédure de transition ───────────────────────────────────────────────
cat <<EOF
${BOLD}${CYAN}─── Procédure de transition (zero-downtime) ─────────────────────────${RST}

${BOLD}Étape 1 — Préparer le code à accepter deux verify keys${RST}
   Avant de toucher aux env vars, le code doit pouvoir vérifier une licence
   avec L'ANCIENNE ou la NOUVELLE clé publique.

   Dans ${BOLD}functions/api/license/validate.js${RST} (et helper ${BOLD}_crypto.js${RST}) :

     // Pseudo-code à adapter (current file utilise une seule key)
     const oldPub = env.LICENSE_VERIFY_KEY_OLD;
     const newPub = env.LICENSE_PUBLIC_KEY;
     let res = await verifyLicenseKey(key, newPub);
     if (!res.valid && oldPub) {
       res = await verifyLicenseKey(key, oldPub);
     }
     if (!res.valid) return json({ valid: false, reason: res.reason });

   ${YEL}Commit + push + déploiement Cloudflare Pages avant l'étape 2.${RST}
   À ce stade, OLD = clé actuelle et NEW n'existe pas encore.

${BOLD}Étape 2 — Sauvegarder l'ancienne clé publique${RST}

   La valeur actuelle de ${BOLD}LICENSE_PUBLIC_KEY${RST} doit être recopiée
   dans une nouvelle variable ${BOLD}LICENSE_VERIFY_KEY_OLD${RST} (non chiffrée).

   ${DIM}wrangler pages secret put / Cloudflare Dashboard → notchia-website${RST}
   ${DIM}→ Settings → Environment variables → Production${RST}

   Ou en CLI (production) :

     wrangler pages secret put LICENSE_VERIFY_KEY_OLD --project-name notchia-website
     # → coller la valeur ACTUELLE de LICENSE_PUBLIC_KEY (SPKI base64)

   ${YEL}NOTE${RST} : LICENSE_VERIFY_KEY_OLD n'est PAS sensible (clé publique),
   mais on la met en "secret" pour rester homogène avec LICENSE_PUBLIC_KEY.

${BOLD}Étape 3 — Pousser la nouvelle paire en prod${RST}

   En CLI (recommandé) :

     # Clé privée (sensible — toujours en secret chiffré)
     wrangler pages secret put LICENSE_PRIVATE_KEY --project-name notchia-website
     # → coller : ${NEW_PRIV}

     # Clé publique (non sensible)
     wrangler pages secret put LICENSE_PUBLIC_KEY --project-name notchia-website
     # → coller : ${NEW_PUB}

   Alternative Dashboard : Cloudflare → Pages → notchia-website → Settings
   → Environment variables → ${BOLD}Production${RST} → édit :
     - LICENSE_PRIVATE_KEY ← nouvelle PKCS#8 (chiffré)
     - LICENSE_PUBLIC_KEY  ← nouvelle SPKI
     - LICENSE_VERIFY_KEY_OLD ← ancienne SPKI (gardée 60 j minimum)

${BOLD}Étape 4 — Redéployer + vérifier${RST}

     # Forcer une nouvelle build pour que les Functions récupèrent les env
     wrangler pages deploy . --project-name notchia-website
     # ou : Cloudflare Dashboard → Deployments → Retry last deployment

   Test fonctionnel :
   ${DIM}1.${RST} Faire un achat test 2,99 € → reçoit une licence signée par NEW_PUB.
   ${DIM}2.${RST} Tester validation d'une ANCIENNE licence (mensuel signé avant rotation) :
        curl -X POST https://notchia.app/api/license/validate \\
          -H "Content-Type: application/json" \\
          -d '{"key":"nia_live_<ancienne_clé>"}'
        → doit toujours répondre { valid: true } (vérifié via OLD_VERIFY_KEY).
   ${DIM}3.${RST} D1 inspector :
        wrangler d1 execute notchia-licenses --remote \\
          --command="SELECT key, created_at FROM licenses ORDER BY created_at DESC LIMIT 5"

${BOLD}Étape 5 — Mettre à jour la clé publique embarquée dans NotchIA.app${RST}

   Swift / NotchIA.app source :
     let licensePublicKeyHex = "${NEW_PUB_HEX}"

   ${YEL}Important${RST} : tant que la version de l'app n'est pas releasée avec
   la nouvelle clé publique, les nouvelles licences signées par NEW_PRIV
   ne seront PAS vérifiées en OFFLINE.

   Pour transition douce, l'app peut embarquer DEUX clés publiques pendant
   une release :

     let publicKeysHex = [
       "${NEW_PUB_HEX}",           // priorité nouvelle
       "<ancienne_pub_hex>",       // fallback pour licences anciennes
     ]
     // verifyLicenseKey tente chaque pub dans l'ordre, valid si l'une match.

   Une fois 100 % des users à jour, retirer l'ancienne clé du binaire.

${BOLD}Étape 6 — Retrait de l'ancienne clé (après ≥ 60 jours)${RST}

   Quand toutes les licences mensuelles signées par OLD_PRIV ont expiré
   (max 31 jours + marge sécurité = 60 jours minimum), supprimer :

     wrangler pages secret delete LICENSE_VERIFY_KEY_OLD --project-name notchia-website

   Mettre à jour le code ${BOLD}validate.js${RST} pour retirer la branche fallback.
   Commit + déploiement.

   ${RED}⚠️${RST} ${BOLD}Lifetime${RST} : les licences lifetime n'expirent jamais. Garder
   LICENSE_VERIFY_KEY_OLD ${BOLD}indéfiniment${RST} si des lifetime ont été
   émis sous l'ancienne clé. Alternative : ré-émettre toutes les licences
   lifetime existantes (UPDATE licenses SET key = <nouvelle_signature>) après
   une migration scriptée.

${BOLD}${CYAN}─── Sauvegarde 1Password ────────────────────────────────────────────${RST}

  Avant de fermer ce terminal, archive la nouvelle paire dans 1Password :

    Item : NotchIA — License Ed25519 (rotation ${TIMESTAMP})
    Fields :
      - LICENSE_PRIVATE_KEY  : ${NEW_PRIV}
      - LICENSE_PUBLIC_KEY   : ${NEW_PUB}
      - Public raw hex       : ${NEW_PUB_HEX}
      - Fingerprint          : ${FP}
      - Rotated at           : ${TIMESTAMP}
      - Previous fingerprint : <à compléter manuellement>

  ${RED}La clé privée ne sera plus regénérée à l'identique.${RST}

${BOLD}${CYAN}═════════════════════════════════════════════════════════════════${RST}

EOF
