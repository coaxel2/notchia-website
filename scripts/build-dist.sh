#!/bin/bash
# Assemble dist/ : uniquement les fichiers publics du site (liste blanche).
# Tout le reste du dépôt (notes internes, marketing/, seo-audit/, scripts/, schema.sql…)
# n'est plus publié. functions/ reste à la racine : wrangler la compile depuis le dossier courant.
# Usage : ./scripts/build-dist.sh   puis   npx wrangler pages deploy dist (ou pages dev dist)
set -euo pipefail
cd "$(dirname "$0")/.."
rm -rf dist
rsync -a --prune-empty-dirs \
  --exclude='.DS_Store' --exclude='* copie.*' --exclude='* copy.*' \
  --include='/blog/***' --include='/de/***' --include='/en/***' --include='/es/***' \
  --include='/dl/***' --include='/fonts/***' --include='/press-kit/***' --include='/.well-known/***' \
  --include='/_headers' --include='/_redirects' \
  --exclude='/logo.original.png' \
  --include='/*.html' --include='/*.css' --include='/*.txt' --include='/*.xml' \
  --include='/*.png' --include='/*.svg' --include='/*.avif' --include='/*.webmanifest' \
  --include='/*.zip' --include='/*.command' \
  --exclude='*' ./ dist/
echo "dist/ : $(find dist -type f | wc -l | tr -d ' ') fichiers"
./scripts/check-content.sh dist
