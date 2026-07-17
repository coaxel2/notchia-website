# GEO Analysis — notchia.app

**Date : 2026-07-17** · remplace l'analyse du 2026-05-26 · toutes les vérifications ci-dessous ont été exécutées en live ce jour (curl, User-Agent GPTBot, recherches web).

---

## 1. GEO Readiness Score : 81/100

| Dimension | Poids | Note | Verdict |
|---|---|---|---|
| Citabilité | 25 % | 92 | 27 blocs « citation-ready » dans llms.txt, answer-first, un fait précis tous les 150-200 mots, claims tous véridiques (audit du 16-17/07) |
| Lisibilité structurelle | 20 % | 94 | Hiérarchie Hn propre, FAQ 10 questions = 10 `<details>` (parité schema), tableaux comparatifs |
| Multi-modal | 15 % | 57 | og-image seule ; pas de vidéo démo, screenshots press = placeholders |
| Autorité & marque | 20 % | 55 | Dates + contact + sameAs ✓, mais auteur anonymisé (choix privacy) et ~0 mention tierce |
| Accessibilité technique | 20 % | 96 | 19 crawlers IA autorisés, llms.txt 31 Ko + llms-full 36 Ko, SSR /changelog, pages statiques /en /es /de vérifiées via UA GPTBot |

> Note : l'analyse du 26 mai affichait 87/100 avec une notation plus généreuse du critère autorité (14/20 pour des signaux on-page). La présente notation applique strictement le barème du skill (les mentions tierces Wikipedia/Reddit/YouTube dominent le critère) — les deux analyses décrivent la même réalité : **on-page au plafond, off-page quasi vide**.

## 2. Répartition par plateforme

| Plateforme | Note | Pourquoi |
|---|---|---|
| Claude | ~88 | ClaudeBot + anthropic-ai + Claude-Web autorisés, llms.txt riche |
| Google AI Overviews | ~85 | #1 sur la marque (title EN déjà indexé), schema @graph, 88 URLs sitemap en 200 |
| Bing Copilot | ~84 | IndexNow actif (clé validée, ping 200 après chaque deploy) |
| ChatGPT | ~76 | GPTBot/OAI-SearchBot OK, mais **0 présence Wikipedia** (47,9 % des citations ChatGPT) |
| Perplexity | ~72 | PerplexityBot OK, mais **0 présence Reddit** (46,7 % des citations Perplexity) |

## 3. Accès crawlers IA — 19/19 autorisés ✅

`robots.txt` (vérifié live) : GPTBot, ChatGPT-User, OAI-SearchBot, ClaudeBot, anthropic-ai, Claude-Web, PerplexityBot, Perplexity-User, Google-Extended, Amazonbot, Applebot-Extended, Meta-ExternalAgent, FacebookBot, Bytespider, CCBot, cohere-ai, DuckAssistBot, YouBot + wildcard. Sitemap déclaré. Aucun blocage.

## 4. llms.txt — présent et exemplaire ✅

- `/llms.txt` (31 355 o) : intro answer-first, table « Key facts » (20+ lignes), 27 sections dont « Citation-ready answers » (blocs 60-120 mots par intention de recherche), comparatif concurrents, **0 donnée personnelle** (anonymisé le 16/07).
- `/llms-full.txt` (36 070 o) : version étendue avec guides intégraux.
- Versions/faits synchronisés : 2.9.7, 14 modules, macOS 15+, DMG ~12 Mo / installé ~30 Mo, InStock.

## 5. Mentions de marque (vérifié 2026-07-17)

| Plateforme | Statut | Note |
|---|---|---|
| Wikipedia | ❌ absent | « Notchia » sur Wikipedia = un arthropode préhistorique, pas l'app |
| Reddit | ❌ absent | Aucune mention détectée |
| YouTube | ⚠️ chaîne propre créée (@notchia-app), aucune mention tierce | Corrélation la plus forte avec les citations IA (~0.737) |
| LinkedIn | ❌ absent | |
| Annuaire tiers | ✅ toolify.ai/tool/notchia | Seule fiche tierce |
| Socials propres | ✅ Instagram, TikTok, YouTube, Facebook | Référencés en sameAs dans le schema Organization |

⚠️ **Index périmé** : la recherche Google restitue encore l'ancienne description « Claude Code, ChatGPT Codex et GitHub Copilot » (feature retirée de l'app en 2.9.4, purgée du site le 16/07). IndexNow a été pingé (88 URLs) ; le recrawl corrigera. Si Google Search Console est configurée : demander une réindexation manuelle de `/`, `/features`, `/llms.txt`.

## 6. Citabilité passage-level

- Bloc « Qu'est-ce que NotchIA ? » : présent dans les 60 premiers mots du about (FR) et de la FAQ, **dans les 4 langues** (pages statiques).
- llms.txt : 27 blocs auto-suffisants ; les « Citation-ready answers » couvrent créateur, différence vs Boring Notch, sécurité, open-source, modèle économique, Mac App Store.
- Article de release `blog/sealed-badger-2-9-7` (17/07) : FAQ 4 questions avec parité schema.
- Aucun claim « premier/seul » absolu restant (adoucis le 16/07 : « l'une des seules », « among the first »).

## 7. Server-Side Rendering ✅ (résolu le 17/07)

- **Avant** : home/features/pricing servis en FR uniquement, EN/ES/DE en JS-only → invisibles aux crawlers IA.
- **Maintenant** : `/en/`, `/es/`, `/de/` = versions statiques pré-rendues (générateur `scripts/build-i18n-pages.mjs`), JSON-LD traduit (FAQ comprise), clusters hreflang réels. **Vérifié avec UA GPTBot sans JS** : contenu EN/ES/DE servi.
- `/changelog` : SSR edge (GitHub Releases), affiche 2.9.7.
- Blog : 70+ articles statiques multilingues, index filtré par langue côté client (crawlers voient tout).

## 8. Top 5 actions à plus fort impact (toutes off-page ou média)

1. **Vidéo démo YouTube** (~0.737 de corrélation avec les citations IA — le signal n°1) + shorts TikTok/IG déjà planifiés.
2. **Présence Reddit** : post de lancement r/macapps + réponses utiles dans les fils « notch app » (46,7 % des citations Perplexity).
3. **Fiche AlternativeTo** (compte débloqué depuis le 04/06, kit prêt dans `marketing/off-site/alternativeto-submit-now.md`).
4. **Vrais screenshots produit** (remplace les 6 placeholders du press kit) → multi-modal 57 → ~80.
5. **Purge de l'index périmé** : recrawl GSC des pages clés pour éliminer la mention Copilot fantôme.

## 9. Schema — état

88 blocs JSON-LD, 100 % parseables. @graph home : Organization (sameAs socials), SoftwareApplication (v2.9.7, InStock, macOS 15.0+), FAQPage (parité), BreadcrumbList, WebSite, HowTo (déprécié par Google pour les rich results mais inoffensif, conservé pour le contexte IA). Author = Organization « NotchIA » partout (nœud Person supprimé volontairement — privacy). Pages de langue : FAQ et descriptions traduites dans le schema. Rien à corriger.

## 10. Reformulations de contenu

Aucune urgente — la structure answer-first est en place. Optionnel : RSL 1.0 (`/license.xml`) absent ; standard émergent de licence IA, à considérer seulement si une politique de licence de contenu devient nécessaire.

---
*Généré le 2026-07-17. Méthodo : curl live (robots, llms, UA GPTBot sur /en /de /changelog), validation JSON-LD locale (88 blocs), recherches web marque du jour, audit on-page des 16-17/07 (commits be37c83 → 8a0e64d).*
