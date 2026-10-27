import { LOCAL_REGION } from "./emulator";

export function backupFunctionUrl(projectId: string, name: string, region = LOCAL_REGION): string {
  return `https://${region}-${projectId}.cloudfunctions.net/${name}`;
}

type FetchLike = (url: string, init?: RequestInit) => Promise<Response>;

export type RemoteObject = {
  objectId: string;
  category: string;
  nonce: string;
  keyVersion: number;
  ciphertextBase64: string;
};

async function postJson<T>(fetchImpl: FetchLike, url: string, body: unknown): Promise<T> {
  const response = await fetchImpl(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error("backup request failed");
  return (await response.json()) as T;
}

export function redeemBackup(
  fetchImpl: FetchLike,
  url: string,
  body: { sessionId: string; vaultId: string; capabilityHash: string },
): Promise<{ paidUntil: string }> {
  return postJson(fetchImpl, url, body);
}

export function uploadBackup(
  fetchImpl: FetchLike,
  url: string,
  body: {
    vaultId: string;
    capability: string;
    objectId: string;
    category: string;
    nonce: string;
    keyVersion: number;
    ciphertextBase64: string;
  },
): Promise<{ stored: true }> {
  return postJson(fetchImpl, url, body);
}

export function downloadBackup(
  fetchImpl: FetchLike,
  url: string,
  vaultId: string,
): Promise<{ objects: RemoteObject[] }> {
  return postJson(fetchImpl, url, { vaultId });
}

export function deleteShelf(
  fetchImpl: FetchLike,
  url: string,
  body: { vaultId: string; capability: string },
): Promise<{ deleted: true }> {
  return postJson(fetchImpl, url, body);
}
