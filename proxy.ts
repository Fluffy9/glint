import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  applySecurityHeaders,
  contentSecurityPolicy,
} from "./lib/security-headers";

export function proxy(request: NextRequest) {
  const nonce = crypto.randomUUID();
  const isProduction = process.env.NODE_ENV === "production";
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(
    "Content-Security-Policy",
    contentSecurityPolicy(nonce, { inlineStyles: !isProduction }),
  );

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  applySecurityHeaders(response.headers, {
    nonce,
    isProduction,
  });

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
