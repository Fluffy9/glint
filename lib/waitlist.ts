import { waitlistEmail } from "@/functions/src/domain/waitlist";
import { functionUrl } from "@/functions/src/domain/emulator";
import { browserFetch, firebaseClient } from "@/lib/client-firebase";

export type WaitlistResult = "ok" | "invalid" | "unavailable" | "failed";

export async function joinWaitlist(raw: string): Promise<WaitlistResult> {
  const email = waitlistEmail(raw);
  if (!email) return "invalid";
  const targets = firebaseClient;
  if (!targets) return "unavailable";

  try {
    const response = await browserFetch()(functionUrl(targets, "joinWaitlist"), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) return response.status === 400 ? "invalid" : "failed";
    return "ok";
  } catch {
    return "failed";
  }
}
