// Canonicalisation www → apex en 301 (les sources host-based ne sont pas
// supportées par _redirects sur Cloudflare Pages — vérifié le 2026-07-17).
// Ce middleware s'exécute sur toutes les requêtes du projet : passe-plat
// immédiat pour l'apex, redirection permanente (chemin + query préservés)
// pour www.notchia.app.
export async function onRequest(context) {
  const url = new URL(context.request.url);
  if (url.hostname === "www.notchia.app") {
    url.hostname = "notchia.app";
    return Response.redirect(url.toString(), 301);
  }
  return context.next();
}
