import { describe, expect, it } from "vitest";
import {
  applyPaidSession,
  canAccessBackup,
  claimEntitlement,
  DAY_MS,
  deleteAccount,
  emptyBackupState,
  expireEntitlement,
  expiryDue,
  expiryTargets,
  renewalDue,
  renewalTargets,
  runDeleteAccount,
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
    expect(first.entitlements[0]?.uid).toBeNull();

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

  it("claims a pending entitlement onto the signed-in user", () => {
    const paid = applyPaidSession(emptyBackupState(), session());
    const missed = claimEntitlement(paid, "uid_1", "other@example.com");
    expect(missed.entitlements[0]?.uid).toBeNull();

    const claimed = claimEntitlement(paid, "uid_1", "buyer@example.com");
    expect(claimed.entitlements[0]).toMatchObject({ uid: "uid_1", email: "buyer@example.com" });
    expect(claimed.users).toEqual(["uid_1"]);
  });
});

describe("backup access, renewal, and expiry", () => {
  const until = new Date(paidAt.getTime() + YEAR_MS);

  it("allows the owner only while paidUntil is in the future", () => {
    expect(
      canAccessBackup({ authUid: "uid_1", ownerUid: "uid_1", paidUntil: until, now: paidAt }),
    ).toBe(true);
    expect(
      canAccessBackup({ authUid: "uid_2", ownerUid: "uid_1", paidUntil: until, now: paidAt }),
    ).toBe(false);
    expect(
      canAccessBackup({ authUid: null, ownerUid: "uid_1", paidUntil: until, now: paidAt }),
    ).toBe(false);
    expect(
      canAccessBackup({ authUid: "uid_1", ownerUid: "uid_1", paidUntil: until, now: until }),
    ).toBe(false);
  });

  it("selects renewal inside the lead window and expiry after the grace period", () => {
    expect(renewalDue(until, new Date(until.getTime() - 31 * DAY_MS))).toBe(false);
    expect(renewalDue(until, new Date(until.getTime() - 30 * DAY_MS))).toBe(true);
    expect(renewalDue(until, until)).toBe(false);
    expect(expiryDue(until, new Date(until.getTime() + 29 * DAY_MS))).toBe(false);
    expect(expiryDue(until, new Date(until.getTime() + 30 * DAY_MS))).toBe(true);

    const claimed = claimEntitlement(applyPaidSession(emptyBackupState(), session()), "uid_1", "buyer@example.com");
    expect(renewalTargets(claimed, new Date(until.getTime() - DAY_MS)).map((item) => item.uid)).toEqual(["uid_1"]);
    expect(expiryTargets(claimed, new Date(until.getTime() + 30 * DAY_MS)).map((item) => item.uid)).toEqual([
      "uid_1",
    ]);
  });
});

describe("account delete", () => {
  it("removes ciphertext and the user, and keeps the Stripe order", async () => {
    const calls: string[] = [];
    await runDeleteAccount("uid_1", {
      storage: async () => {
        calls.push("storage");
      },
      objects: async () => {
        calls.push("objects");
      },
      entitlement: async () => {
        calls.push("entitlement");
      },
      auth: async () => {
        calls.push("auth");
      },
    });
    expect(calls).toEqual(["storage", "objects", "entitlement", "auth"]);

    const paid = claimEntitlement(applyPaidSession(emptyBackupState(), session()), "uid_1", "buyer@example.com");
    const withHealth = {
      ...paid,
      objects: [{ id: "obj_1", uid: "uid_1", category: "heart", nonce: "n", keyVersion: 1, size: 4 }],
      blobs: {
        "backups/uid_1/heart/obj_1": new Uint8Array([1, 2, 3, 4]),
        "backups/uid_2/sleep/obj_2": new Uint8Array([9]),
      },
      entitlements: [
        ...paid.entitlements,
        {
          email: "other@example.com",
          paidUntil: paid.entitlements[0]!.paidUntil,
          stripeCustomerId: "cus_2",
          uid: "uid_2",
        },
      ],
    };

    const expired = expireEntitlement(withHealth, "uid_1");
    expect(expired.blobs["backups/uid_1/heart/obj_1"]).toBeUndefined();
    expect(expired.blobs["backups/uid_2/sleep/obj_2"]).toEqual(new Uint8Array([9]));
    expect(expired.objects).toEqual([]);
    expect(expired.orders).toHaveLength(1);

    const deleted = deleteAccount(withHealth, "uid_1");
    expect(deleted.users).toEqual([]);
    expect(deleted.entitlements.map((item) => item.uid)).toEqual(["uid_2"]);
    expect(deleted.orders).toEqual(withHealth.orders);
    expect(deleted.blobs["backups/uid_2/sleep/obj_2"]).toEqual(new Uint8Array([9]));
  });
});
