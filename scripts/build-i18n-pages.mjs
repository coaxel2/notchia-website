#!/usr/bin/env node
/**
 * Génère les versions statiques EN/ES/DE de index/features/pricing dans /en/ /es/ /de/.
 * Applique le dictionnaire I18N côté serveur (même sémantique que applyLang du site),
 * traduit le JSON-LD (FAQPage, descriptions), réécrit canonical/hreflang/og et les
 * chemins relatifs (url() des polices comprises), et patche le JS embarqué : la table
 * LANG_DEST (URL des versions de la page) suit le dossier de langue. La langue de la
 * page vient de <html lang>, le sélecteur navigue entre versions.
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

// Libellés du JSON-LD écrits en dur en français dans les pages source (fil d'Ariane, offres).
const LD_NAMES = {
  'Accueil': { en: 'Home', es: 'Inicio', de: 'Startseite' },
  'IA en direct': { en: 'Live AI', es: 'IA en directo', de: 'Live-KI' },
  'Médias': { en: 'Media', es: 'Multimedia', de: 'Medien' },
  'Calendrier': { en: 'Calendar', es: 'Calendario', de: 'Kalender' },
  'Productivité': { en: 'Productivity', es: 'Productividad', de: 'Produktivität' },
  'Système': { en: 'System', es: 'Sistema', de: 'System' },
  'Tarif': { en: 'Pricing', es: 'Precio', de: 'Preis' },
  'Tarifs': { en: 'Pricing', es: 'Precios', de: 'Preise' },
  'Télécharger': { en: 'Download', es: 'Descargar', de: 'Herunterladen' },
  'Fonctionnalités': { en: 'Features', es: 'Funciones', de: 'Funktionen' },
  'Pro mensuel': { en: 'Pro monthly', es: 'Pro mensual', de: 'Pro monatlich' },
  'Pro à vie': { en: 'Pro lifetime', es: 'Pro de por vida', de: 'Pro lebenslang' },
};
const ldName = (s, lang) => (LD_NAMES[s] && LD_NAMES[s][lang]) || s;
// URL d'une page FR du trio (/, /features, /pricing, avec ancre éventuelle) → sa version localisée.
function ldUrl(u, lang) {
  const m = typeof u === 'string' && u.match(/^https:\/\/notchia\.app\/(features|pricing)?(#.*)?$/);
  return m ? langUrl(lang, m[1] || '') + (m[2] || '') : u;
}

function translateJsonLd(doc, dict, lang, qKeys, page) {
  const my = langUrl(lang, page.slug);
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
      // nœuds propres à la page : identifiant, langue et URL de la version localisée
      if (n['@type'] === 'FAQPage') {
        if (n['@id']) n['@id'] = my + '#faq';
        n.inLanguage = lang;
      }
      if (n['@type'] === 'BreadcrumbList') {
        if (n['@id']) n['@id'] = my + '#breadcrumb';
        (n.itemListElement || []).forEach((it) => {
          it.name = ldName(it.name, lang);
          it.item = ldUrl(it.item, lang);
        });
      }
      if (n['@type'] === 'Product') {
        n.url = ldUrl(n.url, lang);
        (Array.isArray(n.offers) ? n.offers : [n.offers]).filter(Boolean).forEach((o) => {
          o.name = ldName(o.name, lang);
          o.url = ldUrl(o.url, lang);
        });
      }
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
  // 1. Langue : les pages sources ne détectent plus navigator.language. Elles
  //    lisent leur langue dans <html lang> (posé par applyDict), renvoient vers la
  //    version mémorisée par le sélecteur et proposent un bandeau de suggestion.
  //    Seule la table LANG_DEST (URL des versions de la page) dépend du dossier.
  const dests = `{ fr: '../${page.slug}', en: '../en/${page.slug}', es: '../es/${page.slug}', de: '../de/${page.slug}' }`;
  const before = html;
  html = html.replace(/const LANG_DEST = \{[^}]*\};/, `const LANG_DEST = ${dests};`);
  if (html === before) throw new Error(`${page.file} : const LANG_DEST introuvable, script de langue modifié ?`);
  // 2c. liens relatifs restants dans les chaînes des dictionnaires JS
  //     (ré-injectés par applyLang) : préfixe ../ — lookbehind pour ne pas
  //     retoucher ceux déjà réécrits dans le DOM
  html = html.replace(/(?<!\.\.\/)href="install\.html/g, 'href="../install.html');
  // 2d. polices auto-hébergées : les url() des @font-face inline ne passent pas
  //     par rewriteLinks (texte CSS, pas un attribut)
  html = html.replace(/url\(fonts\//g, 'url(../fonts/');
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
    translateJsonLd(doc, I18N[lang], lang, qKeys, page);
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
