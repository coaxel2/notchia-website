#!/bin/bash
# Garde-fou de non-régression sur les faits et les revendications (lancé par build-dist.sh,
# donc aussi en CI avant chaque déploiement). Faits vérifiés dans le code de l'app le 2026-10-31 :
# 15 états IA, convertisseur à 13 formats de sortie, historique du presse-papiers limité à 100 entrées.
# Pas de revendication d'exclusivité (« la seule app ») ni de promesse de notarisation payante.
set -uo pipefail
DIR="${1:-dist}"
fail=0
check() {
  local label="$1" pattern="$2"
  local hits
  hits=$(grep -rIniE --include='*.html' --include='*.txt' "$pattern" "$DIR" | head -5)
  if [ -n "$hits" ]; then
    echo "✗ $label"; echo "$hits" | cut -c1-220; fail=1
  fi
}
check "états IA : 15, pas 10" '\b10 (états|states|estados|Zustände|Zuständen) (IA|AI|de IA|KI)'
check "convertisseur : 13 formats, pas 16" '\b16 (formats|formatos|Formate)\b'
check "presse-papiers : 100 entrées, pas illimité" "presse-papiers illimit|unlimited clipboard|portapapeles ilimitad|unbegrenzte Zwischenablage"
check "pas de revendication d'exclusivité" "la seule app|the only (macos |mac |notch )*app|la única app|die einzige macos"
check "pas de promesse Apple Developer payante" "99 ?€ ?/ ?(an|año|jahr)|€99 ?/ ?year"
if [ "$fail" -ne 0 ]; then echo "check-content : échec"; exit 1; fi
echo "check-content : OK"
