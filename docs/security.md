# Security

Controls are either enforced by a test or marked as a human gate. Add a control in the same change as its test. Do not describe a later control as if it were already on the public security page.

## In place

| Control | Enforced by |
| --- | --- |
| Card data stays on Stripe Checkout. This app has no card fields. | Human gate. Review the checkout route when it changes. |
| Webhook writes require a valid Stripe signature, and errors do not echo the body. Subscription events do not change backup. | Webhook signature test |
| Backup turns on only from Payment Link metadata `backup=true`. | Payment link metadata test |
| Security headers, including a script policy with no open source and no framing. HSTS is production-only. | Browser headers test |
| Client components cannot see server secrets. `NEXT_PUBLIC_` names must be listed in `lib/public-env.ts`. | Secrets stay on the server test |
| The webhook path does not import health storage. | Webhook isolation test |
| Waitlist emails are written only by Cloud Functions. Clients cannot read or write `waitlist`. | Firebase rules test |
| One data key encrypts samples. Passkey output and the recovery key wrap that key. The stored record does not hold those secrets in the clear. | Vault key wrapping test |
| Storage rules deny client reads and writes. Upload goes through a function that checks the capability hash and `paidUntil`. | Firebase rules test |
| There is no Firebase Auth user. A paid checkout binds one vault id to the Stripe email. | Upload capability test |
| The public security page does not claim HIPAA, SOC 2, or military-grade protection. | Public claims test |

## Human gates before health data is stored

- The Firebase project used in production is separate from local emulators. Stripe, Firebase, and GitHub logins use multi-factor authentication. There is no shared admin password.
- There is no account. A new payment does not unwrap old ciphertext. The recovery key is the only way onto a browser that does not already have a passkey for the vault.
- Backup is encrypted before upload. The data key is never stored on the server. A key version is stored so a later rotation has a place to land.
- Firebase Storage is private to Cloud Functions. A leaked capability can add blobs. It cannot rewrite an existing object.
- Logs and error reports do not carry the recovery key, the capability, or sample bodies.
- This browser encrypts, then backup uploads ciphertext. See [health-data.md](health-data.md).
- Counsel reviews the policy before real health data is stored. If readable health data or order email is exposed, tell the affected customers.

Dependabot, or the equivalent, turns on for this GitHub repository. A third-party penetration test is not part of this slice, and the security page does not imply one happened.
