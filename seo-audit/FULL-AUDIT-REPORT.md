# NotchIA — Full SEO Audit Report

**URL** : https://notchia.app/
**Date** : 2026-05-16
**Stack** : Single HTML SPA + Tailwind CDN + JS i18n + Cloudflare Pages
**Auditor** : claude-seo plugin v1.9.9 (parallel sub-agent run)

---

## Executive Summary

### SEO Health Score : **65 / 100**

| Category | Score | Weight | Weighted |
|---|---|---|---|
| Technical SEO | 45 / 100 | 22 % | 9.9 |
| Content Quality | 80 / 100 | 23 % | 18.4 |
| On-Page SEO | 85 / 100 | 20 % | 17.0 |
| Schema / Structured Data | 65 / 100 | 10 % | 6.5 |
| Performance (CWV) | 70 / 100 * | 10 % | 7.0 |
| AI Search Readiness | 25 / 100 | 10 % | 2.5 |
| Images | 70 / 100 | 5 % | 3.5 |
| **Total** | | | **64.8** |

\* CWV: estimated — PageSpeed Insights API quota partagé épuisé, à re-run avec une clé Google (cf. ACTION-PLAN §P3.1).

**Verdict** : techniquement propre côté contenu et métadonnées (le travail GEO récent paie), mais **4 défaillances infrastructure invalident une grande partie de la stratégie GEO** déclarée dans `CLAUDE.md`. Le score remonte mécaniquement à ~78/100 dès que les 2 critiques `P0-CF-WAF` + `P0-SOFT-404` sont corrigés.

### Top 5 Critical Issues

1. **🚨 Cloudflare WAF bloque 5 bots IA / 8 testés** (403) — GPTBot, ClaudeBot, PerplexityBot, CCBot, OAI-SearchBot. La stratégie « être cité par les LLM » est **désactivée au niveau infrastructure**, indépendamment de robots.txt.
2. **🚨 Cloudflare Managed Content prepend un bloc robots.txt qui contredit votre config** — il déclare `User-agent: GPTBot Disallow: /` AVANT votre section custom. Les crawlers respectueux du first-match ignoreront vos `Allow`.
3. **🚨 404 retournent HTTP 200** — `/non-existent-404-test` → 200 avec homepage en payload. Soft-404 sur tout chemin inventé : risque d'indexation infinie de duplicates.
4. **🚨 Hreflang factice sur `/` et `/install`** — 7 alternates fr/fr-FR/en/en-US/es/de/x-default pointent tous vers la même URL servie en français. Google ignore et peut signaler en duplicate.
5. **🟠 FAQPage schema absent sur 5 articles de blog / 8** alors que les Q&A sont visibles dans le DOM — plus gros gisement GEO immédiat.

### Top 5 Quick Wins

1. **Désactiver Super Bot Fight Mode pour les User-Agents IA** dans Cloudflare → débloque GPTBot/ClaudeBot/PerplexityBot/CCBot en 5 minutes.
2. **Ajouter une page `_error.html` Cloudflare Pages + `not_found_behavior: 404`** ou config Worker → soft-404 résolu.
3. **Retirer les 6 hreflang factices** sur `index.html` + `install.html`, garder fr + x-default → conformité Google immédiate.
4. **Ajouter FAQPage JSON-LD** aux 5 articles concernés → boost citation LLM (5 changements quasi mécaniques).
5. **Ajouter 6 headers de sécurité** via `_headers` Cloudflare Pages → +5 pts Best Practices Lighthouse.

---

## 1. Technical SEO

### 1.1 Crawlability

| Check | Result | Detail |
|---|---|---|
| robots.txt présent | ✅ 200 | Bien structuré côté NotchIA (15 user-agents IA explicitement `Allow: /`) |
| Sitemap.xml présent | ✅ 200 | 16 URLs, lastmod uniformes 2026-05-16, hreflang xhtml inclus |
| Sitemap référencé dans robots | ✅ | `Sitemap: https://notchia.app/sitemap.xml` |
| llms.txt | ✅ 200 | Excellent contenu, comprehensive, GEO-ready |
| llms-full.txt | ✅ 200 | Présent (non lu en profondeur) |
| **robots.txt conflictuel** | 🚨 **CRITIQUE** | Cloudflare Managed Content prepend un bloc `Disallow: /` pour GPTBot/ClaudeBot/CCBot/Google-Extended/Applebot-Extended/Bytespider/Amazonbot/meta-externalagent AVANT le bloc custom. Les bots respectant le first-match (RFC) ignorent le `Allow:` qui suit |
| **AI bot WAF blocking** | 🚨 **CRITIQUE** | Tests avec UA réels : GPTBot 403, ClaudeBot 403, PerplexityBot 403, CCBot 403, OAI-SearchBot 403. Seuls Google-Extended, Applebot-Extended et Bingbot passent (200). Cause : Cloudflare Super Bot Fight Mode |
| **404 / Soft-404** | 🚨 **CRITIQUE** | Tout chemin inexistant retourne HTTP 200 + contenu de la homepage. Confirmé : `/non-existent-404-test` → 200 |

