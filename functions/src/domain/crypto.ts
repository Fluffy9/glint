import { KEY_VERSION } from "./state";

const ITERATIONS = 100_000;

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function base64ToBytes(value: string): Uint8Array {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
}

function asBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}

async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const material = await crypto.subtle.importKey(
    "raw",
    asBuffer(new TextEncoder().encode(passphrase)),
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: asBuffer(salt), iterations: ITERATIONS, hash: "SHA-256" },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

export type CipherBlob = {
  ciphertext: Uint8Array;
  nonce: string;
  salt: string;
  keyVersion: typeof KEY_VERSION;
};

export async function encryptWithPassphrase(plain: Uint8Array, passphrase: string): Promise<CipherBlob> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const nonce = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(passphrase, salt);
  const ciphertext = new Uint8Array(
    await crypto.subtle.encrypt({ name: "AES-GCM", iv: asBuffer(nonce) }, key, asBuffer(plain)),
  );
  return {
    ciphertext,
    nonce: bytesToBase64(nonce),
    salt: bytesToBase64(salt),
    keyVersion: KEY_VERSION,
  };
}

export async function decryptWithPassphrase(blob: CipherBlob, passphrase: string): Promise<Uint8Array> {
  const key = await deriveKey(passphrase, base64ToBytes(blob.salt));
  const plain = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: asBuffer(base64ToBytes(blob.nonce)) },
    key,
    asBuffer(blob.ciphertext),
  );
  return new Uint8Array(plain);
}
