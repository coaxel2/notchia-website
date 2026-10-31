// Canonicalisation www → apex en 301 (les sources host-based ne sont pas
// supportées par _redirects sur Cloudflare Pages, vérifié le 2026-07-17).
// Ce middleware s'exécute sur toutes les requêtes du projet : redirection
// permanente (chemin + query préservés) pour www.notchia.app, puis en-têtes.
//
// _headers ne s'applique qu'aux fichiers statiques : les réponses des Functions
// (/changelog, /api/*) n'avaient aucun en-tête de sécurité. On pose donc ici les
// mêmes valeurs que le bloc /* de _headers, sans écraser celles déjà présentes.
// ⚠️ Toute modification du bloc /* de _headers doit être reportée ici.
const SECURITY_HEADERS = {
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), interest-cohort=(), browsing-topics=()",
  "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
};
const CSP =
  "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
  "font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https:; connect-src 'self'; object-src 'none'; " +
  "frame-src 'none'; worker-src 'self'; manifest-src 'self'; media-src 'self'; frame-ancestors 'none'; base-uri 'self'; " +
  "form-action 'self'; upgrade-insecure-requests";

export async function onRequest(context) {
  const url = new URL(context.request.url);
  if (url.hostname === "www.notchia.app") {
    url.hostname = "notchia.app";
    return Response.redirect(url.toString(), 301);
  }
  const response = await context.next();
  const r = new Response(response.body, response);
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) {
    if (!r.headers.has(k)) r.headers.set(k, v);
  }
  if ((r.headers.get("Content-Type") || "").includes("text/html") && !r.headers.has("Content-Security-Policy")) {
    r.headers.set("Content-Security-Policy", CSP);
  }
  // API : jamais indexée. *.pages.dev (previews + alias prod) : contenu
  // identique à l'apex → noindex pour éviter le duplicate content, sans casser
  // la navigation des previews.
  if (url.pathname.startsWith("/api/") || url.hostname.endsWith(".pages.dev")) {
    r.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return r;
}
