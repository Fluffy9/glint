"use client";

import dynamic from "next/dynamic";
import type { LocalVault } from "@/lib/vault-db";

const DashboardDev =
  process.env.NODE_ENV === "development"
    ? dynamic(() => import("@/components/dashboard-dev").then((mod) => mod.DashboardDev), {
        ssr: false,
      })
    : null;

type Props = {
  open: boolean;
  vault: LocalVault | null;
  dataKey: CryptoKey | null;
  onVault: (vault: LocalVault | null, dataKey: CryptoKey | null) => void;
  onNote: (message: string | null) => void;
};

/** Loads dashboard vault test tools only in development builds. */
export function DashboardDevSlot(props: Props) {
  if (!DashboardDev) return null;
  return <DashboardDev {...props} />;
}
