import { initializeApp } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { onRequest } from "firebase-functions/v2/https";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { base64ToBytes, hashCapability } from "./domain/crypto";
import { LOCAL_PROJECT_ID, LOCAL_STRIPE_KEY, LOCAL_WEBHOOK_SECRET } from "./domain/emulator";
import {
  addCiphertext,
  backupObjectPath,
  canDeleteShelf,
  canDownloadBackup,
  canUploadBackup,
  deleteShelf,
  emptyBackupState,
  entitlementForVault,
  expiryTargets,
  normalizeEmail,
  redeemPaidCheckout,
  renewalTargets,
  type BackupState,
  type Entitlement,
  type Order,
} from "./domain/state";
import { postStripeWebhook } from "./domain/webhook";

const emulator = process.env.FUNCTIONS_EMULATOR === "true";

initializeApp({
  projectId: process.env.GCLOUD_PROJECT || LOCAL_PROJECT_ID,
  storageBucket: `${process.env.GCLOUD_PROJECT || LOCAL_PROJECT_ID}.appspot.com`,
});

const region = "us-central1";
const httpOptions = { region, cors: true } as const;

function entitlementFromDoc(id: string, data: Record<string, unknown>): Entitlement {
  const rawUntil = data.paidUntil;
  const paidUntil = rawUntil instanceof Timestamp ? rawUntil.toDate() : new Date(String(rawUntil));
  return {
    email: typeof data.email === "string" ? data.email : id,
    paidUntil,
    stripeCustomerId: typeof data.stripeCustomerId === "string" ? data.stripeCustomerId : null,
    vaultId: typeof data.vaultId === "string" ? data.vaultId : null,
    capabilityHash: typeof data.capabilityHash === "string" ? data.capabilityHash : null,
  };
}

async function loadCommerce(): Promise<BackupState> {
  const db = getFirestore();
  const [ordersSnap, entitledSnap] = await Promise.all([
    db.collection("orders").get(),
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
  return {
    ...emptyBackupState(),
    orders,
    entitlements: entitledSnap.docs.map((doc) => entitlementFromDoc(doc.id, doc.data() as Record<string, unknown>)),
  };
}

async function saveCommerce(state: BackupState): Promise<void> {
  const db = getFirestore();
  const batch = db.batch();
  for (const order of state.orders) {
    batch.set(db.collection("orders").doc(order.sessionId), order);
  }
  for (const item of state.entitlements) {
    batch.set(db.collection("entitlements").doc(normalizeEmail(item.email)), {
      email: item.email,
      paidUntil: Timestamp.fromDate(item.paidUntil),
      stripeCustomerId: item.stripeCustomerId,
      vaultId: item.vaultId,
      capabilityHash: item.capabilityHash,
    });
  }
  await batch.commit();
}

function jsonBody(req: { body?: unknown }): Record<string, unknown> {
  return req.body && typeof req.body === "object" ? (req.body as Record<string, unknown>) : {};
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

export const redeemBackup = onRequest(httpOptions, async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "method" });
    return;
  }
  const body = jsonBody(req);
  const sessionId = typeof body.sessionId === "string" ? body.sessionId : "";
  const vaultId = typeof body.vaultId === "string" ? body.vaultId : "";
  const capabilityHash = typeof body.capabilityHash === "string" ? body.capabilityHash : "";
  if (!sessionId || !vaultId || !capabilityHash) {
    res.status(400).json({ error: "missing" });
    return;
  }
  const result = redeemPaidCheckout(await loadCommerce(), { sessionId, vaultId, capabilityHash, now: new Date() });
  if (!result.ok) {
    res.status(403).json({ error: result.error });
    return;
  }
  await saveCommerce(result.state);
  res.status(200).json({ paidUntil: result.paidUntil.toISOString() });
});

