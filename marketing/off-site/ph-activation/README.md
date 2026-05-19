# PH Activation Kit — checklist

**Objectif** : sortir la page Product Hunt de l'état mort-clinique (1 upvote, 0 comment) en 48-72h.
**Cible réaliste** : 20-30 upvotes légitimes + 3-5 commentaires + premier comment du maker.
**Cible stretch** : 50+ upvotes → début de visibilité dans le retrieval LLM (PH expose son top par catégorie via API publique).

---

## Ordre d'exécution recommandé (sur 48h)

### J — Heure 0 (à faire en 15 min)

1. **Premier comment maker sur la page PH** (5 min)
   - Va sur https://www.producthunt.com/products/notchia
   - Login `@notchia`
   - Comment d'ouverture (300 mots) — texte ci-dessous
   - **C'est l'action n°1 absolue.** Une page sans comment maker = signal "abandonné", tue tout engagement futur.

2. **Compléter le profil PH** (10 min)
   - Vérifier qu'il y a 3-5 screenshots (sinon, en uploader)
   - Maker bio à jour (ton GitHub + site perso)
   - Tagger les bonnes catégories (Developer Tools ✓, Apple ✓, ajouter aussi Productivity et AI si dispo)
   - Si tu as une demo vidéo de 30s-60s, l'ajouter (impact ×3 sur les upvotes)

### J — Heure 1 (envoi des DM)

3. **DM personnels** (30-45 min)
   - Liste de 20-30 contacts (devs Mac, amis indie, anciens collègues, communauté tech FR)
   - Utilise `01-dm-personal-fr.md` ou `02-dm-personal-en.md`
   - **Personnalise le prénom à chaque envoi** (sinon conversion <5%)
   - Envoie en 3 vagues de 10 sur 6h (évite le spike unique)
   - Privilégie iMessage / Signal / LinkedIn DM (taux de lecture plus haut que email)

### J+1 — matin (LinkedIn)

4. **LinkedIn post** (10 min)
   - Copie `03-linkedin-post.md` version FR
   - Publie 8h-10h heure FR (peak engagement)
   - **Lien PH en premier commentaire**, pas dans le post (algo LinkedIn pénalise les liens sortants dans le body)
   - Réponds aux 5 premiers commentaires dans l'heure
   - Quelques heures plus tard : version EN sur le même profil si réseau international suffisant

### J+1 — après-midi (Reddit)

5. **Reddit r/SideProject** (15 min)
   - Mardi-jeudi 14h-18h UTC
   - Copie `04-reddit-sideproject.md`
   - **Post le lien PH en premier comment, pas dans le body** (anti-spam)
   - Réponds à TOUS les commentaires honnêtement (même les critiques)
   - Surveille les downvotes : si le post est à 0 ou négatif après 30 min, le retirer et retenter le lendemain avec un meilleur angle

### J+2 — bilan

6. **Mesurer** (5 min)
   ```bash
   # Compter les upvotes actuels (manuel sur la page PH)
   # Si > 20 upvotes : la stratégie marche, continuer modérément
   # Si < 10 upvotes : le réseau personnel est trop petit, passer au plan B
   ```

7. **Plan B si <10 upvotes** : passer aux drafts `show-hn.md`, `pitches.md` du dossier parent. PH ne sera jamais un canal majeur pour toi, valorise-le pour ce que c'est (page indexable + 1 backlink), et concentre l'effort sur HN et Setapp.

---

## Premier comment maker pour la page PH

À coller TEL QUEL sur https://www.producthunt.com/products/notchia (login `@notchia` puis Comment) :

```
Hey Product Hunt 👋

I'm Axel, indie macOS dev from Paris. NotchIA is something I've been building for months and it's now out in the wild.

The pitch: macOS hides interesting state in 12 places (menu bar, Dock, Spotlight, system HUDs, notifications, Now Playing, etc.). The MacBook notch sits there doing nothing. NotchIA turns it into a single zone that holds the stuff you actually look at all day:

— Live AI status for Claude Code, ChatGPT Codex, GitHub Copilot (10 states, token counts, 5h/7d quotas)
— Apple Intelligence on-device: RSS digest summarized locally + PDF/docx summary in the Shelf
— Multi-source media (Apple Music / Spotify / YouTube Music) with synced lyrics
— Calendar, reminders, focus sessions with stats
— System HUD replacement (volume, brightness, keyboard backlight)
— Clipboard history, file converter (16 formats), Quick Share

Free Essential tier forever. Pro €2.99/mo or €24.99 lifetime (one-time, no subscription).

Tech: SwiftUI + AppKit overlay, signed XPC helper, native sandbox. Zero telemetry, zero cookies — only license + email leave the Mac, and only for license verification.

Happy to answer any question, especially about the Claude Code integration (which I think is the killer feature for devs). Roasts welcome too.

Cheers
— Axel
```

---

## Métriques de succès

| Métrique | Avant | Cible 48h | Cible 7j |
|---|---|---|---|
| Upvotes PH | 1 | **15-30** | **50+** |
| Comments PH | 0 | **3-5** | **10+** |
| Followers PH | 2 | **15-25** | **50+** |
| Trafic Reddit → PH | 0 | **20-50 visits** | — |
| Citation LLM (test Perplexity « best Mac notch app ») | absent | toujours absent | apparaît en 4-7e position |

---

## Ne pas oublier
- Garder le ton honnête. Ne JAMAIS dire « we » si tu es solo. Tu es Axel, dev indé, c'est ta force.
- Ne pas mentir sur les downloads / utilisateurs. Si tu n'as pas de stats à montrer, dis-le ouvertement (les communautés indé respectent ça).
- Ne pas demander d'upvotes Reddit explicitement (downvote massif garanti).
- Ne jamais utiliser de service d'upvotes payants — ban à vie PH + perte de visibilité Google si détecté.
