import { describe, expect, it } from "vitest";
import { hashCapability } from "../../functions/src/domain/crypto";
import {
  addCiphertext,
  applyPaidSession,
  canDeleteShelf,
  canDownloadBackup,
  canUploadBackup,
  DAY_MS,
  deleteShelf,
  emptyBackupState,
  entitlementForVault,
  expiryDue,
  expiryTargets,
  redeemPaidCheckout,
  renewalDue,
  renewalTargets,
  YEAR_MS,
  type PaidSession,
} from "../../functions/src/domain/state";

const paidAt = new Date("2026-01-01T00:00:00.000Z");

function session(overrides: Partial<PaidSession> = {}): PaidSession {
  return {
    id: "cs_1",
    email: "Buyer@Example.com",
    customerId: "cus_1",
    amountTotal: 7999,
    paymentStatus: "paid",
    band: true,
    backup: true,
    paidAt,
    ...overrides,
  };
}

describe("one-time backup entitlements", () => {
  it("records a band purchase without starting backup", () => {
    const next = applyPaidSession(emptyBackupState(), session({ backup: false, amountTotal: 6999 }));
    expect(next.orders).toEqual([
      expect.objectContaining({ sessionId: "cs_1", email: "Buyer@Example.com", band: true, backup: false }),
    ]);
    expect(next.entitlements).toEqual([]);
  });

  it("sets paidUntil a year out and stacks a second year on the current end", () => {
    const first = applyPaidSession(emptyBackupState(), session());
    expect(first.entitlements[0]?.paidUntil.toISOString()).toBe(new Date(paidAt.getTime() + YEAR_MS).toISOString());
    expect(first.entitlements[0]?.vaultId).toBeNull();

    const secondAt = new Date("2026-06-01T00:00:00.000Z");
    const second = applyPaidSession(first, session({ id: "cs_2", paidAt: secondAt }));
    expect(second.entitlements).toHaveLength(1);
    expect(second.entitlements[0]?.paidUntil.toISOString()).toBe(
      new Date(paidAt.getTime() + YEAR_MS * 2).toISOString(),
    );
    expect(second.orders.map((order) => order.sessionId)).toEqual(["cs_1", "cs_2"]);
  });

  it("ignores unpaid sessions and does not extend twice for the same session", () => {
    const unpaid = applyPaidSession(emptyBackupState(), session({ paymentStatus: "unpaid" }));
    expect(unpaid.orders).toEqual([]);

    const once = applyPaidSession(emptyBackupState(), session());
    const twice = applyPaidSession(once, session());
    expect(twice.orders).toHaveLength(1);
    expect(twice.entitlements[0]?.paidUntil.toISOString()).toBe(once.entitlements[0]?.paidUntil.toISOString());
  });
});

describe("upload capability", () => {
  const until = new Date(paidAt.getTime() + YEAR_MS);

  it("binds the first vault and refuses a second vault on the same email", async () => {
    const paid = applyPaidSession(emptyBackupState(), session());
    const hash = await hashCapability("secret-a");
    const other = await hashCapability("secret-b");
    const first = redeemPaidCheckout(paid, {
      sessionId: "cs_1",
      vaultId: "vault-a",
      capabilityHash: hash,
      now: paidAt,
    });
    expect(first.ok).toBe(true);
    if (!first.ok) return;
    const stolen = redeemPaidCheckout(first.state, {
      sessionId: "cs_1",
      vaultId: "vault-b",
      capabilityHash: other,
      now: paidAt,
    });
    expect(stolen).toEqual({ ok: false, error: "taken" });

    const entitlement = entitlementForVault(first.state, "vault-a");
    expect(canUploadBackup({ entitlement, vaultId: "vault-a", capabilityHash: hash, now: paidAt })).toBe(true);
    expect(canUploadBackup({ entitlement, vaultId: "vault-a", capabilityHash: other, now: paidAt })).toBe(false);
    expect(canUploadBackup({ entitlement, vaultId: "vault-a", capabilityHash: hash, now: until })).toBe(false);
    expect(canDownloadBackup({ entitlement, vaultId: "vault-a", now: paidAt })).toBe(true);
    expect(canDownloadBackup({ entitlement, vaultId: "vault-b", now: paidAt })).toBe(false);
    expect(canDeleteShelf({ entitlement, vaultId: "vault-a", capabilityHash: hash })).toBe(true);
    expect(canDeleteShelf({ entitlement, vaultId: "vault-a", capabilityHash: other })).toBe(false);
  });

  it("keeps ciphertext when the year ends and removes only the shelf on delete", () => {
    const paid = applyPaidSession(emptyBackupState(), session());
    const redeemed = redeemPaidCheckout(paid, {
      sessionId: "cs_1",
      vaultId: "vault-a",
      capabilityHash: "hash",
      now: paidAt,
    });
    if (!redeemed.ok) throw new Error("redeem");
    const stored = addCiphertext(
      redeemed.state,
      { id: "obj_1", vaultId: "vault-a", category: "heart", nonce: "n", keyVersion: 1, size: 4 },
      new Uint8Array([1, 2, 3, 4]),
    );
    if (!stored) throw new Error("store");
    const again = addCiphertext(
      stored,
      { id: "obj_1", vaultId: "vault-a", category: "heart", nonce: "n", keyVersion: 1, size: 4 },
      new Uint8Array([9]),
    );
    expect(again).toBeNull();
    expect(expiryDue(until, new Date(until.getTime() + 30 * DAY_MS))).toBe(true);
    expect(stored.blobs["backups/vault-a/heart/obj_1"]).toEqual(new Uint8Array([1, 2, 3, 4]));

    const deleted = deleteShelf(stored, "vault-a");
    expect(deleted.blobs["backups/vault-a/heart/obj_1"]).toBeUndefined();
    expect(deleted.orders).toEqual(stored.orders);
    expect(deleted.entitlements).toHaveLength(1);
  });

  it("selects renewal from the Stripe email", () => {
    const paid = applyPaidSession(emptyBackupState(), session());
    expect(renewalDue(until, new Date(until.getTime() - 31 * DAY_MS))).toBe(false);
    expect(renewalDue(until, new Date(until.getTime() - 30 * DAY_MS))).toBe(true);
    expect(renewalTargets(paid, new Date(until.getTime() - DAY_MS)).map((item) => item.email)).toEqual([
      "buyer@example.com",
    ]);
    expect(expiryTargets(paid, new Date(until.getTime() + 30 * DAY_MS)).map((item) => item.email)).toEqual([
      "buyer@example.com",
    ]);
  });
});
