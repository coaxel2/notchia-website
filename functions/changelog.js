/**
 * NotchIA — page Nouveautés / Changelog (SSR à l'edge)
 *
 * GET /changelog
 *
 * Génère la page HTML côté serveur (Cloudflare Pages Function) à partir des
 * GitHub Releases de coaxel2/NotchIA. Le rendu serveur est volontaire : les
 * crawlers IA (GPTBot, ClaudeBot, PerplexityBot…) n'exécutent PAS le
 * JavaScript — un fetch client-side serait invisible pour eux et n'aurait
 * aucune valeur GEO. Ici tout le contenu (versions, notes) est dans le HTML.
 *
 * - Source de vérité : https://api.github.com/repos/coaxel2/NotchIA/releases
 * - Cache : Cloudflare edge cache (caches.default) 1 h + Cache-Control s-maxage.
 *   → un seul fetch GitHub partagé pour tous les visiteurs, jamais de rate-limit
 *     côté client, pas de token exposé.
 * - Régénération auto : pour rafraîchir hors TTL après une nouvelle release,
 *   déclencher un Cloudflare Pages Deploy Hook depuis release.yml de l'app
 *   (voir README). Sinon la page se met à jour d'elle-même au bout d'1 h.
 *
 * i18n : libellés UI traduits FR/EN/ES/DE côté client (data-i18n + applyLang,
 * cohérent avec le reste du site). Les notes de version restent dans leur
 * langue d'origine (anglais) avec un label "(notes en anglais)".
 */

const REPO = "coaxel2/NotchIA";
const RELEASES_API = `https://api.github.com/repos/${REPO}/releases?per_page=30`;
const DMG = (tag) => `https://github.com/${REPO}/releases/download/${tag}/NotchIA.dmg`;
const LATEST_DL = `https://github.com/${REPO}/releases/latest`;
const CACHE_TTL = 3600; // 1 h

export async function onRequestGet(context) {
  const { request } = context;

  // 1. Edge cache
  const cache = caches.default;
  const cacheKey = new Request(new URL("/changelog", request.url).toString(), request);
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  // 2. Fetch GitHub (UA obligatoire)
  let releases = [];
  let ok = false;
  try {
    const res = await fetch(RELEASES_API, {
      headers: {
        "User-Agent": "NotchIA-Changelog (+https://notchia.app)",
        "Accept": "application/vnd.github+json",
      },
      cf: { cacheTtl: CACHE_TTL, cacheEverything: true },
    });
    if (res.ok) {
      const data = await res.json();
      releases = (Array.isArray(data) ? data : [])
        .filter((r) => r && !r.draft && !r.prerelease)
        .map((r) => ({
          version: String(r.tag_name || "").trim(),
          title: cleanTitle(r.name, r.tag_name),
          date: (String(r.body || "").match(/^<!--date:(\d{4}-\d{2}-\d{2})-->/) || [])[1] || r.published_at || "",
          body: cleanBody(r.body || ""),
          dmg: DMG(r.tag_name),
        }))
        .filter((r) => r.version);
      ok = releases.length > 0;
    }
  } catch (e) {
    console.error("changelog: GitHub fetch failed", e?.message);
  }

  const html = renderPage(releases, ok);
  const response = new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      // edge + navigateur : 1 h, sert le périmé pendant le refresh
      "Cache-Control": `public, max-age=300, s-maxage=${CACHE_TTL}, stale-while-revalidate=86400`,
      "X-Content-Type-Options": "nosniff",
    },
  });
  // ne met en cache que les réponses réussies
  if (ok) context.waitUntil(cache.put(cacheKey, response.clone()));
  return response;
}

// ── Nettoyage ────────────────────────────────────────────────────────────

