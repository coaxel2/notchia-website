#!/bin/bash
# Génère une paire Ed25519 pour signer les clés de licence NotchIA.
#
# La privée va dans Cloudflare Pages env var LICENSE_PRIVATE_KEY (chiffrée).
# La publique va dans LICENSE_PUBLIC_KEY (env var, optionnel) ET embarquée
# dans NotchIA.app pour la vérification offline des licences.
#
# ⚠️  Rotater cette paire invalide toutes les licences existantes.
#     Ne re-générer qu'en cas de compromission de la clé privée.

set -e

if ! command -v node >/dev/null 2>&1; then
  echo "❌ node introuvable. Installe-le via Homebrew : brew install node"
  exit 1
fi

node -e "
const c = require('crypto');
const { privateKey, publicKey } = c.generateKeyPairSync('ed25519');
const priv = privateKey.export({ type: 'pkcs8', format: 'der' });
const pub  = publicKey.export({ type: 'spki', format: 'der' });
const pubRaw = pub.slice(-32);
console.log('═════════════════════════════════════════════════════════════════');
console.log('  NotchIA — paire de clés Ed25519 pour les licences');
console.log('═════════════════════════════════════════════════════════════════');
console.log('');
console.log('LICENSE_PRIVATE_KEY (PKCS#8 base64) — env var Cloudflare Pages :');
console.log('');
console.log('  ' + priv.toString('base64'));
console.log('');
console.log('LICENSE_PUBLIC_KEY (SPKI base64) — env var + app macOS :');
console.log('');
console.log('  ' + pub.toString('base64'));
console.log('');
console.log('Public raw 32 bytes hex — pratique pour Swift CryptoKit :');
console.log('');
console.log('  ' + pubRaw.toString('hex'));
console.log('');
console.log('═════════════════════════════════════════════════════════════════');
console.log('  Sauvegarde la clé privée en lieu sûr (1Password, etc.) AVANT');
console.log('  de fermer ce terminal — elle ne sera pas regénérée à l\\'identique.');
console.log('═════════════════════════════════════════════════════════════════');
"
