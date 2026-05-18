# r/macapps — NotchIA launch post

Target sub: **r/macapps** (~120k, strict no-self-promo, "Show & Tell" tag tolerated once per dev if content is substantial).

Posting account requirements: established account, 3+ months old, with prior non-promotional comment history. If posting from a fresh account, **do not post** — comment on a few unrelated threads first or ask a friend with a real account to crosspost.

---

## 1. Three alternative titles

> Reddit hard limit: 300 chars. All three below are < 120 chars to leave headroom for the [Show & Tell] tag the mods sometimes auto-flair.

**A.** `I got tired of alt-tabbing to my Claude Code terminal — so I put it in the MacBook notch. 6 months in, here's what I learned.`
→ Personal pain → personal solution. Devs in r/macapps are heavily Claude Code / Cursor users right now. The "6 months in" frames it as a journey post, not a launch ad.

**B.** `After a year of trying every notch app (NotchNook, Alcove, MediaMate, Boring), I built a 15-module one focused on dev workflows. AMA / roast me.`
→ Acknowledges the field, signals "I've done my homework", invites criticism — the kind of post r/macapps mods historically leave up because the OP is asking for feedback, not pushing a product.

**C.** `Anyone else live in their MacBook notch? Built a native macOS app around it (focus, AI session states, on-device RSS digest) — wanted to ask what's missing.`
→ Question-first opener. Lowest spam-flag risk. Weakest for upvotes because it doesn't say what's interesting until late.

> **Chosen: Title A.** Strongest hook (specific pain, specific tool a power-user audience cares about *right now*), it's a story not a pitch, and it filters in the exact crowd that converts (devs paying for Claude Code already = used to paying for productivity tools).

---

## 2. Body of the post (Markdown, ~520 words, no links)

```
A year ago I bought a 14" MacBook Pro and the notch genuinely
annoyed me. Then I started spending 6h/day in Claude Code and
realised I was constantly cmd-tabbing back to the terminal just
to check "is it still working or is it stuck waiting for my
permission?"

That's the itch I started scratching. Built a small overlay
that showed Claude Code's session state above the notch. Then a
friend asked for the same thing for Codex. Then someone wanted
it for Copilot. Then I figured I might as well do music, because
why not. Then calendar. Then focus sessions. Then a clipboard
manager.

15 modules later it's a real app. macOS 15+, Apple Silicon and
Intel. ~30 MB. Menu-bar only (LSUIElement, no Dock icon).

**What I think is actually different**

Notch apps exist — NotchNook, Alcove, MediaMate, Boring, DropNotch,
a few others. I respect all of them and most of you probably already
use one. The thing I haven't seen anywhere else is **live AI
session state in the notch**: detect which IDE has an active
Claude Code / Codex / Copilot session, show 10 distinct states
(Compiling, Running, Reading, Writing, Web search, Planning,
Sub-agent…), surface 5h and 7d quota usage, and ping you when the
agent is blocked waiting for permission. All from local session
logs — nothing leaves the Mac.

The other thing I'm proud of is the on-device Digest: paste your
RSS feeds, describe your interests in plain language ("video AI,
macOS 26, SwiftUI"), and Apple Intelligence Foundation Models
(macOS 26+) summarises a 30-second brief on-device. No cloud LLM,
no API key, no telemetry. On macOS 15 it degrades gracefully to a
raw feed reader.

**Stack, for the curious**

SwiftUI for the overlay, AppKit for the actual notch window (NSPanel
non-activating, ignoresMouseEvents toggle), signed XPC helper for
HUD interception (volume / brightness / keyboard backlight), Sparkle
with EdDSA-verified appcast for updates, OSLog with per-module
categories. Sandbox + minimal entitlements.

**Where I'm honest about the weaknesses**

- Not on the Mac App Store. Signed but **not notarised** — first
  launch requires right-click → Open. I'm a solo dev and the
  notarisation hoop is on the to-do list, not done yet.
- Pricing isn't live yet. Free tier is real and unlimited (9 of
  15 modules including the Digest, music, calendar, focus, HUD).
  Pro will be €3.99/month or €39.99 lifetime (2 Macs, no recurring)
  in a couple of weeks.
- The AI session detection has only been battle-tested on the IDEs
  I use daily (VS Code, Cursor, Zed, Terminal). If you use
  something weird, it might not pick it up. Tell me.

**Stuff I genuinely want to know from you**

1. What's your current notch app — or do you actively hide the
   notch with a black wallpaper?
2. Would live AI agent state in the notch actually be useful for
   you, or is it solving a problem only Claude Code addicts have?
3. What's the one notch-app feature nobody has built yet that you
   secretly want?

Roast freely. I've been staring at this thing for 6 months and I
can't see it clearly anymore.
```

