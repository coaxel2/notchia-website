#!/usr/bin/env node
/**
 * Génère les versions statiques EN/ES/DE de index/features/pricing dans /en/ /es/ /de/.
 * Applique le dictionnaire I18N côté serveur (même sémantique que applyLang du site),
 * traduit le JSON-LD (FAQPage, descriptions), réécrit canonical/hreflang/og et les
 * chemins relatifs, et patche le JS embarqué (langue par défaut = celle de la page,
 * sélecteur = navigation entre versions, pas de persistance implicite).
 *
 * À RELANCER après toute modification de index.html, features.html ou pricing.html :
 *   cd /tmp/i18ngen && npm i jsdom@24 && cp <repo>/scripts/build-i18n-pages.mjs . && node build-i18n-pages.mjs
 */
import { JSDOM } from 'jsdom';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

// Racine du repo. Le script est copié dans /tmp pour disposer de jsdom, donc le
// chemin ne peut pas être déduit de import.meta.url — il est surchargeable par
// variable d'environnement (`NOTCHIA_ROOT=… node build-i18n-pages.mjs`).
// Valeur par défaut alignée sur le workspace ~/dev (migration du 2026-08-16).
// Le script est copié dans un dossier temporaire pour disposer de jsdom : le
// chemin ne peut donc pas venir de import.meta.url. Il est résolu dans cet
// ordre — variable d'environnement, puis le premier dossier du workspace qui
// contient index.html. Un chemin en dur casse à chaque renommage du dépôt
// (migration repo/ → repo-notchia-website/ du 2026-08-28).
const ROOT = process.env.NOTCHIA_ROOT || (() => {
  const base = '/Users/axel/dev/notchia-website';
  const found = fs.readdirSync(base)
    .map((d) => path.join(base, d))
    .find((d) => fs.existsSync(path.join(d, 'index.html')));
  if (!found) throw new Error(`Aucun dépôt avec index.html sous ${base} — passe NOTCHIA_ROOT=…`);
  return found;
})();
const LANGS = ['en', 'es', 'de'];
const OGLOC = { fr: 'fr_FR', en: 'en_US', es: 'es_ES', de: 'de_DE' };
const PAGES = [
  { file: 'index.html',    slug: '' },
  { file: 'features.html', slug: 'features' },
  { file: 'pricing.html',  slug: 'pricing' },
];
const SIBLINGS = new Set(['index.html', 'features.html', 'pricing.html']);

const frUrl   = (slug) => 'https://notchia.app/' + slug;
const langUrl = (lang, slug) => `https://notchia.app/${lang}/` + slug;

// ----- extraction du literal I18N avec lexer conscient des chaînes -----
function extractI18N(html) {
  const idx = html.indexOf('const I18N');
  if (idx < 0) throw new Error('const I18N introuvable');
  const start = html.indexOf('{', idx);
  let depth = 0, inStr = null, esc = false, i = start;
  for (; i < html.length; i++) {
    const c = html[i];
    if (esc) { esc = false; continue; }
    if (inStr) {
      if (c === '\\') esc = true;
      else if (c === inStr) inStr = null;
      continue;
    }
    if (c === "'" || c === '"' || c === '`') { inStr = c; continue; }
    if (c === '{') depth++;
    else if (c === '}') { depth--; if (depth === 0) break; }
  }
  const literal = html.slice(start, i + 1);
  return vm.runInNewContext('(' + literal + ')', {});
}

const stripTags = (s) => s.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

function translateJsonLd(doc, dict, lang, qKeys) {
  doc.querySelectorAll('script[type="application/ld+json"]').forEach((node) => {
    let data;
    try { data = JSON.parse(node.textContent); } catch { return; }
    const graph = data['@graph'] || [data];
    for (const n of graph) {
      if (n['@type'] === 'FAQPage' && Array.isArray(n.mainEntity)) {
        n.mainEntity.forEach((q, i) => {
          const qk = qKeys[i];
          if (!qk) return;
          const ak = qk.replace('.q', '.a');
          if (dict[qk]) q.name = stripTags(dict[qk]);
          if (dict[ak] && q.acceptedAnswer) q.acceptedAnswer.text = stripTags(dict[ak]);
        });
      }
      if ((n['@type'] === 'SoftwareApplication' || n['@type'] === 'Product') && dict['meta.title']) {
        if (dict['meta.description']) n.description = dict['meta.description'];
      }
      if (n.inLanguage === 'fr' || n.inLanguage === 'fr-FR') n.inLanguage = lang;
    }
    node.textContent = JSON.stringify(data, null, 1);
  });
}

