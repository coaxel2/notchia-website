# Hacker News — Show HN

## Submission

Title: `Show HN: NotchIA - live AI status and local RSS summaries in the notch`

URL: https://notchia.app/

## First Comment

Hi HN, I'm Axel, an indie macOS developer in Paris.

I built NotchIA because I kept losing track of long Claude Code sessions. I would start an agent on a repo, switch spaces, answer mail, and then come back too early, too late, or only after it had been waiting for permission for ten minutes. The MacBook notch is always in view, so I started using it as a tiny status surface.

That first use case became a native macOS app that shows live AI session status for Claude Code, ChatGPT Codex, and GitHub Copilot: what the assistant is doing, token stats, quota windows, permission waits, and multiple parallel sessions. The session reading is local. It reads files on disk and does not proxy prompts or completions through a server.

The latest release adds the other thing I wanted for myself: Digest. I paste RSS or Atom feeds, write a short description of what I care about, and the app fetches, dedupes, and summarizes the relevant items with Apple's on-device Foundation Models. The goal is not to replace sources. Every original link stays visible. It is just a short morning brief for feeds I already follow.

The free tier includes media controls, calendar, reminders, focus timer, system HUD replacement, and Digest. Pro adds the live AI status module, Shelf file workflows, conversion, and clipboard history. It is distributed directly, not through the Mac App Store, because the app needs permissions and update velocity that did not fit App Store review well.

Technical details people here might care about: native macOS, macOS 15+, graceful fallback when Apple Intelligence is unavailable, no telemetry, no third-party AI calls for Digest or file summaries, Sparkle updates, Stripe licensing, and FR/EN/ES/DE localization.

Happy to answer implementation questions, especially around on-device summaries, notch/menu-bar layout, permissions, or how the AI session detection works without a backend.

## Prepared Q&A

**Q1. Why put this in the notch instead of the menu bar?**  
A. The notch is passive but always visible. The app also supports Macs without a notch by creating a configurable menu-bar zone, so the layout is not limited to recent MacBooks.

**Q2. Does any prompt or session content leave the Mac?**  
A. No telemetry and no proxy server. AI session state is read locally. Digest fetches public feeds from the Mac and summarizes locally when Apple Intelligence is available.

**Q3. Why not ship only through the Mac App Store?**  
A. The app needs low-level macOS permissions, frequent updates, Sparkle delivery, and direct licensing. The App Store would slow down the iteration loop for this kind of utility.

**Q4. What happens on macOS 15 without Apple Intelligence?**  
A. The app still runs. Digest falls back to a raw feed viewer without AI summaries, while media, calendar, focus, HUD, and the other non-Apple-Intelligence features keep working.

**Q5. Is the live AI module useful if I do not use Claude Code?**  
A. It also supports ChatGPT Codex and GitHub Copilot, but if you do not use coding assistants, the free tier may be the better fit: media, calendar, focus, Digest, and system HUD.
