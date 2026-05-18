# Setapp submission — checklist & playbook

## Package contents

1. `01-cover-email.md` — first-contact email to send to Setapp partnership team
2. `02-app-description.md` — long-form profile copy for the Setapp listing
3. `03-screenshots-brief.md` — production brief for the 7 mandatory screenshots (+ optional trailer)
4. `04-technical-spec.md` — review-team-facing technical spec (signing, telemetry, permissions, sandbox)
5. `05-business-terms-questions.md` — open questions to clarify before signing the Vendor Agreement
6. `README.md` — this file

## Primary contact & submission URLs

- **Partner submission form:** https://setapp.com/partner-with-setapp
- **Integration documentation:** https://docs.setapp.com/integration
- **Partnership email (when known):** `partners@setapp.com` (fallback: use the form above, which routes to the same team)
- **Vendor support docs:** https://docs.setapp.com/

The official intake is the partner form. The cover email is meant to be sent **in addition** to the form, after submission, to make the case directly.

## Process

### Step 1 — Asset preparation (Week 0)
- [ ] Produce 7 screenshots per `03-screenshots-brief.md` (Retina @2x PNG + @1x downscale)
- [ ] Optional: produce the 15 s MP4 trailer
- [ ] Have `02-app-description.md` proofread (EN must be flawless)
- [ ] Confirm the latest signed `.dmg` is reachable at the GitHub Releases URL listed in the spec
- [ ] Make sure `https://notchia.app` is up, privacy + ToS pages live (already done)

### Step 2 — Submission (Week 1)
- [ ] Fill the partner form at https://setapp.com/partner-with-setapp with the short description from `02-app-description.md` and a link to the GitHub release DMG
- [ ] Within the same day, send the cover email from `01-cover-email.md` to `partners@setapp.com` (CC `vendors@setapp.com` if no auto-reply)
- [ ] Attach a single PDF combining `02-app-description.md` + 4 best screenshots (hero, Digest, Shelf, AI)
- [ ] Add a one-line P.S. with a Loom link (≤ 2 min) walking through NotchIA in real use

### Step 3 — Waiting (Weeks 1-3)
- Expected first response: **5-10 business days** for an acknowledgement, **2-6 weeks** for a substantive review decision (Setapp's published guidance).
- If no acknowledgement after 10 business days, send a single polite follow-up; do not chase more than twice.

### Step 4 — Review call (Weeks 3-6)
- If Setapp greenlights to call stage, prepare a **30-minute call**:
  - Live product demo (notch open, AI module, Digest, Shelf)
  - Numbers honest snapshot: install count, weekly actives, conversion intent
  - Use `05-business-terms-questions.md` as the agenda for the second half
- After the call, send a recap email summarising agreed-upon points within 24 h

### Step 5 — Integration (Weeks 6-10)
- Swap `LicenseProvider` for Setapp's auth SDK
- Build the Setapp variant (Sparkle disabled, telemetry confirmed off)
- Submit build to Setapp QA per `https://docs.setapp.com/integration`
- Two QA rounds expected before go-live

### Step 6 — Launch (Week 10-12)
- Confirmed live date
- Coordinated marketing push (Setapp newsletter + our channels + Product Hunt update post)
- Monitor first 30 days closely for MAU, refund/churn signals on the direct tier

## Plan B if Setapp declines

- Take the written feedback seriously — Setapp's review team is one of the best signals you can get.
- Wait **3 months** minimum before reapplying. In that window:
  - Ship Pro tier publicly and collect 90 days of subscription / churn data
  - Add 2-3 features Setapp specifically flagged (commonly: better onboarding, Apple notarisation, refined English copy)
  - Build a small reviewer base (MacStories, 9to5Mac, Cult of Mac) to add external credibility to round 2
- Re-pitch with a refreshed `01-cover-email.md` that opens with the metric gains since last contact.
- In parallel: Pasta / SetApp-alternative bundles exist (RapidWeaver, AppShelf, etc.) — worth exploring as fallback distribution.
- Maintain direct-sale Pro on notchia.app as primary channel regardless of Setapp outcome.

## Internal owner

- **Submission owner:** Axel Courty
- **Tech contact for review team:** Axel Courty (same person — small team)
- **Email of record:** notchia.app@gmail.com
