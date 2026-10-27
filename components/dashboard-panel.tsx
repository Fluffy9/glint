"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { copy } from "@/content";
import {
  addPasskey,
  base64ToBytes,
  bytesToBase64,
  createVault,
  decryptSample,
  encryptSample,
  hashCapability,
  importVaultFromRecovery,
  openWithPasskey,
  randomCapability,
  type VaultRecord,
} from "@/functions/src/domain/crypto";
import { functionUrl } from "@/functions/src/domain/emulator";
import { downloadBackup, redeemBackup, uploadBackup } from "@/functions/src/domain/backup-rest";
import { DashboardDevSlot } from "@/components/dashboard-dev-slot";
import { resolveBandSource } from "@/lib/band";
import { browserFetch, firebaseClient } from "@/lib/client-firebase";
import { readFixtureBandFlag } from "@/lib/fixture-band-flag";
import { createPasskey, unlockPasskey } from "@/lib/passkey";
import { readLocalVault, writeLocalVault, type LocalVault } from "@/lib/vault-db";
import { VAULT_FLAG_EVENT, readVaultFlag, writeVaultFlag } from "@/lib/vault-flag";
import { mergeRestoredVault } from "@/lib/vault-restore";
import { storeBandBytes } from "@/lib/vault-samples";

const isDev = process.env.NODE_ENV === "development";

type Step = "save" | "restore" | "add-passkey" | "open";

function subscribe(onStore: () => void) {
  window.addEventListener(VAULT_FLAG_EVENT, onStore);
  window.addEventListener("storage", onStore);
  return () => {
    window.removeEventListener(VAULT_FLAG_EVENT, onStore);
    window.removeEventListener("storage", onStore);
  };
}

function useVaultFlag(): boolean | null {
  return useSyncExternalStore(subscribe, () => readVaultFlag(localStorage), () => null);
}

async function sealHeader(vault: LocalVault, dataKey: CryptoKey) {
  const blob = await encryptSample(
    new TextEncoder().encode(JSON.stringify({ capability: vault.capability, record: vault.record })),
    dataKey,
  );
  return {
    nonce: blob.nonce,
    keyVersion: blob.keyVersion,
    ciphertextBase64: bytesToBase64(blob.ciphertext),
  };
}

