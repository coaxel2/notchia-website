# NotchIA — Setapp profile copy

## Tagline (78 chars)
Turn your MacBook notch into a live AI, media and focus cockpit.

## Short description (198 chars, for roundups)
NotchIA turns the MacBook notch (or menu bar) into a native cockpit: media, calendar, focus, clipboard, file shelf, on-device AI digest, and live status for Claude Code, Codex and Copilot.

---

## Long description

### What it does
NotchIA wraps the unused space around the MacBook notch into a single, glanceable cockpit. On Macs without a notch, it spawns a virtual notch in the menu bar with the same modules. Everything stays on-device, runs in the background as a menu-bar app (LSUIElement, no Dock icon), and stays out of your way until you hover, swipe down with two fingers, or trigger a global shortcut.

### Key features
- **Media everywhere** — Apple Music, Spotify, YouTube Music and any Now Playing-compatible app, with album-art animation, synced lyrics (lrclib, 26 languages), audio visualiser and 7 favourite slots.
- **Calendar + Reminders** — daily scroller, full-month grid, one-click event creation, auto-scroll to next event.
- **Focus sessions** — Pomodoro-style timer with daily stats, finish sounds and periodic sneak peek.
- **Clipboard history** — search, per-app grouping, pinning, up to 500 entries in Pro.
- **Shelf** — drag-and-drop staging area for files, text and links between apps without polluting the Desktop.
- **File converter** — 16 image / PDF / video formats in Pro.
- **Digest (on-device AI)** — paste your RSS feeds, describe your interests in plain language, and Apple Intelligence (Foundation Models, macOS 26+) generates a 30-second daily brief 100% locally.
- **Live AI dev monitoring** (Pro) — auto-detects active Claude Code, ChatGPT Codex and GitHub Copilot sessions, surfaces 10 live states (compiling, terminal, web, planning, sub-agent...), token counters, 5h/7d quotas and permission-pending alerts — all parsed from local session logs, nothing sent off-device.
- **System HUD replacement** — replaces the default volume / brightness / keyboard backlight HUDs with an in-notch version.
- **Sneak Peek Engine** — rotating mini-widgets in the closed notch.

### Who it's for
- Mac developers running Claude Code, Codex or Copilot who want a live, glanceable status without alt-tabbing to the IDE.
- Power users who already curate Raycast / Rectangle / CleanShot stacks and want a single cockpit for media, focus and clipboard.
- French / English / Spanish / German users who want a fully localised notch utility (most competitors ship English-only).
- Privacy-minded users who refuse cloud AI processing for their RSS feeds.

### Tech
SwiftUI + AppKit overlay, signed XPC helper for HUD interception, Sparkle EdDSA-signed updates over HTTPS, sandboxed with minimal entitlements, native Apple Silicon + Intel binary (~30 MB).

### Privacy
Zero telemetry. No analytics SDK. No third-party AI calls — Digest runs on Apple Intelligence locally; live AI monitoring reads `~/.claude/projects/` locally. The only network traffic outside user-initiated RSS fetches is the signed Sparkle update check.

### Roadmap
Q2 2026: Pro tier opens (monthly + lifetime), additional Digest sources (Hacker News, Reddit JSON), per-source weights. Q3 2026: shortcut macros across modules, expanded Apple Intelligence summarisation in Shelf, Vision-side widget mirror.

---

## Setapp Highlights bullets

- Native cockpit around the MacBook notch (and menu bar on notch-less Macs)
- Live status for Claude Code, ChatGPT Codex and GitHub Copilot in your peripheral vision
- On-device Apple Intelligence RSS digest — no cloud AI, no tracking
- Multi-source media with synced lyrics and audio visualiser
- Built-in focus timer, clipboard history, file shelf and 16-format converter
- Localised FR / EN / ES / DE with native macOS feel
- Zero telemetry, sandboxed, Sparkle EdDSA-signed updates

---

## Use cases

- **You're a Claude Code user** who wants to see token burn, current state and 5h quota without leaving SwiftUI — NotchIA surfaces it under the notch.
- **You're a French RSS reader** who refuses to send your feed selection to a cloud AI — Digest summarises everything on-device with Apple Intelligence.
- **You're a remote worker juggling Spotify, calendar and Pomodoro** — three taps on the notch replaces three separate menu-bar apps.
- **You're a designer** moving files between Figma, Finder and Slack — Shelf holds them mid-flight without cluttering the Desktop.
- **You're a power user with a notch-less M1 Air** — the virtual notch in the menu bar gives you the same cockpit on an older Mac.
