import { normalizeEmail } from "./state";

export function waitlistEmail(raw: string): string | null {
  const email = normalizeEmail(raw);
  if (email.length < 5 || email.length > 254) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  return email;
}
