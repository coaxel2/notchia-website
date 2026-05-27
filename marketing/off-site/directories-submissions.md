# Directory Submissions — NotchIA

> Status: ready-to-paste copy organised per platform. Submit manually from Axel's personal/dev accounts (no agent automation — most directories detect bot submissions). Updated 2026-05-27.
>
> Core source-of-truth wording lives in `press.html`, `marketing/off-site/setapp-submission/02-app-description.md` and `llms.txt`. Anything here is derived from those.

## Cheat sheet

| # | Platform | Auth | Submission URL | Priority |
|---|---|---|---|---|
| 1 | AlternativeTo | account | https://alternativeto.net/software/new/ | P1 |
| 2 | Crunchbase | account | https://www.crunchbase.com/add-new | P2 |
| 3 | Product Hunt | maker account | https://www.producthunt.com/posts/new | P1 |
| 4 | MacUpdate | account | https://www.macupdate.com/content/submit | P1 |
| 5 | MacRumors Forums | forum account | https://forums.macrumors.com/forums/mac-apps-and-mac-app-store.10/ | P2 |
| 6 | Setapp | email | `marketing/off-site/setapp-submission/` | P3 |
| 7 | Awesome Mac (GitHub) | GitHub | PR on `agarrharr/awesome-mac-apps` or `jaywcjlove/awesome-mac` | P2 |
| 8 | Indie Hackers | account | https://www.indiehackers.com/products/new | P3 |
| 9 | Mac App Lab | account | https://macapplab.com/submit | P3 |
| 10 | StackShare | account | https://stackshare.io/create-tools/new | P4 |
| 11 | BetaList | account | https://betalist.com/submit | (skip — out of beta) |

**Recommended order (domino effect):**

1. **AlternativeTo** first → indexed by Google fast, creates outbound citations on competitor pages (NotchNook, MediaMate, TopNotch).
2. **MacUpdate** second → high DR, evergreen download page, gets scraped by mac-software aggregators within 48 h.
3. **Product Hunt** third (Tuesday launch) → drives spike + GEO citations + journalist signal.
4. Then **Crunchbase, MacRumors, Awesome Mac PR, Indie Hackers** during launch week.
5. **Setapp / StackShare / Mac App Lab** when there is launch traction to show.

**Priority for this week (3):** AlternativeTo, MacUpdate, Product Hunt (Tuesday slot).

---

## 1. AlternativeTo

**Submission flow:** log in, https://alternativeto.net/software/new/ → fill form → after approval, visit each competitor page and click "Add alternative" → NotchIA.

### Fields

**App name**

```text
NotchIA
```

**Tagline (≤ 80 chars, 74 used)**

```text
AI productivity cockpit in the MacBook notch with live coding-agent status
```

**Short description (~270 chars)**

```text
NotchIA is a native macOS app that turns the MacBook notch (or a virtual menu-bar zone) into a productivity cockpit: media, calendar, focus, on-device Apple Intelligence RSS digest, clipboard, file shelf, file converter, and live status for Claude Code, ChatGPT Codex and GitHub Copilot.
```

**Long description (~480 chars)**

```text
NotchIA is an independent native macOS utility built by Axel Courty in Talence, France. It transforms the MacBook notch — or a virtual menu-bar zone on Macs without a physical notch — into a 14-module cockpit: multi-source media with synced lyrics, calendar and reminders, focus sessions, system HUD replacement, on-device Apple Intelligence RSS Digest, PDF Summarizer, Shelf file workflows, 16-format converter, clipboard history, sneak peek widgets, and live status for Claude Code, ChatGPT Codex and GitHub Copilot. Local-first: zero telemetry, no cloud AI, signed Sparkle/EdDSA updates. FR/EN/ES/DE. macOS 15+, Apple Silicon & Intel. ~30 MB.
```

**Pricing model**

```text
Freemium
```

**Pricing detail**

```text
Free Essential tier. Pro: EUR 2.99/month or EUR 24.99 lifetime (one-time, 2 Macs).
```

