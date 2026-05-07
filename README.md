# NotchIA — Site web

Landing page statique, single-file, prête à déployer.

## Structure

```
notchia-website/
├── index.html              # Page complète (Tailwind via CDN, polices Google)
├── favicon.svg             # Favicon vectoriel (recommandé)
├── favicon.png             # Favicon raster 192×192 (fallback)
├── apple-touch-icon.png    # 180×180 pour iOS / Safari
├── og-image.png            # 1200×630 — Open Graph + Twitter Card
├── og-image.svg            # Source vectorielle de l'OG
├── site.webmanifest        # Manifest PWA
├── robots.txt              # Règles d'indexation
├── sitemap.xml             # Sitemap pour Google Search Console
└── README.md               # Ce fichier
```

## Avant de mettre en ligne

### 1. Remplacer le domaine

Le domaine `https://notchia.app/` est utilisé partout. Si tu déploies ailleurs,
remplace-le dans :

```bash
sed -i '' 's|https://notchia.app|https://ton-domaine.com|g' \
  index.html sitemap.xml robots.txt
```

### 2. Brancher le téléchargement

Dans `index.html`, les boutons « Télécharger » pointent sur `#telecharger` ou `#`.
Remplace-les par l'URL de ton `.dmg` signé.

```bash
# Cherche les liens à brancher
grep -n 'href="#"' index.html
```

### 3. Activer Google Analytics 4

Le snippet GA4 est déjà inclus, **commenté**, dans `<head>`. Pour l'activer :

1. Crée une propriété GA4 → récupère ton **Measurement ID** (format `G-XXXXXXXXXX`)
2. Dans `index.html`, retire les balises de commentaire `<!-- ... -->` autour du bloc GA
3. Remplace les deux occurrences de `G-XXXXXXXXXX` par ton ID
4. Le bloc inclut déjà `gtag('consent', 'default', { ...denied })` → conforme RGPD,
   aucun cookie n'est posé avant consentement utilisateur

```html
<!-- Avant -->
<!--
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
...
-->

<!-- Après -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-ABC123XYZ"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('consent', 'default', { ... });
  gtag('config', 'G-ABC123XYZ', { anonymize_ip: true });
</script>
```

Pour passer en mode "consenti" après acceptation :

```js
gtag('consent', 'update', {
  analytics_storage: 'granted'
});
```

### Alternative : Plausible (sans cookies)

Si tu veux éviter le bandeau cookies, décommente la ligne Plausible en bas du `<head>` :

```html
<script defer data-domain="notchia.app" src="https://plausible.io/js/script.js"></script>
```

Plausible ne pose pas de cookie, ne collecte aucune donnée personnelle → pas de bandeau requis.

### 4. Soumettre à Google Search Console

1. Vérifie le domaine via balise meta ou enregistrement DNS
2. Soumets `https://notchia.app/sitemap.xml`
3. Attends 24-48 h pour la première indexation

### 5. Vérifier l'OG (Open Graph)

- Facebook : <https://developers.facebook.com/tools/debug/>
- Twitter / X : <https://cards-dev.twitter.com/validator>
- LinkedIn : <https://www.linkedin.com/post-inspector/>

L'image OG est en `1200×630` (ratio 1.91:1, recommandé).

## Déploiement

### Vercel / Netlify (recommandé)

```bash
# Vercel
npx vercel --prod

# Netlify
npx netlify deploy --prod --dir .
```

### Cloudflare Pages

Pousse le dossier sur GitHub, connecte le repo dans Cloudflare Pages,
build command : (vide), output dir : `.`

### Serveur statique simple

```bash
python3 -m http.server 8000
# ou
npx serve .
```

## Tester localement

```bash
cd /Users/axel/notchia-website
python3 -m http.server 8765
open http://localhost:8765
```

## Performance attendue

Lighthouse devrait afficher :
- **Performance** : 95+ (Tailwind CDN coûte ~30 ko gzip, polices ~50 ko)
- **Accessibilité** : 100 (skip link, ARIA, focus visible, prefers-reduced-motion)
- **SEO** : 100 (meta complètes, structured data, canonical)
- **Best practices** : 100

### Optimisations possibles

- Compiler Tailwind en local (CLI ou PostCSS) → -25 ko sur le bundle
- Self-host les polices Google → -1 requête tierce
- Servir avec compression Brotli → -60 % sur le poids HTML

## Maintenance

- Mettre à jour le `<lastmod>` dans `sitemap.xml` à chaque changement majeur
- Mettre à jour le numéro de version dans la nav et le footer
- Re-générer `og-image.png` si la marque évolue :

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --hide-scrollbars \
  --window-size=1200,630 \
  --screenshot=og-image.png \
  "file://$PWD/og-image.svg"
```
