import { defineConfig, devices } from "@playwright/test";

const port = 3000;
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  outputDir: "node_modules/.cache/playwright-results",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    // One Next dev server per project. Production start is blocked until
    // /checkout/success can prerender.
    command: `pnpm exec next dev --port ${port} --hostname 127.0.0.1`,
    url: baseURL,
    reuseExistingServer: true,
    timeout: 180_000,
  },
});
