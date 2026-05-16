# NotchIA — SEO Action Plan

**Source** : `FULL-AUDIT-REPORT.md` (2026-05-16)

Priorités : **P0 = Critical** (à corriger immédiatement, bloque indexation/GEO) · **P1 = High** (≤ 1 semaine) · **P2 = Medium** (≤ 1 mois) · **P3 = Low** (backlog)

---

## P0 — CRITICAL

### P0.1 — Débloquer les bots IA dans Cloudflare WAF
**Issue** : GPTBot, ClaudeBot, PerplexityBot, CCBot, OAI-SearchBot reçoivent 403. Toute la stratégie « être cité par les LLM » est cassée.

**Where** : Cloudflare dashboard → notchia.app → Security → Bots → Super Bot Fight Mode

**Actions** :
1. Désactiver « Block AI Scrapers and Crawlers » (toggle Off), OU
2. Garder le toggle mais ajouter une WAF Custom Rule **Skip** : `(http.user_agent contains "GPTBot" or http.user_agent contains "ClaudeBot" or http.user_agent contains "PerplexityBot" or http.user_agent contains "CCBot" or http.user_agent contains "OAI-SearchBot" or http.user_agent contains "anthropic-ai" or http.user_agent contains "ChatGPT-User" or http.user_agent contains "Perplexity-User" or http.user_agent contains "Bytespider" or http.user_agent contains "cohere-ai" or http.user_agent contains "Meta-ExternalAgent" or http.user_agent contains "FacebookBot" or http.user_agent contains "DuckAssistBot" or http.user_agent contains "YouBot")` → Action: Skip All

**Vérification** (5 minutes après) :
```bash
for ua in "GPTBot/1.2" "ClaudeBot/1.0" "PerplexityBot/1.0" "CCBot/2.0" "OAI-SearchBot/1.0"; do
  echo "$ua: $(curl -sS -o /dev/null -w '%{http_code}' -A "Mozilla/5.0 (compatible; $ua; +https://example.com)" https://notchia.app/)"
done
```
Toutes les lignes doivent passer en 200.

**Effort** : 10 min · **Impact** : massive (débloque le GEO)

### P0.2 — Régler le conflit robots.txt Cloudflare Managed Content
**Issue** : Cloudflare prepend un bloc « Content-Signal » qui déclare `Disallow: /` pour 9 user-agents IA AVANT votre config custom. Bots qui respectent first-match l'ignoreront.

**Where** : Cloudflare dashboard → notchia.app → Crawl Control (ou Settings → Scrape Shield, selon la nouvelle UI)

**Actions** :
- Désactiver « AI Audit / Content Signals » qui injecte automatiquement le préfixe
- OU passer en « Custom robots.txt only » et confirmer que votre `robots.txt` de repo est servi sans modification

**Vérification** :
```bash
curl -sS https://notchia.app/robots.txt | head -5
# Doit commencer par "# NotchIA — robots.txt" et non par "# As a condition of accessing..."
```

**Effort** : 5 min · **Impact** : haut

### P0.3 — Servir un vrai 404 (HTTP 404, pas 200)
**Issue** : `/non-existent-foo` → HTTP 200 avec homepage. Tout URL inventé est indexable comme duplicate.

**Where** : Cloudflare Pages settings (ou `wrangler.toml` / `_redirects` dans le repo)

**Actions** : créer/éditer à la racine du repo :

`_redirects` :
```
# Routes statiques explicites
/install     /install.html    200
/features    /features.html   200
/pricing     /pricing.html    200
/refund      /refund.html     200
/privacy     /privacy.html    200
/cgv         /cgv.html        200
/mentions-legales  /mentions-legales.html  200
/blog/*      /blog/:splat.html  200

# Catch-all : 404 explicite
/*           /404.html        404
```

Et créer `404.html` (page minimale en 4 langues avec lien retour homepage). Référencer les sections existantes (`#ia`, `#medias`, etc.) comme jumpoffs.

**Vérification** :
```bash
curl -sS -o /dev/null -w "%{http_code}\n" https://notchia.app/non-existent-foo
# Doit retourner 404
```

**Effort** : 30 min · **Impact** : haut (stoppe soft-404 cascade)

