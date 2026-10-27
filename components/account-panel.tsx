"use client";

import { useEffect, useState, type FormEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import { copy } from "@/content";
import {
  AccountSkeleton,
  AccountStatus,
  BackupBlob,
  DeleteAccountForm,
  SignInForm,
  TestBackupForm,
} from "@/components/account/views";
import { latestEmulatorSignInLink, sendEmailLink, callAuthedFunction } from "@/functions/src/domain/auth-rest";
import { emulatorAuthOrigin, functionUrl } from "@/functions/src/domain/emulator";
import { canDeleteAccount, canSendSignIn } from "@/functions/src/domain/state";
import {
  ACCOUNT_SESSION_EVENT,
  clearAccountSession,
  noteEmailSignInSettled,
  readAccountSession,
  readStoredEmail,
  writeStoredEmail,
  type AccountSession,
} from "@/lib/account-session";
import { browserFetch, firebaseClient } from "@/lib/client-firebase";
import { completeEmailSignIn } from "@/lib/complete-email-sign-in";
import { useAccountChrome, useAccountSession } from "@/lib/use-account-chrome";
import { saveTestBackup, unlockTestBackup, type StoredTestBackup } from "@/lib/test-backup";

const targets = firebaseClient;

function stripSignInParams() {
  const url = new URL(window.location.href);
  if (!url.searchParams.has("oobCode") && !url.searchParams.has("mode") && !url.searchParams.has("apiKey")) return;
  url.search = "";
  window.history.replaceState({}, "", `${url.pathname}${url.hash}`);
}

function restingNote(): string | null {
  if (!targets) return copy.account.notConfigured;
  return targets.emulators ? copy.account.emulatorNote : null;
}

function hasOobCode(): boolean {
  return Boolean(new URLSearchParams(window.location.search).get("oobCode"));
}

export function AccountPanel() {
  const router = useRouter();
  const pathname = usePathname();
  const chrome = useAccountChrome();
  const liveSession = useAccountSession();
  const configured = targets !== null;
  const [email, setEmail] = useState("");
  const [phrase, setPhrase] = useState("");
  const [passphrase, setPassphrase] = useState("");
  const [unlockPhrase, setUnlockPhrase] = useState("");
  const [signInLink, setSignInLink] = useState<string | null>(null);
  const [session, setSession] = useState<AccountSession | null>(null);
  const active = session ?? liveSession;
  const [ready, setReady] = useState(false);
  const [storedBackup, setStoredBackup] = useState<StoredTestBackup | null>(null);
  const [unlockedText, setUnlockedText] = useState<string | null>(null);
  const [showTestForm, setShowTestForm] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function resetSignedOutUi() {
    setSession(null);
    setStoredBackup(null);
    setUnlockedText(null);
    setShowTestForm(true);
    setPhrase("");
    setPassphrase("");
    setUnlockPhrase("");
    setSignInLink(null);
    setError(null);
    setInfo(restingNote());
  }

  useEffect(() => {
    const savedEmail = readStoredEmail();
    if (savedEmail) setEmail(savedEmail);

    const existing = readAccountSession();
    if (existing) {
      setSession(existing);
      stripSignInParams();
      setInfo(restingNote());
      setReady(true);
      return;
    }

    resetSignedOutUi();

    const oobCode = new URLSearchParams(window.location.search).get("oobCode");
    if (!targets || !oobCode || !savedEmail) {
      if (oobCode && savedEmail) noteEmailSignInSettled(oobCode);
      setReady(true);
      return;
    }

    let cancelled = false;
    void completeEmailSignIn({
      fetch: browserFetch(),
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
        setInfo(restingNote());
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
      })
      .finally(() => {
        noteEmailSignInSettled(oobCode);
      });

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  useEffect(() => {
    const sync = () => {
      const existing = readAccountSession();
      if (!existing) {
        resetSignedOutUi();
        setReady(true);
        return;
      }
      setSession(existing);
      setReady(true);
    };
    window.addEventListener(ACCOUNT_SESSION_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(ACCOUNT_SESSION_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  useEffect(() => {
    if (chrome === "checking") return;
    if (chrome === "in" && pathname === "/login") {
      router.replace("/account");
      return;
    }
    if (chrome === "out" && pathname === "/account" && !hasOobCode()) {
      router.replace("/login");
    }
  }, [chrome, pathname, router]);

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!targets || !canSendSignIn(configured, email) || pending) return;
    setPending(true);
    setError(null);
    setSignInLink(null);
    try {
      const sent = await sendEmailLink(
        browserFetch(),
        targets.apiKey,
        email.trim(),
        `${window.location.origin}/account`,
        targets.authBase,
        targets.projectId,
      );
      writeStoredEmail(email.trim());
      const oobLink =
        sent.oobLink ??
        (targets.emulators
          ? await latestEmulatorSignInLink(
              browserFetch(),
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
    if (!targets || !active || passphrase.length < 8 || pending) return;
    setPending(true);
    setError(null);
    try {
      setStoredBackup(await saveTestBackup(targets, active, passphrase));
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

  async function unlock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!targets || !active || !storedBackup || unlockPhrase.length < 8 || pending) return;
    setPending(true);
    setError(null);
    try {
      setUnlockedText(await unlockTestBackup(targets, active, storedBackup, unlockPhrase));
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
    if (!targets || !active || !canDeleteAccount(configured, true, phrase) || pending) return;
    setPending(true);
    setError(null);
    try {
      await callAuthedFunction(browserFetch(), functionUrl(targets, "deleteAccount"), active.idToken);
      clearAccountSession();
      resetSignedOutUi();
      setInfo(copy.account.deleted);
      router.replace("/login");
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
      {chrome === "checking" || (chrome === "in" && !active) ? (
        <AccountSkeleton />
      ) : active && chrome === "in" ? (
        <>
          <AccountStatus email={active.email} saved={storedBackup !== null} unlocked={unlocked} label={backupStatus} />
          {targets?.emulators && storedBackup ? (
            <BackupBlob
              stored={storedBackup}
              unlockedText={unlockedText}
              unlockPhrase={unlockPhrase}
              pending={pending}
              onUnlockPhrase={setUnlockPhrase}
              onUnlock={unlock}
            />
          ) : null}
          {targets?.emulators && showTestForm ? (
            <TestBackupForm
              passphrase={passphrase}
              pending={pending}
              onPassphrase={setPassphrase}
              onSubmit={saveBackup}
            />
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
          <DeleteAccountForm
            phrase={phrase}
            pending={pending}
            signedIn
            configured={configured}
            onPhrase={setPhrase}
            onSubmit={remove}
          />
        </>
      ) : (
        <SignInForm
          email={email}
          pending={pending}
          configured={configured}
          signInLink={signInLink}
          onEmail={setEmail}
          onSubmit={send}
        />
      )}
      {chrome !== "checking" && error ? <p className="account-notice-error">{error}</p> : null}
      {chrome !== "checking" && !error && (info ?? restingNote()) ? (
        <p className="fine">{info ?? restingNote()}</p>
      ) : null}
    </div>
  );
}
