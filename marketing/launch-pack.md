# NotchIA — Pack de lancement externe

> Drafts prêts à envoyer pour les 5 canaux de visibilité externe les plus rentables. NotchIA est positionnée comme **app macOS native indépendante** — JAMAIS comme fork ou dérivé d'un autre projet.

## Sommaire

1. [Product Hunt](#1--product-hunt) — un mardi/mercredi à 6h00 PT
2. [Reddit r/MacApps + r/macbookpro](#2--reddit) — format Showcase, après 14h CET = peak engagement US
3. [Pull Requests GitHub awesome-mac](#3--github-awesome-mac) — voir `marketing/awesome-mac-prs.md`
4. [Mail aux blogs Mac FR](#4--mail-blogs-mac-fr) — MacGeneration, iGeneration, Mac4Ever
5. [Hacker News Show HN](#5--hacker-news-show-hn) — pour la prochaine release avec angle technique fort

---

## 1 — Product Hunt

**Quand** : mardi ou mercredi, 6h00 PT (15h00 CET). Surtout pas un vendredi.
**Lien** : https://www.producthunt.com/posts/new

### Title (60 chars max)
```
NotchIA — Turn your MacBook notch into an interactive cockpit
```

### Tagline (60 chars max)
```
Live AI status, Apple Intelligence summaries, in the notch
```

### Description (longform)
```
NotchIA turns the empty notch of your MacBook (or the menu bar on notch-less Macs) into an interactive control center — 15 native modules across six tabs.

What you get in the free tier:
• Multi-source music with synced lyrics (Apple Music, Spotify, YouTube Music)
• Calendar + Reminders with iCal events
• Full Pomodoro Focus with daily stats
• Digest (new in 2.8.0) — RSS feeds summarized by on-device Apple Intelligence
• System HUD replacement (volume, brightness, keyboard)
• Sneak Peek Engine, focus detection, recording detection
• 4 languages: French, English, Spanish, German

Pro adds:
• Live AI status — Claude Code, ChatGPT Codex, and GitHub Copilot in the notch with 10 states, token stats, 5h/7d quotas, permission notifications
• Shelf drag-and-drop with on-device Apple Intelligence summary for PDF/.docx
• File converter (16 formats)
• Unlimited clipboard history

100% local. No telemetry, no third-party AI calls (except license validation). Independent macOS app developed in Paris.

Free Essential tier forever. Pro at €2.99/mo or €24.99 one-time for 2 Macs (lifetime, all major updates included).

macOS 15+ (Sequoia). Apple Silicon + Intel.
```

### Gallery (images)
- 1× screenshot encoche ouverte avec onglet IA en direct (état "Compilation · xcodebuild · 12s")
- 1× screenshot Digest avec brief résumé Apple Intelligence
- 1× screenshot Shelf avec aura arc-en-ciel pendant un résumé PDF
- 1× screenshot Calendar
- 1× hero gif (encoche fermée → ouverte → onglet IA → onglet Digest)
- 1× tableau Essentiel vs Pro

### Maker Comment (à poster soi-même dans les 30 min)
```
Hey PH! I'm Axel, indie dev based in Paris.

I built NotchIA because the MacBook notch sits there doing nothing all day while my Claude Code session crunches in the background and I'm wondering if it's done or hung. So the notch shows me. That was the seed.

Two months later it does music with synced lyrics, calendar, Pomodoro Focus, file conversion, clipboard history, and — the bit I'm proudest of — Digest, which fetches my RSS feeds and lets Apple's on-device Foundation Models summarize them based on what I tell it I care about. Nothing leaves the Mac.

Free Essential tier is full Focus + Digest + media + calendar + HUD. Pro is €24.99 once for the live-AI integration and file management.

AMA on architecture, on-device AI implementation, why no Mac App Store, anything.
```

### Hunter (qui poste)
Idéalement quelqu'un avec déjà des followers PH. Sinon, poste toi-même.

---

## 2 — Reddit

### r/MacApps — titre

```
[Showcase] NotchIA — turn your MacBook notch into an interactive cockpit with live Claude Code/Codex/Copilot status and on-device Apple Intelligence
```

### r/MacApps — corps

```
Hi all, indie dev here. I built NotchIA — a native macOS app that turns the MacBook notch (or the menu bar on notch-less Macs) into a multi-tab interactive cockpit. 15 modules across six tabs.

**Why I built it**

The notch sits empty all day. My Claude Code session is crunching in the background and I keep switching windows to check if it's done, if it crashed, or if it's waiting for a permission prompt. So the notch shows me. That was the seed.

**What it does**

- **Live AI status** in the notch: auto-detects Claude Code, ChatGPT Codex, and GitHub Copilot sessions, shows 10 states (Compiling, Terminal, Searching, Reading, Editing, Writing, Web, Sub-agent, Planning, Running), token stats per session, 5h/7d quota bars, and notifications when an assistant is waiting for permission. Reads `~/.claude/projects/` locally, no cloud calls.

- **Digest** (new in 2.8.0, free): paste your RSS feeds, describe what interests you in plain language, and on-device Apple Intelligence (Foundation Models) summarizes them for you. 14-day cache. Requires macOS 26 for Apple Intelligence; falls back to a raw RSS viewer on macOS 15.

- **Shelf with on-device summary**: drop a PDF/.docx/.txt/.md on the notch, get a scrollable summary via the same on-device models.

- **Music**: Apple Music, Spotify, YouTube Music — with synced lyrics via lrclib (26 languages), album art with extracted dominant color.

- **Calendar**: iCal events + Reminders, day + month views, create events directly from the notch.

- **Focus**: full Pomodoro with daily stats, configurable break sessions.

- **System HUD replacement**: volume, brightness, keyboard backlight integrated into the notch.

- **Shelf** drag-and-drop, **16-format file converter**, unlimited **clipboard history**.

- **i18n**: French, English, Spanish, German.

**Privacy**

No telemetry, no third-party AI calls. The only outbound connections are Sparkle auto-update (EdDSA signed), license validation (email + key), and the RSS feeds you configured yourself.

**Pricing**

Essential tier free forever (Focus, Digest, media, calendar, HUD, lyrics, system detections). Pro at €2.99/mo or €24.99 lifetime one-time for 2 Macs.

macOS 15+ (Sequoia), Apple Silicon + Intel. Download: https://notchia.app/

Happy to answer questions on the AI detection logic, on-device Apple Intelligence integration, the notch overlay implementation, or anything else.
```

### r/macbookpro — adapter

Même corps mais titre plus orienté hardware :
```
[App] Built a notch app that monitors my Claude Code sessions and summarizes my RSS feeds on-device — NotchIA
```

### Règles à respecter
- **JAMAIS** poster en moins de 24h sur les deux subs (les mods regardent les cross-post)
- Répondre dans les 2h aux commentaires (les mods downvote les "post and ghost")
- Si quelqu'un compare à un autre notch utility (NotchNook, MediaMate, Boring Notch, etc.) en commentaire, OK de répondre factuellement vs cette app — ne JAMAIS faire la comparaison en proactif
- Ne pas répondre aux trolls. Bloquer si nécessaire.

---

## 3 — GitHub awesome-mac

Voir `marketing/awesome-mac-prs.md` pour les diffs précis ready-to-submit.

---

## 4 — Mail blogs Mac FR

3 cibles. Personnaliser le destinataire avant d'envoyer.

### a) MacGeneration

**Email** : redaction@macg.co
**Objet** : `NotchIA — app macOS qui détecte Claude Code dans l'encoche et résume tes RSS via Apple Intelligence on-device`

```
Bonjour,

Je suis Axel Courty, développeur indépendant à Paris. Je viens de sortir NotchIA, une app macOS native qui exploite l'encoche du MacBook comme cockpit interactif, avec deux angles que vous n'avez pas couverts à ma connaissance :

1. Détection automatique des sessions Claude Code, ChatGPT Codex et GitHub Copilot en direct — affichage de 10 états en temps réel dans l'encoche, statistiques de jetons, quotas 5h/7j, notifications quand l'assistant attend une permission. Lecture 100 % locale des journaux ~/.claude/projects/, jamais d'envoi externe.

2. Digest — résumé des flux RSS via Apple Intelligence (Foundation Models on-device, macOS 26). L'utilisateur colle ses flux, décrit ses centres d'intérêt en langage naturel, l'app fetch + dédupe + résume. 100 % local — pas d'OpenAI/Anthropic dans le circuit. C'est la première fois que je vois un usage quotidien sérieux des Foundation Models.

L'app inclut 15 modules natifs au total : médias multi-source avec paroles synchronisées, calendrier, Pomodoro Focus, Digest, Shelf, IA en direct, convertisseur 16 formats, presse-papiers historique, HUD système, et plus. Tier Essentiel gratuit à vie, Pro à 2,99 €/mois ou 24,99 € à vie en achat unique.

Je serais ravi de vous envoyer un build de test, vous laisser jouer avec, et répondre aux questions techniques. Je peux aussi écrire un guest post si vous voulez creuser l'intégration on-device Apple Intelligence.

Site : https://notchia.app/
Blog post détaillé sur Digest : https://notchia.app/blog/wise-owl-2-8-0
Comparatif Mac apps 2026 : https://notchia.app/blog/meilleures-apps-mac-2026

Merci pour votre temps.

Axel Courty
notchia.app@gmail.com
+33 ... (préciser)
```

### b) iGeneration

**Email** : contact@igen.fr (ou rédacteur ciblé via leur page contact)
Adapter le mail ci-dessus, mentionner l'usage Claude Code en angle principal (leur lectorat dev est plus engagé).

### c) Mac4Ever

**Email** : contact@mac4ever.com
Adapter le mail ci-dessus, mentionner l'angle privacy / on-device en angle principal.

### Règles communes
- **Pas de PR aggregator** (ne pas envoyer le même mail à 10 blogs en simultané, ils se reconnaissent)
- **Personnaliser au moins le premier paragraphe** pour chaque blog (mention d'un article récent qu'ils ont publié sur un sujet adjacent)
- **Joindre** : un screenshot hero + le DMG signé si tu veux qu'ils testent (sinon laisse le lien GitHub)
- **Suivi** : 1 relance après 10 jours si pas de réponse. Pas plus.

---

## 5 — Hacker News Show HN

**À garder pour quand tu auras** : une release avec un angle technique fort. La 2.8.0 (Digest avec Apple Intelligence on-device) est un bon candidat — pas trop tard.

**Lien** : https://news.ycombinator.com/submit
**Quand** : mardi, jeudi, 9h00 ET (15h00 CET). Surtout pas un weekend.

### Title
```
Show HN: NotchIA – Turn your MacBook notch into an interactive cockpit (with on-device AI)
```

### URL
```
https://notchia.app/
```

### Text (optional comment to add immediately after submitting)
```
Hi HN. I built NotchIA because the MacBook notch sits there empty while my Claude Code session works in the background.

It does live AI status detection (Claude Code, Codex, Copilot — read locally from ~/.claude/projects/), media playback with synced lyrics, calendar, Pomodoro Focus, system HUD replacement, and the bit I'm proudest of: Digest, which uses Apple's on-device Foundation Models (Apple Intelligence, macOS 26) to summarize my RSS feeds based on what I tell it I care about. Nothing leaves the Mac.

It's a native macOS app — 15 modules total. Free Essential tier, €24.99 lifetime Pro.

Tech stack: SwiftUI, AppKit for the notch overlay, XPC helper for HUD interception, lrclib for synced lyrics, Sparkle with EdDSA for auto-update. The AI detection parses Claude Code's local JSONL session logs and matches them to 10 state patterns.

Happy to answer questions on the notch overlay implementation, on-device Apple Intelligence integration, or anything else.
```

### Règles
- **Réponds dans les 30 min** aux premiers commentaires, sinon le post tombe
- **Argumente sur la technique** plus que sur les features (HN aime le détail d'implémentation)
- **N'amplifie pas** avec des comptes burner — HN détecte et shadow-ban

---

## Ordre d'exécution recommandé (sur 4 semaines)

| Semaine | Canal | Effort | Impact attendu |
|---|---|---|---|
| S1 | PR awesome-mac | 30 min | Backlink GitHub indexé par les LLM |
| S1 | Reddit r/MacApps | 1h (préparation) | +200-1500 vues, 5-30 downloads |
| S2 | Mail blogs Mac FR (3) | 1h (rédaction + envoi) | 1-2 articles si l'angle plaît |
| S3 | Product Hunt launch | 4-6h (préparation + day) | Pic visibilité 24-48h, 50-300 downloads |
| S4 | Show HN (avec la 2.8.0) | 1h | 500-3000 vues si front page |

Ne fais **pas tout en une semaine** — la qualité de la conversation sur chaque canal dépasse largement le volume brut. Espace.

---

## Métriques à suivre

- **Backlinks** : tools comme Ahrefs (~ 99 $/mo), ou gratuitement via `site:` Google
- **Mentions LLM** : poser régulièrement la question cible à ChatGPT, Claude, Perplexity et voir si tu apparais
- **Trafic GA / Cloudflare** : référents Reddit, Product Hunt, awesome-mac, blogs
- **Downloads** : releases GitHub + analytics Cloudflare des `*.dmg`

Cible 3 mois : 10+ backlinks tiers (pas juste sociaux), mention occasionnelle dans ChatGPT sur "best notch app Mac" → top 3 sur cette requête.
