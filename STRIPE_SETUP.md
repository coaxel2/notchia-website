# Setup Stripe en prod — NotchIA

Guide étape par étape pour activer les paiements réels.

## 1. Activer le compte Stripe avec ton KBis

1. Va sur https://dashboard.stripe.com → si tu es encore en test mode, bascule "View test data" OFF en haut.
2. Bouton **Activate account** en haut à droite (si pas encore fait).
3. Remplis les sections demandées :
   - **Business type** : Individual / Sole proprietorship
   - **Legal business name** : COURTY Axel
   - **Business structure** : Sole proprietorship (entreprise individuelle)
   - **SIREN** : 105 093 058
   - **Business address** : Bâtiment D Porte 256, 64 Rue Lamartine, 33400 Talence
   - **Industry / MCC** : `5734 - Computer Software Stores` ou `7372 - Computer Programming`
   - **Website** : https://notchia.app
   - **Date of birth** : 23/10/2005
   - **VAT** : décocher / "Not VAT-registered" (franchise en base art. 293 B CGI)
4. Upload :
   - **Pièce d'identité** : recto-verso CNI ou passeport
   - **KBis** : le PDF reçu (Extrait Kbis 13946383)
5. **Banking** : IBAN du compte qui recevra les paiements
6. **2FA** : activer (recommandé, ~1 min)
7. Submit → Stripe valide sous 24-48 h.

## 2. Créer les 2 produits dans Stripe Dashboard

