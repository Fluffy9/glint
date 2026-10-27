"use client";

import { useState } from "react";
import {
  base64ToBytes,
  bytesToBase64,
  decryptSample,
  encryptSample,
  hashCapability,
  randomCapability,
} from "@/functions/src/domain/crypto";
import { functionUrl } from "@/functions/src/domain/emulator";
import { downloadBackup, redeemBackup, uploadBackup } from "@/functions/src/domain/backup-rest";
import { FIXTURE_BAND_BYTES, FIXTURE_BAND_PLAINTEXT } from "@/lib/band";
import { browserFetch, firebaseClient } from "@/lib/client-firebase";
import { mintDevVault } from "@/lib/dashboard-dev";
import { readFixtureBandFlag, writeFixtureBandFlag } from "@/lib/fixture-band-flag";
import { clearLocalVault, readLocalVault, writeLocalVault, type LocalVault } from "@/lib/vault-db";
import { writeVaultFlag } from "@/lib/vault-flag";
import { storeBandBytes } from "@/lib/vault-samples";

type Props = {
  open: boolean;
  vault: LocalVault | null;
  dataKey: CryptoKey | null;
  onVault: (vault: LocalVault | null, dataKey: CryptoKey | null) => void;
  onNote: (message: string | null) => void;
};

export function DashboardDev({ open, vault, dataKey, onVault, onNote }: Props) {
  const [openPanel, setOpenPanel] = useState(true);
  const [sessionId, setSessionId] = useState("");
  const [busy, setBusy] = useState(false);
  const [log, setLog] = useState<string>("");
  const [useFixtureBand, setUseFixtureBand] = useState(() =>
    typeof window === "undefined" ? true : readFixtureBandFlag(localStorage),
  );

  function note(message: string) {
    setLog(message);
    onNote(null);
  }

  async function mint() {
    setBusy(true);
    try {
      const created = await mintDevVault();
      const next: LocalVault = {
        record: created.record,
        samples: [],
        capability: null,
        paidUntil: null,
      };
      await writeLocalVault(next);
      writeVaultFlag(localStorage, true);
      onVault(next, created.dataKey);
      note(`Minted test vault. Recovery key:\n${created.recoveryKey}`);
    } catch (caught) {
      note(caught instanceof Error ? caught.message : "mint failed");
    } finally {
      setBusy(false);
    }
  }

  async function injectSample() {
    if (!vault || !dataKey) {
      note("Open the vault first.");
      return;
    }
    setBusy(true);
    try {
      const next = await storeBandBytes(vault, dataKey, FIXTURE_BAND_BYTES, new Date().toISOString());
      await writeLocalVault(next);
      onVault(next, dataKey);
      note(`Stored encrypted fixture sample (${FIXTURE_BAND_PLAINTEXT}).`);
    } catch (caught) {
      note(caught instanceof Error ? caught.message : "inject failed");
    } finally {
      setBusy(false);
    }
  }

  async function readLatest() {
    if (!vault || !dataKey || vault.samples.length === 0) {
      note("No encrypted samples to open.");
      return;
    }
    setBusy(true);
    try {
      const sample = vault.samples[vault.samples.length - 1]!;
      const plain = await decryptSample(
        {
          ciphertext: base64ToBytes(sample.ciphertext),
          nonce: sample.nonce,
          keyVersion: 1,
        },
        dataKey,
      );
      note(`Latest sample plaintext: ${new TextDecoder().decode(plain)}`);
    } catch (caught) {
      note(caught instanceof Error ? caught.message : "decrypt failed");
    } finally {
      setBusy(false);
    }
  }

  async function redeem() {
    if (!vault || !dataKey) {
      note("Open the vault first.");
      return;
    }
    const targets = firebaseClient;
    if (!targets) {
      note("Firebase targets are not configured.");
      return;
    }
    const id = sessionId.trim();
    if (!id) {
      note("Paste a Checkout session id (cs_…).");
      return;
    }
    setBusy(true);
    try {
      const capability = randomCapability();
      const result = await redeemBackup(browserFetch(), functionUrl(targets, "redeemBackup"), {
        sessionId: id,
        vaultId: vault.record.vaultId,
        capabilityHash: await hashCapability(capability),
      });
      const next = { ...vault, capability, paidUntil: result.paidUntil };
      await writeLocalVault(next);
      onVault(next, dataKey);
      note(`Redeemed. Paid through ${result.paidUntil.slice(0, 10)}.`);
    } catch (caught) {
      note(caught instanceof Error ? caught.message : "redeem failed");
    } finally {
      setBusy(false);
    }
  }

  async function syncHeader() {
    if (!vault || !dataKey || !vault.capability) {
      note("Need an open vault with a capability.");
      return;
    }
    const targets = firebaseClient;
    if (!targets) {
      note("Firebase targets are not configured.");
      return;
    }
    setBusy(true);
    try {
      const blob = await encryptSample(
        new TextEncoder().encode(JSON.stringify({ capability: vault.capability, record: vault.record })),
        dataKey,
      );
      await uploadBackup(browserFetch(), functionUrl(targets, "uploadBackup"), {
        vaultId: vault.record.vaultId,
        capability: vault.capability,
        objectId: `header-dev-${Date.now()}`,
        category: "header",
        nonce: blob.nonce,
        keyVersion: blob.keyVersion,
        ciphertextBase64: bytesToBase64(blob.ciphertext),
      });
      note("Uploaded encrypted vault header.");
    } catch (caught) {
      note(caught instanceof Error ? caught.message : "upload failed");
    } finally {
      setBusy(false);
    }
  }

  async function pullShelf() {
    if (!vault || !dataKey) {
      note("Open the vault first.");
      return;
    }
    const targets = firebaseClient;
    if (!targets) {
      note("Firebase targets are not configured.");
      return;
    }
    setBusy(true);
    try {
      const remote = await downloadBackup(
        browserFetch(),
        functionUrl(targets, "downloadBackup"),
        vault.record.vaultId,
      );
      note(`Shelf objects: ${remote.objects.length}\n${remote.objects.map((item) => item.category).join(", ") || "(none)"}`);
    } catch (caught) {
      note(caught instanceof Error ? caught.message : "download failed");
    } finally {
      setBusy(false);
    }
  }

  async function wipe() {
    setBusy(true);
    try {
      await clearLocalVault();
      writeVaultFlag(localStorage, false);
      onVault(null, null);
      note("Cleared IndexedDB vault and localStorage flag.");
    } catch (caught) {
      note(caught instanceof Error ? caught.message : "wipe failed");
    } finally {
      setBusy(false);
    }
  }

  async function refreshStatus() {
    const stored = await readLocalVault();
    const flag = localStorage.getItem("glint-vault") === "1";
    note(
      [
        `flag=${flag}`,
        `open=${open}`,
        `vaultId=${stored?.record.vaultId ?? "none"}`,
        `passkeys=${stored?.record.passkeys.length ?? 0}`,
        `samples=${stored?.samples.length ?? 0}`,
        `capability=${stored?.capability ? "yes" : "no"}`,
        `paidUntil=${stored?.paidUntil ?? "none"}`,
        `fixtureBand=${useFixtureBand}`,
      ].join("\n"),
    );
  }

  return (
    <section className="dashboard-dev paint-skip" data-dev-chrome aria-label="Dashboard dev tools">
      <button
        type="button"
        className="dashboard-dev-toggle"
        aria-pressed={openPanel}
        onClick={() => setOpenPanel((value) => !value)}
      >
        Dev tools
      </button>
      {openPanel ? (
        <div className="dashboard-dev-body">
          <p className="dashboard-dev-hint">
            Local only. Fixture band skips Web Bluetooth. Mint skips the real passkey prompt.
          </p>
          <div className="dashboard-dev-row">
            <label className="dashboard-check">
              <input
                type="checkbox"
                checked={useFixtureBand}
                onChange={(event) => {
                  writeFixtureBandFlag(localStorage, event.target.checked);
                  setUseFixtureBand(event.target.checked);
                }}
              />
              Fixture band
            </label>
          </div>
          <div className="dashboard-dev-actions">
            <button type="button" className="gl-btn" disabled={busy} onClick={() => void mint()}>
              Mint test vault
            </button>
            <button type="button" className="gl-btn" disabled={busy || !open} onClick={() => void injectSample()}>
              Inject fixture sample
            </button>
            <button type="button" className="gl-btn" disabled={busy || !open} onClick={() => void readLatest()}>
              Decrypt latest sample
            </button>
            <button type="button" className="gl-btn" disabled={busy} onClick={() => void refreshStatus()}>
              Status
            </button>
            <button type="button" className="gl-btn" disabled={busy} onClick={() => void wipe()}>
              Wipe local vault
            </button>
          </div>
          <label className="gl-field">
            <span className="gl-field-label">Checkout session id</span>
            <input
              className="dashboard-recovery-input"
              value={sessionId}
              autoComplete="off"
              spellCheck={false}
              placeholder="cs_…"
              onChange={(event) => setSessionId(event.target.value)}
            />
          </label>
          <div className="dashboard-dev-actions">
            <button type="button" className="gl-btn" disabled={busy || !open} onClick={() => void redeem()}>
              Redeem backup
            </button>
            <button type="button" className="gl-btn" disabled={busy || !open} onClick={() => void syncHeader()}>
              Upload vault header
            </button>
            <button type="button" className="gl-btn" disabled={busy || !open} onClick={() => void pullShelf()}>
              List shelf
            </button>
          </div>
          {log ? <pre className="dashboard-dev-log">{log}</pre> : null}
        </div>
      ) : null}
    </section>
  );
}
