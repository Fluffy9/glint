"use client";

import { copy } from "@/content";
import { readVaultFlag } from "@/lib/vault-flag";
import { useSyncExternalStore } from "react";
import { VAULT_FLAG_EVENT } from "@/lib/vault-flag";

function subscribe(onStore: () => void) {
  window.addEventListener(VAULT_FLAG_EVENT, onStore);
  window.addEventListener("storage", onStore);
  return () => {
    window.removeEventListener(VAULT_FLAG_EVENT, onStore);
    window.removeEventListener("storage", onStore);
  };
}

export function DashboardIntro() {
  const present = useSyncExternalStore(subscribe, () => readVaultFlag(localStorage), () => null);
  if (present === null) return null;
  return (
    <>
      <h1 className="h1">{copy.dashboard.title}</h1>
      <p className="account-lede">{copy.dashboard.lede}</p>
    </>
  );
}
