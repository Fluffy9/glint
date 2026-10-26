"use client";

import { useEffect, useState, type FormEvent } from "react";
import { copy, fill } from "@/content";
import {
  callAuthedFunction,
  putEncryptedBackup,
  latestEmulatorSignInLink,
  sendEmailLink,
  signInWithEmailLink,
} from "../functions/src/domain/auth-rest";
import { encryptWithPassphrase } from "../functions/src/domain/crypto";
import { firebaseTargets, functionUrl } from "../functions/src/domain/emulator";
import { backupObjectPath, canDeleteAccount, canSendSignIn } from "../functions/src/domain/state";

const targets = firebaseTargets({
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
});

export function AccountPanel() {
  const configured = targets !== null;
  const [email, setEmail] = useState("");
  const [phrase, setPhrase] = useState("");
  const [passphrase, setPassphrase] = useState("");
  const [signInLink, setSignInLink] = useState<string | null>(null);
  const [session, setSession] = useState<{ idToken: string; localId: string; email: string } | null>(null);
  const [notice, setNotice] = useState<string | null>(
    configured ? (targets.emulators ? copy.account.emulatorNote : null) : copy.account.notConfigured,
  );
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const oobCode = params.get("oobCode");
    const stored = window.localStorage.getItem("glint-email");
    if (!targets || !oobCode || !stored) return;
    let cancelled = false;
    void signInWithEmailLink(globalThis.fetch.bind(globalThis), targets.apiKey, stored, oobCode, targets.authBase)
      .then(async (next) => {
        await callAuthedFunction(
          globalThis.fetch.bind(globalThis),
          functionUrl(targets, "claimEntitlement"),
          next.idToken,
        );
        if (!cancelled) setSession(next);
      })
      .catch(() => {
        if (!cancelled) setNotice(copy.account.failed);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!targets || !canSendSignIn(configured, email) || pending) return;
    setPending(true);
    setNotice(null);
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
      window.localStorage.setItem("glint-email", email.trim());
      const oobLink =
        sent.oobLink ??
        (targets.emulators
          ? await latestEmulatorSignInLink(globalThis.fetch.bind(globalThis), targets.projectId, email.trim())
          : null);
      setSignInLink(oobLink);
      setNotice(oobLink ? copy.account.emulatorNote : copy.account.sent);
    } catch {
      setNotice(copy.account.failed);
    } finally {
      setPending(false);
    }
  }

  async function saveBackup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!targets || !session || passphrase.length < 8 || pending) return;
    setPending(true);
    setNotice(null);
    try {
      const objectId = crypto.randomUUID();
      const blob = await encryptWithPassphrase(
        new TextEncoder().encode("glint-local-backup"),
        passphrase,
      );
      await putEncryptedBackup(globalThis.fetch.bind(globalThis), {
        storageBase: targets.storageBase,
        firestoreBase: targets.firestoreBase,
        idToken: session.idToken,
        uid: session.localId,
        objectPath: backupObjectPath(session.localId, "heart", objectId),
        objectId,
        category: "heart",
        nonce: blob.nonce,
        salt: blob.salt,
        keyVersion: blob.keyVersion,
        ciphertext: blob.ciphertext,
      });
      setNotice(copy.account.saved);
    } catch {
      setNotice(copy.account.failed);
    } finally {
      setPending(false);
    }
  }

  async function remove(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!targets || !session || !canDeleteAccount(configured, true, phrase) || pending) return;
    setPending(true);
    setNotice(null);
    try {
      await callAuthedFunction(
        globalThis.fetch.bind(globalThis),
        functionUrl(targets, "deleteAccount"),
        session.idToken,
      );
      setSession(null);
      setPhrase("");
      setNotice(copy.account.deleted);
    } catch {
      setNotice(copy.account.failed);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="account-panel">
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
      {session ? <p>{fill(copy.account.signedIn, { email: session.email })}</p> : null}
      {session && targets?.emulators ? (
        <form className="buy-form" onSubmit={saveBackup}>
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
          <button className="gl-btn" type="submit" disabled={passphrase.length < 8 || pending}>
            {copy.account.saveBackup}
          </button>
        </form>
      ) : null}
      <form className="buy-form" onSubmit={remove}>
        <h2 className="h2">{copy.account.deleteTitle}</h2>
        <p>{copy.account.deleteBody}</p>
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
          disabled={!canDeleteAccount(configured, Boolean(session), phrase) || pending}
        >
          {copy.account.deleteButton}
        </button>
      </form>
      {notice ? <p className="fine">{notice}</p> : null}
    </div>
  );
}
