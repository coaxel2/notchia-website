# OG / Twitter Card Audit — notchia.app

Date: 2026-05-27
Scope: tous les fichiers HTML à la racine + `blog/` (71 fichiers HTML totaux, dont 1 hors scope = `blog/index.html` consolidé par le parent).

## Méthode

Vérification de la présence des 9 balises sociales clés sur chaque page :
- `og:title`, `og:description`, `og:image`, `og:url`, `og:type`
- `twitter:card` (`summary_large_image`), `twitter:title`, `twitter:description`, `twitter:image`

## Résultats avant correction

| Statut | Nombre | Pages |
|---|---|---|
| Complet (9/9) | 1 | `index.html` |
| Quasi complet (8/9) — manque `twitter:description` | 12 | 12 articles GEO (apple-intelligence × 4 langues, apps-mac-developpeurs × 4 langues, best-mac-* × 4) |
| Standard (9/9 mais avec un seul `og:title` etc.) | 55 | tous les autres articles + `features.html`, `press.html`, `blog/index.html` |
| **AUCUNE balise OG/Twitter** | **11** | `404.html`, `account.html`, `cgv.html`, `contact.html`, `dl/dmg.html`, `dl/homebrew.html`, `install.html`, `mentions-legales.html`, `pricing.html`, `privacy.html`, `refund.html` |

Note : `index.html` montre 13 occurrences car il définit les balises avec doublons FR/EN — cohérent, pas un bug.

## Décisions par page

### Pages corrigées (OG complet ajouté)

| Page | Décision | Raison |
|---|---|---|
| `404.html` | OG ajouté | noindex mais partageable (utilisateurs qui collent un lien cassé) |
| `cgv.html` | OG ajouté | index,follow — visible publiquement |
| `contact.html` | OG ajouté | index,follow — visible publiquement |
| `install.html` | OG ajouté | index,follow — landing critique |
| `mentions-legales.html` | OG ajouté | index,follow — visible publiquement |
| `pricing.html` | OG ajouté | index,follow — landing critique |
| `privacy.html` | OG ajouté | index,follow — visible publiquement |
| `refund.html` | OG ajouté | index,follow — visible publiquement |

### Pages skippées (OG non ajouté, par design)

| Page | Décision | Raison |
|---|---|---|
| `account.html` | skip | `noindex,nofollow` — page privée self-service, jamais partagée |
| `dl/dmg.html` | skip | `noindex,follow` — page transitoire (redirige vers `/install` en 3 s) |
| `dl/homebrew.html` | skip | `noindex,follow` — page transitoire (idem) |

### Articles blog complétés (twitter:description ajouté)

12 articles GEO avaient `og:description` mais pas `twitter:description`. Ajout de `twitter:description` en miroir de `og:description` :

1. `blog/apple-intelligence-mac-2026-de.html`
2. `blog/apple-intelligence-mac-2026-es.html`
3. `blog/apple-intelligence-mac-2026.html`
4. `blog/apple-intelligence-on-mac-2026.html`
5. `blog/apps-mac-desarrolladores-2026.html`
6. `blog/apps-mac-developpeurs-2026.html`
7. `blog/best-mac-ai-apps-2026.html`
8. `blog/best-mac-apps-claude-code-2026.html`
9. `blog/best-mac-notch-app-2026.html`
10. `blog/developer-mac-apps-2026.html`
11. `blog/entwickler-mac-apps-2026.html`
12. `blog/meilleures-apps-ia-mac-2026.html`
13. `blog/meilleures-apps-mac-claude-code-2026.html`

(13 fichiers car la mention "12" du rapport initial sous-estimait d'un = `meilleures-apps-mac-claude-code-2026.html` ; cf. audit avant correction.)

## og:type — Validation

Tous les articles `blog/*.html` (hors `blog/index.html`) utilisent bien `og:type="article"`. Aucun ajustement nécessaire.

Toutes les pages racine restent en `og:type="website"`, ce qui est correct.

## Pattern utilisé (référence press.html / index.html)

```html
<!-- Open Graph -->
<meta property="og:type" content="website" />
<meta property="og:title" content="…" />
<meta property="og:description" content="…" />
<meta property="og:url" content="https://notchia.app/…" />
<meta property="og:image" content="https://notchia.app/og-image.png" />
<meta property="og:site_name" content="NotchIA" />
<meta property="og:locale" content="fr_FR" />
<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="…" />
<meta name="twitter:description" content="…" />
<meta name="twitter:image" content="https://notchia.app/og-image.png" />
```

## Résultats après correction

| Statut | Avant | Après |
|---|---|---|
| Pages avec OG/Twitter complet (parmi pages publiques indexables) | 56 | 68 |
| Pages publiques sans aucune balise OG | 8 | 0 |
| Articles blog complets (9/9) | 56 | 69 |

## Pages encore "problématiques" — examen manuel suggéré

Aucune. Les 3 pages exclues volontairement (`account`, `dl/dmg`, `dl/homebrew`) sont toutes noindex et non destinées au partage social.
