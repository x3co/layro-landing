export const MAX_FILE_BYTES = 5 * 1024 * 1024;

export const ALLOWED_FILE_TYPES = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
]);

const FILE_EXTENSIONS = [".pdf", ".png", ".jpg", ".jpeg", ".webp"];

export const COUNTRIES = [
  { code: "ES", es: "España", en: "Spain" },
  { code: "MX", es: "México", en: "Mexico" },
  { code: "CO", es: "Colombia", en: "Colombia" },
  { code: "AR", es: "Argentina", en: "Argentina" },
  { code: "CL", es: "Chile", en: "Chile" },
  { code: "PE", es: "Perú", en: "Peru" },
  { code: "BR", es: "Brasil", en: "Brazil" },
  { code: "UY", es: "Uruguay", en: "Uruguay" },
  { code: "EC", es: "Ecuador", en: "Ecuador" },
  { code: "CR", es: "Costa Rica", en: "Costa Rica" },
  { code: "PA", es: "Panamá", en: "Panama" },
  { code: "GT", es: "Guatemala", en: "Guatemala" },
  { code: "DO", es: "República Dominicana", en: "Dominican Republic" },
  { code: "OTHER", es: "Otro", en: "Other" },
] as const;

export const TIMELINES = [
  { code: "lt1", es: "Menos de 1 mes", en: "Under 1 month" },
  { code: "1to3", es: "1 a 3 meses", en: "1 to 3 months" },
  { code: "3to6", es: "3 a 6 meses", en: "3 to 6 months" },
  { code: "gt6", es: "Más de 6 meses", en: "More than 6 months" },
  { code: "explore", es: "Solo exploración", en: "Exploring only" },
] as const;

export const ISO_OPTIONS = [
  { code: "ISO5", es: "ISO 5", en: "ISO 5" },
  { code: "ISO6", es: "ISO 6", en: "ISO 6" },
  { code: "ISO7", es: "ISO 7", en: "ISO 7" },
  { code: "ISO8", es: "ISO 8", en: "ISO 8" },
  { code: "ISO9", es: "ISO 9", en: "ISO 9" },
  { code: "CNC", es: "No clasificado", en: "Not classified" },
  { code: "UNSURE", es: "Aún no definido", en: "Not decided yet" },
] as const;

export type Locale = "es" | "en";

const esMessages = {
  summary: "Revise los campos marcados. El brief no se ha enviado.",
  company: "Indique la empresa.",
  contact: "Indique el nombre de contacto.",
  email: "Indique un email válido.",
  country: "Seleccione un país.",
  countryOther: "Indique el país.",
  product: "Describa el tipo de producto o proceso.",
  area: "Indique el área aproximada en m² (un número mayor que 0).",
  iso: "Marque al menos una clase objetivo, o «Aún no definido».",
  timeline: "Seleccione un plazo.",
  notes: "Las notas no pueden superar 5000 caracteres.",
  fileLink: "El enlace debe empezar por http:// o https://.",
  fileSize: "El archivo supera 5 MB.",
  fileType: "El archivo debe ser PDF, PNG, JPG o WEBP.",
  consent: "Confirme que podemos usar estos datos para responder el brief.",
  honeypot: "No se pudo validar el envío.",
};

const enMessages: typeof esMessages = {
  summary: "Check the highlighted fields. The brief was not sent.",
  company: "Enter the company.",
  contact: "Enter a contact name.",
  email: "Enter a valid email.",
  country: "Select a country.",
  countryOther: "Enter the country.",
  product: "Describe the product type or process.",
  area: "Enter an approximate area in m² (a number greater than 0).",
  iso: "Select at least one target class, or “Not decided yet”.",
  timeline: "Select a timeline.",
  notes: "Notes cannot exceed 5000 characters.",
  fileLink: "The link must start with http:// or https://.",
  fileSize: "The file is larger than 5 MB.",
  fileType: "The file must be a PDF, PNG, JPG, or WEBP.",
  consent: "Confirm that we may use this information to reply to the brief.",
  honeypot: "The submission could not be validated.",
};

export const briefMessages = { es: esMessages, en: enMessages };

export type BriefField =
  | "company"
  | "contact"
  | "email"
  | "country"
  | "countryOther"
  | "product"
  | "area"
  | "iso"
  | "timeline"
  | "notes"
  | "fileLink"
  | "file"
  | "consent";

export type BriefRecord = {
  locale: Locale;
  company: string;
  contactName: string;
  email: string;
  country: string;
  productType: string;
  areaM2: number;
  isoClasses: string;
  timeline: string;
  notes: string;
  fileLink: string | null;
  consent: true;
};