function applyDict(doc, dict, lang) {
  doc.documentElement.setAttribute('lang', lang);
  doc.querySelectorAll('[data-i18n]').forEach((el) => {
    const v = dict[el.getAttribute('data-i18n')];
    if (v != null) el.textContent = v;
  });
  doc.querySelectorAll('[data-i18n-html]').forEach((el) => {
    const v = dict[el.getAttribute('data-i18n-html')];
    if (v != null) el.innerHTML = v;
  });
  // textes alternatifs des captures (accessibilité + SEO images)
  doc.querySelectorAll('[data-i18n-alt]').forEach((el) => {
    const v = dict[el.getAttribute('data-i18n-alt')];
    if (v != null) el.setAttribute('alt', v);
  });
  const hero = doc.querySelector('.hero-word text');
  if (hero && dict['hero.svg']) hero.textContent = dict['hero.svg'];
  if (dict['meta.title']) {
    const t = doc.querySelector('title');
    if (t) t.textContent = dict['meta.title'];
  }
  const set = (q, val) => { const el = doc.querySelector(q); if (el && val != null) el.setAttribute('content', val); };
  set('meta[name="description"]', dict['meta.description']);
  set('meta[property="og:title"]', dict['meta.title']);
  set('meta[property="og:description"]', dict['meta.description']);
  set('meta[name="twitter:title"]', dict['meta.title']);
  set('meta[name="twitter:description"]', dict['meta.description']);
  set('meta[property="og:locale"]', OGLOC[lang]);
  const sel = doc.getElementById('lang-switch');
  if (sel) sel.querySelectorAll('option').forEach((o) => {
    if (o.getAttribute('value') === lang) o.setAttribute('selected', '');
    else o.removeAttribute('selected');
  });
}

function fixHead(doc, page, lang) {
  const my = langUrl(lang, page.slug);
  const canon = doc.querySelector('link[rel="canonical"]');
  if (canon) canon.setAttribute('href', my);
  const og = doc.querySelector('meta[property="og:url"]');
  if (og) og.setAttribute('content', my);
  // reconstruit le cluster hreflang complet
  const head = doc.querySelector('head');
  const anchor = doc.querySelector('link[rel="alternate"][hreflang]') || canon;
  doc.querySelectorAll('link[rel="alternate"][hreflang]').forEach((l, i) => { if (i > 0) l.remove(); });
  const first = doc.querySelector('link[rel="alternate"][hreflang]');
  const cluster = [
    ['fr', frUrl(page.slug)],
    ['en', langUrl('en', page.slug)],
    ['es', langUrl('es', page.slug)],
    ['de', langUrl('de', page.slug)],
    ['x-default', frUrl(page.slug)],
  ];
  let ref = first || anchor;
  cluster.forEach(([hl, url]) => {
    const l = doc.createElement('link');
    l.setAttribute('rel', 'alternate');
    l.setAttribute('hreflang', hl);
    l.setAttribute('href', url);
    ref.parentNode.insertBefore(l, ref.nextSibling);
    ref = l;
  });
  if (first) first.remove();
}