### 1.2 Indexability

- Canonical présent sur toutes les pages testées ✅
- `<html lang>` correct (fr ou en selon la page) ✅
- Pas de `noindex` détecté ✅
- Pas de boucle de redirect (max 1 hop sur les URLs testées) ✅

### 1.3 Hreflang

| URL | hreflang declarés | Pointe vers | Issue |
|---|---|---|---|
| `/` | fr, fr-FR, en, en-US, es, de, x-default | **toutes la même URL** | 🚨 FAKE — toutes pointent vers la même URL servie en `fr` |
| `/install` | fr, en, es, de, x-default | **toutes la même URL** | 🚨 FAKE — idem |
| `/features` | fr, x-default | self | ✅ correct (vraiment FR-only) |
| `/blog/wise-owl-2-8-0` | fr, x-default | self | ✅ correct (FR-only) |
| `/blog/meilleures-apps-mac-2026` | fr, en, x-default | symétrique | ✅ correct |
| `/blog/best-mac-apps-2026` | en, fr, x-default | symétrique | ✅ correct |
| `/blog/meilleure-app-encoche-macbook-2026` | fr, en, x-default | symétrique | ✅ correct |
| `/blog/best-mac-notch-app-2026` | en, fr, x-default | symétrique | ✅ correct |
| `/blog/meilleures-apps-mac-claude-code-2026` | fr, x-default | **manque hreflang=en** | 🟠 ASYMÉTRIQUE — l'EN pointe pourtant vers ce FR |
| `/blog/best-mac-apps-claude-code-2026` | en, fr, x-default | OK côté EN | 🟠 ASYMÉTRIQUE — orphelin côté FR |
| `/blog/meilleures-apps-ia-mac-2026` | fr, x-default | **manque hreflang=en** | 🟠 ASYMÉTRIQUE — pourtant `/blog/best-mac-ai-apps-2026` existe |
| `/blog/best-mac-ai-apps-2026` | en, fr, x-default | OK côté EN | 🟠 ASYMÉTRIQUE — orphelin côté FR |

### 1.4 Security Headers

| Header | Value | Status |
|---|---|---|
| `Strict-Transport-Security` | absent | ❌ MISSING |
| `Content-Security-Policy` | absent | ❌ MISSING |
| `Permissions-Policy` | absent | ❌ MISSING |
| `X-Frame-Options` | absent | ❌ MISSING (CSP `frame-ancestors` suffirait) |
| `X-Content-Type-Options: nosniff` | présent | ✅ |
| `Referrer-Policy: strict-origin-when-cross-origin` | présent | ✅ |
| `Access-Control-Allow-Origin: *` | présent | ⚠️ très large — OK pour un site marketing public mais à scoper si jamais une API privée est servie depuis le même domaine |

### 1.5 Cache

- HTML : `Cache-Control: public, max-age=0, must-revalidate` — OK pour SPA (freshness immediate)
- Pas vérifié pour assets statiques (logo.png, og-image.png) — voir `seo google` quand quota PSI restoré

---

## 2. Content Quality (Homepage + Blog)

### 2.1 Homepage

- **Word count visible** : 2 521 mots (très bon pour une landing)
- **H1** : 1 (unique) — « NotchIA — L'encoche pense maintenant. »
- **Hiérarchie** : 1× H1, 11× H2, 21× H3 — clean
- **FAQ** : 10 questions visibles + 10 Q&A dans schema FAQPage (numérotation i18n key inconsistante : DOM `q1-q11` avec q8 supprimé, schema séquentiel)
- **Liens** : 38 total (31 internes, 2 externes seulement) — **manque outbound authority** pour E-E-A-T
- **Mobile viewport, theme-color, format-detection** : ✅ tous présents

### 2.2 Blog (8 articles)

