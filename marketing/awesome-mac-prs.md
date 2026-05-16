# Awesome-Mac — 3 PRs ready-to-submit

> Diffs précis pour 3 listes GitHub awesome-mac. Soumets-les **espacées** (24-48h entre chaque), pas en même temps. Les mainteneurs regardent les cross-posts.

---

## PR #1 — jaywcjlove/awesome-mac

**Repo cible** : https://github.com/jaywcjlove/awesome-mac
**Étoiles** : ~ 80k+ (la plus grosse liste mac), indexée par tous les LLM.
**Catégorie** : Productivity > Menu Bar Tools (à vérifier dans le README au moment de la PR — l'ordre alphabétique compte)

### Étapes

1. Fork https://github.com/jaywcjlove/awesome-mac
2. Édit `README.md` ou `editors/README-en.md` selon la convention du repo
3. Ajoute la ligne ci-dessous **dans la section Menu Bar Tools, à la position alphabétique** (entre "Magnet" et "OneSwitch" approximativement)
4. Commit avec le message ci-dessous
5. PR title : `Add NotchIA to Menu Bar Tools`
6. PR body : voir ci-dessous

### Ligne à insérer dans README.md

```markdown
- [NotchIA](https://notchia.app/) - Turns the MacBook notch into an interactive cockpit with multi-source music + synced lyrics, calendar, Pomodoro Focus, on-device Apple Intelligence Digest (RSS summaries), live AI status (Claude Code / Codex / Copilot) and system HUD replacement. Free Essential tier, Pro €39.99 lifetime. Based on the open-source Boring Notch. macOS 15+. ![Freemium]
```

### Commit message

```
Add NotchIA — interactive MacBook notch with on-device AI
```

### PR description (body)

```
This PR adds **NotchIA** to the Menu Bar Tools section.

NotchIA is a macOS app that turns the MacBook notch (or menu bar on notch-less Macs) into an interactive cockpit with 15 native modules: multi-source music player with synced lyrics, iCal calendar + Reminders, full Pomodoro Focus, on-device Apple Intelligence Digest (RSS summaries via Foundation Models, requires macOS 26), live AI status for Claude Code / ChatGPT Codex / GitHub Copilot, system HUD replacement, and more.

- Site: https://notchia.app/
- GitHub releases: https://github.com/coaxel2/NotchIA/releases
- License: Open-core (base derived from open-source Boring Notch, Pro modules proprietary)
- Pricing: Essential tier free for life · Pro €3.99/mo · Lifetime Pro €39.99 one-time for 2 Macs
- Platform: macOS 15+ (Sequoia), Apple Silicon + Intel
- Privacy: no telemetry, no third-party AI calls, on-device summaries via Apple Intelligence

The app builds on top of the existing open-source Boring Notch project and adds the AI integration layer, file converter, clipboard history, and i18n (FR/EN/ES/DE). Boring Notch is also a valid candidate for this list if you'd prefer the strictly open-source option.

Position in alphabetical order: between "Magnet" and "OneSwitch" (adjust as needed based on current contents).
```

---

## PR #2 — iCHAIT/awesome-macOS

**Repo cible** : https://github.com/iCHAIT/awesome-macOS
**Étoiles** : ~ 15k+
**Catégorie** : Productivity

### Étapes

1. Fork https://github.com/iCHAIT/awesome-macOS
2. Édit `README.md` à la section **Productivity**
3. Ajoute la ligne ci-dessous **en respectant l'ordre alphabétique**
4. Commit avec le message ci-dessous
5. PR title : `Add NotchIA to Productivity`
6. PR body : voir ci-dessous

### Ligne à insérer

```markdown
- [NotchIA](https://notchia.app/) - macOS app that turns the MacBook notch into an interactive cockpit: media, calendar, Focus, live AI (Claude Code/Codex/Copilot), on-device Apple Intelligence RSS digest, file converter. Open-core, free Essential tier + Pro €39.99 lifetime.
```

### Commit message

```
Add NotchIA — interactive MacBook notch app
```

### PR description

```
Adds NotchIA to the Productivity section.

NotchIA is a macOS 15+ app that uses the MacBook notch as an interactive cockpit:
- Multi-source media (Apple Music, Spotify, YouTube Music) + synced lyrics
- Calendar (iCal + Reminders) and Pomodoro Focus
- Live AI status for Claude Code, ChatGPT Codex, GitHub Copilot (10 states, token stats)
- On-device Apple Intelligence Digest (RSS summaries via Foundation Models)
- File converter, clipboard history, system HUD replacement

Site: https://notchia.app/ · Open-core, free Essential tier, Pro €39.99 lifetime.
```

---

## PR #3 — agarrharr/awesome-macos-screensavers (faux ami — ne pas viser)

**Verdict** : skipper. Pas le bon repo pour NotchIA (focalisé screensavers).

### Vrai 3e repo : serhii-londar/open-source-mac-os-apps

**Repo cible** : https://github.com/serhii-londar/open-source-mac-os-apps
**Étoiles** : ~ 45k+
**Attention** : ce repo n'accepte **que** les apps 100 % open-source. NotchIA est open-core. **Option A** : soumettre Boring Notch (le projet d'origine) si pas déjà listé, en mentionnant ton fork/successeur dans la PR. **Option B** : skipper ce repo.

