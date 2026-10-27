import { describe, expect, it } from "vitest";
import { createVault } from "../../functions/src/domain/crypto";
import type { LocalVault } from "../../lib/vault-db";
import { mergeRestoredVault } from "../../lib/vault-restore";

function prf(byte: number): Uint8Array {
  return new Uint8Array(32).fill(byte);
}

describe("mergeRestoredVault", () => {
  it("keeps passkeys and samples when the recovery key matches this vault", async () => {
    const created = await createVault({ credentialId: "cred-1", salt: prf(1), prfOutput: prf(2) });
    const existing: LocalVault = {
      record: created.record,
      samples: [
        {
          id: "s1",
          recordedAt: "2026-01-01T00:00:00.000Z",
          nonce: "n",
          keyVersion: 1,
          ciphertext: "YQ==",
        },
      ],
      capability: "cap",
      paidUntil: "2027-01-01T00:00:00.000Z",
    };
    const merged = mergeRestoredVault(existing, {
      record: { vaultId: created.record.vaultId, recoveryWrappedDataKey: "new-wrap", passkeys: [] },
    });
    expect(merged.record.passkeys).toEqual(created.record.passkeys);
    expect(merged.record.recoveryWrappedDataKey).toBe("new-wrap");
    expect(merged.samples).toHaveLength(1);
    expect(merged.capability).toBe("cap");
  });

  it("starts empty when the recovery key is for a different vault", async () => {
    const created = await createVault({ credentialId: "cred-1", salt: prf(1), prfOutput: prf(2) });
    const existing: LocalVault = {
      record: created.record,
      samples: [
        {
          id: "s1",
          recordedAt: "2026-01-01T00:00:00.000Z",
          nonce: "n",
          keyVersion: 1,
          ciphertext: "YQ==",
        },
      ],
      capability: "cap",
      paidUntil: null,
    };
    const merged = mergeRestoredVault(existing, {
      record: { vaultId: "other-vault", recoveryWrappedDataKey: "wrap", passkeys: [] },
    });
    expect(merged.record.passkeys).toEqual([]);
    expect(merged.samples).toEqual([]);
    expect(merged.capability).toBeNull();
  });
});
