import { NextResponse } from "next/server";
import { MAX_FILE_BYTES, validateBrief, type Locale } from "@/lib/brief";
import { StorageError, assertRateLimit, saveBrief } from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json(
      { ok: false, error: "No se pudo leer el envío. El brief no se ha guardado." },
      { status: 400 },
    );
  }

  const locale: Locale = form.get("locale") === "en" ? "en" : "es";
  const fileEntry = form.get("file");
  let file: { name: string; type: string; size: number; bytes: Buffer } | null = null;
  if (fileEntry instanceof File && fileEntry.size > 0) {
    const bytes =
      fileEntry.size > MAX_FILE_BYTES ? Buffer.alloc(0) : Buffer.from(await fileEntry.arrayBuffer());
    file = {
      name: fileEntry.name,
      type: fileEntry.type,
      size: fileEntry.size,
      bytes,
    };
  }

  const result = validateBrief({
    locale,
    company: String(form.get("company") ?? ""),
    contactName: String(form.get("contact") ?? ""),
    email: String(form.get("email") ?? ""),
    country: String(form.get("country") ?? ""),
    countryOther: String(form.get("countryOther") ?? ""),
    productType: String(form.get("product") ?? ""),
    areaM2: String(form.get("area") ?? ""),
    isoClasses: form.getAll("iso").filter((value): value is string => typeof value === "string"),
    timeline: String(form.get("timeline") ?? ""),
    notes: String(form.get("notes") ?? ""),
    fileLink: String(form.get("fileLink") ?? ""),
    consent: form.get("consent") === "yes",
    honeypot: String(form.get("company_website") ?? ""),
    file,
  });

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error, fields: result.fields },
      { status: 400 },
    );
  }

  try {
    assertRateLimit(clientIp(request), locale);
    const id = await saveBrief(result.value, locale);
    return NextResponse.json({ ok: true, id });
  } catch (error) {
    if (error instanceof StorageError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: error.status });
    }
    console.error("brief_storage_failed");
    const message = locale === "en" ? "The brief could not be saved." : "No se pudo guardar el brief.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
