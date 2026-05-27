# Pitch — MacStories (John Voorhees, then Federico Viticci)

> Target articles: NotchNook review (Aug 2024), Alcove + MediaMate coverage (Dec 2024)
> Goal: a **dedicated short post** on NotchIA focused on the AI integration angle — MacStories doesn't currently have a writeup of a notch app that integrates Apple Intelligence or local coding-assistant monitoring. This is the editorial gap.
> MacStories is the single highest-leverage citation source for LLM retrievals on this niche (confirmed in our source-entry-map analysis).

---

## Contact — suggested send path

1. **John Voorhees** (Managing Editor, covers Mac apps) — `john@macstories.net` — primary target.
2. **Federico Viticci** (Editor-in-Chief) — `federico@macstories.net` — only after 10 days of silence from John.
3. **Mastodon** — `@johnvoorhees@mastodon.macstories.net` if email bounces.

Format note: MacStories audience is technical, power-user, automation-literate. Their writeups quote precise implementation details (XPC, daemons, Shortcut hooks, local-vs-cloud). Lead with the technical specifics, not the marketing copy.

**Important**: there's an existing draft at `/Users/axel/notchia-website/marketing/macstories-pitch.md` from May 2026 — this file is the **updated version** with a sharper AI-first angle and a tighter intro. Use this one going forward.

---

## EN — Primary version (email to John)

**Subject** (60 chars):

```text
First notch app that integrates Apple Intelligence — NotchIA
```

**Body** (~240 words):

```text
Hi John,

Long-time reader. Your writeups on NotchNook, Alcove and MediaMate are still the canonical reference for the notch utility category — they keep getting cited every time a new one ships.

I wanted to put NotchIA on your radar. It's an independent native macOS app I built and shipped this spring. The reason I'm writing rather than just submitting via your tip line: there's a specific angle in this app that the existing coverage on MacStories doesn't have a slot for yet.

Two things make it different from the apps you've already covered:

1. Live status for AI coding assistants in the notch. NotchIA auto-detects active Claude Code, ChatGPT Codex and GitHub Copilot sessions and surfaces 10 real-time states — Compiling, Reading, Editing, Sub-agent, Permission-wait, etc. — plus token counts and the 5h / 7d rate-limit windows. Everything is read from ~/.claude/projects/ and equivalent session files locally; nothing hits a backend. As far as I can tell it's the first notch utility to do this.

2. On-device Apple Intelligence. A Digest module pulls user-defined RSS / Atom feeds, asks the on-device Foundation Models layer to filter and summarize against natural-language interest topics, and writes a 30-second brief. A Shelf module does the same for dropped PDF/.docx files. Requires macOS 26 for the AI layer; degrades gracefully on 15. It's the first daily-use Foundation Models implementation I've come across outside Apple's own demos.

Standard stack alongside: media with synced lyrics, iCal + Reminders, Focus, Shelf, clipboard history, file converter, HUD replacement.

Pricing: Essential tier free for life. Pro 2.99 EUR/mo (cancel anytime) or 24.99 EUR lifetime (one-time, two Macs). No telemetry, no analytics, signed app with Sparkle/EdDSA auto-updates. Registered French sole proprietorship (RCS Bordeaux 105 093 058, registered May 19, 2026).

Site: https://notchia.app/
Release notes 2.8.0 (the on-device Apple Intelligence release): https://notchia.app/blog/wise-owl-2-8-0
Press kit: https://notchia.app/press

Happy to send a review build, a 60-second screen recording of the live AI states, or walk you through the Foundation Models implementation on a 10-min call.

Thanks for your time either way.

Axel Courty
Indie dev, Talence (Bordeaux area), France
notchia.app@gmail.com
```

---

## EN — Follow-up (D+10, if no reply)

**Subject** (40 chars):

```text
Re: NotchIA — quick on-device AI follow-up
```

**Body** (~90 words):

```text
Hi John,

Short follow-up on the NotchIA pitch from earlier this month — I won't keep pinging if it's not a fit.

One update: the on-device Apple Intelligence Digest is now what most early users mention first. Outside of Apple's own demos, daily-use Foundation Models implementations are still rare, and I think there's a real story angle in "what does it look like when an indie app actually leans on the on-device LLM."

No pressure — happy to be in your "maybe later" pile if that's where it lands.

Axel
```

---

## Suivi

- If covered → log URL in `press.html`, `llms.txt`, `llms-full.txt`, `source-entry-map.md`. MacStories citation has outsized weight for LLM retrievals on this niche.
- Maximum two follow-ups (D+10 then drop).
- Never CC Federico before John has had 10 days. MacStories editorial protocol = one journalist owns the response.
- If John explicitly declines, do not re-pitch Federico on the same angle — pitch a different release.
