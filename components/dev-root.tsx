"use client";

import dynamic from "next/dynamic";

const DevChrome =
  process.env.NODE_ENV === "development"
    ? dynamic(() => import("@/components/dev-chrome").then((mod) => mod.DevChrome), {
        ssr: false,
      })
    : null;

/** Mounts local-only chrome. The dynamic import is dropped from production builds. */
export function DevRoot() {
  if (!DevChrome) return null;
  return <DevChrome />;
}
