import { createVault } from "@/functions/src/domain/crypto";

export {
  DEV_FIXTURE_BAND_FLAG,
  readFixtureBandFlag,
  writeFixtureBandFlag,
} from "@/lib/fixture-band-flag";

/** Create a vault without WebAuthn so local backup and sample flows can be exercised. */
export async function mintDevVault(): Promise<{
  record: Awaited<ReturnType<typeof createVault>>["record"];
  recoveryKey: string;
  dataKey: CryptoKey;
}> {
  const salt = crypto.getRandomValues(new Uint8Array(32));
  const prfOutput = crypto.getRandomValues(new Uint8Array(32));
  const created = await createVault({
    credentialId: "dev-fixture-passkey",
    salt,
    prfOutput,
  });
  // Drop the fake wrap so Lock lands on Paste recovery key, not a broken Unlock.
  return {
    ...created,
    record: { ...created.record, passkeys: [] },
  };
}
