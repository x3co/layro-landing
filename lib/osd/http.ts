import { timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { StorageError } from "../storage";
import { orderByAccessToken } from "./store";

export const ACCESS_COOKIE = "lgmp_access";

export function jsonError(error: unknown) {
  if (error instanceof StorageError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  const message = error instanceof Error ? error.message : "";
  if (message.startsWith("Fuera de alcance de esta versión (v2):")) {
    return NextResponse.json({ error: message }, { status: 422 });
  }
  return NextResponse.json({ error: "No se pudo completar la operación." }, { status: 500 });
}

export function tokensMatch(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function accessCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    secure: process.env.NODE_ENV === "production",
  };
}

export async function orderFromRequest(request: Request, bodyToken?: unknown) {
  const fromBody = typeof bodyToken === "string" ? bodyToken.trim() : "";
  const fromCookie = cookies().get(ACCESS_COOKIE)?.value?.trim() || "";
  const header = request.headers.get("x-access-token")?.trim() || "";
  const token = fromCookie || fromBody || header;
  if (!token) return null;
  return orderByAccessToken(token);
}
