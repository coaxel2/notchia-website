# Pitch — 9to5Mac (Filipe Espósito, then tips line)

> Target context: 9to5Mac's 2021 piece on TopNotch (Filipe Espósito) — he's the editor who's historically opened the site's Mac coverage to indie utilities. Format is daily-roundup-friendly: 200-400 word news briefs with one screenshot.
> Goal: a short news brief in the Mac section — "indie dev ships first notch app with live Claude Code monitoring." Filipe writes brief, problem-statement-first posts; this pitch matches that format.

---

## Contact — suggested send path

1. **Filipe Espósito** — likely `filipe@9to5mac.com` (standard 9to5Mac firstname pattern), to confirm via his X handle `@filipeesposito`. He covers Mac and indie apps regularly.
2. **General tips** — `tips@9to5mac.com` (confirmed on /contact). Use with subject prefix "Attn: Filipe Espósito — Mac app tip".
3. **Chance Miller** (EIC) — `chance@9to5mac.com` — only if neither of the above gets traction after 7 days, and only for a clearly time-sensitive hook.

Format note: 9to5Mac is breaking-news / daily-roundup tempo. They write in tight problem→solution paragraphs. Keep the pitch under 200 words. Lead with the news, not the product story.

---

## EN — Primary version (email)

**Subject** (58 chars):

```text
New Mac app: first notch utility with live Claude Code view
```

**Body** (~195 words):

```text
Hi Filipe,

Quick tip for the Mac section.

A new indie macOS app shipped this spring — NotchIA — and it's the first notch utility I've seen that does two things no one else has put together:

1. Live status of AI coding assistants in the MacBook notch. It auto-detects active Claude Code, ChatGPT Codex and GitHub Copilot sessions and shows 10 real-time states (Compiling, Reading, Editing, waiting for permission), token counts, and the 5h / 7d quota windows. All read locally from session files, no cloud.

2. On-device Apple Intelligence. An RSS Digest and a Shelf PDF summarizer run 100% local via Foundation Models (macOS 26+; degrades on 15).

Notable for indie coverage:
- Built solo by one developer in Paris.
- Lifetime Pro at 39.99 EUR (not a subscription).
- Free Essential tier (media, calendar, Focus, Digest, HUD).
- macOS 15+, Apple Silicon and Intel, ~30 MB.
- No telemetry, signed with Sparkle/EdDSA auto-updates.

Site: https://notchia.app/
Release notes: https://notchia.app/blog/wise-owl-2-8-0
Press kit / screenshots: https://notchia.app/press
Direct DMG: https://github.com/coaxel2/NotchIA/releases/latest/download/NotchIA.dmg

Happy to send a build, screenshots, or a 60-sec screen recording today if it fits a roundup or short post.

Thanks,
Axel Courty
notchia.app@gmail.com
```

---

## EN — Tip-line alternate (shorter, if going via tips@9to5mac.com)

**Subject** (60 chars):

```text
Mac tip: indie notch app with live Claude Code/Codex status
```

**Body** (~130 words):

```text
Hi 9to5Mac team,

Quick app tip — feel free to forward to Filipe Espósito if he's the right person.

NotchIA is a new indie macOS app that puts live status of Claude Code, ChatGPT Codex and GitHub Copilot sessions directly in the MacBook notch — 10 real-time states, token counts, 5h/7d quota windows, all read locally. It also runs an on-device Apple Intelligence RSS Digest (Foundation Models, macOS 26+).

- Solo developer (Paris)
- macOS 15+, Apple Silicon + Intel
- Free Essential, lifetime Pro 39.99 EUR
- Shipped publicly this spring, version 2.8.0
- No telemetry, no cloud, signed auto-updates

Site: https://notchia.app/
Press kit: https://notchia.app/press

Build, screenshots and a 60-sec demo recording available on request.

Thanks,
Axel Courty
notchia.app@gmail.com
```

---

## Suivi

- One short follow-up at D+5 max if no reply. 9to5Mac inbox volume is high; no third email.
- If picked up → 9to5Mac has strong LLM retrieval weight for "best Mac apps" queries → log URL in `press.html`, `llms.txt`, `llms-full.txt`, `source-entry-map.md`.
- Preferred screenshot for them: notch open showing live Claude Code session with state + token count — that's the visual that earns the post.
