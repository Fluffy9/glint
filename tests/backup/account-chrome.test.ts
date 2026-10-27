import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  accountChrome,
  noteEmailSignInSettled,
  resetAccountChrome,
  serverAccountChrome,
  writeAccountSession,
  writeStoredEmail,
} from "../../lib/account-session";

let search = "";

beforeEach(() => {
  resetAccountChrome();
  search = "";
  const store = new Map<string, string>();
  const localStorage = {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
  };
  vi.stubGlobal("window", {
    localStorage,
    get location() {
      return { search };
    },
    dispatchEvent: () => true,
  });
});

afterEach(() => {
  resetAccountChrome();
  vi.unstubAllGlobals();
});

describe("accountChrome", () => {
  it("stays checking while an email link can still sign the stored address in", () => {
    writeStoredEmail("buyer@example.com");
    search = "?mode=signIn&oobCode=oob_1";

    expect(accountChrome("/account")).toBe("checking");
    expect(accountChrome("/login")).toBe("checking");
    expect(accountChrome("/pricing")).toBe("out");
    expect(serverAccountChrome()).toBe("checking");
  });

  it("is signed in whenever a session exists", () => {
    writeStoredEmail("buyer@example.com");
    writeAccountSession({ idToken: "tok", localId: "uid_1", email: "buyer@example.com" });
    search = "?mode=signIn&oobCode=oob_1";

    expect(accountChrome("/account")).toBe("in");
    expect(accountChrome("/login")).toBe("in");
  });

  it("shows sign-in only after that email link settles without a session", () => {
    writeStoredEmail("buyer@example.com");
    search = "?mode=signIn&oobCode=oob_1";
    noteEmailSignInSettled("oob_1");

    expect(accountChrome("/account")).toBe("out");
  });

  it("shows sign-in when the page is not completing an email link", () => {
    expect(accountChrome("/login")).toBe("out");
    expect(accountChrome("/account")).toBe("out");
  });
});
