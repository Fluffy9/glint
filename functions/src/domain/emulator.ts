export const LOCAL_PROJECT_ID = "glint-local";
export const LOCAL_API_KEY = "local-emulator-key";
export const LOCAL_REGION = "us-central1";
export const LOCAL_WEBHOOK_SECRET = "whsec_local_emulator";
export const LOCAL_STRIPE_KEY = "sk_test_local";

/** Same-origin Next rewrites → Firebase emulators (see next.config.ts). */
export const EMULATOR_PROXY = {
  auth: "/__glint/auth",
  functions: "/__glint/functions",
  firestore: "/__glint/firestore",
  storage: "/__glint/storage",
} as const;

export type FirebaseTargets = {
  emulators: boolean;
  apiKey: string;
  projectId: string;
  authBase: string;
  functionsBase: string;
  firestoreBase: string;
  storageBase: string;
  bucket: string;
};

export function firebaseTargets(env: {
  NODE_ENV?: string;
  NEXT_PUBLIC_FIREBASE_API_KEY?: string;
  NEXT_PUBLIC_FIREBASE_PROJECT_ID?: string;
}): FirebaseTargets | null {
  const apiKey = env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim() || "";
  const projectId = env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim() || "";
  if (env.NODE_ENV === "development" && !apiKey) {
    const bucket = `${LOCAL_PROJECT_ID}.appspot.com`;
    return {
      emulators: true,
      apiKey: LOCAL_API_KEY,
      projectId: LOCAL_PROJECT_ID,
      // Browser stays on the Next origin; rewrites reach 127.0.0.1 emulators.
      authBase: `${EMULATOR_PROXY.auth}/identitytoolkit.googleapis.com/v1`,
      functionsBase: `${EMULATOR_PROXY.functions}/${LOCAL_PROJECT_ID}/${LOCAL_REGION}`,
      firestoreBase: `${EMULATOR_PROXY.firestore}/v1/projects/${LOCAL_PROJECT_ID}/databases/(default)/documents`,
      storageBase: `${EMULATOR_PROXY.storage}/v0/b/${bucket}/o`,
      bucket,
    };
  }
  if (!apiKey || !projectId) return null;
  const bucket = `${projectId}.appspot.com`;
  return {
    emulators: false,
    apiKey,
    projectId,
    authBase: "https://identitytoolkit.googleapis.com/v1",
    functionsBase: `https://${LOCAL_REGION}-${projectId}.cloudfunctions.net`,
    firestoreBase: `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`,
    storageBase: `https://firebasestorage.googleapis.com/v0/b/${bucket}/o`,
    bucket,
  };
}

export function functionUrl(targets: FirebaseTargets, name: string): string {
  return `${targets.functionsBase}/${name}`;
}

export function emulatorAuthOrigin(authBase: string): string {
  if (authBase.startsWith("/")) {
    return authBase.replace(/\/identitytoolkit\.googleapis\.com\/v1\/?$/, "") || EMULATOR_PROXY.auth;
  }
  return new URL(authBase).origin;
}
