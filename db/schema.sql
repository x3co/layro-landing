-- Brief submissions. The API also runs this statement on first write
-- when DATABASE_URL is set. Keep in sync with lib/schema.ts.

CREATE TABLE IF NOT EXISTS briefs (
  id UUID PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  locale TEXT NOT NULL,
  company TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  country TEXT NOT NULL,
  product_type TEXT NOT NULL,
  area_m2 NUMERIC,
  iso_classes TEXT NOT NULL,
  timeline TEXT NOT NULL,
  notes TEXT,
  file_link TEXT,
  file_name TEXT,
  file_mime TEXT,
  file_bytes BYTEA,
  consent BOOLEAN NOT NULL
);

CREATE INDEX IF NOT EXISTS briefs_created_at_idx ON briefs (created_at DESC);

-- Paid scenario orders and the layouts generated for them.
-- The API also runs this on first order write. Keep in sync with lib/schema.ts.

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  email TEXT NOT NULL,
  status TEXT NOT NULL,
  source TEXT NOT NULL,
  external_id TEXT,
  access_token TEXT NOT NULL UNIQUE,
  raw_event JSONB
);

CREATE UNIQUE INDEX IF NOT EXISTS orders_source_external_idx
  ON orders (source, external_id)
  WHERE external_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS orders_email_idx ON orders (lower(email));

CREATE TABLE IF NOT EXISTS layouts (
  id UUID PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  order_id UUID NOT NULL REFERENCES orders(id),
  inputs JSONB NOT NULL,
  result JSONB NOT NULL
);

CREATE INDEX IF NOT EXISTS layouts_order_idx ON layouts (order_id, created_at DESC);