### P0.4 — Retirer le hreflang factice sur `/` et `/install`
**Issue** : 6 alternates pointent vers la même URL servie en français. Google traite comme duplicate / cloaking signal.

**Files** : `/Users/axel/notchia-website/index.html` (head) + `/Users/axel/notchia-website/install.html` (head) + `sitemap.xml`

**Actions index.html** — supprimer ces 5 lignes :
```html
<link rel="alternate" hreflang="fr-FR" href="https://notchia.app/" />
<link rel="alternate" hreflang="en" href="https://notchia.app/" />
<link rel="alternate" hreflang="en-US" href="https://notchia.app/" />
<link rel="alternate" hreflang="es" href="https://notchia.app/" />
<link rel="alternate" hreflang="de" href="https://notchia.app/" />
```
Garder uniquement :
```html
<link rel="alternate" hreflang="fr" href="https://notchia.app/" />
<link rel="alternate" hreflang="x-default" href="https://notchia.app/" />
```

**Actions install.html** : même nettoyage (retirer en/es/de).

**Actions sitemap.xml** — pour les URLs `/` et `/install`, retirer les `<xhtml:link rel="alternate" hreflang="en"|"es"|"de" ...>`. Garder fr + x-default.

**Actions @graph schema** : dans `index.html` `SoftwareApplication.inLanguage` et `WebSite.inLanguage`, garder uniquement `["fr"]` (ou `["fr-FR"]`) car le contenu n'est servi qu'en français côté SEO. Le i18n JS reste, mais ne déclarez pas SEO ce que vous ne servez pas server-side.

**Effort** : 20 min · **Impact** : haut

---

## P1 — HIGH (≤ 1 semaine)

### P1.1 — Ajouter FAQPage schema aux 5 blog posts qui en manquent
**Issue** : les Q&A sont visibles dans le DOM mais absentes du JSON-LD, donc invisibles pour les rich results et la citation LLM.

**Files concernés** :
- `/Users/axel/notchia-website/blog/meilleures-apps-mac-2026.html`
- `/Users/axel/notchia-website/blog/best-mac-apps-2026.html`
- `/Users/axel/notchia-website/blog/meilleures-apps-mac-claude-code-2026.html`
- `/Users/axel/notchia-website/blog/best-mac-apps-claude-code-2026.html`
- `/Users/axel/notchia-website/blog/meilleures-apps-ia-mac-2026.html`

