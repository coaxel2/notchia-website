# Audit Stripe — NotchIA

**Date de l'audit** : 2026-05-27
**Auditeur** : revue interne backend / conformité FR
**Scope** : `functions/api/stripe/{checkout,portal,webhook}.js`, `functions/api/license/{_crypto,validate}.js`, `schema.sql`, `STRIPE_SETUP.md`
**Statut prod** : en production depuis 2026-05-21, tunnel complet fonctionnel.

---

## 1. Architecture actuelle

```
                ┌──────────────────────────────────────────────────────────┐
                │                       NotchIA tunnel paiement                       │
                └──────────────────────────────────────────────────────────┘

  Client                Cloudflare Pages Function           Stripe                  D1 + Resend
  ──────                ───────────────────────────         ──────                  ───────────

  /pricing
    │
    │ POST /api/stripe/checkout
    │ { plan, email?, lang }
    │ ────────────────────────────►  checkout.js
    │                                │
    │                                │ POST /v1/checkout/sessions
    │                                │ + consent_collection.terms_of_service=required
    │                                │ + custom_text[L221-28 13°]
    │                                │ + metadata[plan,lang,withdrawal_waiver]
    │                                │ ────────────────────────────►  Stripe API
    │                                │                                │
    │                                │ ◄────────────────────────────  { url, id }
    │ ◄──────────────────────────── { url }
    │
    │ window.location → checkout.stripe.com/...
    │ ────────────────────────────────────────────────────────────►  Stripe Checkout (UI hosted)
    │                                                                │
    │                                                                │ paiement OK
    │                                                                │
    │ ◄────────────────────────────────────────────────────────────  redirect /account?session_id=cs_xxx
    │                                                                │
    │                                                                │ async
    │                                                                ▼
    │                                webhook.js   ◄──────  POST /api/stripe/webhook
    │                                │                       Stripe-Signature: t=…,v1=…
    │                                │
    │                                │ 1. verifyStripeSignature() — HMAC-SHA256 constant-time
    │                                │ 2. INSERT OR IGNORE webhook_events (idempotence)
    │                                │ 3. dispatch event.type
    │                                │
    │                                │ ─────────────────────────►  generateLicenseKey()
    │                                │                              (Ed25519 / WebCrypto)
    │                                │ ◄─────────────────────────  "nia_live_<b64>.<sig>"
    │                                │
    │                                │ INSERT INTO licenses ─────────────►  D1
    │                                │
    │                                │ POST /emails  ─────────────────────►  Resend
    │                                │                                       │
    │                                │                                       ▼
    │                                                                  Email avec clé Pro

  App macOS
    │
    │ POST /api/license/validate     validate.js
    │ { key, device_id } ──────────► │ 1. verifyLicenseKey() (Ed25519 offline-equivalent)
    │                                │ 2. SELECT licenses WHERE key=?
    │                                │ 3. check status / expires_at / devices
    │ ◄──────────────────────────── { valid, plan, status, active_devices }
```

---

## 2. Sécurité

### 2.1 Vérification de signature Stripe — OK

`functions/api/license/_crypto.js` lignes 165-190 :

- Parse strict du header `Stripe-Signature` (`t=...,v1=...`).
- Tolérance temporelle **300 s par défaut** (paramètre).
- HMAC-SHA256 via WebCrypto sur `${t}.${rawBody}`.
- **Comparaison constant-time** explicite via XOR cumulatif (lignes 186-189) : OK, pas vulnérable au timing attack.
- Header manquant ou format cassé → `false`.

```js
// ligne 186-189 — constant-time compare correct
let diff = 0;
for (let i = 0; i < hex.length; i++) diff |= hex.charCodeAt(i) ^ v1.charCodeAt(i);
return diff === 0;
```

✅ **Strict, conforme aux bonnes pratiques Stripe.**

⚠️ **Sévérité INFO** : la fonction ne gère **qu'une seule signature `v1=`** alors qu'un header Stripe peut en contenir plusieurs (rotation de webhook secrets). Si tu fais un jour `whsec_xxx` rotation, le code casse pendant la fenêtre de transition. À hardener (voir §6 reco 5).

### 2.2 Lecture des secrets — OK

Tous les secrets sont lus depuis `env` (bindings Cloudflare Pages) :
- `STRIPE_SECRET_KEY` (checkout.js, portal.js)
- `STRIPE_WEBHOOK_SECRET` (webhook.js)
- `LICENSE_PRIVATE_KEY`, `LICENSE_PUBLIC_KEY`
- `RESEND_API_KEY`

