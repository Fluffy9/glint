const HSTS = "max-age=63072000; includeSubDomains";

const emulatorConnect =
  "http://127.0.0.1:9099 http://127.0.0.1:5001 http://127.0.0.1:8180 http://127.0.0.1:9199";

export function contentSecurityPolicy(
  nonce: string,
  options?: { inlineStyles?: boolean; emulators?: boolean; unsafeEval?: boolean },
): string {
  const styleSrc = options?.inlineStyles
    ? "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com"
    : "style-src 'self' https://fonts.googleapis.com";
  const connectSrc = options?.emulators
    ? `connect-src 'self' ${emulatorConnect} https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firestore.googleapis.com https://firebasestorage.googleapis.com https://*.cloudfunctions.net`
    : "connect-src 'self' https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firestore.googleapis.com https://firebasestorage.googleapis.com https://*.cloudfunctions.net";
  // React's development build uses eval for call stacks. Production never needs it.
  const scriptSrc = options?.unsafeEval
    ? `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-eval'`
    : `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`;

  return [
    "default-src 'self'",
    scriptSrc,
    styleSrc,
    // React sets layout/transform via style attributes (slide box + accents).
    "style-src-attr 'unsafe-inline'",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data:",
    connectSrc,
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
  headers.set(
    "Content-Security-Policy",
    contentSecurityPolicy(options.nonce, {
      // The Next.js dev indicator injects style elements. Production stays closed.
      inlineStyles: !options.isProduction,
      emulators: !options.isProduction,
      unsafeEval: !options.isProduction,
    }),
  );
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  if (options.isProduction) {
    headers.set("Strict-Transport-Security", HSTS);
  }
  return headers;
}
