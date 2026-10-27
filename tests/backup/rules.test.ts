import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const storage = readFileSync(new URL("../../storage.rules", import.meta.url), "utf8");
const firestore = readFileSync(new URL("../../firestore.rules", import.meta.url), "utf8");
const functions = readFileSync(new URL("../../functions/src/index.ts", import.meta.url), "utf8");

describe("Firebase rules", () => {
  it("keeps backup objects private to the paid owner", () => {
    expect(storage).toContain("match /backups/{uid}/{category}/{objectId}");
    expect(storage).toContain("request.auth.uid == uid");
    expect(storage).toContain("paidUntil > request.time");
    expect(storage).toContain("allow read, write: if false");
    expect(storage.toLowerCase()).not.toMatch(/heart|sleep|sample|bpm/);
  });

  it("hides orders from clients and lets only functions write paidUntil", () => {
    expect(firestore).toContain("match /orders/{id}");
    expect(firestore).toContain("match /entitlements/{uid}");
    expect(firestore).toContain("allow write: if false");
    expect(firestore).toContain("request.auth.uid == uid");
    expect(firestore.toLowerCase()).not.toMatch(/heart rate|plaintext/);
  });

  it("exports the webhook, claim, delete, renewal, and expiry functions", () => {
    for (const name of [
      "stripeWebhook",
      "claimEntitlement",
      "deleteAccount",
      "renewalReminders",
      "expireBackups",
    ]) {
      expect(functions).toContain(`export const ${name}`);
    }
    expect(functions).not.toContain("commerce.subscriptions");
    expect(functions.toLowerCase()).not.toContain("health.");
  });
});