export type UploadedFile = {
  name: string;
  type: string;
  bytes: Buffer;
};

export type ValidBrief = {
  record: BriefRecord;
  file: UploadedFile | null;
};

type FieldErrors = Partial<Record<BriefField, string>>;

function clean(value: string, max: number) {
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim().slice(0, max);
}

function parseArea(value: string): number | null {
  const normalized = value.trim().replace(/\s/g, "").replace(",", ".");
  if (!/^\d+(\.\d+)?$/.test(normalized)) return null;
  const number = Number(normalized);
  if (!Number.isFinite(number) || number <= 0 || number > 1_000_000) return null;
  return Math.round(number * 100) / 100;
}

function extensionAllowed(name: string) {
  const lower = name.toLowerCase();
  return FILE_EXTENSIONS.some((extension) => lower.endsWith(extension));
}

export function validateBrief(input: {
  locale: string;
  company: string;
  contactName: string;
  email: string;
  country: string;
  countryOther: string;
  productType: string;
  areaM2: string;
  isoClasses: string[];
  timeline: string;
  notes: string;
  fileLink: string;
  consent: boolean;
  honeypot: string;
  file: { name: string; type: string; size: number; bytes?: Buffer } | null;
}): { ok: true; value: ValidBrief } | { ok: false; error: string; fields: FieldErrors } {
  const locale: Locale = input.locale === "en" ? "en" : "es";
  const m = briefMessages[locale];
  const fields: FieldErrors = {};

  if (input.honeypot.trim()) {
    return { ok: false, error: m.honeypot, fields: {} };
  }

  const company = clean(input.company, 200);
  if (company.length < 2) fields.company = m.company;

  const contactName = clean(input.contactName, 200);
  if (contactName.length < 2) fields.contact = m.contact;

  const email = clean(input.email, 200).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fields.email = m.email;

  const countryOption = COUNTRIES.find((item) => item.code === input.country);
  let country = "";
  if (!countryOption) {
    fields.country = m.country;
  } else if (countryOption.code === "OTHER") {
    const other = clean(input.countryOther, 80);
    if (other.length < 2) fields.countryOther = m.countryOther;
    else country = `Otro: ${other}`;
  } else {
    country = countryOption.es;
  }

  const productType = clean(input.productType, 400);
  if (productType.length < 3) fields.product = m.product;

  const areaM2 = parseArea(input.areaM2);
  if (areaM2 === null) fields.area = m.area;

  const iso = ISO_OPTIONS.filter((item) => input.isoClasses.includes(item.code));
  if (iso.length === 0) fields.iso = m.iso;

  const timelineOption = TIMELINES.find((item) => item.code === input.timeline);
  if (!timelineOption) fields.timeline = m.timeline;

  const notes = clean(input.notes, 5000);
  if (input.notes.trim().length > 5000) fields.notes = m.notes;

  const linkRaw = input.fileLink.trim();
  let fileLink: string | null = null;
  if (linkRaw) {
    try {
      const url = new URL(linkRaw);
      if (url.protocol !== "http:" && url.protocol !== "https:") fields.fileLink = m.fileLink;
      else if (linkRaw.length > 500) fields.fileLink = m.fileLink;
      else fileLink = url.toString();
    } catch {
      fields.fileLink = m.fileLink;
    }
  }

  let file: UploadedFile | null = null;
  if (input.file && input.file.size > 0) {
    const typeOk =
      !input.file.type ||
      input.file.type === "image/jpg" ||
      ALLOWED_FILE_TYPES.has(input.file.type);
    if (input.file.size > MAX_FILE_BYTES) fields.file = m.fileSize;
    else if (!extensionAllowed(input.file.name) || !typeOk) fields.file = m.fileType;
    else if (input.file.bytes) {
      file = {
        name: clean(input.file.name, 180) || "adjunto",
        type: input.file.type || "application/octet-stream",
        bytes: input.file.bytes,
      };
    }
  }

  if (!input.consent) fields.consent = m.consent;

  if (Object.keys(fields).length > 0 || !countryOption || areaM2 === null || !timelineOption) {
    return { ok: false, error: m.summary, fields };
  }

  return {
    ok: true,
    value: {
      file,
      record: {
        locale,
        company,
        contactName,
        email,
        country,
        productType,
        areaM2,
        isoClasses: iso.map((item) => item.es).join(", "),
        timeline: timelineOption.es,
        notes,
        fileLink,
        consent: true,
      },
    },
  };
}
