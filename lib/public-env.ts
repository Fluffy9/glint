/** Names that may appear in client code. Anything else that starts with NEXT_PUBLIC_ fails the secrets test. */
export const publicEnvNames = ["NEXT_PUBLIC_SITE_URL"] as const;
