# MacStories — pitch email

> Pourquoi MacStories : c'est **la** source éditoriale citée par ChatGPT Search pour la niche "notch apps Mac" (analyse 2026-05-16). Une mention sur macstories.net = présence instantanée dans les retrievals LLM sur la niche. La review historique de NotchNook+MediaMate y a été publiée et est encore le contenu de référence cité par les LLM.

## Cibles

### Première cible : John Voorhees (couvre Mac apps)
- Email : john@macstories.net (ou contact@macstories.net)
- Twitter : @johnvoorhees
- Tag MacStories : il a couvert NotchNook, Alcove, et la majorité des notch apps

### Deuxième cible : Federico Viticci (founder)
- Email : federico@macstories.net
- Twitter : @viticci
- À tenter si John ne répond pas après 10 jours

### Si refus / pas de réponse
Cibles secondaires identifiées dans le retrievé ChatGPT :
- **9to5Mac** Mac apps editor : chance@9to5mac.com
- **MacRumors** : tips@macrumors.com (mais tip line plus formelle)

---

## Email pitch — version 1 (envoyer en premier, en anglais — leur audience)

**Subject** : `NotchIA — a new notch utility with on-device Apple Intelligence and live AI status (Claude Code/Codex/Copilot)`

**Body** :

```
Hi John,

Long-time reader. I noticed your write-ups on NotchNook and Alcove, and I wanted to put a new app on your radar — NotchIA.

NotchIA is an independent native macOS app. It adds two things that aren't covered by any of the notch utilities currently reviewed on MacStories:

1. **Live AI status in the notch.** It auto-detects active Claude Code, ChatGPT Codex, and GitHub Copilot sessions and shows what they're doing in real time — 10 states (Compiling, Reading, Editing, Writing, Sub-agent, etc.), token statistics, 5h/7d rate-limit quotas, and notifications when an assistant is waiting for permission. All read locally from ~/.claude/projects/, no cloud calls.

2. **On-device Apple Intelligence RSS Digest.** Users paste their feeds, describe their interests in plain language, and the app summarizes via Foundation Models — on-device, 100% local, requires macOS 26. It's the first practical, daily-use case I've seen for Apple Intelligence beyond the OS demos. Graceful fallback to a raw RSS viewer on macOS 15.

Beyond that: multi-source media with synced lyrics (Apple Music / Spotify / YouTube Music), iCal calendar + Reminders, full Pomodoro Focus, 16-format file converter, unlimited clipboard history, FR/EN/ES/DE i18n, on-device Shelf summary for PDF/.docx via Apple Intelligence.

Pricing: Essential tier free for life. Pro at €2.99/mo or €24.99 lifetime one-time for 2 Macs (vs NotchNook's $25 lifetime — comparable territory but with the AI stack).

Site: https://notchia.app/
Release notes 2.8.0 (the Apple Intelligence Digest release): https://notchia.app/blog/wise-owl-2-8-0

If you have time, I'm happy to:
- Send a TestFlight-style build for review
- Walk you through the on-device AI integration
- Answer any technical questions on the implementation

No problem if it's not a fit for MacStories right now — I just wanted to give you a heads-up given your prior coverage of this niche.

Cheers,
Axel Courty
Indie dev, Paris
notchia.app@gmail.com
```

---

## Email pitch — version 2 (si John ne répond pas, après 10 jours)

**Subject** : `Re: NotchIA — short follow-up on the on-device Apple Intelligence angle`

**Body** :

```
Hi John,

Quick follow-up on my last email about NotchIA. I realize you probably get dozens of indie pitches a week, so I'll keep it short.

Since I wrote, NotchIA's 2.8.0 release (https://notchia.app/blog/wise-owl-2-8-0) has been featured in [insert what you can — Product Hunt, a Reddit post, a blogger mention]. The Apple Intelligence Digest angle in particular has generated interesting feedback because it's one of the rare daily-use Foundation Models implementations outside Apple's own apps.

If this isn't on your radar for now I won't keep emailing. But if you ever do a "best notch apps" roundup or want to dive into on-device AI use cases, I'd love to be part of the conversation.

Thanks,
Axel
```

---

## Conseils tactiques (à ne pas mettre dans le mail)

### Ce qui marche pour MacStories
- Pitch **technique précis** (ils sont devs/power users, pas marketing). Mentionner l'XPC helper, EdDSA Sparkle, lecture locale `~/.claude/projects/`, Foundation Models on-device, etc. — pas "the best app ever made"
- **Reconnaître l'existant** : "NotchNook" en premier paragraphe — ça montre que tu connais le territoire
- **Pas d'embargos**, pas de "release exclusivity" tant que tu n'as pas de relation établie
- **Email court** : 250-400 mots max. Voir le premier essai ci-dessus

### Ce qui tue le pitch
- Faux nom ("Best Mac app of 2026")
- Termes marketing ("revolutionary", "game-changing")
- Pitch en français pour un site EN (MacStories est US/IT)
- Plus de 2 follow-ups
- CC'er Federico avant que John ait répondu

### Timing
- Envoyer **mardi ou mercredi**, entre 14h et 17h ET (20h-23h CET)
- **Pas le weekend**, **pas un vendredi après-midi**
- John est actif 9h-18h ET typiquement

### Si John répond positivement
1. Lui envoyer un build .dmg directement (lien GitHub releases)
2. Une short Loom video (~ 3 min) qui montre les 2 angles : Claude Code monitoring + Digest Apple Intelligence
3. Disponibilité pour appel Zoom de 30 min si besoin
4. Captures haute résolution prêtes (sans watermark, format 16:10)

---

## Mesure du succès

Si MacStories publie un article qui mentionne NotchIA :
- **24-72h après** : refaire le test ChatGPT Search → on devrait apparaître dans la réponse
- **1 semaine après** : refaire test sans web search → on n'y sera pas (pas dans le training set) mais le web search nous trouvera
- **3-6 mois après** : avec d'autres mentions accumulées, on commence à être cité même sur "best Mac app" générique sur certaines requêtes contextualisées

---

## Pendant qu'on attend MacStories (en parallèle)

Cibles **secondaires** moins prioritaires mais utiles :

| Site | Email | Angle |
|---|---|---|
| 9to5Mac | chance@9to5mac.com | Apple Intelligence on-device use case |
| MacRumors | tips@macrumors.com | Indie release, formal tip line |
| MacGeneration (FR) | redaction@macg.co | Voir `launch-pack.md` |
| iGeneration (FR) | contact@igen.fr | Voir `launch-pack.md` |
| Mac4Ever (FR) | contact@mac4ever.com | Voir `launch-pack.md` |
| Six Colors | contact@sixcolors.com | Jason Snell — angle technique |
| The Sweet Setup | hello@thesweetsetup.com | Mac app reviews |

**Règle d'or** : pas plus de 3 envois simultanés. Sinon ça se voit que c'est une campagne et tout le monde te poubellise.