(Tu peux le faire AVANT que l'activation soit validée, en mode live.)

Dashboard → **Products** → **+ Add product** :

### Produit 1 : NotchIA Pro Monthly

- **Name** : NotchIA Pro
- **Description** : Live AI tabs + Shelf + clipboard history + converter
- **Pricing** :
  - Type : **Recurring**
  - Price : `3.99 EUR`
  - Billing period : **Monthly**
- Save → note le **Price ID** (commence par `price_`) → c'est `STRIPE_PRICE_MONTHLY`

### Produit 2 : NotchIA Pro Lifetime

- **Name** : NotchIA Pro Lifetime
- **Pricing** :
  - Type : **One-time**
  - Price : `39.99 EUR`
- Save → note le **Price ID** → c'est `STRIPE_PRICE_LIFETIME`

## 3. Créer une API key restricted

Dashboard → **Developers → API keys** → **+ Create restricted key**

- Name : `notchia-pages-functions`
- Permissions :
  - **Checkout Sessions** : Write
  - **Billing Portal Sessions** : Write
  - **Customers** : Read
  - **Subscriptions** : Read
  - **Invoices** : Read
  - Tout le reste : None
- Save → copie la clé `rk_live_xxx` ou `sk_live_xxx` → c'est `STRIPE_SECRET_KEY`

⚠️ Cette clé ne sera affichée qu'une fois. Sauvegarde-la dans 1Password.

## 4. Configurer la base D1

```bash
# Installer wrangler si pas déjà fait
npm install -g wrangler
wrangler login

# Créer la base
wrangler d1 create notchia-licenses
# → note le database_id renvoyé

# Appliquer le schema
wrangler d1 execute notchia-licenses --remote --file=schema.sql
```

Puis dans **Cloudflare Pages → notchia-website → Settings → Functions → D1 database bindings** :
- Variable name : `DB`
- D1 database : `notchia-licenses`

## 5. Créer le webhook Stripe

Dashboard Stripe → **Developers → Webhooks** → **+ Add endpoint**

- **Endpoint URL** : `https://notchia.app/api/stripe/webhook`
- **Events to send** :
  - `checkout.session.completed`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`
  - `customer.subscription.deleted`
  - `charge.refunded`
- Save → clique sur le webhook créé → **Signing secret** → reveal → copie `whsec_xxx`. C'est `STRIPE_WEBHOOK_SECRET`.

## 6. Configurer les env vars sur Cloudflare Pages

Cloudflare → Workers & Pages → `notchia-website` → Settings → **Environment variables** (Production) :

| Variable | Valeur | Encrypt |
|---|---|---|
| `STRIPE_SECRET_KEY` | `rk_live_xxx` ou `sk_live_xxx` | ✅ |
| `STRIPE_PRICE_MONTHLY` | `price_xxx` | non |
| `STRIPE_PRICE_LIFETIME` | `price_xxx` | non |
| `STRIPE_WEBHOOK_SECRET` | `whsec_xxx` | ✅ |
| `LICENSE_PRIVATE_KEY` | la PKCS#8 base64 (cf. plus bas) | ✅ |
| `LICENSE_PUBLIC_KEY` | la SPKI base64 | non |

**Les env vars existantes** (Resend, Gemini, Contact) **restent inchangées**.

## 7. Générer la paire Ed25519 pour les licences

```bash
./scripts/generate-license-keypair.sh
```

Sauvegarde la **clé privée** dans 1Password (jamais commitée en repo).  
La **clé publique** sera embarquée dans NotchIA.app (Swift CryptoKit) pour la vérification offline.

## 8. Redeploy + tester

1. Cloudflare Pages → Deployments → Retry last deployment (les env vars sont prises en compte).
2. Va sur https://notchia.app/pricing → clique **Souscrire Pro mensuel**.
3. Tu es redirigé vers `checkout.stripe.com/...`
4. Utilise une vraie carte avec un petit montant test (3,99 €) ou une carte test pour vérifier le flow.

   **Cartes test Stripe** (à utiliser SEULEMENT si tu mets temporairement `STRIPE_SECRET_KEY` en mode test `sk_test_xxx`) :
   - `4242 4242 4242 4242` — paiement OK
   - `4000 0000 0000 9995` — paiement refusé
   - Expiration : n'importe quelle date future
   - CVC : n'importe quel 3 chiffres

5. Après paiement : tu es redirigé sur `/account?session_id=cs_xxx`
6. En parallèle, Stripe envoie `checkout.session.completed` à `/api/stripe/webhook` → ta function crée la licence en D1 → envoie l'email Resend avec la clé.
7. Vérifie ta boîte `notchia.app@gmail.com` : tu dois recevoir « Ta clé NotchIA Pro 🦉 ».

## 9. Diagnostics

- `GET /api/stripe/checkout` → health check (montre quelles env vars sont set)
- Cloudflare Pages → Logs → Real-time logs → tu vois les `console.log` du webhook
- Stripe Dashboard → Developers → Events → tu vois chaque event reçu + son code de réponse
- D1 inspector : `wrangler d1 execute notchia-licenses --remote --command="SELECT * FROM licenses LIMIT 10"`

## 10. Côté app macOS NotchIA

Embarquer la clé publique dans Swift :

```swift
import CryptoKit
import Foundation

let licensePublicKeyHex = "2f0af78c529aa333ccbe593ada8c5e791dce8838aba96273a7479c2376bb8c8a"
let pubKey = try Curve25519.Signing.PublicKey(
    rawRepresentation: Data(hexString: licensePublicKeyHex)
)

func verifyLicenseKey(_ raw: String) -> LicensePayload? {
    guard raw.hasPrefix("nia_live_") else { return nil }
    let stripped = String(raw.dropFirst(9))
    guard let dot = stripped.firstIndex(of: ".") else { return nil }
    let payloadB64 = String(stripped[..<dot])
    let sigB64 = String(stripped[stripped.index(after: dot)...])

    guard let payloadData = Data(base64UrlEncoded: payloadB64),
          let sigData = Data(base64UrlEncoded: sigB64),
          pubKey.isValidSignature(sigData, for: payloadData) else { return nil }

    return try? JSONDecoder().decode(LicensePayload.self, from: payloadData)
}

struct LicensePayload: Codable {
    let v: Int
    let sub: String
    let plan: String
    let iat: Int
    let exp: Int?
    let jti: String
    let max: Int
}
```

Le check sur `expires_at` se fait localement avec `payload.exp`. Pour vérifier le **status serveur** (remboursement, annulation), appeler périodiquement (1×/semaine) :

```
POST https://notchia.app/api/license/validate
Body : { key: "nia_live_...", device_id: <UUID machine> }
```

Si `valid: false, reason: "status_refunded"` → désactiver les fonctionnalités Pro localement.
