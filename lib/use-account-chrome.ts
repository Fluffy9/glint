"use client";

import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import {
  accountChrome,
  accountSessionSnapshot,
  serverAccountChrome,
  serverAccountSession,
  subscribeAccountChrome,
} from "@/lib/account-session";

export function useAccountChrome() {
  const pathname = usePathname();
  return useSyncExternalStore(subscribeAccountChrome, () => accountChrome(pathname), serverAccountChrome);
}

export function useAccountSession() {
  return useSyncExternalStore(subscribeAccountChrome, accountSessionSnapshot, serverAccountSession);
}
