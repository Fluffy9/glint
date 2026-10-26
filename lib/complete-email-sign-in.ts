import {
  writeAccountSession,
  type AccountSession,
} from "@/lib/account-session";
import { callAuthedFunction, signInWithEmailLink } from "../functions/src/domain/auth-rest";

type FetchLike = (url: string, init?: RequestInit) => Promise<Response>;

const inFlight = new Map<string, Promise<AccountSession>>();

/** One network round-trip per oobCode, even if React Strict Mode remounts. */
export function completeEmailSignIn(input: {
  fetch: FetchLike;
  apiKey: string;
  email: string;
  oobCode: string;
  authBase: string;
  claimUrl: string;
}): Promise<AccountSession> {
  const existing = inFlight.get(input.oobCode);
  if (existing) return existing;

  const promise = (async () => {
    const next = await signInWithEmailLink(
      input.fetch,
      input.apiKey,
      input.email,
      input.oobCode,
      input.authBase,
    );
    await callAuthedFunction(input.fetch, input.claimUrl, next.idToken);
    writeAccountSession(next);
    return next;
  })();

  inFlight.set(input.oobCode, promise);
  return promise.catch((error) => {
    inFlight.delete(input.oobCode);
    throw error;
  });
}

/** Test helper — clears the in-flight map between cases. */
export function resetEmailSignInAttempts(): void {
  inFlight.clear();
}
