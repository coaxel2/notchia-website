# Awesome-Mac — 3 PRs ready-to-submit

> Diffs précis pour 3 listes GitHub awesome-mac. Soumets-les **espacées** (24-48h entre chaque), pas en même temps. Les mainteneurs regardent les cross-posts.

---

## PR #1 — jaywcjlove/awesome-mac

**Repo cible** : https://github.com/jaywcjlove/awesome-mac
**Étoiles** : ~ 80k+ (la plus grosse liste mac), indexée par tous les LLM.
**Catégorie** : Productivity > Menu Bar Tools

### ⚠️ Concurrents déjà listés (analyse 2026-05-16)

Cinq apps "notch utility" sont déjà dans Menu Bar Tools :
- **Boring Notch** (le projet d'origine open-source dont NotchIA dérive)
- **CodexIsland** (rate-limit display Claude Code / Codex CLI uniquement)
- **Notchly** (notch interactive avec live activities)
- **NotchNook** (intégration design avec l'encoche)
- **Atoll**, **Droppy**, **DynamicHorizon** (Dynamic Island-style)

Conséquence : ta PR doit **différencier clairement** sinon elle sera fermée comme duplicate. La ligne et le PR body ci-dessous adressent ce point.

### Étapes

1. Fork https://github.com/jaywcjlove/awesome-mac
2. Édite `README.md` à la **ligne 1198** (entre NetFluss et NotchNook). Si les lignes ont bougé depuis, cherche `NetFluss` avec Cmd+F.
3. Insère la ligne ci-dessous **juste après** la ligne de NetFluss
4. Commit avec le message ci-dessous
5. PR title : `Add NotchIA to Menu Bar Tools`
6. PR body : voir ci-dessous

### Ligne à insérer dans README.md (entre NetFluss et NotchNook)

```markdown
* [NotchIA](https://notchia.app/) - MacBook notch cockpit with multi-source music (synced lyrics), calendar, Pomodoro Focus, on-device Apple Intelligence RSS digest, and live AI status (Claude Code/Codex/Copilot). Open-core fork of Boring Notch with FR/EN/ES/DE i18n.
```

### Commit message

```
Add NotchIA to Menu Bar Tools
```

### PR title

```
Add NotchIA to Menu Bar Tools
```

### PR description (body)

```
Adds NotchIA to the Menu Bar Tools section.

NotchIA is a macOS app that turns the MacBook notch into an interactive cockpit. It is an **open-core fork of Boring Notch** (already listed) that adds substantial new modules not covered by any of the existing notch utilities in this section:

- **Live AI status** for Claude Code, ChatGPT Codex, and GitHub Copilot — 10 states (Compiling, Terminal, Searching, Reading, Editing, Writing, Web, Sub-agent, Planning, Running), token stats, 5h/7d quotas, permission notifications. Read locally from `~/.claude/projects/`.
- **On-device Apple Intelligence Digest** — RSS feed summaries via Foundation Models (macOS 26+). User pastes feeds, describes interests in plain language, the app fetches/dedupes/summarizes locally. 14-day cache. Graceful fallback on macOS 15.
- **Apple Intelligence Shelf summary** for PDF/.docx/.txt/.md files dropped on the notch.
- **Full Pomodoro Focus** with daily stats and configurable break sessions.
- **Multi-source music** (Apple Music, Spotify, YouTube Music) with **synced lyrics** via lrclib (26 languages).
- **16-format file converter** and unlimited clipboard history.
- **i18n**: French, English, Spanish, German.

How NotchIA differs from the notch apps already in this section:
- vs **Boring Notch**: NotchIA adds the AI layer (Claude Code monitoring, Apple Intelligence Digest, Shelf summaries), file converter, clipboard history, i18n, and a regular release cycle.
- vs **CodexIsland**: NotchIA does Claude Code rate-limit tracking *plus* 15 other modules — it's a full notch cockpit, not a single-purpose tracker.
- vs **Notchly / NotchNook**: NotchIA emphasizes integration with developer AI workflows and Apple Intelligence on-device, not just live activities.

Details:
- Site: https://notchia.app/
- GitHub releases: https://github.com/coaxel2/NotchIA/releases
- License: Open-core (base derived from MIT Boring Notch, Pro modules proprietary)
- Pricing: Essential tier free for life · Pro €3.99/mo · Lifetime Pro €39.99 one-time for 2 Macs
- Platform: macOS 15+ (Sequoia), Apple Silicon + Intel
- Privacy: no telemetry, no third-party AI calls, on-device AI via Apple Intelligence Foundation Models

Inserted alphabetically between NetFluss and NotchNook.
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
