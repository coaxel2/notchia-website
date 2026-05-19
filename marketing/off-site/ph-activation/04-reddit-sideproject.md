# Reddit r/SideProject — réveiller le lancement PH

## Usage

**Sub cible** : `r/SideProject` (300k+ membres, autorise l'auto-promo, tolérant aux indies).

**Pas sur r/MacApps** pour cette stratégie — ce subreddit a une no-self-promo policy stricte et un post type "I launched on PH" se fait downvote/remove instantanément. r/MacApps sera une stratégie séparée (post natif "how I built X" sans lien PH direct).

**Quand publier** : mardi-jeudi 14h-18h UTC (peak audience US tech). Pas le week-end.

**Format Reddit r/SideProject** : screenshot + title + body court + lien en commentaire (pas dans le body, ça déclenche l'anti-spam).

---

## Titre du post (max 300 chars Reddit)

```
I launched NotchIA on Product Hunt this week — 1 upvote, 0 comments. Roast it.
```

**Pourquoi ce titre** :
- Vulnérabilité honnête (1 upvote = relatable, indé qui galère)
- « Roast it » = invitation au feedback, ne sent pas la demande d'upvote
- Pas de buzzwords marketing → passe les filtres anti-spam

**Alternative plus soft** :
```
I built a macOS app that uses the MacBook notch for live Claude Code monitoring. Launched on PH, would love feedback.
```

---

## Body du post (Markdown)

```markdown
Hey r/SideProject,

I'm Axel, indie dev from Paris. I shipped **NotchIA** this week on Product Hunt — a macOS app that turns the MacBook notch into an interactive control center.

**What it does**
- Live AI status in the notch for Claude Code, ChatGPT Codex, GitHub Copilot (10 states: compilation, terminal, search, reading, writing, sub-agent, etc.)
- On-device Apple Intelligence: RSS digest + PDF/.docx summary, all local, zero telemetry
- Multi-source media (Apple Music / Spotify / YouTube Music) with synced lyrics
- Calendar + reminders + focus sessions + system HUD replacement
- 15 native modules in one freemium app

**Tech**: SwiftUI + AppKit overlay for the notch zone, signed XPC helper for system HUD interception, native macOS sandbox.

**Pricing**: Essential free forever. Pro €2.99/mo or €24.99 lifetime (one Mac / two Macs).

**What I'm struggling with**
Product Hunt launch fell flat — 1 upvote, 0 comments. No prior community, no Twitter audience, just shipped and hoped. Now trying to figure out how to get it in front of real Mac power users.

**What I'd love from this sub**
- Honest roasts on the landing page → https://notchia.app
- Thoughts on positioning vs Boring.Notch / NotchNook / MediaMate
- If you use Claude Code or Codex, would you actually use the live status thing?

PH link in the first comment (rules).

Cheers
```

---

## Premier commentaire (à poster IMMÉDIATEMENT après le post)

```
PH link as promised: https://www.producthunt.com/products/notchia

(Reddit rules don't allow PH links in post body, so dropping it here. Upvote there is appreciated but the feedback in this thread is what I actually came for.)
```

---

## Hashtags / flair
Reddit n'utilise pas de hashtags. Tag le post avec le flair **`Feedback`** ou **`Show & Tell`** (selon ce que r/SideProject propose au moment du post).

## À NE PAS faire
- Mettre le lien PH dans le body → ban automatique anti-spam
- Begging d'upvotes Reddit (« plz upvote ») → downvote massif
- Reposter dans plusieurs subs en une heure → shadow-ban
- Répondre uniquement aux comments positifs → comportement vu et puni

## Si le post performe bien
Si tu dépasses 20+ upvotes Reddit en 6h → cross-post sur :
- r/macapps (mais reformule en post natif sans mention PH/launch, focus produit)
- r/Anthropic (focus sur la feature Claude Code monitoring)
- r/macgaming si tu as un angle gaming-friendly (probablement pas)