export const uploadBackup = onRequest(httpOptions, async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "method" });
    return;
  }
  const body = jsonBody(req);
  const vaultId = typeof body.vaultId === "string" ? body.vaultId : "";
  const capability = typeof body.capability === "string" ? body.capability : "";
  const objectId = typeof body.objectId === "string" ? body.objectId : "";
  const category = typeof body.category === "string" ? body.category : "";
  const nonce = typeof body.nonce === "string" ? body.nonce : "";
  const keyVersion = typeof body.keyVersion === "number" ? body.keyVersion : 0;
  const ciphertextBase64 = typeof body.ciphertextBase64 === "string" ? body.ciphertextBase64 : "";
  if (!vaultId || !capability || !objectId || !category || !nonce || !ciphertextBase64) {
    res.status(400).json({ error: "missing" });
    return;
  }
  const state = await loadCommerce();
  const allowed = canUploadBackup({
    entitlement: entitlementForVault(state, vaultId),
    vaultId,
    capabilityHash: await hashCapability(capability),
    now: new Date(),
  });
  if (!allowed) {
    res.status(403).json({ error: "forbidden" });
    return;
  }
  const bytes = base64ToBytes(ciphertextBase64);
  const next = addCiphertext(
    state,
    { id: objectId, vaultId, category, nonce, keyVersion, size: bytes.byteLength },
    bytes,
  );
  if (!next) {
    res.status(409).json({ error: "exists" });
    return;
  }
  const path = backupObjectPath(vaultId, category, objectId);
  await getStorage().bucket().file(path).save(Buffer.from(bytes));
  await getFirestore().collection("vaultObjects").doc(vaultId).collection("items").doc(objectId).set({
    category,
    nonce,
    keyVersion,
    size: bytes.byteLength,
    ciphertextBase64,
  });
  res.status(200).json({ stored: true });
});

export const downloadBackup = onRequest(httpOptions, async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "method" });
    return;
  }
  const vaultId = typeof jsonBody(req).vaultId === "string" ? String(jsonBody(req).vaultId) : "";
  if (!vaultId) {
    res.status(400).json({ error: "missing" });
    return;
  }
  const state = await loadCommerce();
  if (!canDownloadBackup({ entitlement: entitlementForVault(state, vaultId), vaultId, now: new Date() })) {
    res.status(403).json({ error: "forbidden" });
    return;
  }
  const snap = await getFirestore().collection("vaultObjects").doc(vaultId).collection("items").get();
  const objects = snap.docs.map((doc) => {
    const data = doc.data();
    return {
      objectId: doc.id,
      category: String(data.category ?? ""),
      nonce: String(data.nonce ?? ""),
      keyVersion: Number(data.keyVersion ?? 0),
      ciphertextBase64: String(data.ciphertextBase64 ?? ""),
    };
  });
  res.status(200).json({ objects });
});

export const deleteBackup = onRequest(httpOptions, async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "method" });
    return;
  }
  const body = jsonBody(req);
  const vaultId = typeof body.vaultId === "string" ? body.vaultId : "";
  const capability = typeof body.capability === "string" ? body.capability : "";
  if (!vaultId || !capability) {
    res.status(400).json({ error: "missing" });
    return;
  }
  const state = await loadCommerce();
  const allowed = canDeleteShelf({
    entitlement: entitlementForVault(state, vaultId),
    vaultId,
    capabilityHash: await hashCapability(capability),
  });
  if (!allowed) {
    res.status(403).json({ error: "forbidden" });
    return;
  }
  await getStorage().bucket().deleteFiles({ prefix: `backups/${vaultId}/` });
  const db = getFirestore();
  const items = await db.collection("vaultObjects").doc(vaultId).collection("items").get();
  const batch = db.batch();
  for (const doc of items.docs) batch.delete(doc.ref);
  await batch.commit();
  await saveCommerce(deleteShelf(state, vaultId));
  res.status(200).json({ deleted: true });
});

export const renewalReminders = onSchedule({ region, schedule: "every day 16:00" }, async () => {
  const state = await loadCommerce();
  const due = renewalTargets(state, new Date());
  const db = getFirestore();
  const link = process.env.NEXT_PUBLIC_STRIPE_LINK_BACKUP ?? "";
  for (const item of due) {
    console.info("renewal reminder", normalizeEmail(item.email), link ? "link" : "no-link");
    await db.collection("entitlements").doc(normalizeEmail(item.email)).set(
      { lastRenewalReminder: Timestamp.now() },
      { merge: true },
    );
  }
});

export const expireBackups = onSchedule({ region, schedule: "every day 17:00" }, async () => {
  const due = expiryTargets(await loadCommerce(), new Date());
  for (const item of due) {
    console.info("backup upload paused", normalizeEmail(item.email));
  }
});