function rewriteLinks(doc, lang) {
  doc.querySelectorAll('*').forEach((el) => {
    if (el.hasAttribute && el.hasAttribute('data-no-lang-rewrite')) return; // liens de langue explicites
    for (const a of ['href', 'src', 'srcset']) {
      const v = el.getAttribute && el.getAttribute(a);
      if (!v) continue;
      if (/^(https?:|\/\/|#|mailto:|tel:|data:|javascript:)/.test(v)) continue;
      if (v.startsWith('/')) {
        if (v === '/' || v.startsWith('/#')) { el.setAttribute(a, `/${lang}/` + v.slice(1)); continue; }
        const m = v.match(/^\/(features|pricing)([#?/].*)?$/);
        if (m) el.setAttribute(a, `/${lang}/${m[1]}${m[2] || ''}`);
        continue;
      }
      const base = v.split('#')[0].split('?')[0];
      if (SIBLINGS.has(base)) continue; // reste dans le dossier de langue
      el.setAttribute(a, '../' + v);
    }
  });
}

function patchScripts(html, page, lang) {
  // 1. langue par défaut = celle de la page (le choix explicite stocké reste prioritaire)
  html = html.replace(
    /const b = \(navigator\.language \|\| 'en'\)\.toLowerCase\(\)\.split\('-'\)\[0\];\s*\n\s*return I18N\[b\] \? b : 'en';/,
    `return '${lang}';`
  );
  // 2. pas de persistance implicite au chargement
  html = html.replace(
    "try { localStorage.setItem('notchia-lang-choice', lang); } catch (e) {}",
    "/* pas de persistance implicite sur les pages statiques */"
  );
  // 2b. le contenu est PRÉ-RENDU : pas de re-render au chargement, sauf si
  //     l'utilisateur a explicitement choisi une autre langue auparavant
  html = html.replace(
    'applyLang(detectLang());',
    `(function(){ let s = null; try { s = localStorage.getItem('notchia-lang-choice'); } catch (_) {} if (s && s !== '${lang}' && I18N[s]) applyLang(s); })();`
  );
  // 2c. liens relatifs restants dans les chaînes des dictionnaires JS
  //     (ré-injectés par applyLang) : préfixe ../ — lookbehind pour ne pas
  //     retoucher ceux déjà réécrits dans le DOM
  html = html.replace(/(?<!\.\.\/)href="install\.html/g, 'href="../install.html');
  // 3. sélecteur = navigation entre versions linguistiques
  const dests = `{ fr: '../${page.slug}', en: '../en/${page.slug}', es: '../es/${page.slug}', de: '../de/${page.slug}' }`
    .replace(/\.\.\/'/g, "../'").replace(/\.\.\/(en|es|de)\/'/g, "../$1/'");
  html = html.replace(
    /document\.getElementById\('lang-switch'\)\?\.addEventListener\('change', e => \{\n\s*try \{ localStorage\.setItem\('notchia-lang-choice', e\.target\.value\); \} catch \(_\) \{\}\n\s*applyLang\(e\.target\.value\);\n\s*\}\);/,
    `document.getElementById('lang-switch')?.addEventListener('change', e => {
    const v = e.target.value;
    try { localStorage.setItem('notchia-lang-choice', v); } catch (_) {}
    const dest = ${dests}[v];
    if (dest != null) location.href = dest || '../'; else applyLang(v);
  });`
  );
  return html;
}

let generated = 0;
for (const page of PAGES) {
  const srcPath = path.join(ROOT, page.file);
  const src = fs.readFileSync(srcPath, 'utf-8');
  const I18N = extractI18N(src);
  for (const lang of LANGS) {
    if (!I18N[lang]) { console.error(`⚠️ ${page.file}: pas de dict ${lang}`); continue; }
    const dom = new JSDOM(src);
    const doc = dom.window.document;
    // ordre DOM des clés de questions (les numéros sautent, ex. pas de faq.q8)
    const qKeys = [...doc.querySelectorAll('[data-i18n^="faq.q"]')].map((el) => el.getAttribute('data-i18n'));
    applyDict(doc, I18N[lang], lang);
    translateJsonLd(doc, I18N[lang], lang, qKeys);
    fixHead(doc, page, lang);
    rewriteLinks(doc, lang);
    let out = dom.serialize();
    out = patchScripts(out, page, lang);
    const dir = path.join(ROOT, lang);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, page.file), out);
    generated++;
    console.log(`✓ ${lang}/${page.file} (${(out.length / 1024).toFixed(0)} Ko)`);
  }
}
console.log(`\n${generated}/9 pages générées`);
