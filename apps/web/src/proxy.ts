import { NextResponse, type NextRequest } from "next/server";
import { OPEN_PATHS, stagingAuthorized, stagingEnabled } from "@/lib/staging";

/** Staging gate (see src/lib/staging.ts). Does nothing unless STAGING_PASSWORD is set. */
export function proxy(req: NextRequest) {
  if (!stagingEnabled()) return NextResponse.next();
  if (OPEN_PATHS.some((p) => req.nextUrl.pathname.startsWith(p))) return NextResponse.next();
  if (stagingAuthorized(req.headers.get("authorization"))) return NextResponse.next();
  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "www-authenticate": 'Basic realm="agere staging", charset="UTF-8"', "cache-control": "no-store" },
  });
}

export const config = {
  // everything except Next's own static assets
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
