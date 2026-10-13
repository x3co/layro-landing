/**
 * Site-wide configuration.
 * The public name and the canonical origin live here.
 * plantagmp.com is not this origin; it is expected to redirect here later.
 */

export const BRAND_NAME = "Aseptia";

/** Public price placeholder. The figure is intentionally not decided. */
export const PRICE_FROM_LABEL = "Desde USD X";

export const OWNER_NAME = "Alejandro Pacheco";

/** Canonical origin for metadata, Open Graph, sitemap, and JSON-LD. */
export const siteUrl = "https://aseptia.ai";

function readHttpUrl(raw: string | undefined): string {
  const value = raw?.trim() || "";
  if (!value) return "";
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") return "";
    return url.toString();
  } catch {
    return "";
  }
}

function readEmail(raw: string | undefined): string {
  const value = raw?.trim() || "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "";
  return value;
}

/** External scheduling page for "Agendar llamada". Empty hides a working link. */
export const calendarUrl = readHttpUrl(process.env.NEXT_PUBLIC_CALENDAR_URL);

/** Optional address for privacy requests. */
export const contactEmail = readEmail(process.env.NEXT_PUBLIC_CONTACT_EMAIL);
