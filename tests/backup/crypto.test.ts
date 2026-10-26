import { describe, expect, it } from "vitest";
import { decryptWithPassphrase, encryptWithPassphrase } from "../../functions/src/domain/crypto";
import { KEY_VERSION } from "../../functions/src/domain/state";

describe("passphrase backup crypto", () => {
  it("round-trips ciphertext and rejects the wrong passphrase", async () => {
    const plain = new TextEncoder().encode("heart-rate-sample");
    const blob = await encryptWithPassphrase(plain, "correct horse");

    expect(blob.keyVersion).toBe(KEY_VERSION);
    expect(Array.from(blob.ciphertext)).not.toEqual(Array.from(plain));
    expect(new TextDecoder().decode(blob.ciphertext)).not.toContain("heart-rate-sample");
    expect(JSON.stringify({ nonce: blob.nonce, salt: blob.salt })).not.toContain("correct horse");

    const opened = await decryptWithPassphrase(blob, "correct horse");
    expect(new TextDecoder().decode(opened)).toBe("heart-rate-sample");
    await expect(decryptWithPassphrase(blob, "wrong horse")).rejects.toThrow();
  });
});
