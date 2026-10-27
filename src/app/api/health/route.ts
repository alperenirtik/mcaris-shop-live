import { NextResponse } from "next/server";

/** Coolify / container healthcheck — hızlı 200, ağır iş yok. */
export async function GET() {
  return NextResponse.json(
    { ok: true, service: "shop.mcaris.com.tr" },
    { status: 200, headers: { "Cache-Control": "no-store" } }
  );
}