> Word count: ~520. No links, no CTA, no "try it now". The post stands on its own as a discussion piece — that's what passes mod review.

---

## 3. First comment to post immediately after (50-80 words)

```
Forgot to include the link in the post (the rules here are a bit
strict on self-promo in body, and rightly so). If anyone wants
to actually look at the thing instead of just my essay:

→ notchia.app

There's a 30-second video on the homepage that shows the notch
behaviour better than I can describe it. Free tier is real, no
account, no email. Drop feedback here or DM — I read everything.
```

> Post this from the OP account as the first reply. Mods are fine with this pattern on r/macapps when the body itself stayed clean.

---

## 4. Five pre-prepared replies to predictable objections

### Objection 1 — "Why not just use Boring Notch which is free?"

```
Boring Notch is great and you should absolutely keep using it if
it covers what you need. They're a different team and a different
approach.

The two things I built NotchIA around that aren't in Boring's
scope: (1) live AI agent state — detecting Claude Code / Codex /
Copilot sessions from local logs and surfacing 10 states + quota
usage in the notch, and (2) on-device Apple Intelligence Digest
that summarises RSS feeds against interests you describe in plain
language, 100% local.

If neither of those matters to you, Boring is the cheaper answer
and that's a real recommendation. Free tier of NotchIA is also
free, so worst case you try both side by side.
```

### Objection 2 — "Source code?"

```
Honest answer: NotchIA is proprietary. Some of the smaller UI
components (animations, custom controls) I've open-sourced or
plan to — I document them case by case in release notes when
that happens. The core app, the AI detection layer and the XPC
helper stay closed because that's where the real work is and
it's how I'm trying to make this sustainable as a solo dev.

I get that this is a turn-off for some of you. The free tier is
there exactly so you can verify the app behaves the way I claim
(no network calls except Sparkle update check) — Little Snitch
or LuLu will show you.
```

### Objection 3 — "Why €39.99 lifetime when Boring is free?"

```
Fair question. Two reasons:

1. Scope. NotchIA bundles 15 native modules — music multi-source
   with synced lyrics, calendar + reminders, focus sessions with
   stats, system HUD replacement, clipboard manager, file shelf
   with conversion, AI session monitor, on-device RSS digest, etc.
   The Pro tier unlocks 6 of those; the other 9 are free forever.

2. Solo dev economics. €39.99 once on 2 Macs, no subscription, no
   data harvested. That's roughly 11 months of the monthly plan,
   and after that you've paid nothing more for life. I'm not
   pretending to compete with free — I'm building something I'd
   pay for myself.

Free tier exists so you can decide *before* paying whether the
Pro modules are worth it for your workflow.
```

### Objection 4 — "Apple Intelligence requirement?"

```
Only the Digest module and Shelf file-summary need Apple
Intelligence (macOS 26 / Foundation Models on-device). Everything
else runs on macOS 15+, Apple Silicon or Intel.

On macOS 15 without Apple Intelligence, the Digest tab degrades
gracefully to a clean RSS reader — you lose the AI summary, you
keep the fetch + dedup + interest filter. Nothing crashes, nothing
nags you to upgrade.

This is on purpose. I didn't want to lock the whole app behind
macOS 26 just to ship one fancy module.
```

