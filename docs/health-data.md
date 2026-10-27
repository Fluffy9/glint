# Health data

Glint does not collect heart rate, sleep, or activity on this website as plaintext. Samples are encrypted in the browser before they are stored.

## Destinations

Activity, heart, and sleep each live in one of these places:

- **On this browser.** Nothing in that category is uploaded. The vault flag in localStorage only records that a vault exists. IndexedDB holds ciphertext.
- **Encrypted backup.** This browser encrypts the bytes, then backup uploads ciphertext. The server stores the blob, a nonce, and a key version. It does not store readable samples. There is no account. A new payment does not unwrap old ciphertext. If the recovery key is lost and every passkey wrap is gone, that backup stays locked.
- **Plain export.** The customer can write an unencrypted CSV or JSON, including to Google Drive or another place they pick. That file is outside Glint’s ciphertext model. Sending it to Google Drive is not built yet.

The default is this browser. If the customer pays for backup, uploads are ciphertext. There is no server-readable health copy.

## Who paid

Firestore holds orders and `entitlements/{email}` with `paidUntil`, the Stripe customer, the bound `vaultId`, and a hash of the upload capability. Firebase Storage holds ciphertext at `backups/{vaultId}/{category}/{id}`. Clients cannot write those objects. A Cloud Function checks the capability hash and `paidUntil` before it writes. Download of ciphertext for a vault id is allowed only while `paidUntil` is in the future. Orders are not readable from the client. The Stripe webhook is a Cloud Function. It does not write a subscription.

Missing a renewal stops uploads. The locked copies stay locked.

## Before the first health byte

These are human gates:

- Backup uses client-side encryption. The data key and the recovery key are never stored on the server.
- This browser is the uploader. iPhone browsers do not connect to the band in this slice.
- Counsel reviews the privacy policy, including the FTC Health Breach Notification Rule and applicable state law, before real health data is stored. Do not describe Glint as HIPAA compliant.
