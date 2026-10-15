/** Keep in sync with db/schema.sql */
export const BRIEF_SCHEMA_SQL = `
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
`;
