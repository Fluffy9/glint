import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { publicEnvNames } from "../../lib/public-env";

const roots = ["app", "components", "lib", "proxy.ts"];
const secretPattern = /sk_live_[A-Za-z0-9]+|sk_test_[A-Za-z0-9]+|whsec_[A-Za-z0-9]+/;
const serverOnly = /STRIPE_SECRET_KEY|STRIPE_WEBHOOK_SECRET/;

function filesIn(entry: string): string[] {
  const full = path.join(process.cwd(), entry);
  if (!statSync(full).isDirectory()) return [full];
  return readdirSync(full).flatMap((name) => filesIn(path.join(entry, name)));
}

describe("Secrets stay on the server", () => {
  it("keeps keys out of source and limits public env names", () => {
    const allowed = new Set<string>(publicEnvNames);
    const files = roots.flatMap((root) => filesIn(root)).filter((file) => /\.(ts|tsx)$/.test(file));

    for (const file of files) {
      const text = readFileSync(file, "utf8");
      const relative = path.relative(process.cwd(), file);
      expect(secretPattern.test(text), `${relative} contains a hardcoded secret.`).toBe(false);

      if (text.includes("use client")) {
        expect(
          serverOnly.test(text),
          `${relative} is a client component and mentions a server secret.`,
        ).toBe(false);
      }

      for (const name of text.match(/NEXT_PUBLIC_[A-Z0-9_]+/g) ?? []) {
        expect(allowed.has(name), `${relative} uses ${name}, which is not on the public env allowlist.`).toBe(
          true,
        );
      }
    }
  });
});
