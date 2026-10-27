export const YEAR_MS = 365 * 24 * 60 * 60 * 1000;
export const DAY_MS = 24 * 60 * 60 * 1000;
export const GRACE_DAYS = 30;
export const RENEWAL_LEAD_DAYS = 30;
export const KEY_VERSION = 1;

export type Order = {
  sessionId: string;
  email: string | null;
  customerId: string | null;
  band: boolean;
  backup: boolean;
  amountTotal: number | null;
  status: string;
};

export type Entitlement = {
  email: string;
  paidUntil: Date;
  stripeCustomerId: string | null;
  vaultId: string | null;
  capabilityHash: string | null;
};

export type ObjectDoc = {
  id: string;
  vaultId: string;
  category: string;
  nonce: string;
  keyVersion: number;
  size: number;
};

export type BackupState = {
  orders: Order[];
  entitlements: Entitlement[];
  objects: ObjectDoc[];
  blobs: Record<string, Uint8Array>;
};

export function emptyBackupState(): BackupState {
  return { orders: [], entitlements: [], objects: [], blobs: {} };
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function extendPaidUntil(current: Date | null, paidAt: Date): Date {
  const base = current && current.getTime() > paidAt.getTime() ? current : paidAt;
  return new Date(base.getTime() + YEAR_MS);
}

export type PaidSession = {
  id: string;
  email: string | null;
  customerId: string | null;
  amountTotal: number | null;
  paymentStatus: string;
  band: boolean;
  backup: boolean;
  paidAt: Date;
};

function isPaid(status: string): boolean {
  return status === "paid" || status === "no_payment_required";
}

export function applyPaidSession(state: BackupState, session: PaidSession): BackupState {
  if (!isPaid(session.paymentStatus)) return state;
  if (state.orders.some((order) => order.sessionId === session.id)) return state;

  const orders: Order[] = [
    ...state.orders,
    {
      sessionId: session.id,
      email: session.email,
      customerId: session.customerId,
      band: session.band,
      backup: session.backup,
      amountTotal: session.amountTotal,
      status: session.paymentStatus,
    },
  ];

  if (!session.backup || !session.email) {
    return { ...state, orders };
  }

  const email = normalizeEmail(session.email);
  const existing = state.entitlements.find((item) => normalizeEmail(item.email) === email) ?? null;
  const next: Entitlement = {
    email,
    paidUntil: extendPaidUntil(existing?.paidUntil ?? null, session.paidAt),
    stripeCustomerId: session.customerId ?? existing?.stripeCustomerId ?? null,
    vaultId: existing?.vaultId ?? null,
    capabilityHash: existing?.capabilityHash ?? null,
  };

  return {
    ...state,
    orders,
    entitlements: [...state.entitlements.filter((item) => normalizeEmail(item.email) !== email), next],
  };
}

export type RedeemResult =
  | { ok: true; state: BackupState; paidUntil: Date }
  | { ok: false; error: "unpaid" | "taken" | "expired" };

export function redeemPaidCheckout(
  state: BackupState,
  input: { sessionId: string; vaultId: string; capabilityHash: string; now: Date },
): RedeemResult {
  const order = state.orders.find((item) => item.sessionId === input.sessionId && item.backup && item.email);
  if (!order?.email) return { ok: false, error: "unpaid" };
  const email = normalizeEmail(order.email);
  const entitlement = state.entitlements.find((item) => normalizeEmail(item.email) === email) ?? null;
  if (!entitlement || entitlement.paidUntil.getTime() <= input.now.getTime()) return { ok: false, error: "expired" };
  if (entitlement.vaultId && entitlement.vaultId !== input.vaultId) return { ok: false, error: "taken" };
  const next: Entitlement = { ...entitlement, vaultId: input.vaultId, capabilityHash: input.capabilityHash };
  return {
    ok: true,
    paidUntil: next.paidUntil,
    state: {
      ...state,
      entitlements: state.entitlements.map((item) => (normalizeEmail(item.email) === email ? next : item)),
    },
  };
}

export function entitlementForVault(state: BackupState, vaultId: string): Entitlement | null {
  return state.entitlements.find((item) => item.vaultId === vaultId) ?? null;
}

export function sameSecret(left: string, right: string): boolean {
  if (left.length !== right.length) return false;
  let mismatch = 0;
  for (let index = 0; index < left.length; index += 1) mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index);
  return mismatch === 0;
}

export function canUploadBackup(input: {
  entitlement: Entitlement | null;
  vaultId: string;
  capabilityHash: string;
  now: Date;
}): boolean {
  if (!input.entitlement?.capabilityHash || input.entitlement.vaultId !== input.vaultId) return false;
  if (input.entitlement.paidUntil.getTime() <= input.now.getTime()) return false;
  return sameSecret(input.entitlement.capabilityHash, input.capabilityHash);
}

export function canDeleteShelf(input: {
  entitlement: Entitlement | null;
  vaultId: string;
  capabilityHash: string;
}): boolean {
  if (!input.entitlement?.capabilityHash || input.entitlement.vaultId !== input.vaultId) return false;
  return sameSecret(input.entitlement.capabilityHash, input.capabilityHash);
}

export function canDownloadBackup(input: { entitlement: Entitlement | null; vaultId: string; now: Date }): boolean {
  if (!input.entitlement || input.entitlement.vaultId !== input.vaultId) return false;
  return input.entitlement.paidUntil.getTime() > input.now.getTime();
}

export function backupObjectPath(vaultId: string, category: string, objectId: string): string {
  return `backups/${vaultId}/${category}/${objectId}`;
}

export function addCiphertext(
  state: BackupState,
  object: ObjectDoc,
  bytes: Uint8Array,
): BackupState | null {
  const path = backupObjectPath(object.vaultId, object.category, object.id);
  if (state.blobs[path] || state.objects.some((item) => item.vaultId === object.vaultId && item.id === object.id)) {
    return null;
  }
  return {
    ...state,
    objects: [...state.objects, object],
    blobs: { ...state.blobs, [path]: bytes },
  };
}

export function deleteShelf(state: BackupState, vaultId: string): BackupState {
  const prefix = `backups/${vaultId}/`;
  const blobs: Record<string, Uint8Array> = {};
  for (const [key, value] of Object.entries(state.blobs)) {
    if (!key.startsWith(prefix)) blobs[key] = value;
  }
  return {
    ...state,
    blobs,
    objects: state.objects.filter((item) => item.vaultId !== vaultId),
  };
}

export function renewalDue(paidUntil: Date, now: Date): boolean {
  const start = paidUntil.getTime() - RENEWAL_LEAD_DAYS * DAY_MS;
  return now.getTime() >= start && now.getTime() < paidUntil.getTime();
}

export function expiryDue(paidUntil: Date, now: Date): boolean {
  return now.getTime() >= paidUntil.getTime() + GRACE_DAYS * DAY_MS;
}

export function renewalTargets(state: BackupState, now: Date): Entitlement[] {
  return state.entitlements.filter((item) => renewalDue(item.paidUntil, now));
}

export function expiryTargets(state: BackupState, now: Date): Entitlement[] {
  return state.entitlements.filter((item) => expiryDue(item.paidUntil, now));
}
