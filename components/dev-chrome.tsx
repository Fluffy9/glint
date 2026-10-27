"use client";

import { useState } from "react";
import { capturePagePng, downloadDataUrl } from "@/lib/capture-page";

const isDev = process.env.NODE_ENV === "development";

/** Floating local-only tools available on every page. */
export function DevChrome() {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!isDev) return null;

  async function onScreenshot() {
    setBusy(true);
    setMessage(null);
    try {
      const { dataUrl, filename } = await capturePagePng();
      downloadDataUrl(dataUrl, filename);
      setMessage(filename);
    } catch (caught) {
      setMessage(caught instanceof Error ? caught.message : "screenshot failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="dev-chrome" data-dev-chrome>
      {message ? <p className="dev-chrome-note">{message}</p> : null}
      <button type="button" className="dev-chrome-btn" disabled={busy} onClick={() => void onScreenshot()}>
        {busy ? "Capturing…" : "Screenshot"}
      </button>
    </div>
  );
}