**Platforms**

```text
Mac
```

**License**

```text
Proprietary
```

**Official website**

```text
https://notchia.app/
```

**Tags (12 — paste in tag field)**

```text
macos
notch
menu-bar
productivity
artificial-intelligence
apple-intelligence
developer-tools
rss-reader
clipboard-manager
file-converter
media-control
privacy
```

**Features list (14 — to tick/declare)**

```text
- Multi-source media controls (Apple Music, Spotify, YouTube Music, any Now Playing app)
- Synced lyrics in 26 languages (lrclib)
- Calendar + Reminders (day + month views, one-click event creation)
- Focus sessions with daily stats and sneak peek
- Clipboard history with per-app grouping, pinning, search (up to 500 entries Pro)
- Shelf drag-and-drop staging area for files, text and links
- 16-format file converter (images, PDF, video)
- On-device Apple Intelligence RSS Digest (Foundation Models, macOS 26+)
- On-device PDF / DOCX / TXT / Markdown summarizer
- Live status for Claude Code, ChatGPT Codex, GitHub Copilot (10 states)
- Token counters + 5h/7d quota windows for coding agents
- System HUD replacement (volume, brightness, keyboard backlight)
- Sneak Peek Engine (rotating mini-widgets in the closed notch)
- Virtual notch in the menu bar on Macs without a physical notch
```

**Features tags to tick if present in AT UI**

```text
No Tracking
Works Offline
AI-Powered
Clipboard Manager
File Management
Calendar Integration
Media Controls
Dark Mode
Menu Bar
RSS
```

### Alternatives to (with differentiator, 1 line each)

Visit each page after the listing is approved and click "Add alternative" → NotchIA, then paste the rationale.

```text
NotchNook        → NotchIA adds live AI coding-agent status (Claude Code/Codex/Copilot) and on-device Apple Intelligence RSS digest; NotchNook focuses on widgets and notes.
MediaMate        → NotchIA goes beyond media: focus, calendar, clipboard, file shelf, file converter and AI dev monitoring; MediaMate is media-only.
Boring.Notch     → NotchIA is an independent rebuild with 14 modules and Pro AI dev tracking; Boring.Notch is an open-source minimal media notch.
Alcove           → NotchIA includes coding-agent status, on-device AI digest and a 16-format converter; Alcove is media + calendar.
TopNotch         → NotchIA uses the notch instead of hiding it; TopNotch only hides it.
Raycast          → NotchIA is a notch/menu-bar cockpit, not a launcher; complements Raycast for media, focus, AI dev status.
Maccy            → NotchIA includes full clipboard history (Pro) plus 13 other modules; Maccy is clipboard-only.
Bartender        → NotchIA reorganises content into the notch instead of hiding menu-bar icons; complementary.
```

**Submitted by**

```text
Axel Courty
```

### Assets

- Video URL: `https://notchia.app/press` (placeholder until demo recorded; full 60 s demo TODO).
- Screenshots (4–6, hosted at `https://notchia.app/press/screenshots/`):
  1. `notch-open-media.png` — Notch open on media module, Spotify track + lyrics + visualiser.
  2. `notch-ai-status.png` — Notch showing live Claude Code state + token counter.
  3. `digest-on-device.png` — Digest module with RSS feeds summarised by Apple Intelligence.
  4. `calendar-day-month.png` — Calendar view, day + month side-by-side.
  5. `shelf-clipboard.png` — Shelf + clipboard history.
  6. `hud-replacement.png` — Custom volume/brightness HUD in the notch.

### Assets to create

- [ ] 60-second demo video (host: YouTube unlisted + mirror on notchia.app).
- [ ] 6 PNG screenshots at 2880×1800 (Retina), exported with realistic content (no Lorem).

### Blockers

- None. Submit immediately.

---

## 2. Crunchbase

**Submission flow:** log in, https://www.crunchbase.com/add-new → "Add an organization" → choose "Company". Note Crunchbase reviews each entry manually (3–7 days).

