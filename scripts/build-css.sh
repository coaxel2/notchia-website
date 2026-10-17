#!/usr/bin/env bash
# Regénère tailwind.css (minifié) après tout ajout/modif de classes Tailwind.
# Usage : ./scripts/build-css.sh
set -euo pipefail
cd "$(dirname "$0")/.."
TMP=$(mktemp -d)
cat > "$TMP/tailwind.config.js" <<CFG
module.exports = {
  content: {
    files: ["$PWD/*.html", "$PWD/blog/*.html", "$PWD/dl/*.html", "$PWD/en/*.html", "$PWD/es/*.html", "$PWD/de/*.html", "$PWD/functions/**/*.js"],
    // La copie intégrée de tailwind.css (<style id="tailwind"> de la home) ne doit pas
    // être analysée : ses sélecteurs échappés (.left-1\/2) produiraient de fausses classes.
    transform: { html: (src) => src.replace(/<style id="tailwind">[\\s\\S]*?<\\/style>/g, "") },
  },
  theme: { extend: {
    colors: {
      ink: '#0B0D12', ink2: '#0F1218', surface: '#14171F', surface2: '#1B1F2A',
      line: 'rgba(237, 232, 220, 0.08)', line2: 'rgba(237, 232, 220, 0.14)',
      cream: '#EDE8DC', fog: 'rgba(237, 232, 220, 0.62)', mist: 'rgba(237, 232, 220, 0.52)',
      violet: 'var(--violet, #A855F7)', magenta: 'var(--magenta, #FF4D88)',
      orange: 'var(--orange, #FF7A2D)', cyan: 'var(--cyan, #4DA8FF)', mint: '#9DD9B7',
    },
    fontFamily: {
      display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
      sans: ['"Instrument Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
    },
  } }
}
CFG
echo "@tailwind base; @tailwind components; @tailwind utilities;" > "$TMP/input.css"
npx -y tailwindcss@3.4.17 -c "$TMP/tailwind.config.js" -i "$TMP/input.css" -o tailwind.css --minify
rm -rf "$TMP"
echo "✓ tailwind.css régénéré ($(wc -c < tailwind.css) octets)"

# La home intègre une copie de tailwind.css (<style id="tailwind">) pour qu'aucune
# feuille CSS ne bloque son premier rendu : on la réinjecte pour qu'elle reste identique.
node -e '
const fs = require("fs");
const css = fs.readFileSync("tailwind.css", "utf8").trim();
const re = /(<style id="tailwind">)[\s\S]*?(<\/style>)/;
let html = fs.readFileSync("index.html", "utf8");
if (!re.test(html)) { console.error("✗ <style id=\"tailwind\"> introuvable dans index.html"); process.exit(1); }
html = html.replace(re, (_, open, close) => open + css + close);
fs.writeFileSync("index.html", html);
'
echo "✓ copie intégrée dans index.html : relancer build-i18n-pages.mjs pour /en/ /es/ /de/"
