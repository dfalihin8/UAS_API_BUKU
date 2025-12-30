import { NextResponse } from "next/server";
import { verifyToken } from "./lib/jwt";

const rateLimit = new Map();

export async function middleware(req) {
  const path = req.nextUrl.pathname;

  /* =====================
     RATE LIMIT (BONUS)
     ===================== */
  const ip = req.ip ?? "unknown";
  const now = Date.now();
  const last = rateLimit.get(ip) || 0;

  if (now - last < 1000) {
    return NextResponse.json(
      { success: false, error: "Too many requests", code: 429 },
      { status: 429 }
    );
  }
  rateLimit.set(ip, now);

  /* =====================
     LOGGING (BONUS)
     ===================== */
  console.log(req.method, path);

  /* =====================
     PUBLIC AUTH
     ===================== */
  if (path.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  /* =====================
     AUTHORIZATION
     ===================== */
  const auth = req.headers.get("authorization");
  if (!auth) {
    return NextResponse.json(
      { success: false, error: "Unauthorized", code: 401 },
      { status: 401 }
    );
  }

  const token = auth.split(" ")[1];

  try {
    const { payload } = await verifyToken(token);

    const res = NextResponse.next();
    res.headers.set("x-user-id", payload.id);
    res.headers.set("x-user-role", payload.role);
    return res;
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid token", code: 401 },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: ["/api/:path*"],
};
