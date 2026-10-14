import { NextResponse } from "next/server";
import { jsonError, tokensMatch } from "@/lib/osd/http";
import { createPaidOrder, normalizeEmail } from "@/lib/osd/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const expected = process.env.ADMIN_TOKEN?.trim() || "";
  if (!expected) {
    return NextResponse.json({ error: "ADMIN_TOKEN no está configurado." }, { status: 503 });
  }

  const body = (await request.json().catch(() => null)) as { email?: unknown; adminToken?: unknown } | null;
  const header = request.headers.get("authorization") || "";
  const bearer = header.toLowerCase().startsWith("bearer ") ? header.slice(7).trim() : "";
  const provided = bearer || (typeof body?.adminToken === "string" ? body.adminToken.trim() : "");
  if (!provided || !tokensMatch(provided, expected)) {
    return NextResponse.json({ error: "Token de administración rechazado." }, { status: 401 });
  }

  const email = normalizeEmail(body?.email);
  if (!email) return NextResponse.json({ error: "Indique un email válido." }, { status: 400 });

  try {
    const order = await createPaidOrder({
      email,
      source: "admin",
      externalId: null,
      rawEvent: null,
    });
    return NextResponse.json({
      ok: true,
      orderId: order.id,
      accessPath: `/app?token=${order.accessToken}`,
    });
  } catch (error) {
    return jsonError(error);
  }
}
