import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  new URL("../../supabase/migrations/20261026000000_commerce.sql", import.meta.url),
  "utf8",
);
const lower = migration.toLowerCase();

describe("Commerce schema", () => {
  it("locks row level security and keeps health data out of commerce", () => {
    expect(lower).toContain("alter table commerce.orders enable row level security");
    expect(lower).toContain("alter table commerce.subscriptions enable row level security");
    expect(lower).toContain("force row level security");
    expect(lower).toContain("create policy commerce_ingest_orders on commerce.orders");
    expect(lower).not.toMatch(/create policy[\s\S]*to (anon|authenticated|public)/);
    expect(lower).not.toMatch(/heart|sleep|hrv|sample|bpm/);
    expect(lower).not.toMatch(/grant[\s\S]*health/);
    expect(lower).toContain("grant select, insert, update on commerce.orders to commerce_ingest");
    expect(lower).toContain("grant select, insert, update on commerce.subscriptions to commerce_ingest");
  });

  it("does not let the webhook import health storage", () => {
    const webhook = readFileSync(
      new URL("../../app/api/stripe/webhook/route.ts", import.meta.url),
      "utf8",
    );
    const database = readFileSync(new URL("../../lib/commerce-db.ts", import.meta.url), "utf8");
    for (const source of [webhook, database]) {
      expect(source).not.toContain("lib/health");
      expect(source.toLowerCase()).not.toContain("health.");
    }
  });
});
