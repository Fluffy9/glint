import { readFileSync } from "node:fs";
import pg from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const adminUrl = process.env.COMMERCE_TEST_ADMIN_URL;
if (!adminUrl) {
  throw new Error("COMMERCE_TEST_ADMIN_URL is required. Run pnpm test:db.");
}

const migration = readFileSync(
  new URL("../../supabase/migrations/20261026000000_commerce.sql", import.meta.url),
  "utf8",
);

describe("Commerce role", () => {
  const admin = new pg.Client({ connectionString: adminUrl });

  beforeAll(async () => {
    await admin.connect();
    await admin.query(migration);
    await admin.query("create schema if not exists health");
    await admin.query("create table if not exists health.samples (id int)");
    await admin.query("revoke all on schema health from public, commerce_ingest, anon, authenticated");
  });

  afterAll(async () => {
    await admin.end();
  });

  async function asRole(role: string, sql: string) {
    await admin.query(`set role ${role}`);
    try {
      return await admin.query(sql);
    } finally {
      await admin.query("reset role");
    }
  }

  it("lets commerce_ingest write an order", async () => {
    await asRole(
      "commerce_ingest",
      `insert into commerce.orders (stripe_checkout_session_id, email, band, backup, status)
       values ('cs_db_test', 'buyer@example.com', true, false, 'paid')`,
    );
    const found = await admin.query(
      "select email from commerce.orders where stripe_checkout_session_id = 'cs_db_test'",
    );
    expect(found.rows[0]?.email).toBe("buyer@example.com");
  });

  it("refuses browser reads of orders", async () => {
    await expect(asRole("anon", "select email from commerce.orders")).rejects.toThrow(/permission denied/);
    await expect(
      asRole("authenticated", "select email from commerce.orders"),
    ).rejects.toThrow(/permission denied/);
  });

  it("refuses commerce_ingest reads of health data", async () => {
    await expect(asRole("commerce_ingest", "select id from health.samples")).rejects.toThrow(
      /permission denied/,
    );
  });
});
