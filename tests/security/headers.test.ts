import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  applySecurityHeaders,
  contentSecurityPolicy,
} from "../../lib/security-headers";

describe("Browser headers", () => {
  it("keeps scripts on this site and refuses framing", () => {
    const policy = contentSecurityPolicy("test-nonce");
    expect(policy).toContain("frame-ancestors 'none'");

    const scriptSrc = policy
      .split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith("script-src"));

    expect(scriptSrc, "script-src must be set. An open default is not a policy.").toBeTruthy();
    expect(scriptSrc).not.toMatch(/\*/);
    expect(scriptSrc).not.toContain("https:");
    expect(scriptSrc).not.toContain("'unsafe-inline'");
    expect(scriptSrc).toContain("'nonce-test-nonce'");
  });

  it("allows React style attributes without opening style elements", () => {
    const policy = contentSecurityPolicy("test-nonce");
    expect(policy).toContain("style-src-attr 'unsafe-inline'");
    expect(policy).toMatch(/style-src 'self' https:\/\/fonts\.googleapis\.com/);
    expect(policy).not.toContain("style-src 'self' 'unsafe-inline'");
  });

  it("lets the dev indicator style itself, and closes that in production", () => {
    const production = applySecurityHeaders(new Headers(), {
      nonce: "n",
      isProduction: true,
    }).get("content-security-policy");
    const development = applySecurityHeaders(new Headers(), {
      nonce: "n",
      isProduction: false,
    }).get("content-security-policy");

    expect(production).not.toContain("'unsafe-inline' https://fonts.googleapis.com");
    expect(development).toContain(
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    );
  });

  it("sends nosniff, a strict referrer, and HSTS in production", () => {
    const production = applySecurityHeaders(new Headers(), {
      nonce: "n",
      isProduction: true,
    });
    const development = applySecurityHeaders(new Headers(), {
      nonce: "n",
      isProduction: false,
    });

    expect(production.get("x-content-type-options")).toBe("nosniff");
    expect(production.get("referrer-policy")).toBe("strict-origin-when-cross-origin");
    expect(production.get("strict-transport-security")).toContain("max-age=");
    expect(development.get("strict-transport-security")).toBeNull();
  });

  it("is applied by the request proxy", () => {
    const proxy = readFileSync(new URL("../../proxy.ts", import.meta.url), "utf8");
    expect(proxy).toContain("applySecurityHeaders");
    expect(proxy).toContain("./lib/security-headers");
  });
});
