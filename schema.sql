-- NotchIA — schema Cloudflare D1 (SQLite serverless)
--
-- Création de la base :
--   wrangler d1 create notchia-licenses
--   wrangler d1 execute notchia-licenses --remote --file=schema.sql
--
-- Binding dans Cloudflare Pages → Settings → Functions → D1 :
--   Variable name : DB
--   D1 database   : notchia-licenses
--
-- Toutes les colonnes timestamp sont en epoch seconds (UTC, int).

CREATE TABLE IF NOT EXISTS licenses (
  -- Clé de licence : "nia_live_<JWT Ed25519>" — index principal
  key                   TEXT PRIMARY KEY NOT NULL,

  -- Email du client (récupéré du Stripe Checkout)
  email                 TEXT NOT NULL,

  -- Plan : 'monthly' | 'lifetime'
  plan                  TEXT NOT NULL CHECK (plan IN ('monthly', 'lifetime')),

  -- Status : 'active' | 'cancelled' | 'expired' | 'refunded' | 'revoked'
  status                TEXT NOT NULL DEFAULT 'active'
                        CHECK (status IN ('active','cancelled','expired','refunded','revoked')),

  -- Stripe Customer ID (cus_xxx) — pour ouvrir le portail client
  stripe_customer_id    TEXT,

  -- Subscription ID si plan = monthly (sub_xxx)
  stripe_subscription_id TEXT,

  -- Session de Checkout d'origine (cs_xxx) — utile pour debug
  stripe_session_id     TEXT,

  -- Timestamps (epoch seconds UTC)
  created_at            INTEGER NOT NULL,         -- date d'achat
  updated_at            INTEGER NOT NULL,         -- dernière modif (cancel, refund, etc.)
  expires_at            INTEGER,                  -- NULL si lifetime, sinon period end (mensuel)

  -- Nombre de Macs activés (1 = Pro mensuel, 2 = Pro lifetime)
  -- Incrémenté lors de chaque activation par l'app
  active_devices        INTEGER NOT NULL DEFAULT 0,

  -- Limite (1 pour monthly, 2 pour lifetime)
  max_devices           INTEGER NOT NULL,

  -- IPs et User-Agents des activations (JSON array, max 5 entries)
  activation_log        TEXT DEFAULT '[]'
);

-- Index pour les queries fréquentes
CREATE INDEX IF NOT EXISTS idx_licenses_email           ON licenses(email);
CREATE INDEX IF NOT EXISTS idx_licenses_customer        ON licenses(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_licenses_subscription    ON licenses(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_licenses_status          ON licenses(status);

-- Table des événements Stripe reçus (idempotence du webhook)
-- Stripe peut retry les webhooks, on dédoublonne par event ID.
CREATE TABLE IF NOT EXISTS webhook_events (
  id          TEXT PRIMARY KEY NOT NULL,  -- Stripe event ID (evt_xxx)
  type        TEXT NOT NULL,              -- ex: 'checkout.session.completed'
  received_at INTEGER NOT NULL,
  processed   INTEGER NOT NULL DEFAULT 0  -- 0=pending, 1=done, 2=failed
);

CREATE INDEX IF NOT EXISTS idx_webhook_type ON webhook_events(type);
