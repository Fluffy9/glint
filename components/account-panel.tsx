"use client";

import { useEffect, useState, type FormEvent } from "react";
import { copy, fill } from "@/content";
import {
  clearAccountSession,
  readAccountSession,
  readStoredEmail,
  writeStoredEmail,
  type AccountSession,
} from "@/lib/account-session";
import { completeEmailSignIn } from "@/lib/complete-email-sign-in";
import {
  callAuthedFunction,
  getEncryptedBackup,
  putEncryptedBackup,
  latestEmulatorSignInLink,
  sendEmailLink,
} from "../functions/src/domain/auth-rest";
import {
  bytesMatch,
  bytesToBase64,
  decryptWithPassphrase,
  encryptWithPassphrase,
  TEST_BACKUP_PLAINTEXT,
  type CipherBlob,
} from "../functions/src/domain/crypto";
import { emulatorAuthOrigin, firebaseTargets, functionUrl } from "../functions/src/domain/emulator";
import { backupObjectPath, canDeleteAccount, canSendSignIn } from "../functions/src/domain/state";

const targets = firebaseTargets({
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
});

type StoredTestBackup = {
  objectPath: string;
  nonce: string;
  salt: string;
  keyVersion: CipherBlob["keyVersion"];
  ciphertextBase64: string;
};

function stripSignInParams() {
  const url = new URL(window.location.href);
  if (!url.searchParams.has("oobCode") && !url.searchParams.has("mode") && !url.searchParams.has("apiKey")) {
    return;
  }
  url.search = "";
  window.history.replaceState({}, "", `${url.pathname}${url.hash}`);
}

function AccountSkeleton() {
  return (
    <div className="account-skeleton" role="status" aria-live="polite" aria-busy="true">
      <span className="gl-sr">{copy.account.checking}</span>
      <span className="account-skeleton-line" />
      <span className="account-skeleton-line account-skeleton-line-lg" />
      <span className="account-skeleton-line account-skeleton-line-lg" />
    </div>
  );
}

