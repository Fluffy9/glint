import { KEY_VERSION } from "./state";

export const TEST_BACKUP_PLAINTEXT = "glint-local-backup";

const RECOVERY_VERSION = 1;

export type SampleBlob = {
  ciphertext: Uint8Array;
  nonce: string;
  keyVersion: typeof KEY_VERSION;
};

export type PasskeyWrap = {
  credentialId: string;
  salt: string;
  wrappedDataKey: string;
};

export type VaultRecord = {
  vaultId: string;
  recoveryWrappedDataKey: string;
  passkeys: PasskeyWrap[];
};

function asBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}

export function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

export function base64ToBytes(value: string): Uint8Array {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
}

export async function hashCapability(secret: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(secret));
  return bytesToBase64(new Uint8Array(digest));
}

export function randomCapability(): string {
  return bytesToBase64(crypto.getRandomValues(new Uint8Array(32)));
}

export function bytesMatch(left: Uint8Array, right: Uint8Array): boolean {
  if (left.byteLength !== right.byteLength) return false;
  for (let index = 0; index < left.byteLength; index += 1) {
    if (left[index] !== right[index]) return false;
  }
  return true;
}

function bytesToBase64Url(bytes: Uint8Array): string {
  return bytesToBase64(bytes).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function base64UrlToBytes(value: string): Uint8Array {
  const padded = value.replaceAll("-", "+").replaceAll("_", "/") + "===".slice((value.length + 3) % 4);
  return base64ToBytes(padded);
}

async function importAesGcm(raw: Uint8Array, usages: KeyUsage[]): Promise<CryptoKey> {
  return crypto.subtle.importKey("raw", asBuffer(raw), { name: "AES-GCM" }, true, usages);
}

async function importWrapKey(raw: Uint8Array): Promise<CryptoKey> {
  if (raw.byteLength !== 32) throw new Error("wrapping key must be 32 bytes");
  return crypto.subtle.importKey("raw", asBuffer(raw), { name: "AES-KW" }, false, ["wrapKey", "unwrapKey"]);
}

export async function generateDataKey(): Promise<CryptoKey> {
  return crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
}

export async function wrapDataKey(dataKey: CryptoKey, wrappingKey: Uint8Array): Promise<string> {
  const kek = await importWrapKey(wrappingKey);
  const wrapped = new Uint8Array(await crypto.subtle.wrapKey("raw", dataKey, kek, "AES-KW"));
  return bytesToBase64(wrapped);
}

export async function unwrapDataKey(wrappedDataKey: string, wrappingKey: Uint8Array): Promise<CryptoKey> {
  const kek = await importWrapKey(wrappingKey);
  return crypto.subtle.unwrapKey(
    "raw",
    asBuffer(base64ToBytes(wrappedDataKey)),
    kek,
    "AES-KW",
    { name: "AES-GCM" },
    true,
    ["encrypt", "decrypt"],
  );
}

export async function encryptSample(plain: Uint8Array, dataKey: CryptoKey): Promise<SampleBlob> {
  const nonce = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = new Uint8Array(
    await crypto.subtle.encrypt({ name: "AES-GCM", iv: asBuffer(nonce) }, dataKey, asBuffer(plain)),
  );
  return { ciphertext, nonce: bytesToBase64(nonce), keyVersion: KEY_VERSION };
}

export async function decryptSample(blob: SampleBlob, dataKey: CryptoKey): Promise<Uint8Array> {
  const plain = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: asBuffer(base64ToBytes(blob.nonce)) },
    dataKey,
    asBuffer(blob.ciphertext),
  );
  return new Uint8Array(plain);
}

export function encodeRecoveryKey(vaultId: string, material: Uint8Array, wrappedDataKey: Uint8Array): string {
  const id = base64UrlToBytes(vaultId);
  if (id.byteLength !== 16 || material.byteLength !== 32 || wrappedDataKey.byteLength < 1 || wrappedDataKey.byteLength > 255) {
    throw new Error("recovery key parts");
  }
  const packed = new Uint8Array(1 + 16 + 32 + 1 + wrappedDataKey.byteLength);
  packed[0] = RECOVERY_VERSION;
  packed.set(id, 1);
  packed.set(material, 17);
  packed[49] = wrappedDataKey.byteLength;
  packed.set(wrappedDataKey, 50);
  return bytesToBase64Url(packed);
}

