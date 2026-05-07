#!/usr/bin/env bash
# IndexNow ping — Bing, Yandex, ChatGPT Search, etc.
# À lancer après chaque déploiement pour notifier les moteurs.
# Usage : ./scripts/indexnow.sh

set -euo pipefail

KEY="f59d5c27ad39419c97195b2f973cd75f"
HOST="notchia.app"
SITEMAP="https://${HOST}/sitemap.xml"

# Récupère toutes les URLs du sitemap
URLS=$(curl -s "$SITEMAP" | grep -oE '<loc>[^<]+</loc>' | sed -E 's|</?loc>||g')

if [ -z "$URLS" ]; then
  echo "❌ Aucune URL trouvée dans $SITEMAP"
  exit 1
fi

# Construit le payload JSON
URL_ARRAY=$(echo "$URLS" | awk '{printf "\"%s\",", $0}' | sed 's/,$//')
PAYLOAD=$(cat <<EOF
{
  "host": "${HOST}",
  "key": "${KEY}",
  "keyLocation": "https://${HOST}/${KEY}.txt",
  "urlList": [${URL_ARRAY}]
}
EOF
)

# Ping IndexNow
echo "📡 Ping IndexNow pour $(echo "$URLS" | wc -l | tr -d ' ') URLs..."
HTTP_CODE=$(curl -sS -o /tmp/indexnow-response.txt -w "%{http_code}" \
  -X POST "https://api.indexnow.org/indexnow" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD")

if [ "$HTTP_CODE" -eq 200 ] || [ "$HTTP_CODE" -eq 202 ]; then
  echo "✅ IndexNow: $HTTP_CODE"
else
  echo "⚠️  IndexNow: $HTTP_CODE"
  cat /tmp/indexnow-response.txt
  exit 1
fi
