"use client";

import { useState, type FormEvent } from "react";
import { copy } from "@/content";
import { joinWaitlist, type WaitlistResult } from "@/lib/waitlist";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "busy" | WaitlistResult>("idle");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "busy" || status === "ok") return;
    setStatus("busy");
    const result = await joinWaitlist(email);
    setStatus(result);
  }

  if (status === "ok") {
    return <p className="newsletter-status" role="status">{copy.newsletter.success}</p>;
  }

  const message =
    status === "invalid"
      ? copy.newsletter.invalid
      : status === "unavailable"
        ? copy.newsletter.unavailable
        : status === "failed"
          ? copy.newsletter.error
          : null;

  return (
    <form className="newsletter-form" onSubmit={onSubmit} noValidate>
      <label className="newsletter-label" htmlFor="newsletter-email">
        {copy.newsletter.emailLabel}
      </label>
      <div className="newsletter-row">
        <input
          id="newsletter-email"
          className="newsletter-input"
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          placeholder={copy.newsletter.placeholder}
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (status !== "idle" && status !== "busy") setStatus("idle");
          }}
          disabled={status === "busy"}
          required
        />
        <button className="gl-btn gl-btn-primary" type="submit" disabled={status === "busy"}>
          {copy.newsletter.submit}
        </button>
      </div>
      {message ? (
        <p className="newsletter-status is-error" role="alert">
          {message}
        </p>
      ) : (
        <p className="newsletter-note">{copy.newsletter.privacy}</p>
      )}
    </form>
  );
}
