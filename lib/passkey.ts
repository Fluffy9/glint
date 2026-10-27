import { base64ToBytes, bytesToBase64 } from "@/functions/src/domain/crypto";

export type PasskeyMaterial = {
  credentialId: string;
  salt: Uint8Array;
  prfOutput: Uint8Array;
};

function asBytes(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}

function bytesToBase64Url(bytes: Uint8Array): string {
  return bytesToBase64(bytes).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function base64UrlToBytes(value: string): Uint8Array {
  const padded = value.replaceAll("-", "+").replaceAll("_", "/") + "===".slice((value.length + 3) % 4);
  return base64ToBytes(padded);
}

type PrfResults = { prf?: { results?: { first?: ArrayBuffer } } };

function prfOutput(credential: PublicKeyCredential): Uint8Array {
  const results = credential.getClientExtensionResults() as AuthenticationExtensionsClientOutputs & PrfResults;
  const first = results.prf?.results?.first;
  if (!first) throw new Error("This passkey cannot wrap the vault.");
  return new Uint8Array(first);
}

export async function createPasskey(): Promise<PasskeyMaterial> {
  if (typeof navigator === "undefined" || !navigator.credentials?.create) {
    throw new Error("This browser cannot create a passkey.");
  }
  const salt = crypto.getRandomValues(new Uint8Array(32));
  const created = (await navigator.credentials.create({
    publicKey: {
      challenge: crypto.getRandomValues(new Uint8Array(32)),
      rp: { name: "Glint" },
      user: {
        id: crypto.getRandomValues(new Uint8Array(16)),
        name: "glint",
        displayName: "Glint",
      },
      pubKeyCredParams: [
        { type: "public-key", alg: -7 },
        { type: "public-key", alg: -257 },
      ],
      authenticatorSelection: { residentKey: "preferred", userVerification: "required" },
      extensions: { prf: { eval: { first: salt } } } as AuthenticationExtensionsClientInputs,
    },
  })) as PublicKeyCredential | null;
  if (!created) throw new Error("Passkey setup was cancelled.");
  return { credentialId: bytesToBase64Url(new Uint8Array(created.rawId)), salt, prfOutput: prfOutput(created) };
}

export async function unlockPasskey(
  passkeys: { credentialId: string; salt: string }[],
): Promise<{ credentialId: string; prfOutput: Uint8Array }> {
  if (typeof navigator === "undefined" || !navigator.credentials?.get || passkeys.length === 0) {
    throw new Error("This browser cannot use a passkey.");
  }
  const evalByCredential: Record<string, { first: BufferSource }> = {};
  const allowCredentials = passkeys.map((item) => {
    evalByCredential[item.credentialId] = { first: asBytes(base64ToBytes(item.salt)) };
    return { type: "public-key" as const, id: asBytes(base64UrlToBytes(item.credentialId)) };
  });
  const credential = (await navigator.credentials.get({
    publicKey: {
      challenge: crypto.getRandomValues(new Uint8Array(32)),
      allowCredentials,
      userVerification: "required",
      extensions: { prf: { evalByCredential } } as AuthenticationExtensionsClientInputs,
    },
  })) as PublicKeyCredential | null;
  if (!credential) throw new Error("Unlock was cancelled.");
  const credentialId = bytesToBase64Url(new Uint8Array(credential.rawId));
  return { credentialId, prfOutput: prfOutput(credential) };
}
