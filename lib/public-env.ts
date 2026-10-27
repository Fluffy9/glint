/** Names that may appear in client code. Anything else that starts with NEXT_PUBLIC_ fails the secrets test. */
export const publicEnvNames = [
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_STRIPE_LINK_BAND",
  "NEXT_PUBLIC_STRIPE_LINK_BACKUP",
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
] as const;