✅ Aucun secret hardcodé trouvé dans le code (`grep -i "sk_live\|whsec_\|re_[A-Z0-9]" functions/` → 0 résultat).

### 2.3 Idempotence — OK avec une réserve

`webhook.js` lignes 58-68 :

```js
const existing = await env.DB
  .prepare("SELECT id, processed FROM webhook_events WHERE id = ?")
  .bind(event.id).first();
if (existing && existing.processed === 1) {
  return json({ ok: true, duplicate: true });
}
await env.DB
  .prepare("INSERT OR IGNORE INTO webhook_events (...) VALUES (?, ?, ?, 0)")
  .bind(event.id, event.type, Math.floor(Date.now() / 1000))
  .run();
```

✅ Bonne pratique : table `webhook_events` avec PK = `event.id`, `INSERT OR IGNORE` + flag `processed`.

⚠️ **Sévérité MOYENNE — race condition possible** :
Entre `SELECT` (existing) et `INSERT OR IGNORE`, si deux retries Stripe arrivent en parallèle (très rare mais possible), les deux peuvent passer le `SELECT` (processed=0), puis exécuter `handleCheckoutCompleted` qui fera deux `INSERT INTO licenses` → **deux licences générées** pour le même paiement.

Mitigations existantes :
- D1 SQLite est mono-writer → un INSERT échoue normalement.
- Mais la clé `licenses.key` est dérivée du **session_id Stripe** via `shortHash` (16 chars hex de SHA256). Donc deux events `checkout.session.completed` pour la même session généreront la **même** `licenseKey` → l'INSERT échoue avec UNIQUE constraint sur `key` (PRIMARY KEY). Bon.
- **Sauf** que `jti` est dans le payload signé, donc si deux retries arrivent, le payload est identique → la signature aussi → la `licenseKey` aussi → UNIQUE constraint protège.

✅ En pratique, idempotence sauvée par l'unicité de `licenses.key`. Mais le code ne loggue pas explicitement la collision : il `throw` et Stripe re-retry pendant 3 jours. Recommandation : `INSERT OR IGNORE INTO licenses` ou wrapper try/catch sur le INSERT (voir §6 reco 1).

### 2.4 Surface d'attaque endpoints publics

| Endpoint | Méthode | Auth | Risques |
|---|---|---|---|
| `POST /api/stripe/checkout` | POST | aucune | spam de création de sessions (gratuit côté Stripe mais nous on paie ø). Rate-limit absent. |
| `POST /api/stripe/portal` | POST | email-only | **MOYENNE** : si Alice connaît l'email de Bob, elle peut ouvrir le portail de Bob → voir/annuler ses abos. Le commentaire (`portal.js` ligne 13-18) reconnaît ce trou : "court-circuit ici". |
| `POST /api/stripe/webhook` | POST | signature Stripe | OK. |
| `POST /api/license/validate` | POST | clé valide | la clé étant signée Ed25519, la lookup en D1 ne fuite que pour les détenteurs légitimes. OK. |

⚠️ **Sévérité HAUTE — portal.js** : pas de magic-link / token email. Un attaquant qui connaît `alice@example.com` peut récupérer une URL `billing.stripe.com/p/session/...` et **annuler son abonnement, voir ses factures, changer sa carte**. C'est le bloquant le plus visible.

### 2.5 CORS

- `checkout.js` et `portal.js` exposent `Access-Control-Allow-Origin: *`.
- Pas un risque direct (les endpoints attendent du JSON et créent des sessions Stripe, pas de cookie partagé), mais à durcir à `https://notchia.app` en prod (voir §6 reco 4).

---

## 3. Webhook events

### 3.1 Events listened (dans le code `webhook.js`)

| Event | Handler | Action |
|---|---|---|
| `checkout.session.completed` | `handleCheckoutCompleted` | Génère licence Ed25519, INSERT en D1, email Resend |
| `invoice.payment_succeeded` | `handleInvoicePaid` | UPDATE expires_at += 31j, status='active' |
| `invoice.payment_failed` | `handlePaymentFailed` | UPDATE status='expired' |
| `customer.subscription.deleted` | `handleSubscriptionDeleted` | UPDATE status='cancelled' |
| `charge.refunded` | `handleChargeRefunded` | UPDATE status='refunded' |

