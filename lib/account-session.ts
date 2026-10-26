export type AccountSession = {
  idToken: string;
  localId: string;
  email: string;
};

export const ACCOUNT_SESSION_KEY = "glint-session";
export const ACCOUNT_SESSION_EVENT = "glint-session";
const EMAIL_KEY = "glint-email";

export function readAccountSession(): AccountSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(ACCOUNT_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<AccountSession>;
    if (!parsed.idToken || !parsed.localId || !parsed.email) return null;
    return { idToken: parsed.idToken, localId: parsed.localId, email: parsed.email };
  } catch {
    return null;
  }
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
