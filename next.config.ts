import type { NextConfig } from "next";

const githubPages = process.env.GITHUB_PAGES === "1";

const nextConfig: NextConfig = {
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
};

export default nextConfig;
