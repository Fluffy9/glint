import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    exclude: ["tests/security/db.test.ts"],
    passWithNoTests: true,
  },
  resolve: {
    alias: {
      "@": import.meta.dirname,
    },
  },
});
