"use client";

import type { FormEvent } from "react";
import { copy, fill } from "@/content";
import { TEST_BACKUP_PLAINTEXT } from "@/functions/src/domain/crypto";
import { canDeleteAccount, canSendSignIn } from "@/functions/src/domain/state";
import type { StoredTestBackup } from "@/lib/test-backup";

export function AccountSkeleton() {
  return (
    <div className="account-skeleton" role="status" aria-live="polite" aria-busy="true">
      <span className="gl-sr">{copy.account.checking}</span>
      <span className="account-skeleton-line" />
      <span className="account-skeleton-line account-skeleton-line-lg" />
      <span className="account-skeleton-line account-skeleton-line-lg" />
    </div>
  );
}

export function SignInForm({
  email,
  pending,
  configured,
  signInLink,
  onEmail,
  onSubmit,
}: {
  email: string;
  pending: boolean;
  configured: boolean;
  signInLink: string | null;
  onEmail: (email: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form className="buy-form" onSubmit={onSubmit}>
      <label className="gl-field">
        <span className="gl-field-label">{copy.account.emailLabel}</span>
        <span className="gl-input">
          <input
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(event) => onEmail(event.target.value)}
          />
        </span>
      </label>
      <button className="gl-btn gl-btn-primary" type="submit" disabled={!canSendSignIn(configured, email) || pending}>
        {copy.account.sendLink}
      </button>
      {signInLink ? <a href={signInLink}>{copy.account.openLink}</a> : null}
    </form>
  );
}

export function AccountStatus({
  email,
  saved,
  unlocked,
  label,
}: {
  email: string;
  saved: boolean;
  unlocked: boolean;
  label: string;
}) {
  return (
    <div className="account-status" role="status">
      <p className="account-status-label">{copy.account.statusLabel}</p>
      <p className="account-status-line">{fill(copy.account.signedIn, { email })}</p>
      <p className={`account-status-backup${saved ? " is-saved" : ""}${unlocked ? " is-unlocked" : ""}`}>{label}</p>
    </div>
  );
}

export function BackupBlob({
  stored,
  unlockedText,
  unlockPhrase,
  pending,
  onUnlockPhrase,
  onUnlock,
}: {
  stored: StoredTestBackup;
  unlockedText: string | null;
  unlockPhrase: string;
  pending: boolean;
  onUnlockPhrase: (value: string) => void;
  onUnlock: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const unlocked = unlockedText !== null;
  return (
    <div className={`account-blob${unlocked ? " is-unlocked" : ""}`}>
      <p className="account-blob-label">
        {unlocked ? copy.account.blobUnlockedLabel : copy.account.blobLockedLabel}
      </p>
      <pre className="account-blob-text">{unlocked ? unlockedText : stored.ciphertextBase64}</pre>
      {unlocked ? (
        <div className="account-result" role="status" aria-live="polite">
          <p className="account-result-title">{copy.account.unlockedTitle}</p>
          <p className="account-result-body">{copy.account.unlockedBody}</p>
        </div>
      ) : (
        <form className="buy-form" onSubmit={onUnlock}>
          <label className="gl-field">
            <span className="gl-field-label">{copy.account.unlockPassphrase}</span>
            <span className="gl-input">
              <input
                type="password"
                name="unlock"
                autoComplete="current-password"
                value={unlockPhrase}
                onChange={(event) => onUnlockPhrase(event.target.value)}
              />
            </span>
          </label>
          <button className="gl-btn gl-btn-primary" type="submit" disabled={unlockPhrase.length < 8 || pending}>
            {copy.account.unlockBackup}
          </button>
        </form>
      )}
    </div>
  );
}

export function TestBackupForm({
  passphrase,
  pending,
  onPassphrase,
  onSubmit,
}: {
  passphrase: string;
  pending: boolean;
  onPassphrase: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form className="buy-form" onSubmit={onSubmit}>
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
            onChange={(event) => onPassphrase(event.target.value)}
          />
        </span>
      </label>
      <button className="gl-btn gl-btn-primary" type="submit" disabled={passphrase.length < 8 || pending}>
        {copy.account.saveBackup}
      </button>
    </form>
  );
}

export function DeleteAccountForm({
  phrase,
  pending,
  signedIn,
  configured,
  onPhrase,
  onSubmit,
}: {
  phrase: string;
  pending: boolean;
  signedIn: boolean;
  configured: boolean;
  onPhrase: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form className="buy-form" onSubmit={onSubmit}>
      <h2 className="h2">{copy.account.deleteTitle}</h2>
      <p className="account-section-body">{copy.account.deleteBody}</p>
      <label className="gl-field">
        <span className="gl-field-label">{copy.account.confirmLabel}</span>
        <span className="gl-input">
          <input name="confirm" autoComplete="off" value={phrase} onChange={(event) => onPhrase(event.target.value)} />
        </span>
      </label>
      <button
        className="gl-btn"
        type="submit"
        disabled={!canDeleteAccount(configured, signedIn, phrase) || pending}
      >
        {copy.account.deleteButton}
      </button>
    </form>
  );
}
