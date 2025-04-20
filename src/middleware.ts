import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const ipMap = new Map<string, { count: number; timestamp: number }>();
const LIMIT = 5;
const WINDOW_MS = 60 * 1000; // 1 minute


function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = ipMap.get(ip);

  if (!entry || now - entry.timestamp > WINDOW_MS) {
    ipMap.set(ip, { count: 1, timestamp: now });
    return false;
  }

  if (entry.count >= LIMIT) {
    return true;
  }

  entry.count += 1;
  return false;
}

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Allow public access to login and auth endpoints
  const publicPaths = ["/login", "/unauthorized"];
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));
  const isAuthApi = pathname.startsWith("/api/auth");

  if (isPublicPath || isAuthApi) {
    return NextResponse.next();
  }

  // Protect all other API endpoints
  if (pathname.startsWith("/api") && !token) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Redirect unauthenticated users trying to access protected pages
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // (Optional) Rate limiting for specific endpoints
  if (pathname.startsWith("/api/address/autocomplete")) {
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    const isLimited = checkRateLimit(ip);
    if (isLimited) {
      return new NextResponse(JSON.stringify({ error: "Too many requests" }), {
        status: 429,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  return NextResponse.next();
}
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
    "/api/:path*",
    "/api/((?!auth|public).*)",
  ],
};
