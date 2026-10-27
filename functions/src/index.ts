import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { onRequest } from "firebase-functions/v2/https";
import { onSchedule } from "firebase-functions/v2/scheduler";
import {
  claimEntitlement as claimEntitlementState,
  emptyBackupState,
  expireEntitlement,
  expiryTargets,
  normalizeEmail,
  renewalTargets,
  type BackupState,
  type Entitlement,
  type Order,
} from "./domain/state";
import { LOCAL_PROJECT_ID, LOCAL_STRIPE_KEY, LOCAL_WEBHOOK_SECRET } from "./domain/emulator";
import { postStripeWebhook } from "./domain/webhook";

const emulator = process.env.FUNCTIONS_EMULATOR === "true";

initializeApp({
  projectId: process.env.GCLOUD_PROJECT || LOCAL_PROJECT_ID,
  storageBucket: `${process.env.GCLOUD_PROJECT || LOCAL_PROJECT_ID}.appspot.com`,
});

const region = "us-central1";
const httpOptions = { region, cors: true } as const;

function bearer(header: string | undefined): string | null {
  if (!header?.startsWith("Bearer ")) return null;
  const token = header.slice("Bearer ".length).trim();
  return token || null;
}

function entitlementFromDoc(id: string, data: Record<string, unknown>, uid: string | null): Entitlement {
  const rawUntil = data.paidUntil;
  const paidUntil = rawUntil instanceof Timestamp ? rawUntil.toDate() : new Date(String(rawUntil));
  return {
    email: typeof data.email === "string" ? data.email : id,
    paidUntil,
    stripeCustomerId: typeof data.stripeCustomerId === "string" ? data.stripeCustomerId : null,
    uid,
  };
}

async function loadCommerce(): Promise<BackupState> {
  const db = getFirestore();
  const [ordersSnap, pendingSnap, entitledSnap] = await Promise.all([
    db.collection("orders").get(),
    db.collection("pendingEntitlements").get(),
    db.collection("entitlements").get(),
  ]);
  const orders: Order[] = ordersSnap.docs.map((doc) => {
    const data = doc.data();
    return {
      sessionId: doc.id,
      email: typeof data.email === "string" ? data.email : null,
      customerId: typeof data.customerId === "string" ? data.customerId : null,
      band: data.band !== false,
      backup: data.backup === true,
      amountTotal: typeof data.amountTotal === "number" ? data.amountTotal : null,
      status: typeof data.status === "string" ? data.status : "paid",
    };
  });
  const entitlements = [
    ...pendingSnap.docs.map((doc) => entitlementFromDoc(doc.id, doc.data() as Record<string, unknown>, null)),
    ...entitledSnap.docs.map((doc) => entitlementFromDoc(doc.id, doc.data() as Record<string, unknown>, doc.id)),
  ];
  return { ...emptyBackupState(), orders, entitlements };
}

async function saveCommerce(state: BackupState): Promise<void> {
  const db = getFirestore();
  const batch = db.batch();
  for (const order of state.orders) {
    batch.set(db.collection("orders").doc(order.sessionId), order);
  }
  for (const item of state.entitlements) {
    const payload = {
      email: item.email,
      paidUntil: Timestamp.fromDate(item.paidUntil),
      stripeCustomerId: item.stripeCustomerId,
    };
    if (item.uid) {
      batch.set(db.collection("entitlements").doc(item.uid), payload);
      batch.delete(db.collection("pendingEntitlements").doc(item.email));
    } else {
      batch.set(db.collection("pendingEntitlements").doc(item.email), payload);
    }
  }
  await batch.commit();
}

async function wipeHealth(uid: string): Promise<void> {
  await getStorage().bucket().deleteFiles({ prefix: `backups/${uid}/` });
  const db = getFirestore();
  const objects = await db.collection("users").doc(uid).collection("objects").get();
  const batch = db.batch();
  for (const doc of objects.docs) batch.delete(doc.ref);
  batch.delete(db.collection("entitlements").doc(uid));
  await batch.commit();
}

async function wipeUser(uid: string, email: string | undefined): Promise<void> {
  await wipeHealth(uid);
  if (email) {
    await getFirestore().collection("pendingEntitlements").doc(normalizeEmail(email)).delete();
  }
  await getAuth().deleteUser(uid);
}

export const stripeWebhook = onRequest(httpOptions, async (req, res) => {
  const signature = req.get("stripe-signature");
  const request = new Request("https://functions.local/stripeWebhook", {
    method: "POST",
    headers: signature ? { "stripe-signature": signature } : {},
    body: new Uint8Array(req.rawBody),
  });
  const state = await loadCommerce();
  const result = await postStripeWebhook(request, state, {
    stripeSecretKey: process.env.STRIPE_SECRET_KEY || (emulator ? LOCAL_STRIPE_KEY : ""),
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || (emulator ? LOCAL_WEBHOOK_SECRET : ""),
  });
  if (result.response.status === 200) await saveCommerce(result.state);
  res.status(result.response.status).type("json").send(await result.response.text());
});

export const claimEntitlement = onRequest(httpOptions, async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "method" });
    return;
  }
  const token = bearer(req.get("authorization"));
  if (!token) {
    res.status(401).json({ error: "sign in" });
    return;
  }
  const decoded = await getAuth().verifyIdToken(token);
  if (!decoded.email) {
    res.status(400).json({ error: "email" });
    return;
  }
  const next = claimEntitlementState(await loadCommerce(), decoded.uid, decoded.email);
  await saveCommerce(next);
  res.status(200).json({ claimed: true });
});

export const deleteAccount = onRequest(httpOptions, async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "method" });
    return;
  }
  const token = bearer(req.get("authorization"));
  if (!token) {
    res.status(401).json({ error: "sign in" });
    return;
  }
  const decoded = await getAuth().verifyIdToken(token);
  await wipeUser(decoded.uid, decoded.email);
  res.status(200).json({ deleted: true });
});

export const renewalReminders = onSchedule({ region, schedule: "every day 16:00" }, async () => {
  const state = await loadCommerce();
  const due = renewalTargets(state, new Date());
  const db = getFirestore();
  const link = process.env.NEXT_PUBLIC_STRIPE_LINK_BACKUP ?? "";
  for (const item of due) {
    if (!item.uid) continue;
    console.info("renewal reminder", item.uid, link ? "link" : "no-link");
    await db.collection("entitlements").doc(item.uid).set({ lastRenewalReminder: Timestamp.now() }, { merge: true });
  }
});

export const expireBackups = onSchedule({ region, schedule: "every day 17:00" }, async () => {
  const state = await loadCommerce();
  let next = state;
  for (const item of expiryTargets(state, new Date())) {
    if (!item.uid) continue;
    await wipeHealth(item.uid);
    next = expireEntitlement(next, item.uid);
  }
  await saveCommerce(next);
});