| # | URL | Title | Desc | Words | H1 | Schema | Red flag |
|---|---|---|---|---|---|---|---|
| 1 | wise-owl-2-8-0 (FR) | 54 ✓ | 145 ✓ | 905 | ✓ | BlogPosting + Breadcrumb | FR-only OK pour release notes |
| 2 | meilleures-apps-mac-2026 (FR) | 56 ✓ | 151 ✓ | 2487 | ✓ | BlogPosting + ItemList + Breadcrumb | 🟠 **pas de FAQPage** |
| 3 | best-mac-apps-2026 (EN) | 56 ✓ | 150 ✓ | 2206 | ✓ | idem #2 | 🟠 **pas de FAQPage** |
| 4 | meilleure-app-encoche-macbook-2026 (FR) | 55 ✓ | 150 ✓ | 1450 | ✓ | + FAQPage ✓ | bio auteur absente |
| 5 | best-mac-notch-app-2026 (EN) | 50 ✓ | 147 ✓ | 1400 | ✓ | + FAQPage ✓ | bio auteur absente |
| 6 | meilleures-apps-mac-claude-code-2026 (FR) | 59 ✓ | 136 | 1149 | ✓ | BlogPosting + ItemList + Breadcrumb | 🟠 **pas de FAQPage**, hreflang asymétrique |
| 7 | best-mac-apps-claude-code-2026 (EN) | 52 ✓ | 130 | 1063 | ✓ | idem #6 | 🟠 **pas de FAQPage** |
| 8 | meilleures-apps-ia-mac-2026 (FR) | 56 ✓ | 135 | 1246 | ✓ | BlogPosting + ItemList + Breadcrumb | 🟠 **pas de FAQPage**, **pas de twin EN** |

**Points forts blog** :
- Métadonnées disciplinées : titles 50-59 chars, descriptions 130-151 chars (cibles SEO respectées).
- BlogPosting uniformes : author, publisher, datePublished, dateModified, inLanguage, image, mainEntityOfPage, wordCount tous présents.
- ItemList sur les listicles (bon pour citation par LLM).
- Structure answer-first avec bloc `.tldr` en intro.
- Densité de faits (1 stat / 150-200 mots) — cible GEO atteinte.

**Faiblesses récurrentes** :
- FAQPage schema absent sur 5 articles / 8 (les `<details>` Q&A sont visibles mais pas dans le JSON-LD).
- Aucune image illustrative dans le contenu (que le logo header).
- Bio auteur absente sur 6 articles / 8.
- 0 outbound vers Apple developer / Anthropic docs / MacStories — pas de chaîne de citations.
- `dateModified` toujours = `datePublished` → signal de fraîcheur affaibli.

---

## 3. On-Page SEO

| Élément | Homepage | Blog (moyenne) |
|---|---|---|
| Title | « NotchIA — L'encoche pense maintenant. » (37 chars) ✓ | 50-59 chars ✓ |
| Meta description | 159 chars ✓ | 130-151 chars ✓ |
| Canonical | ✓ | ✓ |
| OG (title/desc/image/url/type/site_name/locale) | ✓ tous | ✓ tous |
| Twitter Card | summary_large_image ✓ | ✓ |
| OG image | 1200×630, alt fournie ✓ | ✓ |
| Theme-color (dark/light) | ✓ | ✓ |
| `<html lang>` | fr ✓ | fr ou en selon page ✓ |

---

## 4. Schema / Structured Data

### 4.1 Homepage @graph (6 nodes)

```
Organization (@id #organization)
  name, url, logo (ImageObject 1254×1254), foundingDate=2026,
  founder (→ Person), email, slogan, description,
  knowsAbout [11 items], areaServed=Worldwide, contactPoint

Person (@id #axel)
  name=Axel Courty, jobTitle=Indie macOS developer,
  worksFor (→ Org), address (Paris, FR)

SoftwareApplication (@id #app)
  name, alternateName ['Notch IA', 'NotchAI'],
  description, url, image, screenshot,
  applicationCategory [3 items], applicationSubCategory=MenuBarApp,
  operatingSystem=macOS 15.0+, processorRequirements,
  softwareVersion=2.8.0, releaseNotes, datePublished=2026-04-12,
  dateModified=2026-05-06, inLanguage [fr,en,de,es],
  fileSize=47MB, downloadUrl, installUrl,
  author (→ Person), publisher (→ Org),
  featureList [détaillé], offers [3 offers]

FAQPage (@id #faq)
  mainEntity [10 Question/Answer]

BreadcrumbList (@id #breadcrumb)

WebSite
  name, url, description, publisher (→ Org),
  inLanguage [fr-FR, en-US, es-ES, de-DE]
```

