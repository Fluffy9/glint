export type AccountSession = {
  idToken: string;
  localId: string;
  email: string;
};

export const ACCOUNT_SESSION_KEY = "glint-session";
export const ACCOUNT_SESSION_EVENT = "glint-session";
const ACCOUNT_CHROME_EVENT = "glint-chrome";
const EMAIL_KEY = "glint-email";

function parseAccountSession(raw: string | null): AccountSession | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<AccountSession>;
    if (!parsed.idToken || !parsed.localId || !parsed.email) return null;
    return { idToken: parsed.idToken, localId: parsed.localId, email: parsed.email };
  } catch {
    return null;
  }
}

export function readAccountSession(): AccountSession | null {
  if (typeof window === "undefined") return null;
  return parseAccountSession(window.localStorage.getItem(ACCOUNT_SESSION_KEY));
}

let sessionSnapshot = { raw: null as string | null, session: null as AccountSession | null };

/** Stable session object for useSyncExternalStore. Same storage value returns the same reference. */
export function accountSessionSnapshot(): AccountSession | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(ACCOUNT_SESSION_KEY);
  if (sessionSnapshot.raw === raw) return sessionSnapshot.session;
  sessionSnapshot = { raw, session: parseAccountSession(raw) };
  return sessionSnapshot.session;
}

export function serverAccountSession(): AccountSession | null {
  return null;
}

export function writeAccountSession(session: AccountSession): void {
  window.localStorage.setItem(ACCOUNT_SESSION_KEY, JSON.stringify(session));
  window.localStorage.setItem(EMAIL_KEY, session.email);
  window.dispatchEvent(new Event(ACCOUNT_SESSION_EVENT));
}

export function clearAccountSession(): void {
  window.localStorage.removeItem(ACCOUNT_SESSION_KEY);
  window.dispatchEvent(new Event(ACCOUNT_SESSION_EVENT));
}

export function readStoredEmail(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(EMAIL_KEY) ?? "";
}

export function writeStoredEmail(email: string): void {
  window.localStorage.setItem(EMAIL_KEY, email);
}

export type AccountChrome = "checking" | "in" | "out";

let settledOobCode: string | null = null;

function accountPath(pathname: string): boolean {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  return path === "/login" || path === "/account";
}

function unresolvedEmailLink(pathname: string): boolean {
  if (!accountPath(pathname) || typeof window === "undefined") return false;
  const oobCode = new URLSearchParams(window.location.search).get("oobCode");
  if (!oobCode || settledOobCode === oobCode) return false;
  return readStoredEmail().trim().length > 0;
}

/** Header and titles stay unsigned until this email-link attempt finishes. */
export function noteEmailSignInSettled(oobCode: string): void {
  if (!oobCode || settledOobCode === oobCode) return;
  settledOobCode = oobCode;
  if (typeof window !== "undefined") window.dispatchEvent(new Event(ACCOUNT_CHROME_EVENT));
}

export function resetAccountChrome(): void {
  settledOobCode = null;
  sessionSnapshot = { raw: null, session: null };
}

export function accountChrome(pathname: string): AccountChrome {
  if (typeof window === "undefined") return "checking";
  if (readAccountSession()) return "in";
  if (unresolvedEmailLink(pathname)) return "checking";
  return "out";
}

export function serverAccountChrome(): AccountChrome {
  return "checking";
}

export function subscribeAccountChrome(onChange: () => void): () => void {
  window.addEventListener(ACCOUNT_SESSION_EVENT, onChange);
  window.addEventListener(ACCOUNT_CHROME_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(ACCOUNT_SESSION_EVENT, onChange);
    window.removeEventListener(ACCOUNT_CHROME_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}
