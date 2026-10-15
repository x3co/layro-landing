import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ACCESS_COOKIE, accessCookieOptions, jsonError } from "@/lib/osd/http";
import { latestPaidByEmail, normalizeEmail, orderByAccessToken } from "@/lib/osd/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const attempts = new Map<string, { count: number; resetAt: number }>();

function limited(ip: string) {
  const now = Date.now();
  const bucket = attempts.get(ip);
  if (!bucket || bucket.resetAt < now) {
    attempts.set(ip, { count: 1, resetAt: now + 10 * 60 * 1000 });
    return false;
  }
  if (bucket.count >= 12) return true;
  bucket.count += 1;
  return false;
}

export async function GET() {
  const token = cookies().get(ACCESS_COOKIE)?.value?.trim() || "";
  if (!token) return NextResponse.json({ ok: false }, { status: 401 });
  try {
    const order = await orderByAccessToken(token);
    if (!order) return NextResponse.json({ ok: false }, { status: 401 });
    return NextResponse.json({ ok: true, email: order.email });
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (limited(ip)) {
    return NextResponse.json({ error: "Demasiados intentos. Espere unos minutos." }, { status: 429 });
  }

  const body = (await request.json().catch(() => null)) as { token?: unknown; email?: unknown } | null;
  try {
    const token = typeof body?.token === "string" ? body.token.trim() : "";
    const order = token ? await orderByAccessToken(token) : await latestPaidByEmail(normalizeEmail(body?.email));
    if (!order) {
      return NextResponse.json(
        { error: "No hay un pedido pagado con esos datos. Si acaba de pagar, use el enlace de acceso o el email de la compra." },
        { status: 404 },
      );
    }
    cookies().set(ACCESS_COOKIE, order.accessToken, accessCookieOptions());
    return NextResponse.json({ ok: true, email: order.email });
  } catch (error) {
    return jsonError(error);
  }
}