**Validation** : structure Schema.org valide, références `@id` correctement reliées, pas de champ orphelin. Le @graph est l'un des meilleurs vus sur un site indie macOS.

**Anomalies mineures** :
- `SoftwareApplication.fileSize` = "47MB" mais le brief produit dit "~30 Mo" et les pages d'install disent "~12 Mo (DMG)" → harmoniser.
- `WebSite.inLanguage` déclare 4 langues, mais le contenu HTML est servi uniquement en français → incohérent.
- `FAQPage.mainEntity[1]` : « Quelle version de macOS est requise pour NotchIA ? » (suffix « pour NotchIA » ajouté) ne matche pas le DOM « Quelle version de macOS est requise ? ». Mineur mais à aligner.

### 4.2 Blog Schema

- Tous les posts ont BlogPosting + BreadcrumbList ✓
- Listicles ont ItemList ✓ avec `position` et URLs sortants
- 5 posts manquent FAQPage alors que les Q&A sont visibles
- 0 post n'utilise HowTo (✅ correct — HowTo deprecated depuis sept 2023)

---

## 5. Performance (CWV)

⚠️ **Données absentes** : PageSpeed Insights API quota partagé épuisé (429 RESOURCE_EXHAUSTED). À re-run avec une clé Google gratuite (cf. ACTION-PLAN §P3.1).

Estimations qualitatives sans mesure :
- HTML homepage : 253 KB (gros pour 1 fichier, mais c'est tout — Tailwind via CDN, pas de bundle build)
- 18 `<link>` tags (fonts preconnect, favicons, manifest, hreflang...)
- 7 `<script>` blocks
- Pas d'image au-dessus de la ligne de flottaison (LCP = probablement le titre H1 SVG)
- Cloudflare CDN partout (cache hit serait optimal mais HTML est `max-age=0`)

---

## 6. Images

- 3 `<img>` total sur la homepage (toutes `logo.png` à différentes tailles)
- 3/3 ont `alt=""` (techniquement correct pour images décoratives — le texte « NotchIA » est adjacent)
- Pas de WebP/AVIF servis (vérifier dans le rapport PSI quand restauré)
- og-image.png présent (1200×630) avec alt-text dans OG meta ✓
- Pas d'image illustrative dans les blog posts (manqué)
- Pas de Schema ImageObject dans les blog posts

---

## 7. AI Search Readiness (GEO)

| Signal | État |
|---|---|
| robots.txt déclare AI bots `Allow: /` | ✅ (côté site) |
| robots.txt Cloudflare Managed Content déclare AI bots `Disallow: /` | 🚨 conflit, prepend |
| Cloudflare WAF répond 403 à GPTBot/ClaudeBot/PerplexityBot/CCBot/OAI-SearchBot | 🚨 **bloquant** |
| llms.txt présent et excellent | ✅ |
| llms-full.txt présent | ✅ |
| @graph Schema.org complet | ✅ |
| FAQPage schema homepage (10 Q&A) | ✅ |
| FAQPage schema blog | ⚠️ 3/8 seulement |
| Structure answer-first (TL;DR) sur les listicles | ✅ |
| Stats/200 mots ≥ 1 | ✅ |
| E-E-A-T : auteur visible | ✅ partout |
| E-E-A-T : bio auteur | ⚠️ 2/8 blog posts |
| E-E-A-T : date publication + mise à jour | ✅ visible, ⚠️ mais date_modified = date_published |
| Outbound authority citations | ❌ quasi absent |
| Hreflang multilingue valide | ❌ faux sur `/` et `/install`, asymétrique sur 4 blog posts |
| Brand mention signals (Wikipedia, GitHub stars, news, podcasts) | hors scope on-site, mais llms.txt liste GitHub releases |

**Score AI Search Readiness : 25 / 100** — l'ensemble du travail GEO on-page (excellent) est **annulé par le blocage Cloudflare WAF**. Sans correction de ce point, le contenu n'arrivera jamais aux modèles.

---

## 8. Notes diverses

- `account.html` existe localement mais pas dans le sitemap — voulu ou oubli ?
- Sitemap inclut des ancres `#ia`, `#medias`... — inhabituel, Google les ignore mais bloat l'XML
- `marketing/` et `scripts/` répertoires locaux — à vérifier qu'ils ne sont pas déployés publiquement (script indexnow.sh devrait rester serveur-side)
- `f59d5c27ad39419c97195b2f973cd75f.txt` = clé de validation IndexNow ✓ (cohérent avec CLAUDE.md)

---

Voir **ACTION-PLAN.md** pour les correctifs priorisés.
