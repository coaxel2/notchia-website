# Homebrew Cask submission — NotchIA

Step-by-step playbook to land NotchIA in the official
[`Homebrew/homebrew-cask`](https://github.com/Homebrew/homebrew-cask) repository.

> Read `pre-submission-checklist.md` and `risks.md` FIRST.
> If the DMG is not notarized by Apple, do not open the PR — it will be closed.
> NotchIA already ships through the third-party tap `coaxel2/notchia/notchia`,
> which is a fine alternative while notarization is in progress.

---

## 0. Prerequisites (one-time)

- A GitHub account with 2FA enabled (Axel: `coaxel2`).
- Local Homebrew installation up to date:
  ```bash
  brew update
  brew --version   # >= 4.x expected
  ```
- macOS 15 Sequoia or newer (matches the cask's `depends_on`).
- `gh` CLI authenticated:
  ```bash
  gh auth status
  ```

---

## 1. Fork and clone `homebrew-cask`

```bash
# Fork in the browser, or via CLI:
gh repo fork Homebrew/homebrew-cask --clone=false

# Clone the fork next to the official tap directory Homebrew already manages.
# This puts your fork at the canonical location, so `brew bump-cask-pr`
# and other helpers Just Work.
cd "$(brew --repository homebrew/cask)"
git remote rename origin upstream
git remote add origin git@github.com:coaxel2/homebrew-cask.git
git fetch origin
```

If you prefer working in an isolated clone (outside the brew prefix), do:

```bash
git clone git@github.com:coaxel2/homebrew-cask.git ~/dev/homebrew-cask
cd ~/dev/homebrew-cask
git remote add upstream https://github.com/Homebrew/homebrew-cask.git
git fetch upstream
```

---

## 2. Create the topic branch

Homebrew convention: `add-<cask>` for new casks.

```bash
git checkout -b add-notchia upstream/master
```

---

## 3. Place the cask file

Homebrew shards casks by first letter under `Casks/<letter>/`.

```bash
mkdir -p Casks/n
cp ~/notchia-website/marketing/off-site/homebrew-cask/notchia.rb Casks/n/notchia.rb
```

---

## 4. Compute the real SHA-256

The committed file ships with `sha256 "TODO_CALCULATE_AFTER_DOWNLOAD"` —
replace it with the actual hash of the **exact DMG that the URL serves**.

```bash
# Make sure you fetch the same artifact the cask URL points at (versioned URL).
curl -L -o /tmp/notchia.dmg \
  "https://github.com/coaxel2/NotchIA/releases/download/v2.8.0/NotchIA.dmg"

shasum -a 256 /tmp/notchia.dmg
# -> <sha256>  /tmp/notchia.dmg
```

Patch the file:

```bash
SHA=$(shasum -a 256 /tmp/notchia.dmg | awk '{print $1}')
sed -i.bak "s|TODO_CALCULATE_AFTER_DOWNLOAD|${SHA}|" Casks/n/notchia.rb
rm Casks/n/notchia.rb.bak
```

Verify visually:

```bash
grep sha256 Casks/n/notchia.rb
```

---

## 5. Local validation

Run each step. **All must pass** before opening the PR.

```bash
# 5.1 Style and formatting
brew style --fix Casks/n/notchia.rb

# 5.2 Static audit (required by reviewers; --new is stricter for new casks)
brew audit --cask --new --online Casks/n/notchia.rb

# 5.3 Live install from the local file (use a clean machine if possible)
brew install --cask --debug --verbose ./Casks/n/notchia.rb

# 5.4 Confirm the app is in place and launches
ls -lh /Applications/NotchIA.app
open -a NotchIA
# Manually verify: notch UI appears, no Gatekeeper "damaged/unidentified" error.

# 5.5 Uninstall cleanly (no leftover files outside zap list)
brew uninstall --cask notchia

# 5.6 Zap to confirm the cleanup paths are correct
brew install --cask ./Casks/n/notchia.rb
brew uninstall --cask --zap notchia

# 5.7 Livecheck must resolve to the same version
brew livecheck --cask Casks/n/notchia.rb
# Expected: "notchia: 2.8.0 ==> 2.8.0" (or newer if a release shipped)
```

If `brew audit` flags `unsigned` / `not notarized`, **stop here** —
fix notarization upstream before continuing (see `risks.md`).

---

## 6. Commit

Homebrew enforces a strict commit message format.

```bash
git add Casks/n/notchia.rb
git commit -m "Add notchia 2.8.0"
```

One commit per cask. No body, no Co-Authored-By trailers, no emojis.

---

## 7. Push to your fork

```bash
git push -u origin add-notchia
```

---

## 8. Open the pull request

```bash
gh pr create \
  --repo Homebrew/homebrew-cask \
  --base master \
  --head coaxel2:add-notchia \
  --title "Add notchia 2.8.0" \
  --body "$(cat <<'EOF'
After making the changes, ensure that the:

- [x] `brew install --cask <cask>` worked successfully.
- [x] `brew uninstall --cask <cask>` and `brew uninstall --cask --zap <cask>`
      worked successfully.
- [x] `brew audit --cask --new --online <cask>` is error-free.
- [x] `brew style --fix <cask>` reports no offenses.

## Cask description

NotchIA turns the MacBook notch into an AI productivity cockpit:
universal calendar, music controls, AirPods battery, file shelf,
RSS Digest (Apple Intelligence on-device), and global shortcuts.

- Homepage: https://notchia.app/
- Source releases: https://github.com/coaxel2/NotchIA/releases
- Minimum macOS: 15 Sequoia
- Architecture: universal binary (Apple Silicon + Intel)
- Auto-update: Sparkle (EdDSA-signed appcast)

I am the upstream maintainer and will respond to issues within 7 days.
EOF
)"
```

---

## 9. PR checklist (mirror the Homebrew bot)

| Check | Status |
|-------|--------|
| `brew audit --cask --new --online` passes | [ ] |
| `brew style --fix` reports no offenses | [ ] |
| `brew install --cask ./Casks/n/notchia.rb` succeeds | [ ] |
| `brew uninstall --cask --zap notchia` removes all paths | [ ] |
| `brew livecheck --cask` returns the right version | [ ] |
| App is signed AND notarized by Apple Notary Service | [ ] |
| DMG URL is canonical, versioned, immutable | [ ] |
| `auto_updates true` declared (Sparkle inside) | [ ] |
| Cask file lives in `Casks/n/notchia.rb` | [ ] |
| Commit message: `Add notchia 2.8.0` (exact format) | [ ] |
| Maintainer commits to 7-day response time on issues | [ ] |

---

## 10. After the PR is opened

- CI (`brew test-bot`) runs `audit`, `style`, install on macOS runners.
  If it fails, fix and force-push the same branch — do not open a new PR.
- A maintainer will leave review comments. Address each with a follow-up commit.
- Do **not** squash before merge — maintainers do that themselves.
- Once merged, users can install with the canonical command:
  ```bash
  brew install --cask notchia
  ```
  The third-party tap (`coaxel2/notchia/notchia`) can then be deprecated
  by emptying the formula and renaming with `tap_migrations.json`.

---

## 11. Future version bumps

Once the cask is merged, future releases ship via:

```bash
brew bump-cask-pr \
  --version 2.9.0 \
  --sha256 "$(shasum -a 256 /tmp/notchia-2.9.0.dmg | awk '{print $1}')" \
  notchia
```

That command opens a clean PR automatically and is what most maintainers expect.
