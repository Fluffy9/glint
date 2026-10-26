"use client";

import { useEffect, useState } from "react";
import { ManageBilling } from "@/components/manage-billing";

export function CheckoutSession() {
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    setSessionId(new URLSearchParams(window.location.search).get("session_id"));
  }, []);

  if (!sessionId) return null;
  return <ManageBilling sessionId={sessionId} />;
}
