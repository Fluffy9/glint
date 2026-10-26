"use client";

import { useState } from "react";

export function ManageBilling({ sessionId }: { sessionId: string }) {
  const [error, setError] = useState<string | null>(null);

  async function openPortal() {
    setError(null);
    const response = await fetch("/api/portal", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ sessionId }),
    });
    const data = (await response.json().catch(() => null)) as { url?: string } | null;
    if (!response.ok || !data?.url) {
      setError("Billing portal is unavailable.");
      return;
    }
    window.location.assign(data.url);
  }

  return (
    <div className="buy-form">
      <button className="gl-btn" type="button" onClick={openPortal}>
        Manage backup
      </button>
      {error ? <p className="fine">{error}</p> : null}
    </div>
  );
}
