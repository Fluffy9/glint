import { describe, expect, it } from "vitest";
import { createVault, decryptSample, base64ToBytes } from "../../functions/src/domain/crypto";
import { fixtureBand } from "../../lib/band";
import { readVaultFlag, writeVaultFlag, VAULT_FLAG } from "../../lib/vault-flag";
import type { LocalVault } from "../../lib/vault-db";
import { storeBandBytes } from "../../lib/vault-samples";

function memoryStorage() {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
  };
}

describe("local vault flag", () => {
  it("records only that a vault exists", () => {
    const storage = memoryStorage();
    expect(readVaultFlag(storage)).toBe(false);
    writeVaultFlag(storage, true);
    expect(storage.getItem(VAULT_FLAG)).toBe("1");
    expect(readVaultFlag(storage)).toBe(true);
    writeVaultFlag(storage, false);
    expect(readVaultFlag(storage)).toBe(false);
  });
});

describe("band samples", () => {
  it("encrypts fixture bytes before they are stored", async () => {
    const created = await createVault({
      credentialId: "cred",
      salt: new Uint8Array(32).fill(3),
      prfOutput: new Uint8Array(32).fill(4),
    });
    const plain = new Uint8Array([9, 8, 7, 6]);
    const source = fixtureBand(plain);
    await source.connect();
    const vault: LocalVault = {
      record: created.record,
      samples: [],
      capability: null,
      paidUntil: null,
    };
    const stored = await storeBandBytes(vault, created.dataKey, await source.read(), "2026-01-01T00:00:00.000Z");
    expect(stored.samples).toHaveLength(1);
    expect(stored.samples[0]?.ciphertext).not.toContain(String.fromCharCode(9));
    expect(JSON.stringify(stored)).not.toContain("heart-rate");
    const opened = await decryptSample(
      {
        ciphertext: base64ToBytes(stored.samples[0]!.ciphertext),
        nonce: stored.samples[0]!.nonce,
        keyVersion: 1,
      },
      created.dataKey,
    );
    expect(Array.from(opened)).toEqual(Array.from(plain));
  });
});
