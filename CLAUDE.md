# NotchIA — Conventions de développement

Site marketing single-page, statique, déployable sur n'importe quel CDN.

## GEO Conventions (Generative Engine Optimization)

Le site est optimisé pour être cité comme source par les LLM (ChatGPT, Claude, Perplexity, Gemini).

### Règles à respecter

- **Structure Answer-First** : les premiers mots de chaque section répondent directement à la question implicite du H2.
- **Une stat ou un fait précis tous les 150-200 mots** quand c'est pertinent (ex: "10 états IA", "47 Mo", "macOS 14+").
- **Citations sourcées** : si une affirmation est non-évidente, ajouter le contexte vérifiable (date, version, lien officiel).
- **FAQ visible + FAQPage schema** : chaque question dans le JSON-LD doit avoir un `<details>` correspondant.
- **Schema.org en `@graph`** : Organization, SoftwareApplication, Person, FAQPage, BreadcrumbList, WebSite — un seul `<script type="application/ld+json">` les regroupe.
- **llms.txt + llms-full.txt** : à la racine, mis à jour à chaque ajout majeur.
- **Bots IA autorisés** dans `robots.txt` : GPTBot, ChatGPT-User, OAI-SearchBot, ClaudeBot, anthropic-ai, PerplexityBot, Google-Extended, Amazonbot, Applebot-Extended, Bytespider, CCBot, cohere-ai, Meta-ExternalAgent.
- **Hreflang complet** : fr, en, es, de + x-default obligatoire.
- **Jamais de keyword stuffing**, jamais de citation inventée.
- **E-E-A-T visible** : auteur (Axel Courty), date de mise à jour, contact email.

### IndexNow

- Clé : `f59d5c27ad39419c97195b2f973cd75f`
- Fichier de validation : `f59d5c27ad39419c97195b2f973cd75f.txt`
- Script : `scripts/indexnow.sh` — à lancer après chaque déploiement.

### Vérifications avant deploy

```bash
# 1. Robots.txt accessible aux bots IA
curl -A "GPTBot" https://notchia.app/ | head
curl https://notchia.app/robots.txt | grep "GPTBot"

# 2. llms.txt présent et valide
curl https://notchia.app/llms.txt | head

# 3. Schema valide (utiliser le test Google)
# https://search.google.com/test/rich-results?url=https://notchia.app/

# 4. IndexNow ping post-deploy
./scripts/indexnow.sh
```

## Architecture du site

- **Single HTML file** : `index.html` (~1900 lignes)
- **Tailwind via CDN** (pas de build step)
- **Polices Google Fonts** : Fraunces (display), Instrument Sans (body), JetBrains Mono (code/labels)
- **i18n** : système data-i18n inline avec dictionnaire JS pour 4 langues (FR/EN/ES/DE), détection via `navigator.language` + sélecteur manuel
- **Pas de JavaScript framework** : vanilla JS pour marquee, reveal-on-scroll, language switcher

## Identité visuelle

- **Palette gradient brand** : violet `#A855F7` → magenta `#FF4D88` → orange `#FF7A2D` → cyan `#4DA8FF`
- **Base** : ink `#0B0D12`, cream `#EDE8DC`
- **Le mot « pense » du hero** : SVG inline (pas span avec background-clip:text — bug de descender italique)

## Fichiers à mettre à jour ensemble

Si tu changes une feature majeure de l'app :

1. `index.html` — section visible
2. `index.html` `<script type="application/ld+json">` — featureList du SoftwareApplication
3. `index.html` FAQ section + FAQPage schema (si nouvelle question)
4. `llms.txt` — résumé pour les LLM
5. `sitemap.xml` — `<lastmod>` mis à jour
6. `./scripts/indexnow.sh` — relancer après déploiement

## Conventions Edit/Write

- Ne jamais utiliser `display: inline-block` sur les `.grad-text` dans les `<p>` (casse le wrap multi-ligne).
- Pour les titres (h1, h2, h3) avec `.grad-text` italique, utiliser le selecteur scopé `h1 span.grad-text` etc. avec padding-bottom pour protéger les descenders.
- Les SVG inline pour les mots gradient sont préférés aux spans avec background-clip quand le glyphe a une descente complexe (italique 'p', 'g').
- Tous les chemins d'assets sont **relatifs** (pas `/logo.png` mais `logo.png`) pour fonctionner en `file://` ET en serveur.

## RÈGLE i18n CRITIQUE — synchronisation systématique

**À chaque ajout ou modification de texte visible**, mettre à jour **les 4 langues** (FR, EN, ES, DE) en même temps :

1. Ajouter `data-i18n="key.path"` (ou `data-i18n-html` si HTML) sur l'élément
2. Ajouter la clé dans le dictionnaire `I18N.fr` (texte source)
3. **Ajouter immédiatement** la traduction dans `I18N.en`, `I18N.es`, `I18N.de`
4. Si le texte apparaît aussi dans `llms.txt`, JSON-LD schema, OG image SVG, mettre à jour ces sources aussi
5. Tester : `applyLang('en')` puis `applyLang('es')` puis `applyLang('de')` doit changer toutes les chaînes

**Conventions de nommage des clés** :
- `nav.*` — navigation
- `hero.*` — héro
- `price.{essential,monthly,lifetime_pro}.{name,tag,subtitle,b1..b10,cta,...}` — tarification
- `faq.{eyebrow,title1,title2,q1..q8,a1..a8}` — FAQ
- `cta.*` — CTAs finales
- `footer.*` — footer
- `trust.*` — bandeau de confiance
- `meta.description` — meta description (mise à jour dans `<head>` aussi)

**Ce qui n'a PAS besoin de traduction** :
- Code mock (logs, états IA, tracks musique, calendrier-data) — restent en français car ce sont des démonstrations techniques
- Code style (`font-mono`) avec contenu de type chemin/commande
- Marques propres (NotchIA, Claude Code, Spotify, etc.)
- Symboles et chiffres purs

**Ne jamais commit / déployer** sans vérifier que les 4 langues s'affichent correctement via le sélecteur.