### 3.2 Events à ajouter (recommandés)

| Event | Pourquoi |
|---|---|
| `customer.subscription.updated` | **CRITIQUE manquant** : changement de plan, pause, ré-activation, mise à jour de la quantité → on rate ces transitions. Notamment si Stripe Smart Retries ré-active une sub en `past_due` → on n'a aucun moyen de la repasser en `active`. |
| `customer.subscription.trial_will_end` | Si tu introduis un essai gratuit (par ex. via promotion_code). |
| `payment_intent.payment_failed` | Lifetime : si le paiement échoue côté carte (vs. invoice échec côté sub), aucun handler. |
| `charge.dispute.created` | **HAUTE priorité** : tu n'es pas alerté quand un client ouvre un chargeback. Tu rates la fenêtre de 7 jours pour répondre. Conséquence : tu perds le procès par défaut + 15 € de fees + montant. |
| `radar.early_fraud_warning.created` | Stripe Radar prévient des paiements probablement frauduleux 1-2 j avant le chargeback. Permet d'envoyer un refund proactif. |

### 3.3 Cas d'erreur non couverts

- `handleChargeRefunded` ne gère pas les **remboursements partiels** (`amount_refunded < amount`). Pour un lifetime à 24,99 €, un refund partiel de 5 € → status='refunded' alors que le client garde le droit d'usage. **Sévérité BASSE** (Stripe lifetime → rare remboursement partiel).
- `handlePaymentFailed` passe direct en `expired`. Stripe envoie pourtant `invoice.payment_failed` à chaque tentative. Au 1er échec on devrait passer en `past_due`, pas couper. **Sévérité MOYENNE** : un faux-positif sur la carte coupe immédiatement le service.

---

## 4. Conformité légale FR

### 4.1 Article L221-28 13° — Renoncement au droit de rétractation ✅ OK

Déjà géré depuis le commit `821c215` (2026-05-13).

`checkout.js` lignes 96-109 :
- `consent_collection[terms_of_service] = required` → Stripe force la case obligatoire.
- `custom_text[terms_of_service_acceptance][message]` injecte le texte du renoncement exprès en 4 langues (FR/EN/ES/DE).
- `metadata[withdrawal_waiver] = "L221-28-13"` → traçabilité sur l'event webhook.
- CGV article 5 (`cgv.html` ligne 134-137) documente le renoncement.
- `refund.html` documente la politique.

✅ **Solide**. Recommandation : conserver la `metadata[withdrawal_waiver]` côté D1 (actuellement non persistée) pour pouvoir produire la preuve si litige.

### 4.2 Article L221-5 — Informations pré-contractuelles

| Mention obligatoire | Statut |
|---|---|
| Identité du professionnel (nom, raison sociale) | ✅ Mentions légales |
| Adresse géographique | ✅ Mentions légales (Talence) |
| Email, téléphone, fax | ✅ Email présent. ⚠️ Pas de téléphone (recommandé pour B2C). |
| Prix TTC | ✅ Pricing |
| Caractéristiques essentielles du bien | ✅ Pricing, features |
| Modalités de paiement, livraison, exécution | ✅ CGV art 3, 4 |
| Garanties légales (conformité, vices cachés) | ✅ CGV art 6 |
| Droit de rétractation + formulaire type ou non-applicabilité | ✅ CGV art 5 (non-applicabilité justifiée L221-28 13°) |
| Durée du contrat / résiliation (abonnement) | ✅ CGV art 3 + portail Stripe |
| **Médiateur de la consommation (L612-1)** | ⚠️ **EN COURS** — voir §4.3 |

### 4.3 Article L612-1 — Médiation consommateur ⚠️ BLOQUANT

`cgv.html` art. 11 dit explicitement : *« Désignation du médiateur en cours »*.

**Statut légal** : non-conforme. Tout professionnel B2C français doit :
1. Adhérer à **un** dispositif de médiation conventionnée (gratuite pour le consommateur).
2. Afficher les **coordonnées + URL de saisine** :
   - sur le site web (footer + CGV)
   - dans les CGV
   - sur les emails / bons de commande / factures
3. Renseigner ces infos sur le **portail RLL européen** (`ec.europa.eu/consumers/odr`).

**Sanction** : amende administrative jusqu'à **15 000 €** (personne morale) / **3 000 €** (personne physique), art. L641-1 Code conso. La DGCCRF peut sanctionner sur simple constat lors d'un contrôle.

