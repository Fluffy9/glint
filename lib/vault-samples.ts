import { bytesToBase64, encryptSample, type SampleBlob } from "@/functions/src/domain/crypto";
import type { LocalVault, StoredSample } from "@/lib/vault-db";

export async function storeBandBytes(
  vault: LocalVault,
  dataKey: CryptoKey,
  bytes: Uint8Array,
  recordedAt: string,
): Promise<LocalVault> {
  const blob: SampleBlob = await encryptSample(bytes, dataKey);
  const sample: StoredSample = {
    id: crypto.randomUUID(),
    recordedAt,
    nonce: blob.nonce,
    keyVersion: blob.keyVersion,
    ciphertext: bytesToBase64(blob.ciphertext),
  };
  return { ...vault, samples: [...vault.samples, sample] };
}
