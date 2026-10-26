"use client";

import { useState, type FormEvent } from "react";
import { formatUsd } from "@/lib/money";

export function BuyForm({
  enabled,
  backupCents,
}: {
  enabled: boolean;
  backupCents: number;
}) {
  const [backup, setBackup] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!enabled) return;
    setPending(true);
    setError(null);
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ backup }),
    });
    const data = (await response.json().catch(() => null)) as { url?: string } | null;
    if (!response.ok || !data?.url) {
      setError("Checkout is unavailable.");
      setPending(false);
      return;
    }
    window.location.assign(data.url);
  }

  return (
    <form className="buy-form" onSubmit={submit}>
      <label className="gl-check">
        <input
          type="checkbox"
          checked={backup}
          disabled={!enabled || pending}
          onChange={(event) => setBackup(event.target.checked)}
        />
        <span>Add backup, {formatUsd(backupCents)} usd a year</span>
      </label>
      <button className="gl-btn gl-btn-primary" type="submit" disabled={!enabled || pending}>
        [ Get the band ]
      </button>
      {enabled ? null : (
        <p className="fine">Checkout is off until payments are configured.</p>
      )}
      {error ? <p className="fine">{error}</p> : null}
    </form>
  );
}
