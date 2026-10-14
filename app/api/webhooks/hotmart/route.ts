import { NextResponse } from "next/server";
import { jsonError, tokensMatch } from "@/lib/osd/http";
import { createPaidOrder } from "@/lib/osd/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const APPROVED = new Set(["PURCHASE_APPROVED", "PURCHASE_COMPLETE", "APPROVED"]);

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function pickString(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

export async function POST(request: Request) {
  const expected = process.env.HOTMART_WEBHOOK_TOKEN?.trim() || "";
  if (!expected) {
    return NextResponse.json({ error: "HOTMART_WEBHOOK_TOKEN no está configurado." }, { status: 503 });
  }

  const body = asRecord(await request.json().catch(() => null));
  if (!body) return NextResponse.json({ error: "El cuerpo no es JSON." }, { status: 400 });

  const provided = pickString(request.headers.get("x-hotmart-hottok"), body.hottok);
  if (!provided || !tokensMatch(provided, expected)) {
    return NextResponse.json({ error: "Token de postback rechazado." }, { status: 401 });
  }

  const event = pickString(body.event, body.status).toUpperCase();
  if (!APPROVED.has(event)) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const data = asRecord(body.data);
  const buyer = asRecord(data?.buyer);
  const buyerVo = asRecord(body.buyerVO);
  const purchase = asRecord(data?.purchase);
  const email = pickString(buyer?.email, body.email, buyerVo?.email);
  const transaction = pickString(purchase?.transaction, body.transaction);
  if (!email || !transaction) {
    return NextResponse.json({ error: "El aviso de pago no trae email o transacción." }, { status: 422 });
  }

  const rawEvent = { ...body };
  delete rawEvent.hottok;

  try {
    const order = await createPaidOrder({
      email,
      source: "hotmart",
      externalId: transaction,
      rawEvent,
    });
    return NextResponse.json({ ok: true, orderId: order.id, created: order.created });
  } catch (error) {
    return jsonError(error);
  }
}