### Fields

**Organization Name**

```text
NotchIA
```

**Also known as**

```text
NotchIA — by Axel Courty
```

**Description / About (~100 words, paste in "About" field)**

```text
NotchIA is a native macOS productivity application that transforms the MacBook notch — or a virtual menu-bar zone on notch-less Macs — into a 14-module cockpit. The app includes multi-source media controls, calendar, focus, clipboard, file shelf, on-device Apple Intelligence RSS digest and PDF summarization, plus live status for AI coding assistants Claude Code, ChatGPT Codex and GitHub Copilot. NotchIA is bootstrapped, ships under a French sole-proprietorship (RCS Bordeaux 105 093 058) and operates with zero telemetry. Distribution is direct via signed DMG with Sparkle/EdDSA auto-updates. Free Essential tier; Pro at EUR 2.99/month or EUR 24.99 lifetime.
```

**Short description (≤ 280 chars, 268 used)**

```text
NotchIA turns the MacBook notch into an AI productivity cockpit: multi-source media, calendar, focus, on-device Apple Intelligence summaries, clipboard, file shelf, and live status for Claude Code, ChatGPT Codex and GitHub Copilot. Native macOS, zero telemetry, indie French studio.
```

**Industries (pick from CB taxonomy)**

```text
Software
SaaS
Productivity Software
Artificial Intelligence
Developer Tools
Apps
macOS
```

**Headquarters Location**

```text
Talence, Nouvelle-Aquitaine, France
```

**Founded Date**

```text
2026-05-19
```

(Date of RCS Bordeaux registration; matches `press.html` Key Facts and `wikipedia-draft-fr.md`.)

**Operating Status**

```text
Active
```

**Funding Status**

```text
Bootstrapped
```

**Company Type**

```text
For Profit
```

(Add note in description: "Sole proprietorship / Entreprise individuelle, RCS Bordeaux 105 093 058".)

**Number of Employees**

```text
1-10
```

**Website**

```text
https://notchia.app
```

**Contact email**

```text
notchia.app@gmail.com
```

**Phone**

```text
(leave blank — no public business phone)
```

**Social profiles (add what is live)**

```text
X / Twitter:   https://twitter.com/notchia_app    (TODO — claim handle)
LinkedIn:      https://www.linkedin.com/company/notchia (TODO — create)
GitHub:        https://github.com/coaxel2/NotchIA
```

### Founders

**Founder #1**

```text
Name:         Axel Courty
Title:        Founder, Solo Developer
LinkedIn:     https://www.linkedin.com/in/axel-courty/  (verify — placeholder if not exact)
Twitter:      https://twitter.com/axelcourty           (TODO)
Bio (50 w):   Axel Courty is an independent macOS developer based in Talence, France.
              He founded NotchIA in May 2026 to build native, privacy-respecting Mac
              utilities that lean on on-device Apple Intelligence and integrate
              naturally with AI coding workflows (Claude Code, Codex, Copilot).
```

### Products / Tags

```text
Mac App
Productivity App
AI Productivity
Menu Bar App
Notch Utility
On-Device AI
```

### Assets

- Logo: `https://notchia.app/logo-512.png`
- Hero / OG: `https://notchia.app/og-image.png`

### Blockers

- LinkedIn company page not yet created → either skip the field or create the page before submitting (5-min task).
- No press coverage URLs yet → leave "News" section empty; Crunchbase will pull articles automatically once MacStories / 9to5mac / Indie Hackers covers ship.

---

## 3. Product Hunt

