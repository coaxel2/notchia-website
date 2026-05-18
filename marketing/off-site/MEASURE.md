# Mesure GEO — protocole hebdo

**Pourquoi** : sans mesure régulière, impossible de savoir si les efforts off-site convertissent en citations LLM. À faire **chaque dimanche soir** (~5 min).

---

## Les 5 queries de référence à tester

À poser TEL QUEL, dans l'ordre, à **ChatGPT** ET **Perplexity** ET **Claude.ai** ET **Gemini** :

1. `meilleur app pour l'encoche du mac`
2. `best mac notch app 2026`
3. `mac app to monitor claude code sessions`
4. `apps mac pour productivité avec IA on-device`
5. `notch utility for MacBook with AI integration`

---

## Scoring NotchIA

Pour chaque (query × LLM), noter :

- **Position dans la réponse principale** : 1er / 2e / 3e / 4e+ / ABSENT
- **Cité dans les sources web (si LLM les expose)** : OUI / NON
- **Description correcte** : exacte / approximative / hallucination

---

## Tableau de bord

### Semaine du 2026-05-18 (baseline)

| Query | ChatGPT | Perplexity | Claude | Gemini |
|---|---|---|---|---|
| 1. `meilleur app encoche mac` | ABSENT | ABSENT (57 sources) | — | — |
| 2. `best mac notch app 2026` | — | — | — | — |
| 3. `claude code monitoring mac` | — | — | — | — |
| 4. `productivité IA on-device mac` | — | — | — | — |
| 5. `notch utility MacBook AI` | — | — | — | — |

**Baseline** : 0/4 LLM citent NotchIA en spontané. Présent dans les sources Bing (Q1 ChatGPT quand interpellé explicitement).

### Semaine du 2026-05-25 — à remplir

### Semaine du 2026-06-01 — à remplir

### Semaine du 2026-06-08 — à remplir

---

## Seuils d'action

| Constat 4 semaines après lancement off-site | Action |
|---|---|
| Toujours 0/4 LLM citent sur Q1+Q2 | Probable : aucune publication presse n'a abouti. Relancer 4 cibles + ajouter 5 nouvelles cibles presse. |
| 1+ LLM cite NotchIA mais en 4e+ position | Bon signal. Continuer le rythme presse, ajouter blog posts dédiés ("notchia vs notchnook" etc.) |
| 2+ LLM citent en 1-3e position sur Q3 (niche claude code) | 🎯 victoire stratégique — c'est la query où on peut gagner. Doubler la mise sur le content marketing "Claude Code Mac apps" |
| 2+ LLM citent en 1-3e position sur Q1+Q2 (généraliste) | Tu as gagné. Plus de mention nécessaire, juste maintenance. |

---

## Bonus — autres signaux à surveiller

### Backlinks
Vérifier mensuellement via `https://search.google.com/search-console` (si compte connecté) ou via une recherche manuelle :
```
curl -sS "https://www.google.com/search?q=%22notchia%22+-site%3Anotchia.app+-site%3Agithub.com%2Fcoaxel2" -A "Mozilla/5.0" -o /tmp/bl.html
grep -oE 'href="[^"]+"' /tmp/bl.html | grep -v "google\|youtube" | head -20
```
Cible 1 mois : ≥ 3 backlinks tiers (hors GitHub, hors notchia.app).
Cible 3 mois : ≥ 10.

### PH Followers / Upvotes
Tracker manuel page `https://www.producthunt.com/products/notchia` :
- Followers : ___
- Upvotes : ___
- Comments : ___

### Reddit mentions
Recherche manuelle sur Reddit `notchia` (https://www.reddit.com/search/?q=notchia&type=link).
Cible 1 mois : ≥ 1 mention organique non liée à ton propre post.

### GitHub
Stars du repo `coaxel2/NotchIA` :
- Baseline aujourd'hui : ___
- Cible 1 mois : +50% (objectif réaliste indé)
