const HSTS = "max-age=63072000; includeSubDomains";

export function contentSecurityPolicy(nonce: string): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    "style-src 'self' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data:",
    "connect-src 'self'",
    "form-action 'self' https://checkout.stripe.com https://billing.stripe.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "object-src 'none'",
  ].join("; ");
}

export function applySecurityHeaders(
  headers: Headers,
  options: { nonce: string; isProduction: boolean },
): Headers {
  headers.set("Content-Security-Policy", contentSecurityPolicy(options.nonce));
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  if (options.isProduction) {
    headers.set("Strict-Transport-Security", HSTS);
  }
  return headers;
}
