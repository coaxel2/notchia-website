# Risks — Homebrew Cask submission

Ranked from highest to lowest probability of PR rejection.
Each item lists the trigger, the consequence, and the mitigation.

---

## R1 — Apple notarization missing (P = HIGH, currently TRUE)

**State today.** Per `llms-full.txt`:
> "Application signée mais non notarisée Apple : au premier lancement,
> macOS affiche un avertissement Gatekeeper."

**Why it matters.** Homebrew Cask reviewers run
`brew install --cask` on a clean macOS VM. If Gatekeeper blocks the
launch with "developer cannot be verified" or "damaged", the PR
gets the `notarization` label and is closed within 24 h.

**Mitigation.**
- Enroll in the Apple Developer Program (99 $/yr) if not already.
- Notarize the DMG with `xcrun notarytool submit --wait` and
  staple the ticket with `xcrun stapler staple`.
- Verify locally with `spctl -a -t install -vvv NotchIA.dmg`
  → must return `source=Notarized Developer ID`.
- Until then, keep the third-party tap `coaxel2/notchia/notchia`
  as the only Homebrew install path.

---

## R2 — Non-canonical, mutable URL (P = HIGH if not fixed)

**Trigger.** Using `https://notchia.app/dl/dmg` (an HTML landing page,
not a 30x redirect) or `releases/latest/download/NotchIA.dmg` (a
mutable URL that breaks the `sha256` on every new release).

**Consequence.** Audit fails with
`url should not redirect to a different domain` or
`sha256 mismatch`. Worse, every silent upstream rebuild can
poison the existing install for users who already have the cask
pinned.

**Mitigation.** Pin to a real GitHub Release tag:

```ruby
url "https://github.com/coaxel2/NotchIA/releases/download/v#{version}/NotchIA.dmg",
    verified: "github.com/coaxel2/NotchIA/"
```

The shipped `notchia.rb` already does this.

---

## R3 — `auto_updates` mismatch with upstream Sparkle (P = MEDIUM)

**Trigger.** Cask declares `auto_updates true` but Sparkle is either
not bundled, not configured with `SUFeedURL`, or shipped with the
private EdDSA key included (security flag).

**Consequence.** Reviewers ask for proof Sparkle is alive,
or they require `auto_updates false`. Worst case: a security
scanner flags the embedded key and the PR is bounced to
`security@homebrew.sh`.

**Mitigation.**
- `defaults read /Applications/NotchIA.app/Contents/Info SUFeedURL`
  → must return an HTTPS URL on `notchia.app`.
- `Sparkle.framework/Resources/Info.plist` must not contain
  `SUPrivateKeyAccount` (only the **public** key, in `SUPublicEDKey`).
- Confirm the appcast is reachable and serves at least one
  signed item.

---

## R4 — License ambiguity (P = MEDIUM)

**Trigger.** NotchIA is closed-source freemium with Pro tiers
(2.99 €/mo / 24.99 € lifetime). Homebrew reviewers occasionally ask:
"Are users allowed to redistribute the binary via a package manager?"

**Consequence.** A maintainer comment requesting a clear EULA
link delays the merge by 1-2 weeks.

**Mitigation.**
- Publish a one-line EULA on the homepage:
  "The NotchIA app binary may be freely redistributed by
  package managers (Homebrew, MacUpdate, etc.). Pro licenses
  are non-transferable and tied to the issued Ed25519 key."
- Link that page from the press kit and the GitHub release notes.

---

## R5 — App too new (P = MEDIUM)

**Trigger.** Homebrew's unwritten rule: a cask is accepted once the
app has been "stable on the public web for ≥ 30 days". NotchIA 2.8.0
shipped 2026-05-15.

**Consequence.** PR sits in review until 2026-06-14+, or is closed
with "please resubmit after 30 days".

**Mitigation.**
- Submit no earlier than **2026-06-15**.
- Include in the PR body a link to the GitHub release history
  showing prior versions (2.7.x, 2.6.x, …).

---

## R6 — Bundle identifier collision (P = LOW)

**Trigger.** `com.coaxel2.notchia` uses a personal GitHub handle
rather than a verified domain (e.g. `app.notchia.NotchIA`).
Some reviewers prefer the latter.

**Consequence.** Cosmetic comment, rarely blocking.

**Mitigation.** Document the rationale in the PR description.
Migrating the bundle ID later requires `pkgutil` work and a
`tap_migrations.json` entry — defer unless a reviewer insists.

---

## R7 — Zap paths incomplete (P = LOW)

**Trigger.** `brew uninstall --cask --zap notchia` leaves files
behind under `~/Library/Containers`, `~/Library/Group Containers`,
or `~/Library/LaunchAgents`.

**Consequence.** Audit warning, easy fix.

**Mitigation.** After install, run:

```bash
find ~/Library -name "*notchia*" -o -name "*NotchIA*" 2>/dev/null
```

Add every match to the `zap trash:` array in the cask.

---

## R8 — Style / RuboCop offenses (P = LOW)

**Trigger.** Spacing, string quotes, `livecheck` block ordering.

**Consequence.** Bot comment, force-push fix.

**Mitigation.** Always run `brew style --fix Casks/n/notchia.rb`
before pushing.

---

## R9 — `livecheck` regex fails (P = LOW)

**Trigger.** `:github_latest` strategy is fine because the project
uses GitHub Releases with semver tags. If the upstream switches
to non-semver tags ("wise-owl-final"), livecheck breaks.

**Mitigation.** Keep release tags strictly `vX.Y.Z`.

---

## R10 — Duplicate cask (P = NEGLIGIBLE)

**Trigger.** A cask with the same name already exists.

**Consequence.** PR closed instantly.

**Mitigation.** Already verified — no `notchia` cask in
`Homebrew/homebrew-cask` as of 2026-05.

---

## Risk matrix

| ID  | Risk                          | Likelihood | Impact   | Fix effort |
|-----|-------------------------------|------------|----------|------------|
| R1  | No Apple notarization         | TRUE       | Blocker  | High (cert + workflow) |
| R2  | Non-canonical URL             | High       | Blocker  | Low (one-line URL change) |
| R3  | Sparkle auto-update mismatch  | Medium     | Blocker  | Medium (Info.plist audit) |
| R4  | License ambiguity             | Medium     | Delay    | Low (publish EULA) |
| R5  | App < 30 days old             | Medium     | Delay    | None (wait) |
| R6  | Bundle ID with personal handle| Low        | Cosmetic | None |
| R7  | Incomplete zap paths          | Low        | Warning  | Low (find + patch) |
| R8  | Style offenses                | Low        | Warning  | Auto-fix |
| R9  | livecheck regex breaks later  | Low        | Future   | None now |
| R10 | Name collision                | None       | Blocker  | N/A |

**Bottom line.** R1 alone is enough to block the submission today.
Notarize first; everything else is straightforward.
