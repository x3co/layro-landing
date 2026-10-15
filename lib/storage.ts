import { Pool } from "pg";
import { randomUUID } from "crypto";
import { BRIEF_SCHEMA_SQL } from "./schema";
import type { Locale, ValidBrief } from "./brief";

export class StorageError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

const esStorage = {
  missing:
    "No se pudo guardar el brief. Defina DATABASE_URL, o bien RESEND_API_KEY, RESEND_FROM_EMAIL y BRIEF_NOTIFY_EMAIL.",
  missingResend: (names: string) =>
    `No se pudo guardar el brief. Faltan variables de Resend: ${names}.`,
  postgres: "No se pudo escribir en Postgres. Revise DATABASE_URL y que la base acepte la conexión.",
  postgresDetail: (detail: string) => `No se pudo escribir en Postgres: ${detail}`,
  resend: "No se pudo enviar el brief por email.",
  resendDetail: (detail: string) => `No se pudo enviar el brief por email: ${detail}`,
  rate: "Demasiados envíos desde esta red. Espere unos minutos e inténtelo de nuevo.",
};

const enStorage: typeof esStorage = {
  missing:
    "The brief could not be saved. Set DATABASE_URL, or set RESEND_API_KEY, RESEND_FROM_EMAIL and BRIEF_NOTIFY_EMAIL.",
  missingResend: (names: string) =>
    `The brief could not be saved. Missing Resend variables: ${names}.`,
  postgres: "Could not write to Postgres. Check DATABASE_URL and that the database accepts the connection.",
  postgresDetail: (detail: string) => `Could not write to Postgres: ${detail}`,
  resend: "Could not send the brief by email.",
  resendDetail: (detail: string) => `Could not send the brief by email: ${detail}`,
  rate: "Too many submissions from this network. Wait a few minutes and try again.",
};

const storageCopy = { es: esStorage, en: enStorage };

type RateBucket = { count: number; resetAt: number };

const globalState = globalThis as unknown as {
  briefPool?: Pool;
  briefSchema?: Promise<void>;
  briefRates?: Map<string, RateBucket>;
};

function copy(locale: Locale) {
  return storageCopy[locale];
}

export function assertRateLimit(ip: string, locale: Locale) {
  if (!globalState.briefRates) globalState.briefRates = new Map();
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const bucket = globalState.briefRates.get(ip);
  if (!bucket || bucket.resetAt < now) {
    globalState.briefRates.set(ip, { count: 1, resetAt: now + windowMs });
    return;
  }
  if (bucket.count >= 8) {
    throw new StorageError(copy(locale).rate, 429);
  }
  bucket.count += 1;
}

function databaseUrl() {
  return process.env.DATABASE_URL?.trim() || "";
}

function resendConfig() {
  return {
    apiKey: process.env.RESEND_API_KEY?.trim() || "",
    from: process.env.RESEND_FROM_EMAIL?.trim() || "",
    to: process.env.BRIEF_NOTIFY_EMAIL?.trim() || "",
  };
}

export function requirePool() {
  const connectionString = databaseUrl();
  if (!connectionString) {
    throw new StorageError(
      "No hay base de datos. Defina DATABASE_URL para guardar pedidos y layouts.",
      503,
    );
  }
  return getPool(connectionString);
}

function getPool(connectionString: string) {
  if (!globalState.briefPool) {
    const local = /localhost|127\.0\.0\.1/.test(connectionString);
    globalState.briefPool = new Pool({
      connectionString,
      max: 3,
      ssl: local ? undefined : { rejectUnauthorized: false },
    });
  }
  return globalState.briefPool;
}

async function ensureSchema(pool: Pool) {
  if (!globalState.briefSchema) {
    globalState.briefSchema = pool.query(BRIEF_SCHEMA_SQL).then(() => undefined);
    globalState.briefSchema.catch(() => {
      globalState.briefSchema = undefined;
    });
  }
  await globalState.briefSchema;
}