→ Voir `marketing/legal/mediateur-template.md` pour le détail de choix et procédure.

### 4.4 Mentions légales — RCS / SIRET / TVA ✅ OK

`mentions-legales.html` contient :
- COURTY Axel (nom commercial NotchIA)
- RCS Bordeaux 105 093 058 (immatriculé 2026-05-19)
- N° TVA intra FR86105093058 (commit `57ca0b2`)
- Adresse Talence
- APE 4791B
- Hébergeur Cloudflare

✅ Conforme art. L122-3 Code consommation + art. R123-237 Code de commerce.

### 4.5 Facturation — numéro séquentiel + archivage ⚠️ NON GÉRÉ EN INTERNE

**Légalement obligatoire** :
- Numéro de facture unique, basé sur une **séquence continue** sans rupture (art. 242 nonies A annexe II CGI).
- Mentions obligatoires : date d'émission, identité vendeur/acheteur, désignation produit, prix HT/TTC, n° TVA si > seuil, mention "TVA non applicable, art. 293 B du CGI" (franchise en base).
- **Archivage 10 ans** (art. L123-22 Code de commerce).

**Actuel chez NotchIA** :
- Stripe émet automatiquement des **invoices** (factures) numérotées (`INV-NNNN`). Numérotation continue **côté Stripe** ✅.
- Disponibles via le **Customer Portal** ✅.
- Mention "TVA non applicable, art. 293 B du CGI" → **à vérifier** dans Stripe Dashboard → Tax settings. Si non configurée, les factures Stripe affichent un montant sans mention TVA → non-conforme.
- Archivage : Stripe garde l'historique tant que le compte existe. Bonne pratique : **export trimestriel CSV** des invoices + sauvegarde locale (10 ans légal).

⚠️ **Sévérité MOYENNE** : vérifier que Stripe Invoices affiche la mention franchise en base de TVA.

---

## 5. Bloquants prod identifiés

Classés par sévérité.

| # | Sévérité | Bloquant | Impact | Fix |
|---|---|---|---|---|
| 1 | 🔴 **HAUTE** | `portal.js` — pas de magic-link, n'importe qui avec un email valide ouvre le portail | Annulation d'abos / fuite factures / changement carte par un tiers | Implémenter un magic-link signé envoyé par email avant ouverture du portail |
| 2 | 🔴 **HAUTE** | Médiateur consommation non désigné (L612-1) | Amende DGCCRF jusqu'à 15 000 € | Adhérer à MEDICYS ou CM2C (voir `mediateur-template.md`), mettre à jour CGV art. 11 + footer + email confirmation |
| 3 | 🟠 **MOYENNE** | Pas de handler `charge.dispute.created` | Chargebacks perdus par défaut (montant + 15 €) | Ajouter handler, envoi alerte email à axelcourty1@gmail.com |
| 4 | 🟠 **MOYENNE** | Pas de handler `customer.subscription.updated` | Manque les transitions past_due → active, plan changes | Ajouter handler avec UPDATE sur status + expires_at |
| 5 | 🟠 **MOYENNE** | Mention "TVA non applicable, art. 293 B CGI" à vérifier sur Stripe Invoices | Factures non-conformes / risque redressement | Stripe Dashboard → Tax → ajouter "Customer tax IDs" + custom field "Mention TVA" |
| 6 | 🟠 **MOYENNE** | Pas de rate-limit sur `/api/stripe/checkout` | Spam de création de sessions, log noise | Cloudflare Rate Limiting rule : 10 req/min/IP |
| 7 | 🟠 **MOYENNE** | `handlePaymentFailed` coupe immédiat sans grace period | Faux-positifs carte → coupure service immédiate | Passer en `past_due` au 1er échec, attendre `customer.subscription.deleted` |
| 8 | 🟡 **BASSE** | Webhook secret rotation pas supportée (1 seul `v1=`) | Si rotation `whsec_`, fenêtre downtime | Itérer sur toutes les signatures `v1=` du header |
| 9 | 🟡 **BASSE** | `metadata[withdrawal_waiver]` pas persistée en D1 | Preuve du renoncement à fournir manuellement via Stripe Dashboard | Ajouter colonne `withdrawal_waiver` dans `licenses`, persister à l'INSERT |
| 10 | 🟡 **BASSE** | CORS `*` sur checkout/portal | Cosmétique mais à durcir | Restreindre à `https://notchia.app` |

