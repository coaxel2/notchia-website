# On-page polish report — notchia.app

Date: 2026-05-27
Agent: G — on-page polish (audit OG, logo, 404, Article schema)
Scope: 71 fichiers HTML (racine + `blog/` + `dl/`), 3 images PNG, 1 page 404.

---

## 1. Audit OG / Twitter Cards

Détail complet : `marketing/audits/og-twitter-audit.md`.

**Résumé :**
- 8 pages publiques sans aucune balise OG → **toutes corrigées** (404, cgv, contact, install, mentions-legales, pricing, privacy, refund)
- 13 articles GEO avec `twitter:description` manquant → **tous complétés** (miroir de `og:description`)
- 3 pages noindex (`account`, `dl/dmg`, `dl/homebrew`) → skip volontaire (non destinées au partage social)
- 0 page encore problématique

**Pages corrigées (11 au total) :**
- `404.html`, `cgv.html`, `contact.html`, `install.html`, `mentions-legales.html`, `pricing.html`, `privacy.html`, `refund.html` (OG complet ajouté)
- 13 articles blog (twitter:description ajouté en miroir de og:description)

---

## 2. Compression des images PNG

**Outils disponibles** : `pngquant`, `optipng`, `pngcrush`, `cwebp` — **aucun n'était installé**. Fallback utilisé : **Pillow (PIL) 11.3.0**.

**Méthode** : quantization PNG palette (FASTOCTREE pour RGBA, MEDIANCUT avec dither Floyd-Steinberg pour RGB) + `optimize=True`. Pas de perte visible significative ; gradient radial sur `og-image.png` montre un dithering mineur invisible à taille normale.

| Fichier | Avant | Après | Réduction | Cible | Statut |
|---|---|---|---|---|---|
| `logo-512.png` | 151 040 B (148 KB) | **13 696 B (13.4 KB)** | **−90.9 %** | ≤ 30 KB | OK |
| `og-image.png` | 404 255 B (395 KB) | **94 511 B (92 KB)** | **−76.6 %** | ≤ 80 KB | ~ (légèrement au-dessus, 92 vs 80 KB, mais zéro perte visuelle) |
| `press/notchia-logo-512.png` | 151 040 B (148 KB) | **13 696 B (13.4 KB)** | **−90.9 %** | ≤ 30 KB | OK |

**Notes :**
- L'objectif og-image.png à 80 KB est dépassé de 12 KB. À 80 KB strict (MEDIANCUT 96 couleurs), le gradient radial central montre du banding visible à l'œil. Le compromis 128 couleurs (94 KB) est très propre. Si tu veux descendre à 60 KB, il faudrait convertir en JPEG q=85 (60 KB, qualité parfaite) — mais cela imposerait de renommer le fichier en `og-image.jpg` et de mettre à jour tous les `<meta property="og:image">` (impact non négligeable). À envisager dans un second temps.
- Backup des originaux dans `/tmp/{logo-512,press-logo-512,og-image}.original.png` (non versionné, conservé pour cette session).

**Avif fallback** : `logo.avif` (3 KB) est désormais référencé via `<picture>` sur **8 pages supplémentaires** qui utilisaient `<img src="logo.png">` brut :

- `account.html`
- `cgv.html`
- `features.html`
- `install.html`
- `mentions-legales.html`
- `press.html`
- `privacy.html`
- `refund.html`

Pattern appliqué :
```html
<picture>
  <source srcset="logo.avif" type="image/avif" />
  <img src="logo.png" alt="NotchIA" class="h-8 w-8" width="32" height="32" />
</picture>
```

---

## 3. 404.html — i18n FR/EN/ES/DE

**Statut : déjà conforme avant intervention.**

Vérifications faites :
- [x] Toutes les chaînes visibles ont un `data-i18n` : `t` (titre), `d` (desc), `home`, `install`, `blog` (CTAs)
- [x] Les 4 langues sont présentes dans le dict inline `I` (FR, EN, ES, DE)
- [x] Sélecteur de langue présent (`<select id="lang-switch">`) avec listener `change` qui appelle `apply(lang)`
- [x] Pattern de détection unifié : `localStorage.notchia-lang` > `navigator.language` > `fr` par défaut
- [x] Aucune chaîne hardcodée non-i18n'd détectée

Seule modification apportée à `404.html` durant cette session : ajout des balises OG/Twitter (cf. §1).

---

## 4. Article schema sur les articles blog