function safeDbMessage(error: unknown, locale: Locale) {
  const message = error instanceof Error ? error.message : "";
  if (!message || /password|DATABASE_URL|postgres:\/\//i.test(message)) {
    return copy(locale).postgres;
  }
  return copy(locale).postgresDetail(message.slice(0, 240));
}

function briefText(brief: ValidBrief, id: string) {
  const { record, file } = brief;
  const lines = [
    `Referencia: ${id}`,
    `Idioma de la página: ${record.locale}`,
    `Empresa: ${record.company}`,
    `Contacto: ${record.contactName}`,
    `Email: ${record.email}`,
    `País: ${record.country}`,
    `Producto / proceso: ${record.productType}`,
    `Área (m²): ${record.areaM2}`,
    `Clases ISO objetivo: ${record.isoClasses}`,
    `Plazo: ${record.timeline}`,
    `Notas: ${record.notes || "—"}`,
    `Enlace: ${record.fileLink || "—"}`,
    `Archivo: ${file ? `${file.name} (${file.type}, ${file.bytes.length} bytes)` : "—"}`,
    "Consentimiento: sí",
  ];
  return lines.join("\n");
}

async function saveToPostgres(brief: ValidBrief, locale: Locale) {
  const connectionString = databaseUrl();
  const pool = getPool(connectionString);
  const id = randomUUID();
  try {
    await ensureSchema(pool);
    await pool.query(
      `INSERT INTO briefs (
        id, locale, company, contact_name, email, country, product_type, area_m2,
        iso_classes, timeline, notes, file_link, file_name, file_mime, file_bytes, consent
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,TRUE
      )`,
      [
        id,
        brief.record.locale,
        brief.record.company,
        brief.record.contactName,
        brief.record.email,
        brief.record.country,
        brief.record.productType,
        brief.record.areaM2,
        brief.record.isoClasses,
        brief.record.timeline,
        brief.record.notes || null,
        brief.record.fileLink,
        brief.file?.name ?? null,
        brief.file?.type ?? null,
        brief.file?.bytes ?? null,
        ],
    );
  } catch (error) {
    throw new StorageError(safeDbMessage(error, locale), 500);
  }
  return id;
}

async function saveToResend(brief: ValidBrief, locale: Locale) {
  const config = resendConfig();
  const missing = [
    !config.apiKey ? "RESEND_API_KEY" : "",
    !config.from ? "RESEND_FROM_EMAIL" : "",
    !config.to ? "BRIEF_NOTIFY_EMAIL" : "",
  ].filter(Boolean);
  if (missing.length > 0) {
    throw new StorageError(copy(locale).missingResend(missing.join(", ")), 503);
  }

  const id = randomUUID();
  const payload: Record<string, unknown> = {
    from: config.from,
    to: [config.to],
    reply_to: brief.record.email,
    subject: `Brief GMP ${id.slice(0, 8)} — ${brief.record.company}`,
    text: briefText(brief, id),
  };
  if (brief.file) {
    payload.attachments = [
      {
        filename: brief.file.name,
        content: brief.file.bytes.toString("base64"),
      },
    ];
  }

  let response: Response;
  try {
    response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(20000),
    });
  } catch {
    throw new StorageError(copy(locale).resend, 502);
  }

  if (!response.ok) {
    let detail = "";
    try {
      const body = (await response.json()) as { message?: string };
      detail = typeof body.message === "string" ? body.message : "";
    } catch {
      detail = "";
    }
    if (/api[_ ]?key|token|unauthorized/i.test(detail)) {
      throw new StorageError(copy(locale).resend, 502);
    }
    throw new StorageError(
      detail ? copy(locale).resendDetail(detail.slice(0, 240)) : copy(locale).resend,
      502,
    );
  }

  return id;
}

export async function saveBrief(brief: ValidBrief, locale: Locale) {
  if (databaseUrl()) return saveToPostgres(brief, locale);
  const resend = resendConfig();
  if (resend.apiKey || resend.from || resend.to) return saveToResend(brief, locale);
  throw new StorageError(copy(locale).missing, 503);
}
