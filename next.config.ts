import type { NextConfig } from "next";

const githubPages = process.env.GITHUB_PAGES === "1";
const liveFirebase = Boolean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim());

const nextConfig: NextConfig = {
  // Dev assets are tied to localhost. 127.0.0.1 is a different origin.
  allowedDevOrigins: ["127.0.0.1"],
  ...(githubPages
    ? {
        output: "export",
        // https://fluffy9.github.io/glint/
        basePath: "/glint",
        trailingSlash: true,
      }
    : {}),
  // Partial prerender and cache components need a server. Pages is a static export.
  cacheComponents: !githubPages,
  partialPrefetching: !githubPages,
  experimental: {
    // Implicit instant checks reload the dev server: the root appearance
    // provider is a client parent, so connection() can never pass them.
    instantInsights: {
      validationLevel: "manual-warning",
    },
  },
  // Keep the browser on the Next origin; proxy reaches the Firebase emulators.
  async rewrites() {
    if (githubPages || liveFirebase) return [];
    return [
      { source: "/__glint/auth/:path*", destination: "http://127.0.0.1:9099/:path*" },
      { source: "/__glint/functions/:path*", destination: "http://127.0.0.1:5001/:path*" },
      { source: "/__glint/firestore/:path*", destination: "http://127.0.0.1:8180/:path*" },
      { source: "/__glint/storage/:path*", destination: "http://127.0.0.1:9199/:path*" },
    ];
  },
};

export default nextConfig;
