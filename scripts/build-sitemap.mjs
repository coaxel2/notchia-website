#!/usr/bin/env node
// Régénère sitemap.xml à partir des pages elles-mêmes, sans dépendance :
// - une URL par page indexable (pas de meta robots noindex) dont le canonical pointe sur elle-même ;
// - hreflang repris des <link rel="alternate"> de la page, seulement s'il existe de vraies variantes ;
// - lastmod = date du dernier commit qui touche le fichier (aujourd'hui s'il a des modifications
//   non commitées) ;
// - /changelog (rendu par functions/changelog.js) ajouté à part.
// Usage : node scripts/build-sitemap.mjs   (depuis n'importe où)
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://notchia.app";
const today = new Date().toISOString().slice(0, 10);

function pages() {
  const out = readdirSync(ROOT).filter((f) => f.endsWith(".html")).map((f) => f);
  for (const dir of ["blog", "en", "es", "de"]) {
    for (const f of readdirSync(join(ROOT, dir))) if (f.endsWith(".html")) out.push(`${dir}/${f}`);
  }
  return out.filter((f) => !/ cop(ie|y)\./.test(f)).sort();
}

function selfUrl(file) {
  const p = file.replace(/(^|\/)index\.html$/, "$1").replace(/\.html$/, "");
  return `${SITE}/${p}`;
}

function git(args) {
  return execFileSync("git", args, { cwd: ROOT, encoding: "utf8" }).trim();
}

function lastmod(file) {
  const dirty = git(["status", "--porcelain", "--", file]);
  if (dirty) return today;
  return git(["log", "-1", "--format=%cs", "--", file]) || today;
}

const entries = [];
const skipped = [];
for (const file of pages()) {
  const html = readFileSync(join(ROOT, file), "utf8");
  const head = html.slice(0, html.indexOf("</head>") > 0 ? html.indexOf("</head>") : 20000);
  const robots = (head.match(/<meta name="robots" content="([^"]*)"/i) || [])[1] || "";
  if (/noindex/i.test(robots)) { skipped.push(`${file} (noindex)`); continue; }
  const canonical = (head.match(/<link rel="canonical" href="([^"]+)"/i) || [])[1];
  const url = selfUrl(file);
  if (!canonical) { skipped.push(`${file} (sans canonical)`); continue; }
  if (canonical !== url) { skipped.push(`${file} (canonical vers ${canonical})`); continue; }
  const alts = [...head.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/gi)]
    .map((m) => ({ lang: m[1], href: m[2] }));
  const distinct = new Set(alts.map((a) => a.href));
  entries.push({ url, lastmod: lastmod(file), alts: distinct.size > 1 ? alts : [] });
}
entries.push({ url: `${SITE}/changelog`, lastmod: today, alts: [] });

const order = (u) => (u === `${SITE}/` ? "0" : u.includes("/blog/") ? "3" + u : /\/(en|es|de)\//.test(u) ? "2" + u : "1" + u);
entries.sort((a, b) => order(a.url).localeCompare(order(b.url)));

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
  '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  ...entries.map((e) => [
    "  <url>",
    `    <loc>${e.url}</loc>`,
    `    <lastmod>${e.lastmod}</lastmod>`,
    ...e.alts.map((a) => `    <xhtml:link rel="alternate" hreflang="${a.lang}" href="${a.href}" />`),
    "  </url>",
  ].join("\n")),
  "</urlset>",
  "",
].join("\n");
writeFileSync(join(ROOT, "sitemap.xml"), xml);
console.log(`sitemap.xml : ${entries.length} URL, ${entries.filter((e) => e.alts.length).length} avec hreflang`);
if (skipped.length) console.log("ignorées :\n  " + skipped.join("\n  "));