export function decodeRecoveryKey(value: string): { vaultId: string; material: Uint8Array; wrappedDataKey: Uint8Array } {
  let packed: Uint8Array;
  try {
    packed = base64UrlToBytes(value.trim());
  } catch {
    throw new Error("recovery key");
  }
  if (packed.byteLength < 50 || packed[0] !== RECOVERY_VERSION) throw new Error("recovery key");
  const length = packed[49] ?? 0;
  const wrapped = packed.slice(50, 50 + length);
  if (wrapped.byteLength !== length || packed.byteLength !== 50 + length) throw new Error("recovery key");
  return {
    vaultId: bytesToBase64Url(packed.slice(1, 17)),
    material: packed.slice(17, 49),
    wrappedDataKey: wrapped,
  };
}

export async function createVault(input: {
  credentialId: string;
  salt: Uint8Array;
  prfOutput: Uint8Array;
}): Promise<{ record: VaultRecord; recoveryKey: string; dataKey: CryptoKey }> {
  const dataKey = await generateDataKey();
  const vaultId = bytesToBase64Url(crypto.getRandomValues(new Uint8Array(16)));
  const material = crypto.getRandomValues(new Uint8Array(32));
  const recoveryWrappedDataKey = await wrapDataKey(dataKey, material);
  const record: VaultRecord = {
    vaultId,
    recoveryWrappedDataKey,
    passkeys: [
      {
        credentialId: input.credentialId,
        salt: bytesToBase64(input.salt),
        wrappedDataKey: await wrapDataKey(dataKey, input.prfOutput),
      },
    ],
  };
  return {
    record,
    recoveryKey: encodeRecoveryKey(vaultId, material, base64ToBytes(recoveryWrappedDataKey)),
    dataKey,
  };
}

export async function addPasskey(
  record: VaultRecord,
  dataKey: CryptoKey,
  input: { credentialId: string; salt: Uint8Array; prfOutput: Uint8Array },
): Promise<VaultRecord> {
  return {
    ...record,
    passkeys: [
      ...record.passkeys,
      {
        credentialId: input.credentialId,
        salt: bytesToBase64(input.salt),
        wrappedDataKey: await wrapDataKey(dataKey, input.prfOutput),
      },
    ],
  };
}

export function removePasskey(record: VaultRecord, credentialId: string): VaultRecord {
  return { ...record, passkeys: record.passkeys.filter((item) => item.credentialId !== credentialId) };
}

export async function openWithPasskey(record: VaultRecord, credentialId: string, prfOutput: Uint8Array): Promise<CryptoKey> {
  const wrap = record.passkeys.find((item) => item.credentialId === credentialId);
  if (!wrap) throw new Error("unknown passkey");
  return unwrapDataKey(wrap.wrappedDataKey, prfOutput);
}

export async function importVaultFromRecovery(recoveryKey: string): Promise<{ record: VaultRecord; dataKey: CryptoKey }> {
  const decoded = decodeRecoveryKey(recoveryKey);
  const wrapped = bytesToBase64(decoded.wrappedDataKey);
  const dataKey = await unwrapDataKey(wrapped, decoded.material);
  return {
    dataKey,
    record: { vaultId: decoded.vaultId, recoveryWrappedDataKey: wrapped, passkeys: [] },
  };
}

export async function openWithRecovery(record: VaultRecord, recoveryKey: string): Promise<CryptoKey> {
  const decoded = decodeRecoveryKey(recoveryKey);
  if (decoded.vaultId !== record.vaultId) throw new Error("recovery key");
  return unwrapDataKey(record.recoveryWrappedDataKey, decoded.material);
}

export function recordHidesKeyMaterial(record: VaultRecord, secret: Uint8Array): boolean {
  const encoded = bytesToBase64(secret);
  const dumped = JSON.stringify(record);
  return !dumped.includes(encoded) && !dumped.includes(bytesToBase64Url(secret));
}
