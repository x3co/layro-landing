import { NextResponse } from "next/server";
import { generateLayout } from "@/lib/osd/generate";
import { jsonError, orderFromRequest } from "@/lib/osd/http";
import { latestLayout, saveLayout } from "@/lib/osd/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const order = await orderFromRequest(request);
    if (!order) return NextResponse.json({ error: "Hace falta un acceso de compra." }, { status: 401 });
    const saved = await latestLayout(order.id);
    if (!saved) return NextResponse.json({ layout: null });
    return NextResponse.json({ layout: saved.result, inputs: saved.inputs });
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { inputs?: unknown; accessToken?: unknown } | null;
  try {
    const order = await orderFromRequest(request, body?.accessToken);
    if (!order) return NextResponse.json({ error: "Hace falta un acceso de compra." }, { status: 401 });
    const layout = generateLayout(body?.inputs);
    const id = await saveLayout(order.id, layout.inputs, layout);
    return NextResponse.json({ id, layout });
  } catch (error) {
    return jsonError(error);
  }
}
