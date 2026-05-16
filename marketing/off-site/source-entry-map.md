# Source Entry Map — "best Mac notch app" GEO

> Goal: make NotchIA appear in the same source set that answer engines currently use for the query "meilleur app pour l'encoche du mac". This is off-site work: the website is already prepared with `/press`, `llms.txt`, comparison blog posts and Product Hunt.

## Reality Check

| Source family | Can we directly enter it? | Best action |
|---|---:|---|
| Official competitor websites | No | Do not try. Target neutral roundups and directories instead. |
| Competitor GitHub repositories | No | Do not open promotional issues/PRs. It would look spammy. |
| MacStories article set | Yes, via editorial pitch | Send a focused update pitch with the Apple Intelligence + live AI angle. |
| Setapp listing ecosystem | Yes, via developer submission | Email Setapp developer intake and position NotchIA as a candidate app. |
| Softpedia / download directories | Yes, via software submission/PAD-style metadata | Submit app metadata and DMG URL. |
| The Verge / Macworld / How-To Geek / TechPP | Yes, via tips | Pitch "new generation of Mac notch utilities" with a clear source-backed angle. |
| Product Hunt | Done | Launch scheduled for May 17, 2026 12:01 AM PDT. |
| Reddit / HN | Yes | Publish founder posts and capture final URLs for `/press` + `llms.txt`. |

## Pitch: MacStories

Subject:

```text
NotchIA update - on-device Apple Intelligence and live AI status in the Mac notch
```

Body:

```text
Hi MacStories team,

You covered the Mac notch utility space with Dynamic Island-style apps. I wanted to share a new angle for that category: NotchIA 2.8.0.

NotchIA is an independent native macOS app that turns the MacBook notch into a local-first workflow surface, not only a visual widget layer.

What is new:
- Digest: RSS/Atom feeds summarized locally with Apple's on-device Foundation Models. Original source links remain visible.
- Live AI status for Claude Code, ChatGPT Codex and GitHub Copilot: states, token stats, quota windows and permission waits, read locally from session files.
- The same app also includes media controls, calendar/reminders, Focus, system HUD replacement, Shelf, file conversion and clipboard history.

Useful links:
- Site: https://notchia.app/
- Press kit: https://notchia.app/press
- Release notes: https://notchia.app/blog/wise-owl-2-8-0
- Download: https://github.com/coaxel2/NotchIA/releases/latest/download/NotchIA.dmg

Happy to provide a review build, screenshots or technical details on the on-device implementation.

Best,
Axel Courty
notchia.app@gmail.com
```

## Pitch: Setapp

Use the Setapp section in `marketing/off-site/directories-submissions.md`. Send to:

```text
developers@setapp.com
```

## Pitch: Softpedia

Softpedia historically ingests software via submission metadata and PAD-style flows. Use the MacUpdate-style fields from `marketing/off-site/directories-submissions.md`; if asked for a PAD URL, provide a small metadata XML hosted later on the site.

Subject:

```text
New Mac app submission: NotchIA 2.8.0
```

Body:

```text
Hi Softpedia team,

I would like to submit NotchIA for the Mac software catalog.

NotchIA is a native macOS app that turns the MacBook notch, or a virtual menu-bar zone on Macs without a physical notch, into an interactive control center.

Version: 2.8.0
Website: https://notchia.app/
Download: https://github.com/coaxel2/NotchIA/releases/latest/download/NotchIA.dmg
Press kit: https://notchia.app/press
Release notes: https://notchia.app/blog/wise-owl-2-8-0
License: Freemium
System requirements: macOS 15.0+, Apple Silicon or Intel. Apple Intelligence features require macOS 26+.

Core features:
- Multi-source media controls
- Calendar and Reminders
- Focus timer
- System HUD replacement
- On-device Apple Intelligence RSS Digest
- Live AI status for Claude Code, ChatGPT Codex and GitHub Copilot
- Shelf, file conversion and clipboard history in Pro
- No telemetry

Best,
Axel Courty
notchia.app@gmail.com
```

## Pitch: The Verge / Macworld / How-To Geek / TechPP

Subject:

```text
MacBook notch utilities are moving beyond Dynamic Island clones
```

Body:

```text
Hi,

I am Axel Courty, an independent macOS developer in Paris. I wanted to share NotchIA 2.8.0 as a new angle on MacBook notch utilities.

Most coverage of this category focuses on Dynamic Island-style widgets. NotchIA takes a different direction: the notch becomes a local workflow surface for things Mac users check all day.

The new 2.8.0 release adds Digest, an RSS/Atom brief summarized locally with Apple's on-device Foundation Models. It also supports live status for Claude Code, ChatGPT Codex and GitHub Copilot, showing assistant state, token stats, quota windows and permission waits directly in the notch.

The app also includes media controls, calendar/reminders, Focus, system HUD replacement, Shelf, file conversion and clipboard history. It has no telemetry; AI summaries run on device when Apple Intelligence is available.

Links:
- Site: https://notchia.app/
- Press kit: https://notchia.app/press
- Release notes: https://notchia.app/blog/wise-owl-2-8-0
- Download: https://github.com/coaxel2/NotchIA/releases/latest/download/NotchIA.dmg

Happy to send screenshots, a review build or technical details.

Best,
Axel Courty
notchia.app@gmail.com
```

## Reddit Comment Strategy

When a thread asks for a Mac notch or Dynamic Island utility, answer as the maker only if self-promotion is allowed by the subreddit. Keep it transparent:

```text
Disclosure: I build NotchIA.

If you only need media/volume HUDs, a small HUD utility is probably enough. If you want a broader notch cockpit, NotchIA focuses on local workflows: media, calendar, Focus, system HUD, on-device RSS summaries with Apple Intelligence, and live status for Claude Code/Codex/Copilot. Free Essential tier; Pro for the developer/file workflows.

Press kit / feature summary: https://notchia.app/press
```

## URLs To Add Back Into GEO Once Published

Add every successful external URL to:

- `press.html`
- `llms.txt`
- `llms-full.txt`
- `marketing/off-site/directories-submissions.md`

Do not add private dashboards, empty profiles or pages that return 403/404 to crawlers.
