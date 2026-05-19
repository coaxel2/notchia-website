# NotchIA — technical specification for Setapp review

## Identity

| Field | Value |
|---|---|
| Product name | NotchIA |
| Vendor | Axel Courty (individual developer, France) |
| Bundle identifier | `com.coaxel2.notchia` |
| Current version | 2.8.0 « Wise Owl » (released 2026-05-15) |
| Minimum macOS | 15.0 (Sequoia) |
| Recommended macOS | 26.0+ (Tahoe / Apple Intelligence required for Digest + Shelf AI summarisation) |
| Architecture | Universal 2 (Apple Silicon arm64 + Intel x86_64) |
| Bundle size | ~ 30 MB installed, ~ 12 MB DMG |
| Languages | French, English, Spanish, German (all localised — strings, UI, support) |
| App type | LSUIElement menu-bar app (no Dock icon) |

## Signing & notarisation

- **Signed:** yes — Developer ID Application certificate held by Axel Courty.
- **Notarised by Apple:** **no** — currently distributed outside the Mac App Store without Apple notarisation.
- **User-facing workaround on first launch:** right-click `NotchIA.app` → **Open** → confirm in Gatekeeper dialog. If Sequoia 15+ or Tahoe 26+ blocks the right-click path, the user goes to **System Settings → Privacy & Security → Open Anyway** (a step-by-step guide is shipped in-app and on the website install page).
- **Why honest disclosure matters for Setapp:** if NotchIA is accepted into Setapp, distribution would go through the Setapp installer, which handles its own gating. We expect the notarisation requirement to be either (a) lifted because Setapp manages the trust chain, or (b) added as a condition of acceptance — we are willing to complete Apple notarisation if Setapp requires it before listing.
- **Update path to notarisation:** code is sandbox-compatible; the only blocker is the XPC helper for HUD interception, which we can ship as a separately-signed XPC service to clear notarisation gates if needed.

## Helper & XPC

- Signed XPC helper for system HUD interception (volume, brightness, keyboard backlight) and global shortcut handling.
- Helper validates the caller's code signature before accepting any request — anonymous IPC is rejected.
- Helper has no network entitlement.

## Distribution channels (current)

- Direct `.dmg` from GitHub Releases (signed, EdDSA-verified) — primary.
- Homebrew cask `coaxel2/notchia/notchia` — for CLI users.
- Sparkle auto-update from `https://notchia.app/appcast.xml`, EdDSA signature verified on every update.

## Telemetry policy

- **Zero telemetry.** No analytics SDK is bundled (no Mixpanel, no Amplitude, no Sentry, no PostHog, no Firebase, no Google Analytics, no Apple App Analytics opt-in either).
- **Zero crash reporting.** Crashes are written to the local macOS system log (Console.app) and never transmitted off-device. Users can email a `.crash` file manually if they want to report.
- This is a deliberate product position aligned with Setapp's privacy-conscious audience.
- If Setapp prefers a minimal opt-in crash reporter (e.g. Sentry with explicit consent toggle, defaulting to OFF), we are open to adding one as a Setapp-only build variant.

## Update mechanism

- **Framework:** Sparkle 2.x
- **Signature:** EdDSA (ed25519), public key embedded in `Info.plist`, signature verified before any binary is mounted.
- **Transport:** HTTPS-only, appcast hosted at `https://notchia.app/appcast.xml`.
- **Channels:** stable only (no beta channel exposed in production).
- **If Setapp distributes:** Sparkle would be disabled on Setapp builds and updates would flow through Setapp's installer per their integration guidelines.

## Permissions requested

| Permission | When prompted | Reason |
|---|---|---|
| **Accessibility** | First launch, optional | Global keyboard shortcuts, system HUD interception, multi-screen notch placement |
| **Calendars** | When user opens Calendar module | Read events from EventKit |
| **Reminders** | When user opens Calendar module | Read + toggle Reminders from EventKit |
| **Automation (System Events, Music, Spotify)** | When user enables specific media sources | AppleScript bridge for Now Playing controls on Music.app and Spotify.app |
| **Notifications** | First launch | Permission-pending alerts for AI sessions, focus session end |
| **File system (user-selected)** | When user drops a file into Shelf or uses converter | Sandboxed file access only — no full disk access requested |

- **No** full disk access requested.
- **No** screen recording permission requested.
- **No** microphone or camera access.
- **No** input monitoring beyond the Accessibility scope listed above.

## Sandbox & entitlements

- App is **sandboxed** (`com.apple.security.app-sandbox = true`).
- Entitlements:
  - `com.apple.security.network.client` — only for Sparkle updates and user-provided RSS feeds in Digest.
  - `com.apple.security.files.user-selected.read-write` — Shelf and converter.
  - `com.apple.security.automation.apple-events` — AppleScript bridge for media controls.
  - `com.apple.security.personal-information.calendars` — Calendar module.
  - `com.apple.security.temporary-exception.apple-events` for specific bundle IDs (Music, Spotify, iCal) — explicitly listed.
- **No** `com.apple.security.cs.disable-library-validation`.
- **No** `com.apple.security.get-task-allow` in release builds.

## License model — current and Setapp scenario

- **Current model:** freemium. Essentiel is free forever. Pro tiers (Monthly 2.99 €/month, Lifetime 24.99 €) launch shortly via a custom license-key system backed by a Cloudflare Worker that stores `{email, license_key, IP_of_worker_request}` only — no Mac fingerprinting, no usage logs.
- **For Setapp:** we are prepared to replace the license-key check with Setapp's authentication SDK so that Setapp subscribers transparently get the full Pro feature set without entering a key. The license validation module is isolated behind a `LicenseProvider` protocol — swapping it for Setapp's auth is a localised change (~ 1 day of work).
- **Parallel sales:** we'd like to keep the direct-sale Lifetime Pro tier available on notchia.app for users outside Setapp's regions or who prefer one-time purchase. Open to discussion on this point (see `05-business-terms-questions.md`).

## Logging

- Unified OSLog (`os_log`), categorised per module, filterable in Console.app.
- No log shipping. Logs stay on the user's Mac.

## Known limitations and risks (honest disclosure)

- **Not Apple-notarised** today — covered above with mitigation path.
- **User base is young.** Public release in May 2026; Pro tier not yet live. Acceptance metrics from Setapp would massively help us scale.
- **Apple Intelligence dependency** for Digest and Shelf AI summarisation requires macOS 26+. On macOS 15, those modules gracefully degrade to non-AI viewers — clearly indicated in the UI.
- **Intel support** is maintained but most of the user base is on Apple Silicon; some animations are slightly less fluid on Intel.
- **Live AI monitoring** depends on the on-disk log format of Claude Code, Codex and Copilot. If Anthropic / OpenAI / GitHub change the format, we ship a patch within 48 h (this has happened twice since v2.0 — both patched the same day).
- **Helper XPC** is signed but is the most security-sensitive component. It has been audited in-house; an external audit is on the roadmap for v3.0.