export function DashboardPanel({
  backupPaymentUrl,
  bandServiceId,
}: {
  backupPaymentUrl: string | null;
  bandServiceId: string | null;
}) {
  const present = useVaultFlag();
  const sessionId = useSearchParams().get("session_id");
  const [step, setStep] = useState<Step | null>(null);
  const [vault, setVault] = useState<LocalVault | null>(null);
  const [dataKey, setDataKey] = useState<CryptoKey | null>(null);
  const [recoveryKey, setRecoveryKey] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [recoveryInput, setRecoveryInput] = useState("");
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [passkeyCount, setPasskeyCount] = useState<number | null>(null);
  const pushedHeader = useRef<string | null>(null);
  const waitingOnVault = present === true && passkeyCount === null && step === null;
  const screen =
    step ??
    (present === null || waitingOnVault
      ? "checking"
      : present
        ? passkeyCount && passkeyCount > 0
          ? "unlock"
          : "needs-recovery"
        : "create");

  useEffect(() => {
    if (present !== true) {
      setPasskeyCount(null);
      return;
    }
    let cancel = false;
    void readLocalVault().then((stored) => {
      if (cancel) return;
      setPasskeyCount(stored?.record.passkeys.length ?? 0);
    });
    return () => {
      cancel = true;
    };
  }, [present, step, vault]);

  useEffect(() => {
    if (screen !== "open" || !dataKey || !vault) return;
    const targets = firebaseClient;
    if (!targets) return;
    let cancel = false;
    const vaultId = vault.record.vaultId;
    void (async () => {
      try {
        if (sessionId && !vault.capability) {
          const capability = randomCapability();
          const result = await redeemBackup(browserFetch(), functionUrl(targets, "redeemBackup"), {
            sessionId,
            vaultId,
            capabilityHash: await hashCapability(capability),
          });
          if (cancel) return;
          const next = { ...vault, capability, paidUntil: result.paidUntil };
          await writeLocalVault(next);
          setVault(next);
          return;
        }
        if (!vault.capability) {
          try {
            const remote = await downloadBackup(browserFetch(), functionUrl(targets, "downloadBackup"), vaultId);
            const header = remote.objects.filter((item) => item.category === "header").at(-1);
            if (!header || cancel) return;
            const plain = await decryptSample(
              {
                ciphertext: base64ToBytes(header.ciphertextBase64),
                nonce: header.nonce,
                keyVersion: 1,
              },
              dataKey,
            );
            const parsed = JSON.parse(new TextDecoder().decode(plain)) as {
              capability?: string;
              record?: VaultRecord;
            };
            if (!parsed.capability || !parsed.record || cancel) return;
            const next = { ...vault, capability: parsed.capability, record: parsed.record };
            await writeLocalVault(next);
            setVault(next);
          } catch {
            return;
          }
          return;
        }
        if (pushedHeader.current === vault.capability) return;
        pushedHeader.current = vault.capability;
        const sealed = await sealHeader(vault, dataKey);
        await uploadBackup(browserFetch(), functionUrl(targets, "uploadBackup"), {
          vaultId,
          capability: vault.capability,
          objectId: `header-${Date.now()}`,
          category: "header",
          nonce: sealed.nonce,
          keyVersion: sealed.keyVersion,
          ciphertextBase64: sealed.ciphertextBase64,
        });
      } catch {
        if (!cancel) setError(copy.dashboard.backupFailed);
      }
    })();
    return () => {
      cancel = true;
    };
  }, [screen, sessionId, dataKey, vault]);

  async function onCreate() {
    setError(null);
    setPending(true);
    try {
      const material = await createPasskey();
      const created = await createVault(material);
      const next: LocalVault = { record: created.record, samples: [], capability: null, paidUntil: null };
      await writeLocalVault(next);
      setVault(next);
      setPasskeyCount(1);
      setDataKey(created.dataKey);
      setRecoveryKey(created.recoveryKey);
      setSaved(false);
      setStep("save");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : copy.dashboard.failed);
    } finally {
      setPending(false);
    }
  }

  function onConfirmSaved() {
    writeVaultFlag(localStorage, true);
    setRecoveryKey(null);
    setStep("open");
  }

  async function onUnlock() {
    setError(null);
    setPending(true);
    try {
      const stored = await readLocalVault();
      if (!stored || stored.record.passkeys.length === 0) throw new Error(copy.dashboard.noPasskey);
      const material = await unlockPasskey(stored.record.passkeys);
      const key = await openWithPasskey(stored.record, material.credentialId, material.prfOutput);
      setVault(stored);
      setPasskeyCount(stored.record.passkeys.length);
      setDataKey(key);
      setStep("open");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : copy.dashboard.failed);
    } finally {
      setPending(false);
    }
  }

  async function onRestore() {
    setError(null);
    setPending(true);
    try {
      const imported = await importVaultFromRecovery(recoveryInput.trim());
      const existing = await readLocalVault();
      const next = mergeRestoredVault(existing, imported);
      await writeLocalVault(next);
      writeVaultFlag(localStorage, true);
      setVault(next);
      setPasskeyCount(next.record.passkeys.length);
      setDataKey(imported.dataKey);
      setRecoveryInput("");
      setStep(next.record.passkeys.length > 0 ? "open" : "add-passkey");
    } catch {
      setError(copy.dashboard.failed);
    } finally {
      setPending(false);
    }
  }

  async function onAddPasskey() {
    if (!vault || !dataKey) return;
    setError(null);
    setPending(true);
    try {
      const material = await createPasskey();
      const record = await addPasskey(vault.record, dataKey, material);
      const next = { ...vault, record };
      await writeLocalVault(next);
      setVault(next);
      setPasskeyCount(next.record.passkeys.length);
      setStep("open");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : copy.dashboard.failed);
    } finally {
      setPending(false);
    }
  }

  async function onConnect() {
    if (!vault || !dataKey) return;
    setError(null);
    setPending(true);
    try {
      const source = resolveBandSource({
        serviceId: bandServiceId,
        useFixture: isDev && readFixtureBandFlag(localStorage),
      });
      await source.connect();
      const bytes = await source.read();
      const next = await storeBandBytes(vault, dataKey, bytes, new Date().toISOString());
      await writeLocalVault(next);
      setVault(next);
      setConnected(true);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : copy.dashboard.failed);
    } finally {
      setPending(false);
    }
  }

  function leaveRestore() {
    setError(null);
    setRecoveryInput("");
    setStep(null);
  }

  return (
    <div className="account-panel">
      {screen === "checking" ? (
        <div className="account-skeleton" role="status" aria-label={copy.dashboard.opening} />
      ) : null}

      {screen === "create" ? (
        <>
          <button className="gl-btn gl-btn-primary" type="button" disabled={pending} onClick={() => void onCreate()}>
            {copy.dashboard.create}
          </button>
          <p>
            <button type="button" className="account-text-link" onClick={() => setStep("restore")}>
              {copy.dashboard.haveRecovery}
            </button>
          </p>
        </>
      ) : null}

      {screen === "save" && recoveryKey ? (
        <>
          <p>{copy.dashboard.saveWarning}</p>
          <p className="dashboard-recovery-key paint-skip">{recoveryKey}</p>
          <button type="button" className="gl-btn" onClick={() => void navigator.clipboard.writeText(recoveryKey)}>
            {copy.dashboard.copy}
          </button>
          <label className="dashboard-check">
            <input type="checkbox" checked={saved} onChange={(event) => setSaved(event.target.checked)} />
            {copy.dashboard.saved}
          </label>
          <button className="gl-btn gl-btn-primary" type="button" disabled={!saved} onClick={onConfirmSaved}>
            {copy.dashboard.continue}
          </button>
        </>
      ) : null}

      {screen === "unlock" ? (
        <>
          <button className="gl-btn gl-btn-primary" type="button" disabled={pending} onClick={() => void onUnlock()}>
            {copy.dashboard.unlock}
          </button>
          <p>
            <button type="button" className="account-text-link" onClick={() => setStep("restore")}>
              {copy.dashboard.haveRecovery}
            </button>
          </p>
        </>
      ) : null}

      {screen === "needs-recovery" ? (
        <>
          <p>{copy.dashboard.noPasskey}</p>
          <button className="gl-btn gl-btn-primary" type="button" onClick={() => setStep("restore")}>
            {copy.dashboard.pasteRecovery}
          </button>
        </>
      ) : null}

      {screen === "restore" ? (
        <>
          <label className="gl-field">
            <span className="gl-field-label">{copy.dashboard.recoveryLabel}</span>
            <textarea
              className="dashboard-recovery-input"
              value={recoveryInput}
              rows={3}
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              onChange={(event) => setRecoveryInput(event.target.value)}
            />
          </label>
          <button
            className="gl-btn gl-btn-primary"
            type="button"
            disabled={pending || recoveryInput.trim() === ""}
            onClick={() => void onRestore()}
          >
            {copy.dashboard.continue}
          </button>
          <p>
            <button type="button" className="account-text-link" onClick={leaveRestore}>
              {copy.dashboard.recoveryBack}
            </button>
          </p>
        </>
      ) : null}

      {screen === "add-passkey" ? (
        <>
          <button className="gl-btn gl-btn-primary" type="button" disabled={pending} onClick={() => void onAddPasskey()}>
            {copy.dashboard.addPasskey}
          </button>
          <p>
            <button type="button" className="account-text-link" onClick={() => setStep("open")}>
              {copy.dashboard.skip}
            </button>
          </p>
        </>
      ) : null}

      {screen === "open" && vault ? (
        <>
          <button
            className="gl-btn gl-btn-primary"
            type="button"
            disabled={pending || connected}
            onClick={() => void onConnect()}
          >
            {connected ? copy.dashboard.connected : copy.dashboard.connect}
          </button>
          {vault.samples.length > 0 ? (
            <ul className="dashboard-samples">
              {vault.samples.map((sample) => (
                <li key={sample.id}>
                  {copy.dashboard.sample} {sample.recordedAt}
                </li>
              ))}
            </ul>
          ) : null}
          <section className="dashboard-backup">
            <h2 className="account-section-title">{copy.dashboard.backup}</h2>
            {vault.paidUntil ? (
              <p>
                {copy.dashboard.paidThrough} {vault.paidUntil.slice(0, 10)}
              </p>
            ) : backupPaymentUrl ? (
              <a className="gl-btn" href={backupPaymentUrl}>
                {copy.dashboard.pay}
              </a>
            ) : (
              <p>{copy.dashboard.payOff}</p>
            )}
          </section>
          <p>
            <button type="button" className="account-text-link" disabled={pending} onClick={() => void onAddPasskey()}>
              {copy.dashboard.addPasskey}
            </button>
          </p>
          <p>
            <button
              type="button"
              className="account-text-link"
              onClick={() => {
                setDataKey(null);
                setConnected(false);
                setStep(null);
              }}
            >
              {copy.dashboard.lock}
            </button>
          </p>
        </>
      ) : null}

      {error && screen !== "checking" ? <p className="account-notice-error">{error}</p> : null}

      {isDev ? (
        <DashboardDevSlot
          open={screen === "open" && Boolean(vault && dataKey)}
          vault={vault}
          dataKey={dataKey}
          onVault={(next, key) => {
            setVault(next);
            setDataKey(key);
            setPasskeyCount(next?.record.passkeys.length ?? 0);
            setConnected(false);
            if (next && key) setStep("open");
            else setStep(null);
          }}
          onNote={setError}
        />
      ) : null}
    </div>
  );
}
