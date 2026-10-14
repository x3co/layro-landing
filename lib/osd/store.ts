import { randomBytes, randomUUID } from "crypto";
import { OSD_SCHEMA_SQL } from "../schema";
import { StorageError, requirePool } from "../storage";
import type { OsdInputs, OsdLayout } from "./generate";

export type PaidOrder = {
  id: string;
  email: string;
  accessToken: string;
  status: string;
};

let osdSchema: Promise<void> | undefined;

async function ready() {
  const pool = requirePool();
  if (!osdSchema) {
    osdSchema = pool.query(OSD_SCHEMA_SQL).then(() => undefined);
    osdSchema.catch(() => {
      osdSchema = undefined;
    });
  }
  await osdSchema;
  return pool;
}

function dbError(error: unknown): never {
  const message = error instanceof Error ? error.message : "";
  if (/password|DATABASE_URL|postgres:\/\//i.test(message) || !message) {
    throw new StorageError("No se pudo escribir el pedido en Postgres. Revise DATABASE_URL.", 500);
  }
  throw new StorageError(`No se pudo escribir el pedido en Postgres: ${message.slice(0, 240)}`, 500);
}

export function normalizeEmail(value: unknown) {
  if (typeof value !== "string") return "";
  const email = value.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "";
  return email;
}

export async function createPaidOrder(input: {
  email: string;
  source: "hotmart" | "admin";
  externalId: string | null;
  rawEvent: unknown;
}): Promise<PaidOrder & { created: boolean }> {
  const pool = await ready();
  const email = normalizeEmail(input.email);
  if (!email) throw new StorageError("El email del pedido no es válido.", 422);

  if (input.externalId) {
    const existing = await pool.query<{ id: string; email: string; access_token: string; status: string }>(
      `SELECT id, email, access_token, status FROM orders WHERE source = $1 AND external_id = $2`,
      [input.source, input.externalId],
    );
    const row = existing.rows[0];
    if (row) {
      return { id: row.id, email: row.email, accessToken: row.access_token, status: row.status, created: false };
    }
  }

  const id = randomUUID();
  const accessToken = randomBytes(24).toString("hex");
  try {
    await pool.query(
      `INSERT INTO orders (id, email, status, source, external_id, access_token, raw_event)
       VALUES ($1, $2, 'paid', $3, $4, $5, $6)`,
      [id, email, input.source, input.externalId, accessToken, input.rawEvent ?? null],
    );
  } catch (error) {
    if (input.externalId && isUniqueViolation(error)) {
      const again = await pool.query<{ id: string; email: string; access_token: string; status: string }>(
        `SELECT id, email, access_token, status FROM orders WHERE source = $1 AND external_id = $2`,
        [input.source, input.externalId],
      );
      const row = again.rows[0];
      if (row) {
        return { id: row.id, email: row.email, accessToken: row.access_token, status: row.status, created: false };
      }
    }
    dbError(error);
  }
  return { id, email, accessToken, status: "paid", created: true };
}

function isUniqueViolation(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && (error as { code?: string }).code === "23505";
}

export async function orderByAccessToken(token: string): Promise<PaidOrder | null> {
  if (!token || token.length < 16) return null;
  const pool = await ready();
  const result = await pool.query<{ id: string; email: string; access_token: string; status: string }>(
    `SELECT id, email, access_token, status FROM orders WHERE access_token = $1 AND status = 'paid'`,
    [token],
  );
  const row = result.rows[0];
  if (!row) return null;
  return { id: row.id, email: row.email, accessToken: row.access_token, status: row.status };
}

export async function latestPaidByEmail(email: string): Promise<PaidOrder | null> {
  const normalized = normalizeEmail(email);
  if (!normalized) return null;
  const pool = await ready();
  const result = await pool.query<{ id: string; email: string; access_token: string; status: string }>(
    `SELECT id, email, access_token, status
     FROM orders
     WHERE lower(email) = $1 AND status = 'paid'
     ORDER BY created_at DESC
     LIMIT 1`,
    [normalized],
  );
  const row = result.rows[0];
  if (!row) return null;
  return { id: row.id, email: row.email, accessToken: row.access_token, status: row.status };
}

export async function saveLayout(orderId: string, inputs: OsdInputs, result: OsdLayout) {
  const pool = await ready();
  const id = randomUUID();
  try {
    await pool.query(
      `INSERT INTO layouts (id, order_id, inputs, result) VALUES ($1, $2, $3::jsonb, $4::jsonb)`,
      [id, orderId, JSON.stringify(inputs), JSON.stringify(result)],
    );
  } catch (error) {
    dbError(error);
  }
  return id;
}

export async function latestLayout(orderId: string): Promise<{ inputs: OsdInputs; result: OsdLayout } | null> {
  const pool = await ready();
  const query = await pool.query<{ inputs: OsdInputs; result: OsdLayout }>(
    `SELECT inputs, result FROM layouts WHERE order_id = $1 ORDER BY created_at DESC LIMIT 1`,
    [orderId],
  );
  return query.rows[0] ?? null;
}
