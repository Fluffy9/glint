import type { AccountSession } from "@/lib/account-session";
import { getEncryptedBackup, putEncryptedBackup } from "@/functions/src/domain/auth-rest";
import {
  bytesMatch,
  bytesToBase64,
  decryptWithPassphrase,
  encryptWithPassphrase,
  TEST_BACKUP_PLAINTEXT,
  type CipherBlob,
} from "@/functions/src/domain/crypto";
import { backupObjectPath } from "@/functions/src/domain/state";
import type { FirebaseTargets } from "@/lib/client-firebase";

export type StoredTestBackup = {
  objectPath: string;
  nonce: string;
  salt: string;
  keyVersion: CipherBlob["keyVersion"];
  ciphertextBase64: string;
};

export async function saveTestBackup(
  targets: FirebaseTargets,
  session: AccountSession,
  passphrase: string,
): Promise<StoredTestBackup> {
  const objectId = crypto.randomUUID();
  const objectPath = backupObjectPath(session.localId, "heart", objectId);
  const blob = await encryptWithPassphrase(new TextEncoder().encode(TEST_BACKUP_PLAINTEXT), passphrase);
  await putEncryptedBackup(globalThis.fetch.bind(globalThis), {
    storageBase: targets.storageBase,
    firestoreBase: targets.firestoreBase,
    idToken: session.idToken,
    uid: session.localId,
    objectPath,
    objectId,
    category: "heart",
    nonce: blob.nonce,
    salt: blob.salt,
    keyVersion: blob.keyVersion,
    ciphertext: blob.ciphertext,
  });
  return {
    objectPath,
    nonce: blob.nonce,
    salt: blob.salt,
    keyVersion: blob.keyVersion,
    ciphertextBase64: bytesToBase64(blob.ciphertext),
  };
}

export async function unlockTestBackup(
  targets: FirebaseTargets,
  session: AccountSession,
  stored: StoredTestBackup,
  passphrase: string,
): Promise<string> {
  const ciphertext = await getEncryptedBackup(globalThis.fetch.bind(globalThis), {
    storageBase: targets.storageBase,
    idToken: session.idToken,
    objectPath: stored.objectPath,
  });
  const plain = await decryptWithPassphrase(
    {
      ciphertext,
      nonce: stored.nonce,
      salt: stored.salt,
      keyVersion: stored.keyVersion,
    },
    passphrase,
  );
  const expected = new TextEncoder().encode(TEST_BACKUP_PLAINTEXT);
  if (!bytesMatch(plain, expected)) throw new Error("plaintext mismatch");
  return new TextDecoder().decode(plain);
}