### Si Option A — vérifier d'abord
```bash
# Avant de PR, vérifier que Boring Notch n'est pas déjà dans la liste :
curl -s https://raw.githubusercontent.com/serhii-londar/open-source-mac-os-apps/master/README.md | grep -i 'boring\|notch'
```

Si Boring Notch n'est pas déjà listé, voici la PR (qui linke vers le projet open-source pas vers NotchIA — c'est le seul moyen propre d'apparaître sur cette liste) :

### Ligne pour Boring Notch (Menubar / Productivity)

```markdown
- [Boring Notch](https://github.com/TheBoredTeam/boring.notch) - macOS app that uses the MacBook notch as an interactive control center: media playback, calendar, system HUD. MIT licensed. (See [NotchIA](https://notchia.app/) for the extended fork with AI integration.)
```

Mainteneur peut refuser le "See X for fork". Si refus, soumets juste la ligne sans la mention. Le backlink vers NotchIA est secondaire — ce qui compte c'est que ton sujet (notch utility) apparaisse dans la liste.

---

## Alternative 3e PR — agarrharr/awesome-cli-apps

**Repo cible** : https://github.com/agarrharr/awesome-cli-apps
Pas applicable directement à NotchIA (pas un CLI). Skipper.

---

## Bilan : combien de PRs réellement

- **2 PR sûres et impactantes** : jaywcjlove/awesome-mac + iCHAIT/awesome-macOS
- **1 PR conditionnelle** : serhii-londar/open-source-mac-os-apps (seulement si Boring Notch absent + accepté avec mention de fork)

Démarre par jaywcjlove (la plus grosse liste, 80k étoiles, gros impact LLM).

---

## Si une PR est rejetée

Raisons fréquentes :
- Section incorrecte → check le README, repropose dans la bonne section
- Pas en ordre alphabétique → repushe avec le bon ordre
- "Self-promotion" mentionné dans les CONTRIBUTING.md → certaines listes interdisent les auteurs de soumettre leur propre app. Si c'est le cas, demande à un utilisateur Mac de soumettre à ta place
- Description trop marketing → repushe avec une description plus factuelle (suis le ton des lignes voisines)

**Ne re-soumets pas la même PR sous un autre compte si elle est fermée — c'est un ban garanti.**

---

## Calendrier suggéré

| Jour | Action |
|---|---|
| Aujourd'hui | PR jaywcjlove/awesome-mac |
| +24h | PR iCHAIT/awesome-macOS |
| +48h | Vérifier l'état des 2 PRs, répondre aux commentaires de mainteneurs |
| +72h | PR Boring Notch sur serhii-londar (si applicable) |
| +1 semaine | Suivi : si PR mergées, faire un post Reddit qui linke vers awesome-mac pour amplifier le signal |
