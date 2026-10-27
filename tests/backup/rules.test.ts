import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const storage = readFileSync(new URL("../../storage.rules", import.meta.url), "utf8");
const firestore = readFileSync(new URL("../../firestore.rules", import.meta.url), "utf8");
const functions = readFileSync(new URL("../../functions/src/index.ts", import.meta.url), "utf8");

describe("Firebase rules", () => {
  it("stops client writes to backup objects", () => {
    expect(storage).toContain("match /backups/{vaultId}/{category}/{objectId}");
    expect(storage).toContain("allow read, write: if false");
    expect(storage).not.toContain("request.auth");
    expect(storage.toLowerCase()).not.toMatch(/heart|sleep|sample|bpm/);
  });

  it("hides orders, entitlements, and vault objects from clients", () => {
    expect(firestore).toContain("match /orders/{id}");
    expect(firestore).toContain("match /entitlements/{email}");
    expect(firestore).toContain("match /vaultObjects/{vaultId}/items/{objectId}");
    expect(firestore).toContain("allow read, write: if false");
    expect(firestore).not.toContain("request.auth");
    expect(firestore.toLowerCase()).not.toMatch(/heart rate|plaintext/);
  });

  it("exports the webhook, redeem, upload, download, renewal, and expiry functions", () => {
    for (const name of [
      "stripeWebhook",
      "redeemBackup",
      "uploadBackup",
      "downloadBackup",
      "deleteBackup",
      "renewalReminders",
      "expireBackups",
    ]) {
      expect(functions).toContain(`export const ${name}`);
    }
    expect(functions).not.toContain("claimEntitlement");
    expect(functions).not.toContain("deleteAccount");
    expect(functions).not.toContain("commerce.subscriptions");
    expect(functions.toLowerCase()).not.toContain("health.");
  });
});
