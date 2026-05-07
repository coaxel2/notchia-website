#!/bin/bash
# NotchIA — installation automatique
# https://notchia.app

set -e

cat <<'BANNER'

  ███╗   ██╗ ██████╗ ████████╗ ██████╗██╗  ██╗██╗ █████╗
  ████╗  ██║██╔═══██╗╚══██╔══╝██╔════╝██║  ██║██║██╔══██╗
  ██╔██╗ ██║██║   ██║   ██║   ██║     ███████║██║███████║
  ██║╚██╗██║██║   ██║   ██║   ██║     ██╔══██║██║██╔══██║
  ██║ ╚████║╚██████╔╝   ██║   ╚██████╗██║  ██║██║██║  ██║
  ╚═╝  ╚═══╝ ╚═════╝    ╚═╝    ╚═════╝╚═╝  ╚═╝╚═╝╚═╝  ╚═╝

  Installation automatique — environ 2 minutes

BANNER

# 1. Installer Homebrew si absent
if ! command -v brew >/dev/null 2>&1 && ! [ -x /opt/homebrew/bin/brew ] && ! [ -x /usr/local/bin/brew ]; then
  echo "📦 Étape 1/3 — Installation de Homebrew (gestionnaire de paquets)…"
  echo "   macOS te demandera ton mot de passe Mac."
  echo ""
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)" </dev/null
  echo ""
fi

if [ -x /opt/homebrew/bin/brew ]; then
  BREW=/opt/homebrew/bin/brew
elif [ -x /usr/local/bin/brew ]; then
  BREW=/usr/local/bin/brew
else
  echo "❌ Installation de Homebrew échouée. Vérifie ta connexion internet et réessaie."
  read -n 1 -s -r -p "Appuie sur une touche pour fermer."
  exit 1
fi

eval "$($BREW shellenv)"
if ! grep -qF "$BREW shellenv" ~/.zprofile 2>/dev/null; then
  echo "eval \"\$($BREW shellenv)\"" >> ~/.zprofile
fi

# 2. Installer NotchIA via brew cask
echo "🚀 Étape 2/3 — Installation de NotchIA…"
echo ""
brew install --cask coaxel2/notchia/notchia
echo ""

# 3. Nettoyer le quarantine (défense en profondeur)
xattr -cr /Applications/NotchIA.app 2>/dev/null || true

# 4. Tenter le lancement
echo "🎬 Étape 3/3 — Lancement de NotchIA…"
open /Applications/NotchIA.app 2>/dev/null || true

# Wait LONGER pour qu'AMFI ait le temps de kill le process si Gatekeeper bloque.
# Le process spawne brièvement avant d'être killed → un check trop tôt donne un faux positif.
sleep 6

# 5. Vérifier si l'app tourne encore APRÈS le délai (pas juste briefly)
if pgrep -f "NotchIA.app/Contents/MacOS/NotchIA" >/dev/null; then
  cat <<'OK'

  ✅  NotchIA tourne maintenant !

  L'icône ✨ apparaît dans ta barre de menu en haut à droite.
  Survole l'encoche (en haut au milieu) pour ouvrir l'app.

  Tu peux fermer cette fenêtre.

OK
  read -n 1 -s -r -p "Appuie sur une touche pour quitter."
  exit 0
fi

# 6. macOS Gatekeeper a bloqué le launch (cas le plus probable au 1er install)
cat <<'GATEKEEPER'

  ⚠️   Premier lancement : macOS demande TA PERMISSION explicite

      C'est NORMAL pour toute app non distribuée par le Mac App Store.
      Tu dois cliquer "Ouvrir quand même" UNE SEULE FOIS dans Réglages.

  📝  Voici la procédure exacte (3 clics, 30 secondes) :

      1)  Réglages système viennent de s'ouvrir sur "Confidentialité et sécurité"
          ─ Si elle s'est pas ouverte : cmd+espace, tape "Confidentialité",
            entrée, choisi "Confidentialité et sécurité"

      2)  Scroll jusqu'à la section "Sécurité" (en bas de la page)

      3)  À côté de "NotchIA a été empêchée de s'ouvrir car elle ne provient
          pas d'un développeur identifié", clique sur "Ouvrir quand même"
          (macOS te demandera ton mot de passe Mac ou Touch ID)

      4)  Une popup apparaît : clique "Ouvrir"

  Une fois fait, NotchIA se lance définitivement et tu n'auras
  plus jamais à refaire ces étapes.

GATEKEEPER

# Ouvre le bon panneau dans Réglages système
open "x-apple.systempreferences:com.apple.preference.security?Privacy_Allow" 2>/dev/null \
  || open "x-apple.systempreferences:com.apple.preference.security" 2>/dev/null \
  || open "/System/Applications/System Settings.app"

echo ""
read -n 1 -s -r -p "Appuie sur une touche après avoir cliqué 'Ouvrir quand même' dans Réglages."
echo ""
echo ""
echo "🚀  Re-lancement de NotchIA…"
open /Applications/NotchIA.app 2>/dev/null || true
sleep 4

if pgrep -f "NotchIA.app/Contents/MacOS/NotchIA" >/dev/null; then
  echo ""
  echo "✅  Parfait, NotchIA tourne ! Cherche l'icône ✨ dans ta barre de menu."
  echo "    Tu peux fermer cette fenêtre."
else
  echo ""
  echo "⚠️   NotchIA ne s'est pas lancé. Va dans Réglages → Confidentialité"
  echo "    et clique 'Ouvrir quand même' une fois NotchIA listé,"
  echo "    puis lance NotchIA depuis Spotlight (⌘+Espace → 'NotchIA')."
fi

read -n 1 -s -r -p "Appuie sur une touche pour fermer."
echo ""
