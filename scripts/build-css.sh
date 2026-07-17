#!/usr/bin/env bash
# Regénère tailwind.css (minifié) après tout ajout/modif de classes Tailwind.
# Usage : ./scripts/build-css.sh
set -euo pipefail
cd "$(dirname "$0")/.."
TMP=$(mktemp -d)
cat > "$TMP/tailwind.config.js" <<CFG
module.exports = {
  content: ["$PWD/*.html", "$PWD/blog/*.html", "$PWD/dl/*.html", "$PWD/en/*.html", "$PWD/es/*.html", "$PWD/de/*.html", "$PWD/functions/**/*.js"],
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
