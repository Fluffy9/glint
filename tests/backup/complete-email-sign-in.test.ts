import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { readAccountSession } from "../../lib/account-session";
import { completeEmailSignIn, resetEmailSignInAttempts } from "../../lib/complete-email-sign-in";

beforeEach(() => {
  const store = new Map<string, string>();
  const localStorage = {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
    clear: () => {
      store.clear();
    },
  };
  vi.stubGlobal("localStorage", localStorage);
  vi.stubGlobal("window", { localStorage, dispatchEvent: () => true });
});

afterEach(() => {
  resetEmailSignInAttempts();
  vi.unstubAllGlobals();
});

describe("completeEmailSignIn", () => {
  it("shares one in-flight attempt for the same oob code", async () => {
    let signIns = 0;
    const fetchImpl = vi.fn(async (url: string) => {
      if (String(url).includes("signInWithEmailLink")) {
        signIns += 1;
        await new Promise((resolve) => setTimeout(resolve, 20));
        return Response.json({ idToken: "tok", localId: "uid_1", email: "a@b.co" });
      }
      return new Response("{}", { status: 200 });
    });

    const input = {
      fetch: fetchImpl,
      apiKey: "key",
      email: "a@b.co",
      oobCode: "code-1",
      authBase: "/__glint/auth/identitytoolkit.googleapis.com/v1",
      claimUrl: "/__glint/functions/glint-local/us-central1/claimEntitlement",
    };

    const [first, second] = await Promise.all([completeEmailSignIn(input), completeEmailSignIn(input)]);
    expect(first).toEqual(second);
    expect(signIns).toBe(1);
    expect(readAccountSession()).toEqual(first);
  });

  it("lets a new code retry after a failure", async () => {
    const fetchImpl = vi.fn(async (url: string) => {
      if (String(url).includes("signInWithEmailLink")) {
        return new Response("{}", { status: 400 });
      }
      return new Response("{}", { status: 200 });
    });

    await expect(
      completeEmailSignIn({
        fetch: fetchImpl,
        apiKey: "key",
        email: "a@b.co",
        oobCode: "bad",
        authBase: "/__glint/auth/identitytoolkit.googleapis.com/v1",
        claimUrl: "/claim",
      }),
    ).rejects.toThrow();

    fetchImpl.mockImplementation(async (url: string) => {
      if (String(url).includes("signInWithEmailLink")) {
        return Response.json({ idToken: "tok", localId: "uid_2", email: "a@b.co" });
      }
      return new Response("{}", { status: 200 });
    });

    await expect(
      completeEmailSignIn({
        fetch: fetchImpl,
        apiKey: "key",
        email: "a@b.co",
        oobCode: "good",
        authBase: "/__glint/auth/identitytoolkit.googleapis.com/v1",
        claimUrl: "/claim",
      }),
    ).resolves.toMatchObject({ localId: "uid_2" });
  });
});
