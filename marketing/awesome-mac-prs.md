# Awesome-Mac — PRs ready-to-submit

> Diffs précis pour les listes GitHub awesome-mac. Soumets-les **espacées** (24-48h entre chaque). NotchIA est positionnée comme **app macOS native indépendante** — pas comme fork ou dérivé.

---

## PR #1 — jaywcjlove/awesome-mac (STATUT : déjà soumise, voir #2065)

**Repo cible** : https://github.com/jaywcjlove/awesome-mac
**Étoiles** : ~ 80k+ (la plus grosse liste mac), indexée par tous les LLM.
**Catégorie** : Productivity > Menu Bar Tools
**Statut** : PR soumise le 2026-05-16, voir https://github.com/jaywcjlove/awesome-mac/pull/2065 — **diff README.md mis à jour le 2026-05-16 02:00 CEST** (commit `5309c4d` sur `coaxel2/awesome-mac@master`) : ligne désormais positionnée comme « Native macOS notch cockpit … FR/EN/ES/DE i18n. » sans aucune mention de fork. Body PR déjà clean.

### Concurrents notch déjà listés (analyse 2026-05-16)

- Atoll · CodexIsland · Notchly · NotchNook · Droppy · DynamicHorizon
- Ta différenciation : 15 modules natifs (vs apps mono-fonction), IA en direct unique sur Claude Code/Codex/Copilot, Apple Intelligence on-device pour Digest et Shelf summary, i18n FR/EN/ES/DE.

### Ligne dans README.md (entre NetFluss et NotchNook)

```markdown
* [NotchIA](https://notchia.app/) - Native macOS notch cockpit: multi-source music with synced lyrics, calendar, Pomodoro Focus, on-device Apple Intelligence RSS digest, live AI status (Claude Code/Codex/Copilot), 16-format converter, clipboard history. FR/EN/ES/DE i18n.
```

### Commit / PR title

```
Add NotchIA to Menu Bar Tools
```

### PR description (body — version corrigée)

```
Adds NotchIA to the Menu Bar Tools section.

NotchIA is an independent native macOS app that turns the MacBook notch into an interactive cockpit. It covers a broader scope than any notch utility currently in this section:

- **Live AI status** for Claude Code, ChatGPT Codex, and GitHub Copilot — 10 states (Compiling, Terminal, Searching, Reading, Editing, Writing, Web, Sub-agent, Planning, Running), token stats, 5h/7d quotas, permission notifications. Read locally from `~/.claude/projects/`.
- **On-device Apple Intelligence Digest** — RSS feed summaries via Foundation Models (macOS 26+). User pastes feeds, describes interests in plain language, the app fetches/dedupes/summarizes locally. 14-day cache. Graceful fallback on macOS 15.
- **Apple Intelligence Shelf summary** for PDF/.docx/.txt/.md files dropped on the notch.
- **Full Pomodoro Focus** with daily stats and configurable break sessions.
- **Multi-source music** (Apple Music, Spotify, YouTube Music) with **synced lyrics** via lrclib (26 languages).
- **16-format file converter** and unlimited clipboard history.
- **i18n**: French, English, Spanish, German.

How NotchIA differs from the notch apps already in this section:
- vs **CodexIsland**: NotchIA does Claude Code rate-limit tracking *plus* 15 other modules — it's a full notch cockpit, not a single-purpose tracker.
- vs **Notchly / NotchNook / Atoll**: NotchIA emphasizes integration with developer AI workflows (Claude Code, Codex, Copilot) and on-device Apple Intelligence (Digest, Shelf), beyond live activities and media controls.

Details:
- Site: https://notchia.app/
- GitHub releases: https://github.com/coaxel2/NotchIA/releases
- Pricing: Essential tier free for life · Pro €3.99/mo · Lifetime Pro €39.99 one-time for 2 Macs
- Platform: macOS 15+ (Sequoia), Apple Silicon + Intel
- Privacy: no telemetry, no third-party AI calls, on-device AI via Apple Intelligence Foundation Models

Inserted alphabetically between NetFluss and NotchNook.
```

### Update PR description sur PR #2065 (à faire via gh CLI)

```bash
gh pr edit 2065 --repo jaywcjlove/awesome-mac --body "$(cat <<'EOF'
[corps ci-dessus]
EOF
)"
```

---

## PR #2 — iCHAIT/awesome-macOS (STATUT : closed sans review)

**Repo** : https://github.com/iCHAIT/awesome-macOS
**Statut** : PR #816 a été **fermée immédiatement** par le mainteneur `herrbischoff` (2026-05-16). Analyse : ce repo n'est plus activement maintenu, le mainteneur ferme tout sans review. **Ne pas réessayer.**

---

## PR #3 — Autres awesome lists (à explorer)

Listes alternatives à investiguer manuellement :

| Repo | Étoiles | Section cible | Risque close |
|---|---|---|---|
| [agarrharr/awesome-macos-screensavers](https://github.com/agarrharr/awesome-macos-screensavers) | — | Pas pertinent (screensavers) | — |
| [Lihp31/awesome-macOS](https://github.com/Lihp31/awesome-macOS) | <1k | Productivity | Faible — petit repo, peu de filtres |
| [hk-shao/awesome-macos](https://github.com/hk-shao/awesome-macos) | <1k | À vérifier | Modéré |

**Stratégie alternative** plus utile : viser des listes thématiques étroites où NotchIA peut être en featured plutôt que noyée :
- "awesome-ai-tools" pour le Digest Apple Intelligence
- "awesome-claude-code" pour la détection des sessions
- "awesome-menubar-apps" si la liste existe

---

## Si une PR est rejetée

Raisons fréquentes :
- Section incorrecte → check le README, repropose dans la bonne section
- Pas en ordre alphabétique → repushe avec le bon ordre
- "Self-promotion" mentionné dans les CONTRIBUTING.md → certaines listes interdisent les auteurs de soumettre leur propre app. Si c'est le cas, demande à un utilisateur Mac de soumettre à ta place
- Description trop marketing → repushe avec une description plus factuelle (suis le ton des lignes voisines)
- Mainteneur qui ferme tout sans review (comme iCHAIT) → ne pas insister, passer à un autre repo

**Ne re-soumets pas la même PR sous un autre compte si elle est fermée — c'est un ban garanti.**

---

## Calendrier suggéré

| Jour | Action |
|---|---|
| 2026-05-16 | PR jaywcjlove/awesome-mac #2065 soumise ✓ + diff README.md corrigé sur le fork ✓ |
| +24h | Re-soumettre sur un autre awesome list ciblé |
| +48h | Vérifier l'état de la PR jaywcjlove, répondre aux commentaires de mainteneurs |
| +1 semaine | Si PR mergée, faire un post Reddit qui linke vers awesome-mac pour amplifier le signal |