export function AccountPanel() {
  const configured = targets !== null;
  const [email, setEmail] = useState("");
  const [phrase, setPhrase] = useState("");
  const [passphrase, setPassphrase] = useState("");
  const [unlockPhrase, setUnlockPhrase] = useState("");
  const [signInLink, setSignInLink] = useState<string | null>(null);
  const [session, setSession] = useState<AccountSession | null>(null);
  const [ready, setReady] = useState(false);
  const [storedBackup, setStoredBackup] = useState<StoredTestBackup | null>(null);
  const [unlockedText, setUnlockedText] = useState<string | null>(null);
  const [showTestForm, setShowTestForm] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const existing = readAccountSession();
    const savedEmail = readStoredEmail();
    if (savedEmail) setEmail(savedEmail);
    if (existing) {
      setSession(existing);
      stripSignInParams();
      setInfo(targets?.emulators ? copy.account.emulatorNote : null);
      setReady(true);
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const oobCode = params.get("oobCode");
    if (!targets || !oobCode || !savedEmail) {
      setInfo(
        configured ? (targets?.emulators ? copy.account.emulatorNote : null) : copy.account.notConfigured,
      );
      setReady(true);
      return;
    }

    let cancelled = false;
    void completeEmailSignIn({
      fetch: globalThis.fetch.bind(globalThis),
      apiKey: targets.apiKey,
      email: savedEmail,
      oobCode,
      authBase: targets.authBase,
      claimUrl: functionUrl(targets, "claimEntitlement"),
    })
      .then((next) => {
        stripSignInParams();
        if (cancelled) return;
        setSession(next);
        setError(null);
        setInfo(null);
        setReady(true);
      })
      .catch(() => {
        if (cancelled) return;
        const recovered = readAccountSession();
        if (recovered) {
          stripSignInParams();
          setSession(recovered);
          setError(null);
          setInfo(null);
          setReady(true);
          return;
        }
        setError(copy.account.failed);
        setReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!targets || !canSendSignIn(configured, email) || pending) return;
    setPending(true);
    setError(null);
    setSignInLink(null);
    try {
      const continueUrl = `${window.location.origin}/account`;
      const sent = await sendEmailLink(
        globalThis.fetch.bind(globalThis),
        targets.apiKey,
        email.trim(),
        continueUrl,
        targets.authBase,
        targets.projectId,
      );
      writeStoredEmail(email.trim());
      const oobLink =
        sent.oobLink ??
        (targets.emulators
          ? await latestEmulatorSignInLink(
              globalThis.fetch.bind(globalThis),
              targets.projectId,
              email.trim(),
              emulatorAuthOrigin(targets.authBase),
            )
          : null);
      setSignInLink(oobLink);
      setInfo(oobLink ? copy.account.emulatorNote : copy.account.sent);
    } catch {
      setError(copy.account.sendFailed);
    } finally {
      setPending(false);
    }
  }

  async function saveBackup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!targets || !session || passphrase.length < 8 || pending) return;
    setPending(true);
    setError(null);
    try {
      const objectId = crypto.randomUUID();
      const objectPath = backupObjectPath(session.localId, "heart", objectId);
      const blob = await encryptWithPassphrase(
        new TextEncoder().encode(TEST_BACKUP_PLAINTEXT),
        passphrase,
      );
      await putEncryptedBackup(globalThis.fetch.bind(globalThis), {
        storageBase: targets.storageBase,
        firestoreBase: targets.firestoreBase,
        idToken: session.idToken,
        uid: session.localId,
        objectPath,
        objectId,
        category: "heart",
        nonce: blob.nonce,
        salt: blob.salt,
        keyVersion: blob.keyVersion,
        ciphertext: blob.ciphertext,
      });
      setStoredBackup({
        objectPath,
        nonce: blob.nonce,
        salt: blob.salt,
        keyVersion: blob.keyVersion,
        ciphertextBase64: bytesToBase64(blob.ciphertext),
      });
      setUnlockedText(null);
      setShowTestForm(false);
      setPassphrase("");
      setUnlockPhrase("");
      setInfo(null);
    } catch {
      setError(targets.emulators ? copy.account.backupFailedEmulator : copy.account.backupFailed);
    } finally {
      setPending(false);
    }
  }

  async function unlockBackup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!targets || !session || !storedBackup || unlockPhrase.length < 8 || pending) return;
    setPending(true);
    setError(null);
    try {
      const ciphertext = await getEncryptedBackup(globalThis.fetch.bind(globalThis), {
        storageBase: targets.storageBase,
        idToken: session.idToken,
        objectPath: storedBackup.objectPath,
      });
      const plain = await decryptWithPassphrase(
        {
          ciphertext,
          nonce: storedBackup.nonce,
          salt: storedBackup.salt,
          keyVersion: storedBackup.keyVersion,
        },
        unlockPhrase,
      );
      if (!bytesMatch(plain, new TextEncoder().encode(TEST_BACKUP_PLAINTEXT))) {
        throw new Error("plaintext mismatch");
      }
      setUnlockedText(new TextDecoder().decode(plain));
      setUnlockPhrase("");
    } catch {
      setError(copy.account.unlockFailed);
      setUnlockedText(null);
    } finally {
      setPending(false);
    }
  }

  async function remove(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!targets || !session || !canDeleteAccount(configured, true, phrase) || pending) return;
    setPending(true);
    setError(null);
    try {
      await callAuthedFunction(
        globalThis.fetch.bind(globalThis),
        functionUrl(targets, "deleteAccount"),
        session.idToken,
      );
      clearAccountSession();
      setSession(null);
      setPhrase("");
      setStoredBackup(null);
      setUnlockedText(null);
      setShowTestForm(true);
      setInfo(copy.account.deleted);
    } catch {
      setError(copy.account.deleteFailed);
    } finally {
      setPending(false);
    }
  }

  const unlocked = unlockedText !== null;
  const backupStatus = unlocked
    ? copy.account.unlockedTitle
    : storedBackup
      ? copy.account.backupSaved
      : targets?.emulators
        ? copy.account.backupReady
        : copy.account.backupNone;

  return (
    <div className="account-panel">
      {!ready ? (
        <AccountSkeleton />
      ) : session ? (
        <>
          <div className="account-status" role="status">
            <p className="account-status-label">{copy.account.statusLabel}</p>
            <p className="account-status-line">{fill(copy.account.signedIn, { email: session.email })}</p>
            <p className={`account-status-backup${storedBackup ? " is-saved" : ""}${unlocked ? " is-unlocked" : ""}`}>
              {backupStatus}
            </p>
          </div>

          {targets?.emulators && storedBackup ? (
            <div className={`account-blob${unlocked ? " is-unlocked" : ""}`}>
              <p className="account-blob-label">
                {unlocked ? copy.account.blobUnlockedLabel : copy.account.blobLockedLabel}
              </p>
              <pre className="account-blob-text">{unlocked ? unlockedText : storedBackup.ciphertextBase64}</pre>
              {unlocked ? (
                <div className="account-result" role="status" aria-live="polite">
                  <p className="account-result-title">{copy.account.unlockedTitle}</p>
                  <p className="account-result-body">{copy.account.unlockedBody}</p>
                </div>
              ) : (
                <form className="buy-form" onSubmit={unlockBackup}>
                  <label className="gl-field">
                    <span className="gl-field-label">{copy.account.unlockPassphrase}</span>
                    <span className="gl-input">
                      <input
                        type="password"
                        name="unlock"
                        autoComplete="current-password"
                        value={unlockPhrase}
                        onChange={(event) => setUnlockPhrase(event.target.value)}
                      />
                    </span>
                  </label>
                  <button
                    className="gl-btn gl-btn-primary"
                    type="submit"
                    disabled={unlockPhrase.length < 8 || pending}
                  >
                    {copy.account.unlockBackup}
                  </button>
                </form>
              )}
            </div>
          ) : null}

          {targets?.emulators && showTestForm ? (
            <form className="buy-form" onSubmit={saveBackup}>
              <h2 className="account-section-title">{copy.account.testTitle}</h2>
              <p className="account-section-body">{copy.account.testBody}</p>
              <p className="account-blob-label">{copy.account.sampleLabel}</p>
              <p className="account-sample">{TEST_BACKUP_PLAINTEXT}</p>
              <label className="gl-field">
                <span className="gl-field-label">{copy.account.passphrase}</span>
                <span className="gl-input">
                  <input
                    type="password"
                    name="passphrase"
                    autoComplete="new-password"
                    value={passphrase}
                    onChange={(event) => setPassphrase(event.target.value)}
                  />
                </span>
              </label>
              <button className="gl-btn gl-btn-primary" type="submit" disabled={passphrase.length < 8 || pending}>
                {copy.account.saveBackup}
              </button>
            </form>
          ) : null}

          {targets?.emulators && storedBackup && unlocked && !showTestForm ? (
            <button
              className="gl-btn"
              type="button"
              onClick={() => {
                setShowTestForm(true);
                setError(null);
              }}
            >
              {copy.account.saveAnother}
            </button>
          ) : null}

          <form className="buy-form" onSubmit={remove}>
            <h2 className="h2">{copy.account.deleteTitle}</h2>
            <p className="account-section-body">{copy.account.deleteBody}</p>
            <label className="gl-field">
              <span className="gl-field-label">{copy.account.confirmLabel}</span>
              <span className="gl-input">
                <input
                  name="confirm"
                  autoComplete="off"
                  value={phrase}
                  onChange={(event) => setPhrase(event.target.value)}
                />
              </span>
            </label>
            <button
              className="gl-btn"
              type="submit"
              disabled={!canDeleteAccount(configured, true, phrase) || pending}
            >
              {copy.account.deleteButton}
            </button>
          </form>
        </>
      ) : (
        <form className="buy-form" onSubmit={send}>
          <label className="gl-field">
            <span className="gl-field-label">{copy.account.emailLabel}</span>
            <span className="gl-input">
              <input
                type="email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </span>
          </label>
          <button className="gl-btn gl-btn-primary" type="submit" disabled={!canSendSignIn(configured, email) || pending}>
            {copy.account.sendLink}
          </button>
          {signInLink ? <a href={signInLink}>{copy.account.openLink}</a> : null}
        </form>
      )}
      {ready && error ? <p className="account-notice-error">{error}</p> : null}
      {ready && info && !error ? <p className="fine">{info}</p> : null}
    </div>
  );
}
