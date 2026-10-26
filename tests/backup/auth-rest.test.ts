import { describe, expect, it, vi } from "vitest";
import {
  callAuthedFunction,
  claimEntitlementUrl,
  deleteAccountUrl,
  latestEmulatorSignInLink,
  getEncryptedBackup,
  putEncryptedBackup,
  sendEmailLink,
  signInWithEmailLink,
} from "../../functions/src/domain/auth-rest";
import { firebaseTargets, functionUrl } from "../../functions/src/domain/emulator";
import { canDeleteAccount, canSendSignIn } from "../../functions/src/domain/state";

describe("account gates", () => {
  it("requires a configured project, a real email, and DELETE", () => {
    expect(canSendSignIn(false, "a@b.co")).toBe(false);
    expect(canSendSignIn(true, "not-an-email")).toBe(false);
    expect(canSendSignIn(true, "a@b.co")).toBe(true);
    expect(canDeleteAccount(true, false, "DELETE")).toBe(false);
    expect(canDeleteAccount(true, true, "delete")).toBe(false);
    expect(canDeleteAccount(true, true, "DELETE")).toBe(true);
  });
});

describe("Firebase Auth REST", () => {
  it("sends an email link and signs in with the returned code", async () => {
    const fetchImpl = vi.fn(async (url: string, init?: RequestInit) => {
      const body = JSON.parse(String(init?.body));
      if (String(url).includes("sendOobCode")) {
        expect(body).toMatchObject({
          requestType: "EMAIL_SIGNIN",
          email: "a@b.co",
          canHandleCodeInApp: true,
        });
        return Response.json({ oobLink: "http://127.0.0.1:9099/emulator/action?oobCode=code" });
      }
      expect(body).toEqual({ email: "a@b.co", oobCode: "code" });
      return Response.json({ idToken: "tok", localId: "uid_1", email: "a@b.co" });
    });

    const sent = await sendEmailLink(fetchImpl, "api-key", "a@b.co", "https://glint.example/account");
    expect(sent.oobLink).toContain("oobCode=code");
    expect(fetchImpl.mock.calls[0]?.[0]).toContain("https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode");
    const session = await signInWithEmailLink(fetchImpl, "api-key", "a@b.co", "code");
    expect(session).toEqual({ idToken: "tok", localId: "uid_1", email: "a@b.co" });
  });

  it("calls claim and delete with the signed-in token", async () => {
    const fetchImpl = vi.fn(async (_url: string, init?: RequestInit) => {
      expect(init?.headers).toMatchObject({ authorization: "Bearer tok" });
      return new Response("{}", { status: 200 });
    });
    expect(deleteAccountUrl("glint-local")).toBe(
      "https://us-central1-glint-local.cloudfunctions.net/deleteAccount",
    );
    expect(claimEntitlementUrl("glint-local")).toContain("claimEntitlement");
    await callAuthedFunction(fetchImpl, deleteAccountUrl("glint-local"), "tok");
    expect(fetchImpl).toHaveBeenCalledOnce();
  });

  it("points development with no project keys at the same-origin emulator proxy", () => {
    const targets = firebaseTargets({ NODE_ENV: "development" });
    expect(targets?.emulators).toBe(true);
    expect(targets?.projectId).toBe("glint-local");
    expect(targets?.storageBase).toBe("/__glint/storage/v0/b/glint-local.appspot.com/o");
    expect(functionUrl(targets!, "claimEntitlement")).toBe(
      "/__glint/functions/glint-local/us-central1/claimEntitlement",
    );
    expect(firebaseTargets({ NODE_ENV: "production" })).toBeNull();
    expect(
      firebaseTargets({
        NODE_ENV: "development",
        NEXT_PUBLIC_FIREBASE_API_KEY: "live-key",
        NEXT_PUBLIC_FIREBASE_PROJECT_ID: "glint-prod",
      })?.emulators,
    ).toBe(false);
  });

  it("reads the newest emulator sign-in link for that email", async () => {
    const fetchImpl = vi.fn(async (url: string) => {
      expect(url).toBe("/__glint/auth/emulator/v1/projects/glint-local/oobCodes");
      return Response.json({
        oobCodes: [
          { email: "a@b.co", oobLink: "http://127.0.0.1:9099/old" },
          { email: "other@b.co", oobLink: "http://127.0.0.1:9099/other" },
          { email: "a@b.co", oobLink: "http://127.0.0.1:9099/new" },
        ],
      });
    });
    await expect(
      latestEmulatorSignInLink(fetchImpl, "glint-local", "a@b.co", "/__glint/auth"),
    ).resolves.toBe("http://127.0.0.1:9099/new");
  });

  it("uploads ciphertext then writes the object record", async () => {
    const fetchImpl = vi.fn(async (url: string, init?: RequestInit) => {
      if (String(url).includes("/o?")) {
        expect(init?.headers).toMatchObject({ authorization: "Firebase tok" });
        return new Response("{}", { status: 200 });
      }
      expect(String(url)).toContain("/users/uid_1/objects?documentId=obj_1");
      expect(init?.headers).toMatchObject({ authorization: "Bearer tok" });
      return new Response("{}", { status: 200 });
    });
    await putEncryptedBackup(fetchImpl, {
      storageBase: "http://127.0.0.1:9199/v0/b/glint-local.appspot.com/o",
      firestoreBase: "http://127.0.0.1:8180/v1/projects/glint-local/databases/(default)/documents",
      idToken: "tok",
      uid: "uid_1",
      objectPath: "backups/uid_1/heart/obj_1",
      objectId: "obj_1",
      category: "heart",
      nonce: "n",
      salt: "s",
      keyVersion: 1,
      ciphertext: new Uint8Array([1, 2, 3]),
    });
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it("downloads ciphertext from storage", async () => {
    const fetchImpl = vi.fn(async (url: string, init?: RequestInit) => {
      expect(String(url)).toContain("/o/backups%2Fuid_1%2Fheart%2Fobj_1?alt=media");
      expect(init?.headers).toMatchObject({ authorization: "Firebase tok" });
      return new Response(new Uint8Array([9, 8, 7]));
    });
    await expect(
      getEncryptedBackup(fetchImpl, {
        storageBase: "/__glint/storage/v0/b/glint-local.appspot.com/o",
        idToken: "tok",
        objectPath: "backups/uid_1/heart/obj_1",
      }),
    ).resolves.toEqual(new Uint8Array([9, 8, 7]));
  });
});
