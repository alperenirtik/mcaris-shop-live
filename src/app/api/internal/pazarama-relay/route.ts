import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const API_BASE = "https://isortagimapi.pazarama.com/";
const ALLOWED_METHODS = new Set(["GET", "POST", "PUT", "PATCH", "DELETE"]);

function unauthorized() {
  return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
}

function badRequest(message: string) {
  return NextResponse.json({ ok: false, error: message }, { status: 400 });
}

export async function POST(request: Request) {
  const secret = (process.env.MCARIS_PAZARAMA_RELAY_SECRET || "ea313ea8a58d6b92ceec34a4ef4dcc00537af7d23a850f8e").trim();
  if (!secret) {
    return NextResponse.json({ ok: false, error: "relay_not_configured" }, { status: 503 });
  }

  const provided = (request.headers.get("x-mcaris-relay-key") || "").trim();
  if (!provided || provided !== secret) {
    return unauthorized();
  }

  let payload: {
    method?: string;
    path?: string;
    body?: unknown;
    authorization?: string;
  };

  try {
    payload = await request.json();
  } catch {
    return badRequest("invalid_json");
  }

  const method = String(payload.method || "GET").toUpperCase();
  if (!ALLOWED_METHODS.has(method)) {
    return badRequest("method_not_allowed");
  }

  const rawPath = String(payload.path || "").replace(/^\/+/, "");
  if (!rawPath || rawPath.includes("..") || /^https?:/i.test(rawPath)) {
    return badRequest("invalid_path");
  }

  const target = API_BASE + rawPath;
  const headers: Record<string, string> = {
    Accept: "application/json",
    "User-Agent": "MCARIS-Shop-PazaramaRelay/1.0",
    "Accept-Language": "tr-TR,tr;q=0.9",
  };

  const auth = String(payload.authorization || request.headers.get("authorization") || "").trim();
  if (auth) {
    headers.Authorization = auth;
  }

  let body: string | undefined;
  if (payload.body !== undefined && payload.body !== null && method !== "GET") {
    body = typeof payload.body === "string" ? payload.body : JSON.stringify(payload.body);
    headers["Content-Type"] = "application/json";
  }

  try {
    const upstream = await fetch(target, {
      method,
      headers,
      body,
      cache: "no-store",
      redirect: "manual",
    });
    const text = await upstream.text();
    const contentType = upstream.headers.get("content-type") || "application/json; charset=utf-8";
    return new NextResponse(text, {
      status: upstream.status,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "upstream_failed";
    return NextResponse.json({ ok: false, error: message }, { status: 502 });
  }
}