**Submission flow:** log in with a personal PH account (Axel's), click "Post" or visit https://www.producthunt.com/posts/new. Existing product page draft: `https://www.producthunt.com/products/notchia?launch=notchia`.

### Fields

**Product name**

```text
NotchIA
```

**Tagline (max 60 chars, 47 used)**

```text
AI productivity cockpit in your MacBook notch
```

(Alt 1, 60 chars): `Live AI coding-agent status in your MacBook notch`
(Alt 2, 58 chars): `Turn the MacBook notch into an AI productivity cockpit`

**Description (260 chars)**

```text
NotchIA wraps the MacBook notch into a native cockpit: multi-source media with synced lyrics, calendar, focus, clipboard, file shelf, file converter, on-device Apple Intelligence RSS digest, and live status for Claude Code, ChatGPT Codex and GitHub Copilot. Zero telemetry.
```

**Topics (5)**

```text
Productivity
Mac
Artificial Intelligence
Developer Tools
Menu Bar
```

(If "Open Source" is shown as a default topic — uncheck. NotchIA is proprietary.)

**Pricing**

```text
Freemium with paid Pro (EUR 2.99/mo or EUR 24.99 lifetime)
```

**Links**

```text
Website:    https://notchia.app/
Pricing:    https://notchia.app/#pricing
Press kit:  https://notchia.app/press
Changelog:  https://notchia.app/blog/wise-owl-2-8-0
Download:   https://github.com/coaxel2/NotchIA/releases/latest/download/NotchIA.dmg
```

### Best time to launch

**Recommendation:** Tuesday 12:01 AM PST.

- Tuesday is statistically the highest-volume Product Hunt day (Mon launches compete with the weekend backlog; Wed/Thu lose afternoon traction to mid-week meeting fatigue; Fri/Sat/Sun get low staff curation).
- 12:01 AM PST = early launch → full 24 h on the leaderboard, gives EU mornings 8–10 hours of votes before US wakes up. NotchIA's primary audiences (FR/EU developers + US Mac power users) benefit from both windows.
- Avoid first Tuesday after a major Apple event (WWDC week, iPhone keynote week) — Mac apps get drowned.
- **Suggested date:** Tuesday after the v2.8.0 release stabilises and 2 review pieces (MacStories, 9to5mac, or Indie Hackers) are live to feed launch-day credibility.

### Maker's first comment (~200 words)

```text
Hi Product Hunt 👋 I'm Axel, indie macOS dev based in Talence, near Bordeaux, France.

NotchIA started as a 30-minute hack. I was running Claude Code in one Terminal tab, watching a long agent run, and switching between Spotify, my calendar and the notch every two seconds. The notch was sitting there, completely useless. I thought: what if the notch could actually do something — and what if it told me what my AI coding agents are doing right now without me needing to alt-tab?

A year later, NotchIA is 14 modules in one native app (~30 MB, Apple Silicon + Intel). The headline ones for me:

• Live status for Claude Code, ChatGPT Codex and GitHub Copilot, read locally from session files. 10 states, token counters, 5h/7d quota windows. As far as I can tell, the first notch utility to surface this.
• On-device Apple Intelligence Digest — paste RSS feeds, describe your interests, get a 30-second local brief. Zero cloud AI.
• The usual cockpit: media + synced lyrics, calendar, focus, clipboard, file shelf, 16-format converter, HUD replacement.

Free Essential tier covers media, calendar, focus, HUD and Digest. Pro adds AI dev tracking, Shelf, file conversion and unlimited clipboard for EUR 2.99/mo or EUR 24.99 lifetime (2 Macs).

No telemetry, no analytics, no funny business. I run the whole thing solo. Happy to dig into the SwiftUI/AppKit overlay, the Foundation Models integration, the EdDSA Sparkle pipeline, or anything you want to know about ✌️
```

### Assets needed

- [ ] **Hero image** (gallery slot 1) — 1270×760 PNG, notch open with media + AI status visible. Use brand gradient backdrop.
- [ ] **Demo GIF** (gallery slot 2) — 60 seconds, ≤ 3 MB, looped, no audio. Show: notch closed → hover open → media → AI status flicker → Digest summary appearing → focus timer running. Tool: Gifski + ScreenStudio.
- [ ] **Screenshot 1** — Notch open on Live AI status (Claude Code 10-state UI, token counter, quota bar).
- [ ] **Screenshot 2** — Digest module with on-device summary + source links.
- [ ] **Screenshot 3** — Media module with synced lyrics + visualiser.
- [ ] **Screenshot 4** — Calendar day+month + Focus timer.
- [ ] **Screenshot 5** — Shelf + clipboard history.
- [ ] **Video pitch (optional)** — 60-90 sec, founder-on-camera or screen-only, narrated. Higher engagement on PH 2026 metrics than GIF alone, but ships only if recorded well.
- [ ] **Logo** — square 240×240 PNG, transparent background. Use `logo-512.png` resized.

### Activation playbook

See `marketing/off-site/ph-activation/` for the full day-of playbook (Hunter, supporters, comments, share assets).

### Blockers

- Video assets above are the only real blockers. Without the GIF or hero image, the page looks empty — postpone the launch until both are recorded.

---

## 4. MacUpdate

**Submission flow:** log in, https://www.macupdate.com/content/submit → "Submit a new app" → fill the form. Reviewer turnaround: 3–10 business days; editors may rewrite copy.

### Fields

**Product Name**

```text
NotchIA
```

**Developer Name**

```text
Axel Courty
```

**Developer URL**

```text
https://notchia.app
```

**Download URL**

```text
https://github.com/coaxel2/NotchIA/releases/latest/download/NotchIA.dmg
```

**Product page URL**

```text
https://notchia.app/
```

**Categories (3)**

```text
Primary:    Productivity
Secondary:  System Utilities
Tertiary:   Developer Tools
```

**Short summary (one line)**

```text
Native macOS notch cockpit with media, calendar, focus, on-device Apple Intelligence Digest and live status for Claude Code, ChatGPT Codex and GitHub Copilot.
```

**Long description (~500 words, paste as HTML)**

```html
<p><strong>NotchIA</strong> is a native macOS application that turns the MacBook notch — or a virtual menu-bar zone on Macs without a physical notch — into a glanceable productivity cockpit. Built by independent French developer Axel Courty (Talence), the app combines 14 modules into a single menu-bar utility (LSUIElement, no Dock icon) that stays out of your way until you need it.</p>

<h5>What it does</h5>
<p>NotchIA wraps the unused space around the notch into one cockpit. Hover, two-finger swipe down, or trigger a global shortcut to expand it. Every module runs natively in SwiftUI + AppKit; the entire binary is around 30 MB and supports both Apple Silicon and Intel Macs.</p>

<h5>Modules</h5>
<ul>
  <li><strong>Media everywhere</strong> — Apple Music, Spotify, YouTube Music and any Now Playing-compatible app, with album-art animation, synced lyrics in 26 languages (via lrclib), audio visualiser and 7 favourite slots.</li>
  <li><strong>Calendar + Reminders</strong> — daily scroller, full-month grid, one-click event creation, auto-scroll to the next event.</li>
  <li><strong>Focus sessions</strong> — Pomodoro-style timer with daily stats, finish sounds and periodic sneak peek.</li>
  <li><strong>Clipboard history</strong> — search, per-app grouping, pinning, up to 500 entries in Pro.</li>
  <li><strong>Shelf</strong> — drag-and-drop staging area for files, text and links between apps without polluting the Desktop.</li>
  <li><strong>File converter</strong> — 16 image / PDF / video formats (Pro).</li>
  <li><strong>Digest (on-device AI)</strong> — paste RSS / Atom feeds, describe interests in plain language, and Apple Intelligence Foundation Models (macOS 26+) generate a 30-second local brief. Original links stay visible next to every summary. Graceful fallback on macOS 15.</li>
  <li><strong>PDF Summarizer</strong> — on-device summarization for PDF, DOCX, TXT and Markdown files via the Shelf (Pro).</li>
  <li><strong>Live AI dev monitoring</strong> (Pro) — auto-detects active Claude Code, ChatGPT Codex and GitHub Copilot sessions. Surfaces 10 live states (Compiling, Reading, Editing, Sub-agent, Permission-wait, etc.), token counters, 5h/7d quotas — all parsed from local session logs.</li>
  <li><strong>System HUD replacement</strong> — replaces the default volume / brightness / keyboard backlight HUDs with an in-notch version.</li>
  <li><strong>Sneak Peek Engine</strong> — rotating mini-widgets in the closed notch.</li>
</ul>

<h5>Privacy</h5>
<p>Zero telemetry. No analytics SDK. No third-party AI calls — Digest runs on Apple Intelligence locally; live AI monitoring reads <code>~/.claude/projects/</code> and equivalent files locally. The only network traffic outside user-initiated RSS fetches is the signed Sparkle update check.</p>

<h5>Distribution</h5>
<p>Direct DMG (not Mac App Store) signed with Apple Developer ID and Sparkle EdDSA-signed auto-updates over HTTPS. Sandboxed where possible, minimal entitlements. Fully localised in English, French, Spanish and German.</p>

<h5>Pricing</h5>
<p>Essential tier free forever (media, calendar, focus, HUD, Digest). Pro EUR 2.99/month or EUR 24.99 lifetime (one-time, 2 Macs).</p>
```

**Version**

```text
2.8.0 (Wise Owl)
```

**What's New (changelog 2.8.0, paste as HTML)**

```html
<h5>Added</h5>
<ul>
  <li>Added Digest, a free RSS/Atom brief generated locally with Apple Intelligence Foundation Models.</li>
  <li>Added on-device Shelf summaries for PDF, DOCX, TXT and Markdown files (Pro).</li>
  <li>Added graceful fallback for Digest on macOS versions without Apple Intelligence.</li>
</ul>

<h5>Improved</h5>
<ul>
  <li>Improved music-player stability in background use.</li>
  <li>Improved login-screen handling after long sleep.</li>
  <li>Improved Sparkle update verification log output.</li>
</ul>

<h5>Fixed</h5>
<ul>
  <li>Fixed a rare crash when toggling Focus during a Spotify track change.</li>
  <li>Fixed Calendar sneak peek not refreshing after timezone change.</li>
</ul>
```

> If 2.8.0 changelog is not yet final, placeholder above mirrors what's in `marketing/off-site/setapp-submission/` and `press.html`. Replace with the actual frozen list before publishing.

**System requirements**

```text
macOS 15.0 or later. Apple Silicon or Intel Mac.
Apple Intelligence features (Digest, PDF Summarizer): macOS 26+ and a compatible Mac.
Sandboxed. Sparkle EdDSA-signed auto-updates over HTTPS.
```

**Pricing**

```text
Freemium. Pro: USD 3.30/month or USD 27 lifetime (EUR 2.99/mo or EUR 24.99 lifetime; one-time, 2 Macs).
```

**Submitted by**

```text
Axel Courty (developer, indie)
notchia.app@gmail.com
```

**Screenshots URLs (placeholders, host on notchia.app/press/screenshots/ before submission)**

```text
https://notchia.app/press/screenshots/01-notch-open-media.png
https://notchia.app/press/screenshots/02-notch-ai-status.png
https://notchia.app/press/screenshots/03-digest-on-device.png
https://notchia.app/press/screenshots/04-calendar-day-month.png
https://notchia.app/press/screenshots/05-shelf-clipboard.png
https://notchia.app/press/screenshots/06-hud-replacement.png
```

### Blockers

- Make sure 6 screenshot URLs are live and return 200 before submitting; MacUpdate editors will reject broken links.

---

## 5. MacRumors Forums

> MacRumors does **not** accept direct app submissions. The path is a forum thread; if the app gains forum traction, the MacRumors news desk sometimes covers it organically.

**Submission flow:**

1. Create a thread in the "Mac Apps and Mac App Store" sub-forum: https://forums.macrumors.com/forums/mac-apps-and-mac-app-store.10/
2. Be transparent — MacRumors mods will tag undisclosed self-promotion as spam.
3. Respond to every technical question within 24 hours.

**Suggested thread title**

```text
[Developer] NotchIA — turn your MacBook notch into a live AI cockpit (on-device Apple Intelligence + Claude Code/Codex/Copilot status)
```

**First post template (~200 words)**

```text
Hi everyone — disclosure first: I'm the developer of NotchIA, sharing it here because the AI integration angle might interest the dev/power-user side of the forum. Mods, feel free to move/lock if this doesn't fit the rules.

NotchIA is a native macOS app I've been building solo for a year. It turns the MacBook notch (or a virtual menu-bar zone on notch-less Macs) into a 14-module cockpit. Two parts I'd actually want feedback on:

• Live status for Claude Code, ChatGPT Codex and GitHub Copilot — 10 states, token counters, 5h/7d quotas, read locally from session files. No backend.

• On-device Apple Intelligence Digest — RSS/Atom feeds summarised locally with the Foundation Models layer (macOS 26+). Graceful fallback on macOS 15.

Plus the cockpit basics: media + synced lyrics, calendar, focus, clipboard history, file shelf, 16-format converter, HUD replacement.

Native SwiftUI + AppKit, ~30 MB, Apple Silicon + Intel, sandboxed, signed with Apple Developer ID, Sparkle EdDSA auto-updates over HTTPS. Zero telemetry.

Free Essential tier (media, calendar, focus, HUD, Digest). Pro at EUR 2.99/mo or EUR 24.99 lifetime (2 Macs).

Site: https://notchia.app — press kit: https://notchia.app/press

Happy to answer anything about implementation, the on-device LLM bits, or roadmap.
```

**Common follow-up questions to prepare**

- "Is this open source?" → No. Proprietary, but no telemetry/analytics. Source kept private to fund Pro tier.
- "Why a DMG and not Mac App Store?" → MAS sandbox blocks some of the system integrations (HUD interception, session-log reading). Sparkle EdDSA gives the same security guarantee for updates.
- "How is it different from Boring.Notch / NotchNook?" → 14 modules vs ~3, on-device Apple Intelligence Digest, live AI dev monitoring, full FR/EN/ES/DE localisation. Independent rebuild, not a fork.
- "Apple Silicon requirement?" → No. Universal binary, works on Intel too. Apple Intelligence features need M-series + macOS 26.
- "Where's the privacy policy?" → https://notchia.app/mentions-legales (FR) and the press kit page.

### Blockers

- Account must have some prior forum history before posting promo, or thread risks being flagged. If the Axel account is new, post 2-3 genuine replies in other threads first, then publish.

---

## 6. Setapp

Full submission package already drafted in `marketing/off-site/setapp-submission/`:

- `01-cover-email.md` — partnership outreach email (to `partners@setapp.com`)
- `02-app-description.md` — tagline, short + long description, Setapp Highlights bullets, use cases
- `03-screenshots-brief.md` — shot list for the Setapp store gallery
- `04-technical-spec.md` — sandbox, entitlements, code-signing, update channel
- `05-business-terms-questions.md` — open questions for the Setapp partner team (revenue share, exclusivity, localisation, refund flow)

**Action here:** point Setapp contacts to this folder. The Setapp page does not get a paste-in summary on this document because the format Setapp wants (cover email → review process) is different from a directory listing.

**Status:** outreach not yet sent (low priority until launch traction is visible to make the partnership case stronger).

---

## 7. Awesome Mac (GitHub list) — recommended PR

**Repo options:**

- `agarrharr/awesome-mac-apps` — broader curation, lower bar.
- `jaywcjlove/awesome-mac` — higher traffic, stricter curation, requires "actively maintained" proof.

**PR entry suggestion** (under "Menu Bar Tools" / "Productivity" section):

```markdown
- [NotchIA](https://notchia.app/) - Native macOS notch cockpit: media, calendar, focus, on-device Apple Intelligence RSS digest, clipboard, file shelf, and live status for Claude Code, ChatGPT Codex and GitHub Copilot. Freemium. Source closed.
```

**Eligibility:** open-source listings preferred but proprietary apps with clear value are accepted on `awesome-mac-apps`. `jaywcjlove/awesome-mac` accepts proprietary in dedicated sections.

**Action:** fork → add one line → PR with title `Add NotchIA - macOS notch cockpit with on-device AI`.

---

## 8. Indie Hackers (Products)

**URL:** https://www.indiehackers.com/products/new

**Eligibility:** any product with a public launch. Free.

**What to add:** name, tagline, URL, monetisation model (Freemium), revenue (be honest — leave at "Not disclosed" if pre-revenue), founder profile linked to Axel Courty's IH account.

**Bonus:** post a launch story in the IH community feed after Product Hunt day, link the PH URL. Indie Hackers founders cross-vote PH launches.

---

## 9. Mac App Lab

**URL:** https://macapplab.com/submit

**Eligibility:** any Mac app with a website + DMG. Free listing. Lower DR than MacUpdate but good for SEO long tail.

**Reuse:** the MacUpdate short summary + long description as-is.

---

## 10. StackShare

**URL:** https://stackshare.io/create-tools/new

**Eligibility:** any product willing to publish its tech stack. Useful for B2B/dev SEO; lower priority for a consumer Mac app.

**Stack to declare:** Swift, SwiftUI, AppKit, XPC, Sparkle, EdDSA, Foundation Models (Apple Intelligence), Cloudflare Pages, Cloudflare D1, Cloudflare Workers, Stripe, Resend.

**Action:** defer until v3.0 — only post once stack is stable and there's something to brag about.

---

## 11. BetaList — NOT APPLICABLE

NotchIA is **out of beta** (v2.8.0 shipping in production). BetaList only accepts pre-launch products. Skip.

## 12. F-Droid — NOT APPLICABLE

F-Droid is Android-only. NotchIA is macOS-only. Skip (mentioned only because the task brief listed it explicitly to confirm exclusion).

---

## Submission Tracking

| Directory | Account needed | Submitted | Public URL | Notes |
|---|---:|---:|---|---|
| AlternativeTo | Yes | No | | P1 — submit this week. Plus 8 alternative-page edits after approval. |
| MacUpdate | Yes | No | | P1 — submit this week. Editor turnaround 3-10 days. |
| Product Hunt | Yes | Scheduled draft | https://www.producthunt.com/products/notchia?launch=notchia | P1 — Tuesday launch, post-MacStories/9to5mac coverage. |
| Crunchbase | Yes | No | | P2 — needs LinkedIn company page first. |
| MacRumors Forums | Forum acct | No | | P2 — needs prior forum karma. |
| Setapp | Email | No | `marketing/off-site/setapp-submission/` | P3 — defer until launch traction. |
| Awesome Mac PR | GitHub | No | | P2 — 10-min PR, easy domino. |
| Indie Hackers | Yes | No | | P3 — post launch story week. |
| Mac App Lab | Yes | No | | P3 — copy from MacUpdate. |
| StackShare | Yes | No | | P4 — defer to v3. |
| BetaList | — | — | — | Skip — out of beta. |
| F-Droid | — | — | — | Skip — Android only. |

## Master checklist before any submission

- [ ] 6 screenshots live at `https://notchia.app/press/screenshots/` (HTTP 200 verified).
- [ ] 60-second demo GIF + hero image ready (for PH and AlternativeTo).
- [ ] `https://notchia.app/press` reachable and up-to-date.
- [ ] Changelog at `https://notchia.app/blog/wise-owl-2-8-0` finalised.
- [ ] Download URL `https://github.com/coaxel2/NotchIA/releases/latest/download/NotchIA.dmg` returns the signed DMG.
- [ ] Stripe Checkout live at `https://notchia.app/#pricing` (Pro purchase flow tested end-to-end).
- [ ] LinkedIn company page exists (only required for Crunchbase).
- [ ] Twitter/X handle `@notchia_app` claimed (optional but boosts Crunchbase and PH).
