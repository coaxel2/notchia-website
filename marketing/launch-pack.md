# NotchIA — Pack de lancement externe

> Drafts prêts à envoyer pour les 5 canaux de visibilité externe les plus rentables. Adapter le ton si besoin, mais le squelette est calibré pour le format de chaque plateforme.

## Sommaire

1. [Product Hunt](#1--product-hunt) — un mardi/mercredi à 6h00 PT
2. [Reddit r/MacApps + r/macbookpro](#2--reddit) — format AMA honnête, après 18h CET
3. [Pull Requests GitHub awesome-mac](#3--github-awesome-mac) — 3 listes à viser
4. [Mail aux blogs Mac FR](#4--mail-blogs-mac-fr) — MacGeneration, iGeneration, Mac4Ever
5. [Hacker News Show HN](#5--hacker-news-show-hn) — quand la prochaine release a un angle technique fort

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
NotchIA turns the dead notch of your MacBook (or the menu bar on notch-less Macs) into an interactive control center.

What you get in the free tier:
• Multi-source music with synced lyrics (Apple Music, Spotify, YouTube Music)
• Calendar + Reminders with iCal events
• Full Pomodoro Focus with daily stats
• Digest (new in 2.8.0) — RSS feeds summarized by on-device Apple Intelligence
• System HUD replacement (volume, brightness, keyboard)
• Sneak Peek Engine, focus detection, recording detection

Pro adds:
• Live AI status — Claude Code, ChatGPT Codex, and GitHub Copilot in the notch with 10 states, token stats, 5h/7d quotas, permission notifications
• Shelf drag-and-drop with on-device Apple Intelligence summary for PDF/.docx
• File converter (16 formats)
• Unlimited clipboard history

100% local. No telemetry, nothing sent to OpenAI/Anthropic/our servers (except license validation). Built on top of the open-source Boring Notch.

Free Essential tier forever. Pro at €3.99/mo or €39.99 one-time for 2 Macs (lifetime, all major updates included).

macOS 15+ (Sequoia). Apple Silicon + Intel. Available in French, English, Spanish, German.
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

Free Essential tier is full Focus + Digest + media + calendar + HUD. Pro is €39.99 once for the live-AI integration and file management.

AMA on architecture, on-device AI implementation, why no Mac App Store, anything.
```

### Hunter (qui poste)
Idéalement quelqu'un avec déjà des followers PH. Sinon, poste toi-même.

---

## 2 — Reddit

### r/MacApps — titre

```
[Showcase] NotchIA — I extended Boring Notch with live AI status, on-device Apple Intelligence summaries, and a 16-format converter
```

### r/MacApps — corps

```
Hi all, indie dev here. I built NotchIA on top of the open-source Boring Notch project — added the things I personally wanted in the notch:

**What's new vs Boring Notch:**

- **Live AI status** in the notch: detects Claude Code, ChatGPT Codex, and GitHub Copilot sessions, shows 10 states (Compiling, Terminal, Searching, Reading, Editing, Writing, Web, Sub-agent, Planning, Running), token stats per session, 5h/7d quota bars, and notifications when an assistant is waiting for permission. Reads `~/.claude/projects/` locally, no cloud calls.

- **Digest** (new in 2.8.0, free): paste your RSS feeds, describe what interests you in plain language, and on-device Apple Intelligence (Foundation Models) summarizes the feed for you. 14-day cache. Requires macOS 26 for Apple Intelligence; falls back to a raw RSS viewer on macOS 15.

- **Shelf with on-device summary**: drop a PDF/.docx/.txt/.md on the notch, get a scrollable summary via the same on-device models.

- **16-format file converter** in the Shelf.

- **i18n**: French, English, Spanish, German (Boring Notch is English only).

- **Music**: adds YouTube Music + synced lyrics via lrclib (26 languages).

**Privacy stance**: no telemetry, no third-party AI calls. The only outbound connections are Sparkle auto-update (EdDSA signed), license validation (email + key), and the RSS feeds you configured yourself.

**Pricing**: Essential tier free forever (Focus, Digest, media, calendar, HUD). Pro at €3.99/mo or €39.99 lifetime one-time for 2 Macs.

macOS 15+ (Sequoia), Apple Silicon + Intel. Download: https://notchia.app/

Boring Notch is still excellent if you want strict open-source MIT and only basic music/calendar — both projects can coexist.

Happy to answer questions on the AI detection logic, on-device Apple Intelligence integration, or the open-core decision.
```

### r/macbookpro — adapter

Même corps mais titre plus orienté hardware :
```
[App] Built a notch app that monitors my Claude Code sessions and summarizes my RSS feeds on-device — NotchIA
```

### Règles à respecter
- **JAMAIS** poster en moins de 24h sur les deux subs (les mods regardent les cross-post)
- Répondre dans les 2h aux commentaires (les mods downvote les "post and ghost")
- Reconnaître Boring Notch en premier dans tout commentaire qui le mentionne — c'est ce qui te rendra légitime auprès des fans Boring Notch
- Ne pas répondre aux trolls. Bloquer si nécessaire.

---

## 3 — GitHub awesome-mac

Trois listes prioritaires (en PR séparées, ne pas tout faire en une) :

### a) jaywcjlove/awesome-mac
Repo : https://github.com/jaywcjlove/awesome-mac
Catégorie cible : **Productivity** ou **Menu Bar Tools**
PR title : `Add NotchIA — interactive notch + on-device AI for MacBook`
PR body : ligne markdown à insérer dans la section appropriée :
```markdown
- [NotchIA](https://notchia.app/) - Turns the MacBook notch into an interactive cockpit with multi-source music + synced lyrics, calendar, Pomodoro Focus, on-device Apple Intelligence Digest (RSS summaries), live AI status (Claude Code / Codex / Copilot) and system HUD replacement. Free Essential tier, Pro €39.99 lifetime. Based on the open-source Boring Notch. macOS 15+. ![Freemium]
```

### b) serhii-londar/open-source-mac-os-apps
Repo : https://github.com/serhii-londar/open-source-mac-os-apps
Catégorie : **Menubar** ou **Productivity**
Note : NotchIA est open-core (base open-source, Pro propriétaire). Vérifie d'abord que la liste accepte ce modèle — sinon, soumets plutôt Boring Notch.

### c) iCHAIT/awesome-macOS
Repo : https://github.com/iCHAIT/awesome-macOS
Catégorie : **Productivity**

### Format à respecter strictement
- Une ligne par app
- Description courte mais informative
- Lien direct vers le site
- Pas de mots marketing genre "amazing", "best", "revolutionary"

---

## 4 — Mail blogs Mac FR

3 cibles. Personnaliser le destinataire avant d'envoyer.

### a) MacGeneration

**Email** : redaction@macg.co
**Objet** : `NotchIA — app macOS qui détecte Claude Code dans l'encoche et résume tes RSS via Apple Intelligence on-device`

```
Bonjour,

Je suis Axel Courty, développeur indépendant à Paris. Je viens de sortir NotchIA, une app macOS qui exploite l'encoche du MacBook comme cockpit interactif, avec deux angles que vous n'avez pas couverts à ma connaissance :

1. Détection automatique des sessions Claude Code, ChatGPT Codex et GitHub Copilot en direct — affichage de 10 états en temps réel dans l'encoche, statistiques de jetons, quotas 5h/7j, notifications quand l'assistant attend une permission. Lecture 100 % locale des journaux ~/.claude/projects/, jamais d'envoi externe.

2. Digest — résumé des flux RSS via Apple Intelligence (Foundation Models on-device, macOS 26). L'utilisateur colle ses flux, décrit ses centres d'intérêt en langage naturel, l'app fetch + dédupe + résume. 100 % local — pas d'OpenAI/Anthropic dans le circuit. C'est la première fois que je vois un usage quotidien sérieux des Foundation Models.

L'app est basée sur le projet open-source Boring Notch, étendu avec ces intégrations. Tier Essentiel gratuit à vie, Pro à 3,99 €/mois ou 39,99 € à vie en achat unique.

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

It's based on the open-source Boring Notch and adds the AI layer + Apple Intelligence integration + i18n (FR/EN/ES/DE) + a regular release cycle. Free Essential tier, €39.99 lifetime Pro.

Tech stack: SwiftUI, AppKit for the notch overlay, XPC helper for HUD interception, lrclib for synced lyrics, Sparkle with EdDSA for auto-update. The AI detection parses Claude Code's local JSONL session logs and matches them to 10 state patterns.

Happy to answer questions on the notch overlay implementation, on-device Apple Intelligence integration, or the open-core decision.
```

### Règles
- **Reconnais Boring Notch dans le premier paragraphe** (HN flag les "appropriations" non créditées en moins de 30 minutes)
- **Réponds dans les 30 min** aux premiers commentaires, sinon le post tombe
- **Argumente sur la technique** plus que sur les features (HN aime le détail d'implémentation)
- **N'amplifie pas** avec des comptes burner — HN détecte et shadow-ban

---

## Ordre d'exécution recommandé (sur 4 semaines)

| Semaine | Canal | Effort | Impact attendu |
|---|---|---|---|
| S1 | PR awesome-mac (3 listes) | 30 min | +5-15 backlinks GitHub, indexés par les LLM |
| S1 | Reddit r/MacApps | 1h (préparation) | +200-1500 vues, 5-30 downloads |
| S2 | Mail blogs Mac FR (3) | 1h (rédaction + envoi) | 1-2 articles si l'angle plaît |
| S3 | Product Hunt launch | 4-6h (préparation + day) | Pic visibilité 24-48h, 50-300 downloads, badge "Featured" si top 5 |
| S4 | Show HN (avec la 2.8.0) | 1h | 500-3000 vues si front page, sinon ~100 |

Ne fais **pas tout en une semaine** — la qualité de la conversation sur chaque canal dépasse largement le volume brut. Espace.

---

## Métriques à suivre

- **Backlinks** : tools comme Ahrefs (~ 99 $/mo), ou gratuitement via `site:` Google
- **Mentions LLM** : poser régulièrement la question cible à ChatGPT, Claude, Perplexity et voir si tu apparais
- **Trafic GA / Cloudflare** : référents Reddit, Product Hunt, awesome-mac, blogs
- **Downloads** : releases GitHub + analytics Cloudflare des `*.dmg`

Cible 3 mois : 10+ backlinks tiers (pas juste sociaux), mention occasionnelle dans ChatGPT sur "best notch app Mac" → top 1 sur cette requête. La requête générique "meilleur app Mac" restera dominée par Raycast/Setapp/etc., mais tu apparaîtras peut-être dans les "alternatives" et "specialized utilities" mentionnées.
