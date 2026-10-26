import { emulatorAuthOrigin, LOCAL_REGION } from "./emulator";

export function deleteAccountUrl(projectId: string, region = LOCAL_REGION): string {
  return `https://${region}-${projectId}.cloudfunctions.net/deleteAccount`;
}

export function claimEntitlementUrl(projectId: string, region = LOCAL_REGION): string {
  return `https://${region}-${projectId}.cloudfunctions.net/claimEntitlement`;
}

const liveAuthBase = "https://identitytoolkit.googleapis.com/v1";

type FetchLike = (url: string, init?: RequestInit) => Promise<Response>;

function authUrl(authBase: string, method: string, apiKey: string): string {
  return `${authBase}/accounts:${method}?key=${encodeURIComponent(apiKey)}`;
}

export async function sendEmailLink(
  fetchImpl: FetchLike,
  apiKey: string,
  email: string,
  continueUrl: string,
  authBase = liveAuthBase,
  projectId?: string,
): Promise<{ oobLink: string | null }> {
  const response = await fetchImpl(authUrl(authBase, "sendOobCode", apiKey), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      requestType: "EMAIL_SIGNIN",
      email,
      continueUrl,
      canHandleCodeInApp: true,
    }),
  });
  if (!response.ok) throw new Error("sign-in email failed");
  const data = (await response.json().catch(() => null)) as { oobLink?: string } | null;
  if (data?.oobLink) return { oobLink: data.oobLink };
  const localAuth =
    authBase.startsWith("/") ||
    authBase.includes("127.0.0.1") ||
    authBase.includes("localhost");
  if (!projectId || !localAuth) {
    return { oobLink: null };
  }
  return {
    oobLink: (
      await latestEmulatorSignInLink(fetchImpl, projectId, email, emulatorAuthOrigin(authBase))
    ),
  };
}

export async function latestEmulatorSignInLink(
  fetchImpl: FetchLike,
  projectId: string,
  email: string,
  authOrigin = "http://127.0.0.1:9099",
): Promise<string | null> {
  const response = await fetchImpl(`${authOrigin}/emulator/v1/projects/${projectId}/oobCodes`);
  if (!response.ok) return null;
  const data = (await response.json()) as { oobCodes?: { email?: string; oobLink?: string }[] };
  const links = (data.oobCodes ?? []).filter((item) => item.email === email && item.oobLink);
  return links.at(-1)?.oobLink ?? null;
}

export async function signInWithEmailLink(
  fetchImpl: FetchLike,
  apiKey: string,
  email: string,
  oobCode: string,
  authBase = liveAuthBase,
): Promise<{ idToken: string; localId: string; email: string }> {
  const response = await fetchImpl(authUrl(authBase, "signInWithEmailLink", apiKey), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, oobCode }),
  });
  if (!response.ok) throw new Error("sign-in failed");
  const data = (await response.json()) as { idToken?: string; localId?: string; email?: string };
  if (!data.idToken || !data.localId) throw new Error("sign-in failed");
  return { idToken: data.idToken, localId: data.localId, email: data.email ?? email };
}

export async function putEncryptedBackup(
  fetchImpl: FetchLike,
  input: {
    storageBase: string;
    firestoreBase: string;
    idToken: string;
    uid: string;
    objectPath: string;
    objectId: string;
    category: string;
    nonce: string;
    salt: string;
    keyVersion: number;
    ciphertext: Uint8Array;
  },
): Promise<void> {
  const upload = await fetchImpl(`${input.storageBase}?name=${encodeURIComponent(input.objectPath)}`, {
    method: "POST",
    headers: {
      authorization: `Firebase ${input.idToken}`,
      "content-type": "application/octet-stream",
    },
    body: new Blob([input.ciphertext.buffer.slice(input.ciphertext.byteOffset, input.ciphertext.byteOffset + input.ciphertext.byteLength) as ArrayBuffer]),
  });
  if (!upload.ok) throw new Error("backup upload failed");

  const record = await fetchImpl(
    `${input.firestoreBase}/users/${input.uid}/objects?documentId=${encodeURIComponent(input.objectId)}`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${input.idToken}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        fields: {
          category: { stringValue: input.category },
          nonce: { stringValue: input.nonce },
          salt: { stringValue: input.salt },
          keyVersion: { integerValue: String(input.keyVersion) },
          size: { integerValue: String(input.ciphertext.byteLength) },
        },
      }),
    },
  );
  if (!record.ok) throw new Error("backup record failed");
}

export async function getEncryptedBackup(
  fetchImpl: FetchLike,
  input: {
    storageBase: string;
    idToken: string;
    objectPath: string;
  },
): Promise<Uint8Array> {
  const response = await fetchImpl(
    `${input.storageBase}/${encodeURIComponent(input.objectPath)}?alt=media`,
    {
      headers: {
        authorization: `Firebase ${input.idToken}`,
      },
    },
  );
  if (!response.ok) throw new Error("backup download failed");
  return new Uint8Array(await response.arrayBuffer());
}

export async function callAuthedFunction(
  fetchImpl: FetchLike,
  url: string,
  idToken: string,
): Promise<void> {
  const response = await fetchImpl(url, {
    method: "POST",
    headers: {
      authorization: `Bearer ${idToken}`,
      "content-type": "application/json",
    },
    body: "{}",
  });
  if (!response.ok) throw new Error("request failed");
}
