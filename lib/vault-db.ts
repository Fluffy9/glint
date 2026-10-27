import type { VaultRecord } from "@/functions/src/domain/crypto";

export type StoredSample = {
  id: string;
  recordedAt: string;
  nonce: string;
  keyVersion: number;
  ciphertext: string;
};

export type LocalVault = {
  record: VaultRecord;
  samples: StoredSample[];
  capability: string | null;
  paidUntil: string | null;
};

const DB_NAME = "glint";
const STORE = "vault";
const KEY = "local";

function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function readLocalVault(): Promise<LocalVault | null> {
  const db = await openDb();
  const stored = await requestToPromise(db.transaction(STORE).objectStore(STORE).get(KEY));
  db.close();
  return (stored as LocalVault | undefined) ?? null;
}

export async function writeLocalVault(vault: LocalVault): Promise<void> {
  const db = await openDb();
  const tx = db.transaction(STORE, "readwrite");
  await requestToPromise(tx.objectStore(STORE).put(vault, KEY));
  db.close();
}

export async function clearLocalVault(): Promise<void> {
  const db = await openDb();
  const tx = db.transaction(STORE, "readwrite");
  await requestToPromise(tx.objectStore(STORE).delete(KEY));
  db.close();
}
