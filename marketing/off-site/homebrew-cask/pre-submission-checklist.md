# Pre-submission checklist — Homebrew Cask (NotchIA)

Hard blockers that must be resolved **before** opening the PR against
`Homebrew/homebrew-cask`. If any item below is unchecked, do not submit:
the PR will be closed by the maintainers within 24-48 h.

---

## 1. Apple notarization — STATUS: BLOCKER

> Current state (per `llms-full.txt`): **"Application signée mais non notarisée Apple"**.
> Homebrew Cask requires notarized DMGs since 2023. This is the single biggest
> blocker for NotchIA.

- [ ] Developer ID Application certificate active in
      [Apple Developer portal](https://developer.apple.com/account/resources/certificates)
- [ ] DMG codesigned with hardened runtime
      (`codesign --verify --deep --strict --verbose=2 NotchIA.app`)
- [ ] DMG submitted to Apple Notary Service via `xcrun notarytool submit`
- [ ] Notarization ticket stapled
      (`xcrun stapler staple NotchIA.dmg && xcrun stapler validate NotchIA.dmg`)
- [ ] Final check: `spctl -a -t install -vvv NotchIA.dmg` returns `accepted` and
      `source=Notarized Developer ID`

**If notarization is not feasible right now**, keep distributing through the
third-party tap `coaxel2/notchia/notchia` (already in production) and skip
the official Cask submission. The tap has no notarization requirement.

---

## 2. Canonical, versioned, immutable URL — STATUS: NEEDS FIX

The website redirect `https://notchia.app/dl/dmg` is **HTML + JS**, not a 30x.
It triggers a download to:

```
https://github.com/coaxel2/NotchIA/releases/latest/download/NotchIA.dmg
```

Homebrew prefers a **versioned** URL because `latest` mutates over time and
silently invalidates the pinned `sha256`.

- [ ] The cask uses the versioned URL pattern:
      `https://github.com/coaxel2/NotchIA/releases/download/v2.8.0/NotchIA.dmg`
- [ ] A GitHub release named exactly `v2.8.0` exists with the DMG attached
- [ ] The DMG filename is stable across releases (`NotchIA.dmg`,
      not `NotchIA-2.8.0.dmg`) — or the cask uses `#{version}` interpolation

If the release uses a versioned filename (e.g. `NotchIA-2.8.0.dmg`),
update the cask to:

```ruby
url "https://github.com/coaxel2/NotchIA/releases/download/v#{version}/NotchIA-#{version}.dmg"
```

---

## 3. Version metadata inside the bundle

Homebrew matches `Info.plist`'s `CFBundleShortVersionString` against the
cask's `version` field at audit time.

- [ ] `defaults read /Applications/NotchIA.app/Contents/Info CFBundleShortVersionString`
      returns `2.8.0` (matches the cask exactly)
- [ ] `CFBundleIdentifier` returns `com.coaxel2.notchia` (matches `zap` paths)
- [ ] `LSMinimumSystemVersion` is `15.0` or higher (matches
      `depends_on macos: ">= :sequoia"`)

---

## 4. Bundle identifier consistency — STATUS: VERIFIED

Confirmed from `index.html`, `press.html`, `llms-full.txt`:

- Bundle ID: **`com.coaxel2.notchia`**

All `zap` paths in the cask reference this identifier. If the identifier
changes in a future release, the zap list must be updated **and** a
`tap_migrations.json` rename may be required.

---

## 5. Universal binary

Homebrew Cask doesn't formally require this, but reviewers flag
arch-specific casks. NotchIA must ship both architectures.

- [ ] `lipo -archs /Applications/NotchIA.app/Contents/MacOS/NotchIA`
      returns `x86_64 arm64`

If only one arch ships, declare it explicitly in the cask:

```ruby
depends_on arch: :arm64        # Apple Silicon only
# or
depends_on arch: [:x86_64, :arm64]  # universal — usually omitted
```

---

## 6. License

Cask reviewers ask for the upstream license. Even closed-source apps
must have a clear EULA.

- [ ] License is stated on the homepage or in a `LICENSE`/`EULA` file
- [ ] The license permits free redistribution of the DMG via package managers
      (NotchIA's freemium model is fine — only the **app binary**
      is redistributed, not Pro licenses)

---

## 7. Maintainer responsiveness

- [ ] Axel commits to replying to GitHub issues on the cask within **7 days**
- [ ] Issue notifications enabled for `Homebrew/homebrew-cask`
- [ ] Backup contact noted in case of extended absence

---

## 8. App age and stability

Homebrew prefers apps that have been publicly available for **at least 30 days**.

- [ ] Public launch date ≥ 30 days ago (NotchIA 2.8.0 shipped 2026-05-15 —
      eligible after 2026-06-14)
- [ ] No critical bugs in the last released version
- [ ] At least one user-visible release that isn't the very first one
      (review history easier to verify)

---

## 9. Sparkle / auto-update sanity

The cask declares `auto_updates true`. That MUST be accurate or
audit will fail.

- [ ] Sparkle framework is bundled in `NotchIA.app/Contents/Frameworks/Sparkle.framework`
- [ ] `SUFeedURL` in `Info.plist` points to a real HTTPS appcast
- [ ] Appcast entries are signed with the production EdDSA key
- [ ] `SUEnableInstallerLauncher` is set correctly (false unless privileged
      helper is bundled)

---

## 10. Pre-flight automated check

Run this from inside `homebrew-cask`:

```bash
brew style --fix Casks/n/notchia.rb \
  && brew audit --cask --new --online Casks/n/notchia.rb \
  && brew install --cask --debug --verbose ./Casks/n/notchia.rb \
  && brew uninstall --cask --zap notchia \
  && brew livecheck --cask Casks/n/notchia.rb \
  && echo "READY TO SUBMIT"
```

If `READY TO SUBMIT` doesn't print, you are not ready.

---

## TL;DR — what I (Axel) need to do before submitting

1. **Notarize the DMG with Apple Notary Service.** (Hard blocker.)
2. Switch to a versioned URL (`v2.8.0/NotchIA.dmg`).
3. Re-run the pre-flight block above on a clean macOS 15 install.
4. Open the PR per `submission-instructions.md`.

Until step 1 is done, distribute via the third-party tap
`coaxel2/notchia/notchia` and skip the official cask submission.
