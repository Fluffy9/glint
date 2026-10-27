"use client";

import { copy } from "@/content";
import { useAccountChrome } from "@/lib/use-account-chrome";

export function AccountIntro() {
  const chrome = useAccountChrome();
  if (chrome === "checking") return null;
  if (chrome === "in") {
    return (
      <>
        <h1 className="h1">{copy.account.title}</h1>
        <p className="account-lede">{copy.account.description}</p>
      </>
    );
  }
  return (
    <>
      <h1 className="h1">{copy.login.title}</h1>
      <p className="account-lede">{copy.login.body}</p>
    </>
  );
}
