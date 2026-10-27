import type { VaultRecord } from "@/functions/src/domain/crypto";
import type { LocalVault } from "@/lib/vault-db";

/** Keep local passkeys, samples, and capability when the recovery key opens the same vault. */
export function mergeRestoredVault(
  existing: LocalVault | null,
  imported: { record: VaultRecord },
): LocalVault {
  if (existing && existing.record.vaultId === imported.record.vaultId) {
    return {
      ...existing,
      record: {
        vaultId: imported.record.vaultId,
        recoveryWrappedDataKey: imported.record.recoveryWrappedDataKey,
        passkeys: existing.record.passkeys,
      },
    };
  }
  return {
    record: imported.record,
    samples: [],
    capability: null,
    paidUntil: null,
  };
}
