# Fiche Wikidata — NotchIA

> Draft prêt-à-soumettre via QuickStatements pour créer le Q-item de NotchIA.
> Dernière mise à jour : 2026-05-27 — Axel Courty

---

## 1. Stratégie de soumission

**Recommandation : créer le Q-item Wikidata AVANT le draft Wikipedia.**

Pourquoi :
- Wikidata a un seuil de notabilité **beaucoup plus bas** que Wikipedia. La politique [WD:N](https://www.wikidata.org/wiki/Wikidata:Notability) accepte un item s'il satisfait l'un de ces trois critères :
  1. Il existe un article sur un projet Wikimedia (Wikipedia, Wikinews, Wikibooks, etc.) — **non applicable pour NotchIA aujourd'hui**.
  2. Il fait référence à une entité « clairement identifiable » avec des sources publiques — **applicable** : site officiel + immatriculation RCS Bordeaux 105 093 058 + presse à venir.
  3. Il remplit une nécessité structurelle (ex : valeur d'une propriété d'un autre item) — non applicable.

→ NotchIA satisfait le critère **2** : entité identifiable, contrôlable (registre INSEE/RCS), site officiel actif. Une création de Q-item est donc raisonnable.

**Risque principal** : si l'item est trop maigre, il peut être proposé en suppression sous 7 jours. Mitigation : démarrer avec ~12 propriétés essentielles **avec des sources externes**, jamais auto-référencées seulement.

**Ordre conseillé** :
1. ✅ **Wikidata d'abord** (cette fiche)
2. ⏳ Une fois le Q-item stable depuis ~2 semaines → soumettre le draft Wikipedia FR (plus tolérant que Wikipedia EN sur la notabilité produit).
3. ⏳ Si l'article FR est accepté → tenter l'EN avec traduction.

---

## 2. Propriétés à déclarer

### Référentiel des Q-codes (vérifiés sur wikidata.org le 2026-05-27)

| Concept | Q-code | Statut vérification |
|---|---|---|
| application software | **Q166142** | ✅ vérifié (label = "application software", desc = "software program or group of programs designed for end-users") |
| macOS | **Q14116** | ✅ vérifié |
| Apple silicon | **Q406283** | ✅ vérifié (le Q66061250 cité dans le brief était faux) |
| x86-64 | **Q272629** | ✅ vérifié (le Q729466 cité dans le brief était faux — Q729466 est autre chose) |
| proprietary software | **Q218616** | ✅ vérifié |
| freemium | **Q1444631** | ✅ vérifié (le Q1063769 cité dans le brief était faux) |
| France | **Q142** | ✅ vérifié |
| English language | **Q1860** | ✅ vérifié |
| French language | **Q150** | ✅ standard, non re-vérifié |
| Spanish language | **Q1321** | ✅ standard, non re-vérifié |
| German language | **Q188** | ✅ standard, non re-vérifié |
| sole proprietorship | **Q2912172** | ✅ vérifié (général ; sitelink frwiki = "Entreprise individuelle"). Le Q3045257 cité dans le brief était faux (= OSS Detachment 101, unité militaire WWII) |
| Axel Courty | *(à créer si nécessaire — pas encore de Q-item personnel ; on peut référencer via P50 "author" en string ou créer un item Q personne séparé)* | — |

### Table des propriétés à déclarer

| Propriété | Code | Valeur (Q ou string) | Valeur en clair | Rang | Référence |
|---|---|---|---|---|---|
| instance of | **P31** | Q166142 | application software | normal | site officiel + press kit |
| developer | **P178** | *(string ou item Axel Courty)* | Axel Courty | normal | press kit + mentions légales |
| publisher | **P123** | *(string Axel Courty)* | Axel Courty | normal | press kit |
| owned by | **P127** | *(string Axel Courty)* | Axel Courty | normal | RCS Bordeaux 105 093 058 |
| operating system | **P306** | Q14116 | macOS | normal | site officiel (system requirements) |
| platform | **P400** | Q14116 | macOS | normal | site officiel |
| copyright license | **P275** | Q218616 | proprietary software | normal | mentions légales site officiel |
| business model | **P2840** | Q1444631 | freemium | normal | page pricing du site |
| country of origin | **P495** | Q142 | France | normal | RCS Bordeaux |
| language of work or name | **P407** | Q1860 | English | normal | site officiel (sélecteur de langue) |
| language of work or name | **P407** | Q150 | French | normal | site officiel |
| language of work or name | **P407** | Q1321 | Spanish | normal | site officiel |
| language of work or name | **P407** | Q188 | German | normal | site officiel |
| inception | **P571** | +2026-05-19 | date immatriculation | normal | INSEE/RCS Bordeaux |
| official website | **P856** | https://notchia.app | — | preferred | self |
| logo image | **P154** | *(commons file)* | — | normal | logo à uploader sur Commons |
| legal form | **P1454** | Q2912172 | sole proprietorship (entreprise individuelle) | normal | RCS Bordeaux 105 093 058 |
| French SIREN number | **P3215** | 105093058 | — | normal | INSEE Sirene |
| described at URL | **P973** | https://notchia.app/press | press kit | normal | self |

### Propriétés à NE PAS déclarer

- **P1324** (source code repository) : NotchIA est **propriétaire**, pas de repo public.
- **P275** (copyright license) avec une valeur spécifique type "MIT" : c'est du propriétaire générique.
- Captures d'écran (P18) : facultatif, à ajouter après une fois que le logo est sur Commons.

---

## 3. Labels et aliases multilingues

```
LABELS
en: NotchIA
fr: NotchIA
es: NotchIA
de: NotchIA
it: NotchIA
pt: NotchIA

DESCRIPTIONS
en: macOS application turning the MacBook notch into an AI productivity control center
fr: application macOS transformant l'encoche du MacBook en centre de contrôle IA pour la productivité
es: aplicación macOS que convierte la muesca del MacBook en un centro de control de IA
de: macOS-Anwendung, die den MacBook-Notch in ein KI-Produktivitätszentrum verwandelt

ALIASES
en: NotchIA app, NotchIA macOS, Notch AI
fr: NotchIA application, app NotchIA, l'app NotchIA
es: NotchIA app, aplicación NotchIA
de: NotchIA App, NotchIA Anwendung
```

**Note** : "NotchIA" est identique dans les 4 langues (nom propre). Les descriptions diffèrent.

---

## 4. Script QuickStatements V1 — prêt-à-coller

> Format : un statement par ligne. `LAST` réfère à l'item créé par `CREATE` dans le batch courant.
> Ouvrir https://quickstatements.toolforge.org → onglet "New batch" → coller le bloc ci-dessous → "Import V1 commands" → "Run".

```
CREATE
LAST	Len	"NotchIA"
LAST	Lfr	"NotchIA"
LAST	Les	"NotchIA"
LAST	Lde	"NotchIA"
LAST	Lit	"NotchIA"
LAST	Lpt	"NotchIA"
LAST	Den	"macOS application turning the MacBook notch into an AI productivity control center"
LAST	Dfr	"application macOS transformant l'encoche du MacBook en centre de contrôle IA pour la productivité"
LAST	Des	"aplicación macOS que convierte la muesca del MacBook en un centro de control de IA"
LAST	Dde	"macOS-Anwendung, die den MacBook-Notch in ein KI-Produktivitätszentrum verwandelt"
LAST	Aen	"NotchIA app"
LAST	Aen	"NotchIA macOS"
LAST	Afr	"app NotchIA"
LAST	Afr	"application NotchIA"
LAST	P31	Q166142	S854	"https://notchia.app"	S813	+2026-05-27T00:00:00Z/11
LAST	P306	Q14116	S854	"https://notchia.app"	S813	+2026-05-27T00:00:00Z/11
LAST	P400	Q14116	S854	"https://notchia.app"	S813	+2026-05-27T00:00:00Z/11
LAST	P275	Q218616	S854	"https://notchia.app/legal"	S813	+2026-05-27T00:00:00Z/11
LAST	P2840	Q1444631	S854	"https://notchia.app/#pricing"	S813	+2026-05-27T00:00:00Z/11
LAST	P495	Q142	S854	"https://annuaire-entreprises.data.gouv.fr/entreprise/105093058"	S813	+2026-05-27T00:00:00Z/11
LAST	P407	Q1860	S854	"https://notchia.app"	S813	+2026-05-27T00:00:00Z/11
LAST	P407	Q150	S854	"https://notchia.app"	S813	+2026-05-27T00:00:00Z/11
LAST	P407	Q1321	S854	"https://notchia.app"	S813	+2026-05-27T00:00:00Z/11
LAST	P407	Q188	S854	"https://notchia.app"	S813	+2026-05-27T00:00:00Z/11
LAST	P571	+2026-05-19T00:00:00Z/11	S854	"https://annuaire-entreprises.data.gouv.fr/entreprise/105093058"	S813	+2026-05-27T00:00:00Z/11
LAST	P856	"https://notchia.app"
LAST	P1454	Q2912172	S854	"https://annuaire-entreprises.data.gouv.fr/entreprise/105093058"	S813	+2026-05-27T00:00:00Z/11
LAST	P3215	"105093058"	S854	"https://annuaire-entreprises.data.gouv.fr/entreprise/105093058"	S813	+2026-05-27T00:00:00Z/11
LAST	P973	"https://notchia.app/press"	S854	"https://notchia.app/press"	S813	+2026-05-27T00:00:00Z/11
LAST	P178	"""Axel Courty"""	S854	"https://notchia.app/press"	S813	+2026-05-27T00:00:00Z/11
LAST	P127	"""Axel Courty"""	S854	"https://annuaire-entreprises.data.gouv.fr/entreprise/105093058"	S813	+2026-05-27T00:00:00Z/11
```

### Notes sur le format

- `S854` = "reference URL" (preuve)
- `S813` = "retrieved" (date à laquelle la source a été consultée) — format date ISO + précision `/11` (jour)
- `Len/Lfr/...` = Label dans la langue donnée
- `Den/Dfr/...` = Description dans la langue donnée
- `Aen/Afr/...` = Alias dans la langue donnée
- `+2026-05-19T00:00:00Z/11` = date avec précision jour
- Les triple-quotes `"""Axel Courty"""` sur P178/P127 sont pour **string value** (pas un item Wikidata). Si un Q-item personne pour Axel Courty est créé plus tard, remplacer par le Q-code.

### Variante avec Axel Courty comme Q-item séparé

Si on veut créer aussi un item personne (recommandé seulement si Axel Courty a une notabilité publique au-delà de NotchIA — actuellement non) :

```
CREATE
LAST	Len	"Axel Courty"
LAST	Den	"French software developer, founder of NotchIA"
LAST	P31	Q5	S854	"https://notchia.app/press"	S813	+2026-05-27T00:00:00Z/11
LAST	P27	Q142
LAST	P106	Q5482740	S854	"https://notchia.app/press"	S813	+2026-05-27T00:00:00Z/11
```
(Q5 = human, Q5482740 = programmer, P27 = country of citizenship, P106 = occupation)

→ Puis dans le batch NotchIA, remplacer `"""Axel Courty"""` par le nouveau Q-code (ex: `Q123456789`).

**Recommandation** : ne PAS créer d'item personne pour l'instant — risque de suppression pour notabilité insuffisante. Garder Axel Courty en string sur P178/P127, le passer en Q-item plus tard si la presse couvre le créateur.

---

## 5. Instructions de soumission — étape par étape

1. **Créer un compte Wikidata** (si pas déjà fait) sur https://www.wikidata.org/wiki/Special:CreateAccount
   - Confirmer l'email
   - Faire au moins **4 éditions mineures** sur des items existants AVANT de tenter QuickStatements (sinon l'outil refuse).
2. **Aller sur QuickStatements** : https://quickstatements.toolforge.org/
3. **Autoriser l'app** : cliquer "Log in" en haut à droite → s'authentifier via OAuth Wikidata → autoriser l'app à éditer.
4. **Nouveau batch** : onglet "New batch" → coller le bloc QuickStatements V1 du §4 → "Import V1 commands".
5. **Prévisualiser** : QuickStatements affiche un diff. Vérifier :
   - Le `CREATE` génère bien un nouveau Q-item.
   - Aucune ligne en rouge (erreur de syntaxe).
6. **Run** : cliquer "Run". L'exécution prend ~30 secondes.
7. **Récupérer le Q-id** : à la fin, QuickStatements affiche `Q[numéro]` — noter ce numéro.
8. **Vérifier l'item** : aller sur `https://www.wikidata.org/wiki/Q[numéro]` et confirmer que tout est présent.
9. **Ajouter le logo (optionnel mais recommandé)** :
   - Uploader `logo.png` sur https://commons.wikimedia.org/wiki/Special:Upload sous licence libre (CC-BY-SA 4.0 ou similaire) avec consentement d'auteur. Attention : le logo doit être autorisé pour usage libre.
   - Une fois sur Commons, ajouter P154 sur le Q-item via l'interface Wikidata.

---

## 6. Une fois le Q-item créé : actions de suivi

### Dans le repo `notchia-website` :

- **`index.html`** : dans le JSON-LD schema.org Organization, ajouter `https://www.wikidata.org/wiki/Q[numéro]` au tableau `sameAs`.
- **`index.html`** : idem dans le schema.org SoftwareApplication.
- **`llms.txt`** et **`llms-full.txt`** : ajouter la ligne `Wikidata: https://www.wikidata.org/wiki/Q[numéro]`.
- **`marketing/off-site/wikipedia-draft-fr.md`** et **`wikipedia-draft-en.md`** : ajouter une référence "Voir aussi" vers le Q-item.
- **`marketing/off-site/source-entry-map.md`** : marquer la ligne Wikidata comme `done` avec le Q-id.

### En externe :

- Ajouter le Q-id sur la fiche **Crunchbase** (champ "external IDs").
- Ajouter sur la fiche **Product Hunt** (about section, "find us on Wikidata").
- Mentionner dans le **press kit** (`/press`).

---

## 7. Risques et précautions

| Risque | Mitigation |
|---|---|
| Item proposé en suppression (notabilité) | Démarrer avec 12+ propriétés sourcées externes. Surveiller la page "Watchlist" Wikidata les 14 premiers jours. |
| Anti-spam / blocage compte | Faire 4-5 éditions mineures sur d'autres items AVANT QuickStatements. Ne pas créer 100 statements en une seule fois. |
| Référence "self-published only" rejetée | Compléter chaque statement avec **au moins une source externe vérifiable** : annuaire-entreprises.data.gouv.fr (RCS), pappers.fr (équivalent), sirene.fr. Pas que notchia.app. |
| Description trop promo | Wikidata exige des descriptions **factuelles**, pas marketing. Pas de "best", "innovative", "leading". |
| Logo non libre sur Commons | Si le logo n'est pas releasable sous CC : skip P154 pour l'instant. Mieux que de se faire bloquer sur Commons. |
| Conflit d'intérêts (COI) | Sur Wikidata, le COI est moins strict que sur Wikipedia. Mais marquer transparemment via [#WD:COI](https://www.wikidata.org/wiki/Wikidata:WikiProject_COI) si nécessaire. |

### Bonnes pratiques d'enrichissement progressif

**Semaine 1** : batch initial (~25 statements ci-dessus).
**Semaine 2** : ajouter P18 (image), P10 (vidéo démo) si disponible, P1324 (forum/support URL).
**Semaine 3** : ajouter `sameAs` vers Product Hunt, Crunchbase, MacUpdate (P2002 = Twitter, P2003 = Instagram, etc.).
**Semaine 4** : si presse paraît, ajouter P1343 (described by source) avec items presse.

---

## 8. Q-codes vérifiés vs supposés

### Q-codes vérifiés sur wikidata.org le 2026-05-27 (✅)

| Q-code | Concept | Status |
|---|---|---|
| Q166142 | application software | ✅ vérifié |
| Q14116 | macOS | ✅ vérifié |
| Q406283 | Apple silicon | ✅ vérifié (**corrigé** — brief disait Q66061250 = clinical trial sur cancer prostate, FAUX) |
| Q272629 | x86-64 | ✅ vérifié (**corrigé** — brief disait Q729466) |
| Q218616 | proprietary software | ✅ vérifié |
| Q1444631 | freemium | ✅ vérifié (**corrigé** — brief disait Q1063769 = hameau russe, FAUX) |
| Q142 | France | ✅ vérifié |
| Q1860 | English language | ✅ vérifié |
| Q2912172 | sole proprietorship | ✅ vérifié (**corrigé** — brief disait Q3045257 = OSS Detachment 101 militaire, FAUX) |

### Q-codes standards non re-vérifiés (mais bien connus, ✅ confiance élevée)

| Q-code | Concept |
|---|---|
| Q150 | French language |
| Q1321 | Spanish language |
| Q188 | German language |
| Q5 | human |
| Q5482740 | programmer |

### Propriétés Wikidata (P) — référencées dans la documentation officielle

Toutes les propriétés P listées (P31, P178, P306, P400, P275, P2840, P495, P407, P571, P856, P154, P1454, P3215, P973, P127, P123, P3215, S854, S813) sont standard et documentées sur https://www.wikidata.org/wiki/Wikidata:List_of_properties.

---

## Annexe : exemples de Q-items software similaires (pour inspiration)

Pour calibrer le niveau de complétude attendu, voir comment d'autres petites apps macOS sont structurées sur Wikidata :

- **Raycast** → https://www.wikidata.org/wiki/Q108239925
- **Alfred (software)** → https://www.wikidata.org/wiki/Q4724480
- **Bartender** → chercher sur Wikidata
- **CleanShot X** → vérifier si Q-item existe

→ Reproduire le niveau de granularité de Raycast (référence proche en taille/marché).
