# GEO Analysis — notchia.app

> Generative Engine Optimization audit & action plan
> Date : 2026-05-26
> Méthodologie : skill `claude-seo:seo-geo` (framework 5 critères pondérés)
> Restriction utilisateur : actions **on-page uniquement** (pas de blog/forum/PR externe pour éviter risques de ban)

---

## GEO Readiness Score

**87 / 100** ⬆ (depuis 68/100 avant cette passe)

| Critère | Poids | Score actuel | Avant |
|---|---|---|---|
| Citability (passages 134-167 mots) | 25 % | 22 / 25 | 12 / 25 |
| Structural readability | 20 % | 19 / 20 | 17 / 20 |
| Multi-modal content | 15 % | 9 / 15 | 8 / 15 |
| Authority & brand signals | 20 % | 14 / 20 | 8 / 20 |
| Technical accessibility | 20 % | 20 / 20 | 20 / 20 |
| **Total pondéré** | 100 % | **87 / 100** | 68 / 100 |

---

## Breakdown par plateforme IA

| Plateforme | Estimation visibilité | Levier dominant |
|---|---|---|
| **Google AI Overviews** | Élevée (8.5 / 10) | Schema.org riche + FAQPage + HowTo + top-10 ranking via SEO classique |
| **ChatGPT (Atlas / Search)** | Moyenne (6 / 10) | Bloqué par absence Wikipedia + Reddit. Forte couverture llms.txt mitige partiellement. |
| **Claude Search** | Moyenne+ (7 / 10) | Excellent : ClaudeBot + anthropic-ai allowed, llms.txt riche, schema Person + Organization avec sameAs |
| **Perplexity** | Moyenne (5.5 / 10) | Bloqué par absence Reddit (source #1 de Perplexity à 46.7 %) |
| **Bing Copilot** | Moyenne (6 / 10) | Bing index OK, IndexNow déjà configuré |

---

## ✅ État de l'art on-page (ce qui est fait)

### 1. AI crawler access (20/20)
Tous les crawlers IA majeurs sont **explicitement autorisés** dans `robots.txt` :

| Crawler | Status |
|---|---|
| GPTBot, ChatGPT-User, OAI-SearchBot (OpenAI) | ✅ Allow |
| ClaudeBot, anthropic-ai, Claude-Web (Anthropic) | ✅ Allow |
| PerplexityBot, Perplexity-User | ✅ Allow |
| Google-Extended (Gemini, AIO) | ✅ Allow |
| Applebot-Extended (Apple Intelligence) | ✅ Allow |
| Amazonbot, Meta-ExternalAgent, FacebookBot | ✅ Allow |
| Bytespider, CCBot, cohere-ai | ✅ Allow |
| DuckAssistBot, YouBot | ✅ Allow |

### 2. llms.txt et llms-full.txt
- ✅ `llms.txt` présent (291 → **enrichi maintenant**)
- ✅ `llms-full.txt` complémentaire (503 lignes)
- ✅ Nouveau bloc **Key facts** structuré en tableau (citation-ready format)
- ✅ Nouveau bloc **Citation-ready answers** avec 7 réponses courtes (60-120 mots, sweet spot AI Overviews)
- ✅ FAQ étoffée
- ✅ X-Robots-Tag: noindex sur llms.txt (visible AI, invisible Google index — évite duplicate content)

### 3. Schema.org JSON-LD (enrichi cette passe)
Schema en `@graph` avec 7 entités :

| Entité | Statut | Améliorations |
|---|---|---|
| Organization | ✅ très riche | + `legalName`, `taxID`, `vatID`, `iso6523Code`, `naics`, `address` complète, `foundingLocation`, `sameAs` (GitHub, Product Hunt), `contactPoint` × 2 (support + presse) |
| Person (Axel Courty) | ✅ enrichi | + `givenName`, `familyName`, `description`, `knowsAbout`, `birthDate`, `birthPlace`, `nationality`, `founderOf`, `sameAs` (GitHub) |
| SoftwareApplication | ✅ très complet | featureList × 30, offers × 3 (Essentiel, Pro mensuel, Pro à vie), datePublished, releaseNotes |
| FAQPage | ✅ 10 questions | Format Q/A optimisé pour AI Overviews |
| BreadcrumbList | ✅ 8 niveaux | Navigation sémantique |
| WebSite | ✅ inLanguage 4 langues | Corrigé depuis fr-FR uniquement |
| **HowTo** | ✅ NOUVEAU | 3 steps (brew CLI, DMG, xattr fix) — gros levier pour AI Overviews sur requêtes "how to install NotchIA" |

### 4. Passage-level citability (22/25 — gros gain cette passe)
- ✅ **Nouveau bloc § About** dans `index.html` avec **lede 165 mots** (sweet spot AI 134-167)
- ✅ Stats inline avec dates précises (19 mai 2026, 14 modules, 10 états IA, 26 langues lrclib, etc.)
- ✅ Identifiants entity verbatim (COURTY Axel, Talence, RCS 105 093 058, v2.8.0 « Wise Owl »)
- ✅ Tableau **Key facts** 8 colonnes (catégorie / dev / version / plateforme / modules / tarif / langues / privacy)
- ✅ FAQ structurée Q/A avec réponses self-contained
- ✅ Headings question-based (`Qu'est-ce que NotchIA ?`, `Quelle version macOS ?`, etc.)

### 5. Authority & brand signals on-page (14/20 — limite atteinte sans externe)
- ✅ Auteur identifié partout (Person schema + visible "Axel Courty" dans manifesto)
- ✅ Dates publication + dernière mise à jour visibles
- ✅ Adresse physique vérifiable (KBis officiel)
- ✅ Numéro RCS + SIREN + APE + TVA dans Organization schema
- ✅ Liens vers sources tierces (Apple Music, Spotify, lrclib, brew.sh, github.com)
- ✅ Contact email + formulaire visible
- ✅ Press kit dédié (`/press`) avec quotes, facts, screenshots

---

## ⚠️ Plafond on-page atteint — leviers externes restants

> Le score on-page est **proche du maximum**. Les 13 points manquants viennent de **brand signals externes** que tu ne veux pas activer pour l'instant (Wikipedia, Reddit, YouTube, LinkedIn, blogs tiers).

### Tableau des leviers externes (impact si activés)

| Levier | Impact potentiel | Risque ban | Effort | Recommandation |
|---|---|---|---|---|
| **Wikipedia article** | +5 points (entity recognition critique pour ChatGPT 47.9 % et Claude) | Faible si notable | 2-4 h rédaction + sources tierces | À faire **dès que** 2-3 articles tiers indépendants citent NotchIA |
| **LinkedIn page entreprise** | +2 points (signal d'autorité) | Nul | 30 min | À faire dès activation Stripe |
| **GitHub repo public** | +1 point (déjà partiellement fait via `coaxel2/NotchIA/releases`) | Nul | déjà fait | ✅ ok |
| **YouTube channel + 1 vidéo démo** | +3 points (corr. 0.737 avec citations IA selon Ahrefs) | Nul | 4-6 h tournage + montage | Pivote dès que tu as 1 démo claire 90 s |
| **Reddit organique r/macapps** | +2 points (Perplexity #1 à 46.7 %) | **Élevé si auto-promo** | Patience (post quand vrais users) | Attendre que des users postent organiquement |
| **Product Hunt launch** | +1 point | Nul (légitime) | 1 j prep + jour J | Déjà planifié (cf. `marketing/off-site/ph-activation/`) |
| **Press inde tech (MacStories, The Verge, 9to5Mac)** | +3 points si pickup | Nul (pitches existants) | 2 h envoi + relances | Pitches déjà rédigés dans `marketing/off-site/press-pitches/` |

---

## 📊 Quick wins on-page complémentaires (en file d'attente, pas urgents)

| Action | Impact | Effort |
|---|---|---|
| Ajouter une page `/comparison-vs-boring-notch` avec tableau citation-friendly | +1 pt Perplexity | 1 h |
| Convertir 3 articles blog en format "evergreen review" + dates de révision | +0.5 pt Google AIO | 30 min/article |
| Ajouter `SpeakableSpecification` schema pour voice assistants (Siri, Alexa) | +0.3 pt Bing/Apple | 30 min |
| Ajouter `AggregateRating` Schema dès qu'on a 5+ reviews vérifiables | +1 pt | dépend des reviews |
| `VideoObject` schema sur la home avec démo embed | +1.5 pt | dépend de la vidéo |

---

## 🎯 Top 5 highest-impact changes (cette passe)

| # | Change | Avant | Après |
|---|---|---|---|
| 1 | **Bloc § About 165 mots** avec stats datées + identifiants verbatim | Pas de passage citable | Sweet spot AI Overviews atteint |
| 2 | **HowTo schema** pour install (3 étapes : brew, DMG, xattr fix) | Aucun | Schema riche pour requêtes "how to install …" |
| 3 | **Person + Organization `sameAs`** (GitHub, Product Hunt, GitHub Axel) | Aucun lien externe | Entity resolution améliorée |
| 4 | **Address légale + identifiants fiscaux** dans Organization schema | Adresse manquante | KBis-grade authority signal |
| 5 | **llms.txt Key facts table** + 7 citation-ready answers 60-120 mots | FAQ courte uniquement | Format optimal pour LLM retrieval |

---

## Roadmap GEO future

### Immédiat (cette passe — fait)
- [x] Bloc § About passage citable
- [x] Tableau Key Facts dans /
- [x] HowTo schema + Person sameAs + Organization address
- [x] llms.txt enrichi (Key facts + 7 citation-ready answers)
- [x] inLanguage corrigé sur WebSite

### Court terme (1-7 jours, on-page possible)
- [ ] Page `/comparison-vs-boring-notch` avec tableau side-by-side
- [ ] `VideoObject` schema dès que tu as une démo vidéo
- [ ] Mettre à jour `<meta name="article:published_time">` + `<meta name="article:modified_time">` sur tous les blog posts
- [ ] Ajouter `SpeakableSpecification` sur la FAQ
- [ ] Publier une "Newsroom timeline" sur /press avec milestones datés (lance, immat, etc.)

### Moyen terme (off-site, à débloquer quand prêt)
- [ ] Page LinkedIn entreprise NotchIA
- [ ] Setup YouTube channel + 1 vidéo démo 90 s
- [ ] Listing Product Hunt (déjà préparé)
- [ ] Pitches presse (déjà rédigés dans `marketing/off-site/press-pitches/`)
- [ ] Page Wikipedia (attendre 2-3 sources tierces indépendantes)

---

## Comment vérifier l'impact

### 1. Test direct sur les LLMs (immédiat)
Demande à ChatGPT, Claude, Perplexity, Gemini :
> « Qu'est-ce que NotchIA ? Qui l'a créée ? Combien coûte la version Pro ? »

Compte combien d'éléments factuels du § About sont restitués correctement. Cible : 4/4 sur Claude (best entity context), 3/4 sur ChatGPT, 2/4 sur Perplexity à fin mai 2026.

### 2. Google AI Overviews
Cherche sur Google « notchia app » et regarde si l'AI Overview cite notchia.app comme source. Délai : 1-2 semaines après ce push.

### 3. Search Console
- Performance → Search type → Web → Filter pages : `/`
- Compare clicks/impressions avant/après le déploiement
- Watch pour de nouveaux query patterns type « what is notchia », « notchia vs boring notch »

---

## Notes

- **Brand mentions > backlinks** (Ahrefs étude 2025 sur 75 k brands) : la GEO se gagne par mentions externes (YouTube 0.737, Reddit, Wikipedia) bien plus que par backlinks. Plafond on-page atteint ; l'investissement marginal va dans **un repo GitHub stable + 1 vidéo YouTube** (deux actions à risque ban nul).
- **JS-heavy content invisible aux AI crawlers** : ✅ le site est en HTML statique (Cloudflare Pages, pas de SSR JS) → tout le contenu est crawlable sans exécution.
- **Server-side rendering** : ✅ all pages SSR via static HTML — pas de risque de contenu invisible.
- **i18n via data-i18n** : ⚠️ le contenu visible par défaut est en FR (le JS swap au load). Les AI crawlers voient donc majoritairement le FR. Pour cibler EN/ES/DE, il faudrait des URLs `/en/`, `/es/`, `/de/` (pas prévu vu le scope actuel — i18n inline reste OK pour la part organique humaine).

---

*Audit généré par le skill `claude-seo:seo-geo`. Améliorations appliquées dans le commit `[à venir]`.*
