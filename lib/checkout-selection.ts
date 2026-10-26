export type CheckoutSelection = {
  backup: boolean;
};

/** Band is always included. The only accepted body is `{ backup: boolean }`. */
export function parseCheckoutSelection(body: unknown): CheckoutSelection | null {
  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    return null;
  }
  const record = body as Record<string, unknown>;
  const keys = Object.keys(record);
  if (keys.length !== 1 || keys[0] !== "backup" || typeof record.backup !== "boolean") {
    return null;
  }
  return { backup: record.backup };
}