**Action** : pour chaque, ajouter un script `<script type="application/ld+json">` avec un FAQPage extrayant les Q&A visibles dans la section FAQ (textes exacts). Format :

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "...texte exact de la question...",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "...texte exact de la réponse..."
      }
    }
    // ...
  ]
}
```

**Note** : Google n'affiche plus les FAQ rich results pour les sites commerciaux depuis août 2023 (réservé gov/health), mais **les LLM (GPT, Claude, Perplexity) citent fortement** les contenus FAQ-schema'd. Conserver pour GEO.

**Effort** : 1-2 h · **Impact** : haut (gisement citation LLM)

### P1.2 — Corriger les 4 hreflang asymétriques blog
**Issue** : `/blog/meilleures-apps-mac-claude-code-2026` et `/blog/meilleures-apps-ia-mac-2026` ne pointent pas vers leurs twins EN, alors que les twins EN pointent bien vers eux. Google drop les clusters asymétriques.

**Actions** :

Dans `/Users/axel/notchia-website/blog/meilleures-apps-mac-claude-code-2026.html` head, ajouter :
```html
<link rel="alternate" hreflang="en" href="https://notchia.app/blog/best-mac-apps-claude-code-2026" />
```

Dans `/Users/axel/notchia-website/blog/meilleures-apps-ia-mac-2026.html` head, ajouter :
```html
<link rel="alternate" hreflang="en" href="https://notchia.app/blog/best-mac-ai-apps-2026" />
```

(Le `x-default` peut rester sur la FR.)

**Effort** : 5 min · **Impact** : haut

### P1.3 — Créer la twin EN de `meilleures-apps-ia-mac-2026`
**Issue** : « best AI apps mac 2026 » est l'une des queries GEO les plus volumineuses possible — pas de version EN = territoire abandonné.

**File** : `/Users/axel/notchia-website/blog/best-mac-ai-apps-2026.html` existe déjà (vérifié, sitemap le liste). À vérifier qu'il contient vraiment du contenu EN différent et pas un placeholder.

**Action** : lire le fichier, si c'est un placeholder ou un copy-paste FR, écrire la vraie version EN. Ajouter hreflang bidirectionnel avec la FR.

**Effort** : 1-3 h (selon état actuel) · **Impact** : haut

### P1.4 — Ajouter les security headers via `_headers` Cloudflare Pages
**File** : créer `/Users/axel/notchia-website/_headers`

```
/*
  Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.tailwindcss.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https:; connect-src 'self' https:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'
  X-Frame-Options: DENY
  Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
```

⚠️ Tester la CSP en mode `Content-Security-Policy-Report-Only` d'abord pendant 48h (Tailwind CDN + Google Fonts ont des règles précises) avant de basculer en CSP stricte. Adapter si vous ajoutez analytics, Plausible, etc.

**Effort** : 30 min + 48 h monitoring · **Impact** : moyen-haut (Lighthouse Best Practices +5-10 pts, HSTS protège HTTPS)

### P1.5 — Ajouter bio auteur sur les 6 blog posts qui en manquent
**Issue** : E-E-A-T faible — l'auteur est mentionné mais pas qualifié.

**Action** : créer un partial HTML réutilisable « À propos de l'auteur » avec :
- Photo (ou avatar SVG)
- Nom + titre (« Indie macOS developer, créateur de NotchIA, Paris »)
- Lien vers /about ou vers GitHub/LinkedIn d'Axel
- Date de la dernière mise à jour de l'article

L'insérer en bas de chaque blog post (juste avant le footer). Bonus : déclarer le `Person` dans le JSON-LD `BlogPosting.author` avec `sameAs: [linkedin_url, github_url]`.

**Effort** : 1-2 h · **Impact** : moyen-haut

---

## P2 — MEDIUM (≤ 1 mois)

### P2.1 — Ajouter 2-3 outbound authority citations par blog post
**Issue** : pas de chaîne de citations sortantes → les LLM ne reconnaissent pas la légitimité de la source.

**Action** : pour chaque listicle, ajouter dans la méthodologie ou les sections produits 2-3 liens vers :
- developer.apple.com (Foundation Models, Apple Intelligence, macOS docs)
- docs.anthropic.com (Claude Code)
- platform.openai.com (Codex)
- MacStories, The Sweet Setup (roundups de référence)
- GitHub releases des concurrents

Format : « Selon la doc officielle Apple [...] » avec lien — c'est ce qui fait la différence entre un blog cité et un blog ignoré.

**Effort** : 2 h pour les 8 posts · **Impact** : moyen

### P2.2 — Harmoniser `fileSize` SoftwareApplication
**Issue** : @graph homepage dit `fileSize: 47MB`, brief produit dit « ~30 Mo », page install dit « ~12 Mo (DMG) ».

**Action** : trancher la vraie valeur (vraisemblablement ~12-15 Mo pour le DMG, ~30-47 Mo extracted .app), aligner les 3 sources.

**Effort** : 15 min · **Impact** : bas (mais E-E-A-T : cohérence des faits)

### P2.3 — Aligner numérotation FAQ entre i18n keys et JSON-LD
**Issue** : DOM utilise `faq.q1` à `faq.q11` avec q8 supprimée. Schema FAQPage utilise q1-q10 séquentiel. Cosmétique mais source de bugs futurs.

**Action** : renuméroter les data-i18n `faq.q1` à `faq.q10` consécutifs, mettre à jour le dictionnaire I18N FR/EN/ES/DE. Ou inverse : aligner le schéma sur les keys actuelles. Choisir une convention et la documenter dans CLAUDE.md.

**Effort** : 30 min · **Impact** : bas

### P2.4 — Bumper `dateModified` à chaque édition (pas seulement le bigbang publication)
**Issue** : `dateModified = datePublished` sur tous les blog posts → signal de fraîcheur affaibli.

**Action** : convention git pré-commit ou simple discipline éditoriale : à chaque édition substantielle d'un post, bumper `dateModified` dans le JSON-LD + dans la signature visible « dernière mise à jour ». Ajouter une checkbox dans CLAUDE.md.

**Effort** : recurring · **Impact** : bas-moyen

### P2.5 — Retirer les ancres du sitemap
**Issue** : sitemap liste `/#ia`, `/#medias`, `/#agenda`... Google ignore les fragments — ces lignes bloat l'XML sans valeur SEO.

**Action** : éditer `sitemap.xml` pour retirer toutes les URLs avec `#`. Garder uniquement les vraies pages (16 → 7 URLs propres).

**Effort** : 5 min · **Impact** : bas (propreté du sitemap)

### P2.6 — Servir des images WebP/AVIF + `loading="lazy"`
**Issue** : `logo.png` servi en PNG, pas de format moderne. Pas critique vu la rareté des images, mais point Lighthouse facile.

**Action** : ajouter `logo.webp` (et fallback PNG via `<picture>`), idem `og-image.png` → garder PNG pour OG (OG ne supporte pas WebP partout) mais servir une variante WebP pour les usages on-page.

**Effort** : 30 min · **Impact** : bas

---

## P3 — LOW (backlog)

### P3.1 — Run PageSpeed Insights avec API key
**Action** :
1. Créer une clé API gratuite : https://console.cloud.google.com/apis/credentials → activer `pagespeedonline.googleapis.com`
2. Sauver dans `~/.config/seo/pagespeed.key` (ou env `GOOGLE_PSI_KEY`)
3. Re-run l'audit performance :
   ```bash
   KEY=$(cat ~/.config/seo/pagespeed.key)
   for url in "https://notchia.app/" "https://notchia.app/blog/meilleures-apps-mac-2026"; do
     for strat in mobile desktop; do
       curl -sS "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}&strategy=${strat}&key=${KEY}" > /tmp/psi_$(basename $url)_${strat}.json
     done
   done
   ```
4. Extraire scores LCP, INP (TBT proxy), CLS, FCP, TTFB par strat. Si CrUX field data absent (probable, domaine récent), le noter — visibilité réelle viendra après ~28 jours de trafic.

**Effort** : 15 min + setup · **Impact** : info

### P3.2 — Ajouter ImageObject schema aux blog posts dès qu'il y aura des images
**Action** : quand vous ajoutez la première image illustrative à un blog post, déclarer `ImageObject` avec `width`, `height`, `caption`, `creditText` dans `BlogPosting.image`. LLMs et Google Images valorisent ce niveau de détail.

**Effort** : 10 min/post quand applicable · **Impact** : bas

### P3.3 — Audit /account.html
**Action** : la page existe localement mais n'est pas dans le sitemap. Vérifier si c'est intentionnel (page privée, non-indexable) ou un oubli. Si privée : ajouter `<meta name="robots" content="noindex">`. Si publique : ajouter au sitemap.

**Effort** : 5 min · **Impact** : très bas

### P3.4 — Audit /marketing et /scripts (déployés ?)
**Action** : vérifier que ces dossiers ne sont pas exposés en https://notchia.app/marketing/ et https://notchia.app/scripts/ (risque fuite : prompts marketing, indexnow.sh script). Si exposés, ajouter à `.cloudflare-pages-ignore` ou `_redirects` rule pour 404 explicite.

**Effort** : 10 min · **Impact** : bas-moyen (sécurité)

---

## Récap timeline suggérée

**Aujourd'hui (1 h)** :
- P0.1 Cloudflare WAF (10 min)
- P0.2 Cloudflare robots.txt conflict (5 min)
- P0.4 Retirer hreflang factice (20 min)
- P1.2 Corriger hreflang asymétriques (5 min)
- Vérif post-deploy + IndexNow ping

**Cette semaine** :
- P0.3 Vraie page 404 (30 min)
- P1.1 FAQPage schema sur 5 posts (1-2 h)
- P1.4 Security headers `_headers` (30 min + monitoring)
- P1.5 Bio auteur sur 6 posts (1-2 h)
- P1.3 Audit + finalisation /blog/best-mac-ai-apps-2026 (1-3 h)

**Ce mois** :
- P2.1 Outbound citations sur tous les posts (2 h)
- P2.2 → P2.6 Harmonisations + nettoyage (~2 h cumulé)

**Backlog** :
- P3.1 → P3.4 dès qu'on a un créneau

Re-run `/seo audit https://notchia.app` après P0+P1 pour mesurer le delta (cible : score ≥ 85 / 100).
