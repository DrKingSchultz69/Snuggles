-- Snuggle database schema.
-- Applied with `npm run db:migrate`. Every statement is idempotent so the
-- script can safely be re-run against an existing database.

-- One row per signed-in customer, keyed by the Clerk user ID. This is the
-- saved shipping address that pre-fills checkout. Clerk remains the source of
-- truth for identity (login, email/phone verification); these columns are the
-- delivery details the customer typed, which may legitimately differ from
-- their login email.
CREATE TABLE IF NOT EXISTS profiles (
  user_id      TEXT PRIMARY KEY,
  name         TEXT        NOT NULL DEFAULT '',
  email        TEXT        NOT NULL DEFAULT '',
  phone        TEXT        NOT NULL DEFAULT '',
  address_line TEXT        NOT NULL DEFAULT '',
  city         TEXT        NOT NULL DEFAULT '',
  state        TEXT        NOT NULL DEFAULT '',
  pincode      TEXT        NOT NULL DEFAULT '',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- One row per Razorpay order. user_id is nullable on purpose: guest checkout
-- still works exactly as it does today, it just produces an order that isn't
-- attached to an account.
--
-- The ship_* columns are a deliberate snapshot rather than a join to
-- profiles. An order must record where it was actually sent; if the customer
-- later edits their saved address, past orders must not silently change.
CREATE TABLE IF NOT EXISTS orders (
  id                 BIGSERIAL PRIMARY KEY,
  user_id            TEXT,
  razorpay_order_id  TEXT        NOT NULL UNIQUE,
  razorpay_payment_id TEXT,
  amount_paise       BIGINT      NOT NULL,
  currency           TEXT        NOT NULL DEFAULT 'INR',
  -- created -> paid, or created -> failed
  status             TEXT        NOT NULL DEFAULT 'created',
  ship_name          TEXT        NOT NULL,
  ship_email         TEXT        NOT NULL,
  ship_phone         TEXT        NOT NULL,
  ship_address_line  TEXT        NOT NULL,
  ship_city          TEXT        NOT NULL,
  ship_state         TEXT        NOT NULL,
  ship_pincode       TEXT        NOT NULL,
  items              JSONB       NOT NULL DEFAULT '[]'::jsonb,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  paid_at            TIMESTAMPTZ
);

-- Backs the "My Orders" query, which is always scoped to one user and sorted
-- newest first.
CREATE INDEX IF NOT EXISTS orders_user_id_created_at_idx
  ON orders (user_id, created_at DESC);
