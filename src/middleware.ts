import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

// top of file
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
  // Example: Only rate limit autocomplete API
  const { pathname } = req.nextUrl;
  const publicPaths = ["/login", "/unauthorized"];

  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  if (isPublicPath) return NextResponse.next();

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  

  if (pathname.startsWith("/api/address/autocomplete")) {
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";

    // TODO: add your rate limiting logic here
    const isLimited = checkRateLimit(ip);
    if (isLimited) {
      return new NextResponse(
        JSON.stringify({ error: "Too many requests" }),
        {
          status: 429,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }



  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};