---

## 6. Recommandations de hardening

Top 5 actions concrètes à exécuter dans l'ordre.

### Reco 1 — Sécuriser le Customer Portal avec un magic-link

`functions/api/stripe/portal.js` doit changer de flow :

1. Phase 1 : `POST /api/stripe/portal` reçoit `{ email }` → si l'email existe en D1, **envoyer un magic-link** signé (HMAC ou JWT court avec exp 15 min) à `email` via Resend. Toujours renvoyer `{ ok: true }` (pas de leak d'existence d'email).
2. Phase 2 : `GET /api/stripe/portal?token=...` valide le token, ouvre la session Billing Portal, redirige.

Effort : ~2 h. Réutiliser le code Ed25519 (`_crypto.js`) avec un secret distinct ou directement un HMAC-SHA256.

### Reco 2 — Ajouter handlers webhook manquants

```js
case "customer.subscription.updated":
  await handleSubscriptionUpdated(event.data.object, env);
  break;
case "charge.dispute.created":
  await handleDisputeCreated(event.data.object, env);
  break;
case "radar.early_fraud_warning.created":
  await handleFraudWarning(event.data.object, env);
  break;
```

Dans Stripe Dashboard → Webhook endpoint, **cocher ces 3 events**.

Pour `dispute.created` : envoyer un email d'alerte à `axelcourty1@gmail.com` avec le `dispute.id`, le `customer.email`, le `amount`, le `reason`, et le lien vers Stripe Dashboard pour répondre dans les 7 jours.

### Reco 3 — Idempotence durcie sur `licenses`

Ajouter `INSERT OR IGNORE` ou un try/catch explicite sur le `INSERT INTO licenses` dans `handleCheckoutCompleted` :

```js
try {
  await env.DB.prepare(`INSERT INTO licenses ...`).bind(...).run();
} catch (e) {
  if (String(e).includes("UNIQUE")) {
    console.log("License already exists for session", session.id);
    return; // duplicate retry — ne pas renvoyer d'email
  }
  throw e;
}
```

Sinon : sur retry Stripe, un re-INSERT échoue avec UNIQUE → handler throw → Stripe pense que c'est cassé et continue de retry pendant 3 jours.

### Reco 4 — Rate-limit + CORS scope

1. Cloudflare Pages → Rules → Rate Limiting :
   - `/api/stripe/checkout` → 10 req/min/IP
   - `/api/stripe/portal` → 5 req/min/IP
   - `/api/license/validate` → 60 req/min/IP (app macOS appelle hebdo)
2. Remplacer `Access-Control-Allow-Origin: *` par :
   ```js
   const ALLOWED = new Set(["https://notchia.app", "http://localhost:8788"]);
   function corsHeaders(origin) {
     return ALLOWED.has(origin)
       ? { "Access-Control-Allow-Origin": origin, ... }
       : { "Access-Control-Allow-Origin": "https://notchia.app", ... };
   }
   ```

### Reco 5 — Support multi-signature webhook + rotation Ed25519

1. `verifyStripeSignature` doit accepter **toutes** les signatures `v1=...` du header :
   ```js
   const sigs = sigHeader.split(",")
     .filter(s => s.startsWith("v1="))
     .map(s => s.slice(3));
   // ... HMAC compute hex ...
   return sigs.some(s => constantTimeEq(hex, s));
   ```
2. Permettre `STRIPE_WEBHOOK_SECRET` **et** `STRIPE_WEBHOOK_SECRET_OLD` pendant la rotation.
3. Symétriquement pour Ed25519 : accepter `LICENSE_PUBLIC_KEY` **et** `LICENSE_PUBLIC_KEY_OLD` dans `validate.js`. Voir `scripts/rotate-license-keys.sh`.

---

## 7. Conclusion

Le tunnel est **solide en cryptographie** (HMAC constant-time, Ed25519 WebCrypto, idempotence par PK D1).

Les vrais risques sont :
1. **Légal** — médiateur consommateur à désigner (sanction DGCCRF possible).
2. **Sécurité produit** — Customer Portal ouvrable sans preuve de possession de l'email.
3. **Opérations** — chargebacks aveugles (pas de handler dispute) et transitions de sub non gérées.

Une fois les 5 recos appliquées, le tunnel est prêt pour scale jusqu'à quelques centaines d'achats/mois sans surveillance manuelle.
