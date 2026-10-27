import { describe, expect, it } from "vitest";
import {
  addPasskey,
  bytesMatch,
  createVault,
  decryptSample,
  encryptSample,
  importVaultFromRecovery,
  openWithPasskey,
  openWithRecovery,
  recordHidesKeyMaterial,
  removePasskey,
  TEST_BACKUP_PLAINTEXT,
} from "../../functions/src/domain/crypto";
import { KEY_VERSION } from "../../functions/src/domain/state";

function prf(byte: number): Uint8Array {
  return new Uint8Array(32).fill(byte);
}

describe("vault key wrapping", () => {
  it("opens the same samples from a passkey wrap or the recovery key", async () => {
    const created = await createVault({ credentialId: "cred-1", salt: prf(9), prfOutput: prf(1) });
    const plain = new TextEncoder().encode("heart-rate-sample");
    const blob = await encryptSample(plain, created.dataKey);

    expect(blob.keyVersion).toBe(KEY_VERSION);
    expect(new TextDecoder().decode(blob.ciphertext)).not.toContain("heart-rate-sample");

    const fromPasskey = await openWithPasskey(created.record, created.record.passkeys[0]!.credentialId, prf(1));
    const fromRecovery = await openWithRecovery(created.record, created.recoveryKey);
    expect(bytesMatch(await decryptSample(blob, fromPasskey), plain)).toBe(true);
    expect(bytesMatch(await decryptSample(blob, fromRecovery), plain)).toBe(true);
    await expect(
      openWithPasskey(created.record, created.record.passkeys[0]!.credentialId, prf(2)),
    ).rejects.toThrow();
  });

  it("keeps the other passkey after one wrap is removed", async () => {
    const created = await createVault({ credentialId: "cred-1", salt: prf(9), prfOutput: prf(1) });
    const withSecond = await addPasskey(created.record, created.dataKey, {
      credentialId: "cred-2",
      salt: prf(8),
      prfOutput: prf(3),
    });
    const firstId = withSecond.passkeys[0]!.credentialId;
    const secondId = withSecond.passkeys[1]!.credentialId;
    const remaining = removePasskey(withSecond, firstId);

    expect(remaining.passkeys.map((item) => item.credentialId)).toEqual([secondId]);
    const plain = new TextEncoder().encode(TEST_BACKUP_PLAINTEXT);
    const blob = await encryptSample(plain, created.dataKey);
    const opened = await openWithPasskey(remaining, secondId, prf(3));
    expect(bytesMatch(await decryptSample(blob, opened), plain)).toBe(true);
    await expect(openWithPasskey(remaining, firstId, prf(1))).rejects.toThrow();
    expect(bytesMatch(await decryptSample(blob, await openWithRecovery(remaining, created.recoveryKey)), plain)).toBe(
      true,
    );
  });

  it("does not store the data key or wrapping secrets on the record", async () => {
    const created = await createVault({ credentialId: "cred-7", salt: prf(4), prfOutput: prf(7) });
    const raw = new Uint8Array(await crypto.subtle.exportKey("raw", created.dataKey));
    expect(recordHidesKeyMaterial(created.record, raw)).toBe(true);
    expect(recordHidesKeyMaterial(created.record, prf(7))).toBe(true);
    expect(JSON.stringify(created.record)).not.toContain(created.recoveryKey);
  });

  it("restores the same data key from the recovery key alone", async () => {
    const created = await createVault({ credentialId: "cred-1", salt: prf(9), prfOutput: prf(1) });
    const plain = new TextEncoder().encode("heart-rate-sample");
    const blob = await encryptSample(plain, created.dataKey);
    const restored = await importVaultFromRecovery(created.recoveryKey);
    expect(restored.record.vaultId).toBe(created.record.vaultId);
    expect(restored.record.passkeys).toEqual([]);
    expect(bytesMatch(await decryptSample(blob, restored.dataKey), plain)).toBe(true);
    await expect(importVaultFromRecovery("not-a-key")).rejects.toThrow("recovery key");
  });
});