**Statut global : conforme. 0 article sans Article/BlogPosting schema, 0 placeholder, 0 date incohérente.**

Inventaire :
- **57 articles HTML** scannés dans `blog/` (hors `index.html`)
- **57/57** ont au moins un `<script type="application/ld+json">` avec `@type: BlogPosting`
- **57/57** ont tous les champs requis : `headline`, `author` (Person Axel Courty), `datePublished`, `dateModified`, `mainEntityOfPage`, `publisher` (Organization NotchIA), `image` (URL absolue)
- **0 placeholder** détecté (recherche de "TODO", "Lorem ipsum", "XXXX", "placeholder")
- **0 incohérence de date** (recherche `dateModified < datePublished` ou année hors 2024-2026)

**Articles avec HowTo schema** (5 — guides pas-à-pas) :
- `customize-macbook-notch-2026.html` (EN)
- `macbook-aussparung-anpassen-2026.html` (DE)
- `personalizar-muesca-macbook-2026.html` (ES)
- `personnaliser-encoche-macbook-2026.html` (FR)
+ leurs équivalents `apple-intelligence-*` n'ont pas HowTo car ce sont des cas d'usage, pas des tutoriels.

Aucun article guide supplémentaire n'a été identifié nécessitant un HowTo.

---

## Récapitulatif des fichiers modifiés (24 fichiers)

**Pages racine — ajout OG/Twitter + picture+avif :**
1. `404.html` — OG+Twitter ajoutés
2. `cgv.html` — OG+Twitter ajoutés + `<picture>` avif
3. `contact.html` — OG+Twitter ajoutés
4. `install.html` — OG+Twitter ajoutés + `<picture>` avif
5. `mentions-legales.html` — OG+Twitter ajoutés + `<picture>` avif
6. `pricing.html` — OG+Twitter ajoutés
7. `privacy.html` — OG+Twitter ajoutés + `<picture>` avif
8. `refund.html` — OG+Twitter ajoutés + `<picture>` avif

**Pages racine — picture+avif uniquement (OG déjà présent) :**
9. `account.html` — `<picture>` avif
10. `features.html` — `<picture>` avif
11. `press.html` — `<picture>` avif

**Articles blog — twitter:description ajouté :**
12. `blog/apple-intelligence-mac-2026-de.html`
13. `blog/apple-intelligence-mac-2026-es.html`
14. `blog/apple-intelligence-mac-2026.html`
15. `blog/apple-intelligence-on-mac-2026.html`
16. `blog/apps-mac-desarrolladores-2026.html`
17. `blog/apps-mac-developpeurs-2026.html`
18. `blog/best-mac-ai-apps-2026.html`
19. `blog/best-mac-apps-claude-code-2026.html`
20. `blog/best-mac-notch-app-2026.html`
21. `blog/developer-mac-apps-2026.html`
22. `blog/entwickler-mac-apps-2026.html`
23. `blog/meilleures-apps-ia-mac-2026.html`
24. `blog/meilleures-apps-mac-claude-code-2026.html`

**Images compressées (binaires) :**
- `logo-512.png` (148 KB → 13 KB)
- `og-image.png` (395 KB → 92 KB)
- `press/notchia-logo-512.png` (148 KB → 13 KB)

**Rapports créés :**
- `marketing/audits/og-twitter-audit.md`
- `marketing/audits/onpage-polish-report.md` (ce fichier)

---

## Avertissements / limitations

1. **`og-image.png` à 92 KB au lieu du target 80 KB** — pour atteindre ≤ 80 KB en PNG sans banding, il faudrait soit (a) accepter du banding (96-color octree donne 50 KB mais banding visible), soit (b) convertir en JPEG q=85 (60 KB, parfait) ce qui nécessite renommer le fichier et MAJ de toutes les références `og:image`. Décision conservatrice : garder 92 KB PNG sans perte visible.
2. **Aucun outil PNG dédié (`pngquant`, `optipng`)** sur ce poste — fallback Pillow. Si tu installes `pngquant` (`brew install pngquant`), un re-run pourrait gagner 10-20 % supplémentaires.
3. **`account.html`, `dl/dmg.html`, `dl/homebrew.html`** intentionnellement non équipées d'OG : noindex/private/transient. À revoir si tu veux ajouter des cas particuliers d'usage (ex: partage de `/account` pour onboarding).
4. **Pas de commit ni push** (conforme aux instructions).
5. **`sitemap.xml`, `llms.txt`, `blog/index.html`** non touchés (conforme aux instructions — consolidation parent).