### Objection 5 — "How does this compare to NotchNook?"

```
NotchNook is more mature on the polish side — animations,
tray-drop interactions, a couple of years of users beating on it.
Real respect for what they've built.

The factual differences as I see them: NotchIA adds live AI agent
state (Claude Code / Codex / Copilot detection with quota and
state in the notch), an on-device Apple Intelligence RSS digest,
and a system-HUD replacement for volume/brightness/keyboard. It's
also free at the Essential tier (9 modules) where NotchNook is
paid up front.

NotchNook does Tray and the AirDrop-style file flick better than I
do. If those are your daily drivers, stay there. If the AI
workflow piece is what you'd actually use the notch for, NotchIA
is built around that.
```

---

## 5. Best time to post

**Tuesday or Wednesday, 14:00–16:00 UTC (≈ 10:00–12:00 ET / 07:00–09:00 PT / 15:00–17:00 Paris).**

Reasoning:
- r/macapps engagement peaks weekday US-morning (most active mods + East-Coast lunchtime scroll + EU early afternoon).
- Avoid Monday (post backlog from weekend competes for the front page) and Friday afternoon (drop-off into weekend).
- Avoid the 24h window around any Apple event or macOS .x release — those days the sub is saturated with system-news.
- **Specific recommendation: Tuesday 2026-05-20, 14:30 UTC** (Wednesday is also acceptable). This is 2 days after the chosen date for this brief and gives time to warm up the account with 2-3 genuine non-promo comments in the sub if needed.

---

## 6. Plan B — if the mods remove the post

### Step 1 — Don't repost in the same form for 7 days. Reposting same-day triggers the auto-ban.

### Step 2 — Polite modmail (send via Reddit's "Message the mods" link)

```
Subject: Heads-up on my [Show & Tell] post about NotchIA

Hi r/macapps mods,

I posted [link] this morning and noticed it was removed — totally
respect the call, the no-self-promo rule is what keeps this sub
useful and I'd rather ask than assume.

A bit of context in case it helps: I'm the solo dev behind NotchIA,
a native macOS notch utility (15 modules, Essential tier free
forever, no telemetry). I've been a passive reader of r/macapps
for a while and tried to write the post as a "what I learned
building this" discussion piece rather than a launch ad — no
link in the body, asking the sub real questions, acknowledging
existing apps (Boring, NotchNook, Alcove, MediaMate).

If there's a format or angle that would be acceptable — softer
framing, removing the AMA language, waiting until I have more
non-promo karma in the sub, whatever — I'm happy to follow it.
Or if this just isn't a fit for the sub right now, no problem,
I'll respect that and move on.

Thanks for the work you put into moderating this place.

— Axel (axelcourty1@gmail.com)
```

### Step 3 — Soft-launch variant (if mods green-light a re-post)

Replace the title with one of:
- `Question for the notch-app users here: would live AI session state in the notch be useful, or am I overthinking it?`
- `What's missing from the current crop of MacBook notch apps? (Asking because I've been building one and want a sanity check.)`

Cut the "6 months in" and "AMA / roast me" framing. Cut the stack section. Keep only the problem, the question, and one paragraph of context. Comment your link in the same first-reply pattern.

### Step 4 — Cross-posting fallback

If r/macapps stays closed, the realistic next moves in order of value:
1. **r/macOSX** (~80k, slightly more lenient)
2. **r/macbookpro** (~500k, but lower SNR; reframe around "what to do with the notch")
3. **r/ClaudeAI** (~40k, very on-topic for the AI-session-state angle — likely the highest-conversion sub for this specific feature)
4. **r/SideProject** (~150k, explicit self-promo allowed, lower indexation value)

Avoid r/apple — the mods there are zero-tolerance and you'll burn the account.
