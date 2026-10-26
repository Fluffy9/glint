import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    // Implicit instant checks reload the dev server: the root appearance
    // provider is a client parent, so connection() can never pass them.
    instantInsights: {
      validationLevel: "manual-warning",
    },
  },
};

export default nextConfig;
