export const YEAR_MS = 365 * 24 * 60 * 60 * 1000;
export const DAY_MS = 24 * 60 * 60 * 1000;
export const GRACE_DAYS = 30;
export const RENEWAL_LEAD_DAYS = 30;
export const KEY_VERSION = 1;
export const DELETE_CONFIRM = "DELETE";
export const DELETE_STEPS = ["storage", "objects", "entitlement", "auth"] as const;

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
  uid: string | null;
};

export type ObjectDoc = {
  id: string;
  uid: string;
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
  users: string[];
};

export function emptyBackupState(): BackupState {
  return { orders: [], entitlements: [], objects: [], blobs: {}, users: [] };
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
    uid: existing?.uid ?? null,
  };

  return {
    ...state,
    orders,
    entitlements: [
      ...state.entitlements.filter((item) => normalizeEmail(item.email) !== email),
      next,
    ],
  };
}

export function claimEntitlement(state: BackupState, uid: string, email: string): BackupState {
  const key = normalizeEmail(email);
  return {
    ...state,
    users: state.users.includes(uid) ? state.users : [...state.users, uid],
    entitlements: state.entitlements.map((item) =>
      normalizeEmail(item.email) === key ? { ...item, uid, email: key } : item,
    ),
  };
}

export function entitlementForUid(state: BackupState, uid: string): Entitlement | null {
  return state.entitlements.find((item) => item.uid === uid) ?? null;
}

export function canAccessBackup(input: {
  authUid: string | null;
  ownerUid: string;
  paidUntil: Date | null;
  now: Date;
}): boolean {
  if (!input.authUid || input.authUid !== input.ownerUid || !input.paidUntil) return false;
  return input.paidUntil.getTime() > input.now.getTime();
}

export function renewalDue(paidUntil: Date, now: Date): boolean {
  const start = paidUntil.getTime() - RENEWAL_LEAD_DAYS * DAY_MS;
  return now.getTime() >= start && now.getTime() < paidUntil.getTime();
}

export function expiryDue(paidUntil: Date, now: Date): boolean {
  return now.getTime() >= paidUntil.getTime() + GRACE_DAYS * DAY_MS;
}

export function renewalTargets(state: BackupState, now: Date): Entitlement[] {
  return state.entitlements.filter((item) => item.uid && renewalDue(item.paidUntil, now));
}

export function expiryTargets(state: BackupState, now: Date): Entitlement[] {
  return state.entitlements.filter((item) => expiryDue(item.paidUntil, now));
}

export function expireEntitlement(state: BackupState, uid: string): BackupState {
  const prefix = `backups/${uid}/`;
  const blobs: Record<string, Uint8Array> = {};
  for (const [key, value] of Object.entries(state.blobs)) {
    if (!key.startsWith(prefix)) blobs[key] = value;
  }
  return {
    ...state,
    blobs,
    objects: state.objects.filter((item) => item.uid !== uid),
    entitlements: state.entitlements.filter((item) => item.uid !== uid),
  };
}

export function deleteAccount(state: BackupState, uid: string): BackupState {
  const removed = state.entitlements.find((item) => item.uid === uid) ?? null;
  const expired = expireEntitlement(state, uid);
  return {
    ...expired,
    entitlements: expired.entitlements.filter(
      (item) => !(removed && !item.uid && normalizeEmail(item.email) === normalizeEmail(removed.email)),
    ),
    users: state.users.filter((id) => id !== uid),
  };
}

export async function runDeleteAccount(
  uid: string,
  steps: {
    storage: (uid: string) => Promise<void>;
    objects: (uid: string) => Promise<void>;
    entitlement: (uid: string) => Promise<void>;
    auth: (uid: string) => Promise<void>;
  },
): Promise<void> {
  await steps.storage(uid);
  await steps.objects(uid);
  await steps.entitlement(uid);
  await steps.auth(uid);
}

export function canSendSignIn(configured: boolean, email: string): boolean {
  return configured && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function canDeleteAccount(configured: boolean, signedIn: boolean, phrase: string): boolean {
  return configured && signedIn && phrase === DELETE_CONFIRM;
}

export function backupObjectPath(uid: string, category: string, objectId: string): string {
  return `backups/${uid}/${category}/${objectId}`;
}
