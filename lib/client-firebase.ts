import { firebaseTargets, type FirebaseTargets } from "@/functions/src/domain/emulator";

export const firebaseClient = firebaseTargets({
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
});

export function browserFetch(): typeof fetch {
  return globalThis.fetch.bind(globalThis);
}

export type { FirebaseTargets };