function cleanTitle(name, version) {
  const v = String(version || "").trim();
  if (!name) return v;
  let t = String(name);
  // "v2.9.1 - Release v2.9.1 — more visible notch bounce animation" → après le —
  const em = t.lastIndexOf(" — ");
  if (em !== -1) t = t.slice(em + 3);
  else {
    const dash = t.indexOf(" - ");
    if (dash !== -1) t = t.slice(dash + 3);
  }
  t = t.replace(/^Release\s+v?[\d.]+\s*[—-]?\s*/i, "").trim();
  if (!t || /^v?[\d.]+$/i.test(t)) return v;
  return t.charAt(0).toUpperCase() + t.slice(1);
}

function cleanBody(body) {
  return String(body)
    .split("\n")
    .filter((l) => {
      const s = l.trim();
      if (/^co-authored-by:/i.test(s)) return false;
      if (/generated with \[?claude/i.test(s)) return false;
      if (/^🤖/.test(s)) return false;
      if (/^<!--/.test(s)) return false;
      return true;
    })
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// ── Rendu Markdown → HTML (sanitizé : on échappe AVANT d'ajouter des balises)

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));
}

function renderMarkdown(md) {
  if (!md) return "";
  const lines = escapeHtml(md).split("\n");
  let out = "";
  let inList = false;
  const inline = (s) => s
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+?)`/g, "<code>$1</code>")
    .replace(/\[([^\]]+?)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" rel="noopener nofollow" target="_blank">$1</a>');
  const closeList = () => { if (inList) { out += "</ul>"; inList = false; } };
  for (const raw of lines) {
    const line = raw.replace(/\s+$/, "");
    if (/^#{1,4}\s/.test(line)) { closeList(); out += `<h4>${inline(line.replace(/^#{1,4}\s/, ""))}</h4>`; }
    else if (/^\s*[-*]\s+/.test(line)) { if (!inList) { out += "<ul>"; inList = true; } out += `<li>${inline(line.replace(/^\s*[-*]\s+/, ""))}</li>`; }
    else if (line.trim() === "") { closeList(); }
    else { closeList(); out += `<p>${inline(line)}</p>`; }
  }
  closeList();
  return out;
}

// ── Page ───────────────────────────────────────────────────────────────────

function renderPage(releases, ok) {
  const current = ok ? releases[0].version : "";
  const itemsHtml = ok ? releases.map((r, i) => `
      <article class="rel">
        <div class="rel-head">
          <span class="ver">${escapeHtml(r.version)}</span>
          <time datetime="${escapeHtml(r.date)}" data-date="${escapeHtml(r.date)}"></time>
          ${i === 0 ? '<span class="badge-latest" data-i18n="latest">Dernière version</span>' : ""}
        </div>
        <h2 class="rel-title">${escapeHtml(r.title)}</h2>
        <div class="rel-body">${renderMarkdown(r.body)}</div>
        <a class="rel-dl" href="${escapeHtml(r.dmg)}" rel="noopener" data-i18n="dlThis">Télécharger cette version</a>
      </article>`).join("") : "";

  const fallback = `
      <div class="rel" style="text-align:center">
        <p data-i18n="fallback">Impossible de charger les versions pour le moment.</p>
        <a class="rel-dl" href="${LATEST_DL}" rel="noopener" data-i18n="viewGithub">Voir les versions sur GitHub</a>
      </div>`;

  // SoftwareApplication + version courante (citable / SEO)
  const ld = ok ? JSON.stringify({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "NotchIA",
    "operatingSystem": "macOS 15.0+",
    "applicationCategory": "ProductivityApplication",
    "softwareVersion": current,
    "downloadUrl": "https://notchia.app/dl/dmg",
    "url": "https://notchia.app/changelog",
    "releaseNotes": "https://notchia.app/changelog",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" },
  }) : "";

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Nouveautés NotchIA — journal des versions</title>
<meta name="description" content="Journal des versions de NotchIA : toutes les mises à jour de l'app macOS d'encoche, de la plus récente à la plus ancienne. Version actuelle, notes et téléchargement direct." />
<meta name="theme-color" content="#0B0D12" media="(prefers-color-scheme: dark)" />
<meta name="theme-color" content="#EDE8DC" media="(prefers-color-scheme: light)" />
<meta name="author" content="Axel Courty" />
<meta name="robots" content="index,follow,max-image-preview:large" />
<link rel="icon" type="image/png" sizes="192x192" href="favicon.png" />
<link rel="apple-touch-icon" href="apple-touch-icon.png" />
<link rel="canonical" href="https://notchia.app/changelog" />
<link rel="alternate" hreflang="fr" href="https://notchia.app/changelog" />
<link rel="alternate" hreflang="en" href="https://notchia.app/changelog" />
<link rel="alternate" hreflang="es" href="https://notchia.app/changelog" />
<link rel="alternate" hreflang="de" href="https://notchia.app/changelog" />
<link rel="alternate" hreflang="x-default" href="https://notchia.app/changelog" />
<meta property="og:type" content="website" />
<meta property="og:title" content="Nouveautés NotchIA — journal des versions" />
<meta property="og:description" content="Toutes les mises à jour de NotchIA, version actuelle et téléchargement direct." />
<meta property="og:url" content="https://notchia.app/changelog" />
<meta property="og:image" content="https://notchia.app/og-image.png" />
<meta property="og:site_name" content="NotchIA" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Nouveautés NotchIA — journal des versions" />
<meta name="twitter:description" content="Toutes les mises à jour de NotchIA." />
<meta name="twitter:image" content="https://notchia.app/og-image.png" />
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..600&family=Instrument+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="/tailwind.css" />
<style>
:root{--ink:#0B0D12;--cream:#EDE8DC;--brand:linear-gradient(90deg,#A855F7 0%,#FF4D88 30%,#FF7A2D 60%,#4DA8FF 100%)}
html,body{background:var(--ink);color:var(--cream)}
body{font-family:'Instrument Sans',system-ui,sans-serif;-webkit-font-smoothing:antialiased}
.grad-text{background-image:var(--brand);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;display:inline-block;line-height:1.15;padding-bottom:.08em}
.grad-bg{background:var(--brand)}
.lang-sw{appearance:none;-webkit-appearance:none;background-color:transparent;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%23808998' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'><path d='M6 9l6 6 6-6'/></svg>");background-repeat:no-repeat;background-position:right 10px center;background-size:9px;border:1px solid rgba(237,232,220,.15);color:rgba(237,232,220,.7);font-family:'JetBrains Mono',monospace;font-size:11px;padding:4px 26px 4px 10px;border-radius:999px;cursor:pointer}
.lang-sw:hover{color:#EDE8DC}
.current-card{background:linear-gradient(180deg,#14171F 0%,#0F1218 100%);border:1px solid transparent;background:linear-gradient(180deg,#14171F 0%,#0F1218 100%) padding-box,var(--brand) border-box;border-radius:16px}
.btn-dl{display:inline-flex;align-items:center;gap:8px;background:var(--brand);color:#0B0D12;font-weight:600;padding:.7rem 1.3rem;border-radius:999px;text-decoration:none;transition:transform .15s ease,opacity .15s ease}
.btn-dl:hover{transform:translateY(-1px);opacity:.95}
.rel{border-left:2px solid rgba(237,232,220,.12);padding:0 0 2rem 1.5rem;margin-left:.5rem;position:relative}
.rel::before{content:"";position:absolute;left:-7px;top:6px;width:12px;height:12px;border-radius:999px;background:var(--brand)}
.rel-head{display:flex;align-items:center;gap:.8rem;flex-wrap:wrap;margin-bottom:.35rem}
.ver{font-family:'JetBrains Mono',monospace;font-size:.95rem;font-weight:600;color:#EDE8DC}
.rel-head time{font-family:'JetBrains Mono',monospace;font-size:.72rem;color:rgba(237,232,220,.5)}
.badge-latest{font-family:'JetBrains Mono',monospace;font-size:.62rem;letter-spacing:.12em;text-transform:uppercase;padding:2px 8px;border-radius:999px;color:#0B0D12;font-weight:600}
.badge-latest{background:var(--brand)}
.rel-title{font-family:'Fraunces',serif;font-size:1.35rem;line-height:1.25;margin:.1rem 0 .6rem}
.rel-body{color:rgba(237,232,220,.72);font-size:.95rem;line-height:1.6}
.rel-body p{margin:.4rem 0}
.rel-body ul{margin:.4rem 0;padding-left:1.1rem;list-style:disc}
.rel-body li{margin:.2rem 0}
.rel-body h4{font-family:'Instrument Sans',sans-serif;font-weight:600;color:#EDE8DC;margin:.7rem 0 .3rem;font-size:1rem}
.rel-body code{font-family:'JetBrains Mono',monospace;font-size:.82em;background:rgba(237,232,220,.08);padding:1px 5px;border-radius:5px}
.rel-body a{color:#9ECBFF;text-decoration:underline}
.rel-dl{display:inline-block;margin-top:.7rem;font-family:'JetBrains Mono',monospace;font-size:.74rem;color:rgba(237,232,220,.7);border:1px solid rgba(237,232,220,.15);padding:5px 12px;border-radius:999px;text-decoration:none}
.rel-dl:hover{color:#EDE8DC;border-color:rgba(237,232,220,.35)}
</style>
<script type="application/ld+json">${ld || "{}"}</script>
</head>
<body class="font-sans min-h-screen">
<header class="max-w-3xl mx-auto px-6 py-8 flex items-center justify-between">
  <a href="/" class="flex items-center gap-2">
    <picture><source srcset="logo.avif" type="image/avif" /><img src="logo.png" alt="NotchIA" class="h-8 w-8 rounded-md" width="32" height="32" /></picture>
    <span class="font-display text-xl">NotchIA</span>
  </a>
  <nav class="flex items-center gap-4 sm:gap-6 text-sm text-cream/70">
    <a href="/" class="hover:text-cream" data-i18n="navHome">Accueil</a>
    <a href="/install" class="hover:text-cream" data-i18n="navInstall">Installer</a>
    <a href="/pricing" class="hover:text-cream" data-i18n="navPricing">Tarifs</a>
    <select id="lang-switch" class="lang-sw" aria-label="Language">
      <option value="fr">FR</option><option value="en">EN</option><option value="es">ES</option><option value="de">DE</option>
    </select>
  </nav>
</header>

<main class="max-w-3xl mx-auto px-6 pt-4 pb-24">
  <section class="text-center mb-10">
    <h1 class="font-display text-5xl md:text-6xl leading-tight mb-3"><span class="grad-text" data-i18n="title">Nouveautés</span></h1>
    <p class="text-cream/70 text-lg max-w-xl mx-auto" data-i18n="lead">Toutes les mises à jour de NotchIA, de la plus récente à la plus ancienne.</p>
  </section>

  ${ok ? `<div class="current-card p-6 mb-12 flex items-center justify-between gap-4 flex-wrap">
    <div>
      <div class="text-cream/50 text-xs font-mono uppercase tracking-wider mb-1" data-i18n="current">Version actuelle</div>
      <div class="font-display text-3xl">${escapeHtml(current)}</div>
    </div>
    <a class="btn-dl" href="https://notchia.app/dl/dmg" rel="noopener"><span data-i18n="dlApp">Télécharger NotchIA</span>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 4v12m0 0l-5-5m5 5l5-5M4 20h16"/></svg>
    </a>
  </div>
  <p class="text-cream/40 text-xs mb-6" data-i18n="notesLang">Les notes de version sont en anglais.</p>` : ""}

  <div id="releases">${ok ? itemsHtml : fallback}</div>

  <p class="text-center text-cream/40 text-xs mt-12">
    <a href="${LATEST_DL}" class="underline hover:text-cream/70" rel="noopener" data-i18n="allGithub">Toutes les versions sur GitHub</a>
  </p>
</main>

<footer class="border-t border-white/10 mt-8">
  <div class="max-w-3xl mx-auto px-6 py-8 text-xs text-cream/40 font-mono flex flex-wrap items-center justify-between gap-3">
    <span>© 2026 NotchIA</span>
    <span><a href="/press" class="hover:text-cream/70">Press</a> · <a href="/contact" class="hover:text-cream/70" data-i18n="navContact">Contact</a> · <a href="/" class="hover:text-cream/70">notchia.app</a></span>
  </div>
</footer>

<script>
  const I18N = {
    fr: { navHome:'Accueil',navInstall:'Installer',navPricing:'Tarifs',navContact:'Contact',title:'Nouveautés',lead:'Toutes les mises à jour de NotchIA, de la plus récente à la plus ancienne.',current:'Version actuelle',dlApp:'Télécharger NotchIA',dlThis:'Télécharger cette version',latest:'Dernière version',notesLang:'Les notes de version sont en anglais.',allGithub:'Toutes les versions sur GitHub',viewGithub:'Voir les versions sur GitHub',fallback:'Impossible de charger les versions pour le moment.' },
    en: { navHome:'Home',navInstall:'Install',navPricing:'Pricing',navContact:'Contact',title:"What's New",lead:'Every NotchIA update, newest first.',current:'Current version',dlApp:'Download NotchIA',dlThis:'Download this version',latest:'Latest',notesLang:'Release notes are in English.',allGithub:'All releases on GitHub',viewGithub:'View releases on GitHub',fallback:'Could not load releases right now.' },
    es: { navHome:'Inicio',navInstall:'Instalar',navPricing:'Precios',navContact:'Contacto',title:'Novedades',lead:'Todas las actualizaciones de NotchIA, de la más reciente a la más antigua.',current:'Versión actual',dlApp:'Descargar NotchIA',dlThis:'Descargar esta versión',latest:'Última versión',notesLang:'Las notas de versión están en inglés.',allGithub:'Todas las versiones en GitHub',viewGithub:'Ver versiones en GitHub',fallback:'No se pudieron cargar las versiones por ahora.' },
    de: { navHome:'Start',navInstall:'Installieren',navPricing:'Preise',navContact:'Kontakt',title:'Neuigkeiten',lead:'Alle NotchIA-Updates, neueste zuerst.',current:'Aktuelle Version',dlApp:'NotchIA herunterladen',dlThis:'Diese Version herunterladen',latest:'Neueste Version',notesLang:'Die Versionshinweise sind auf Englisch.',allGithub:'Alle Versionen auf GitHub',viewGithub:'Versionen auf GitHub ansehen',fallback:'Versionen konnten momentan nicht geladen werden.' },
  };
  const LOCALE = { fr:'fr-FR', en:'en-US', es:'es-ES', de:'de-DE' };
  function applyLang(lang){
    if(!I18N[lang]) lang='en';
    const d=I18N[lang];
    document.documentElement.lang=lang;
    document.querySelectorAll('[data-i18n]').forEach(el=>{const v=d[el.dataset.i18n];if(v!=null)el.textContent=v;});
    // dates localisées
    const fmt=new Intl.DateTimeFormat(LOCALE[lang]||'en-US',{year:'numeric',month:'long',day:'numeric'});
    document.querySelectorAll('time[data-date]').forEach(t=>{const iso=t.getAttribute('data-date');if(iso){const dt=new Date(iso);if(!isNaN(dt))t.textContent=fmt.format(dt);}});
    const sel=document.getElementById('lang-switch');if(sel)sel.value=lang;
    try{localStorage.setItem('notchia-lang',lang);}catch(e){}
  }
  let lang='fr';
  try{const s=localStorage.getItem('notchia-lang');if(s)lang=s;else if(navigator.language)lang=navigator.language.slice(0,2);}catch(e){}
  applyLang(lang);
  document.getElementById('lang-switch')?.addEventListener('change',e=>applyLang(e.target.value));
</script>
</body>
</html>`;
}
