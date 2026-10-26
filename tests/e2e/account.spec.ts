import { expect, test } from "@playwright/test";
import { appReady } from "./ready";

test("uses the local emulators and keeps delete off the sign-in screen", async ({ page }) => {
  await page.goto("/account");
  await appReady(page);

  await expect(page.getByRole("heading", { name: "Account", level: 1 })).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByText("talking to the local emulators")).toBeVisible();
  await expect(page.getByRole("button", { name: "Email me a sign-in link" })).toBeDisabled();
  await page.getByLabel("Email").fill("buyer@example.com");
  await expect(page.getByRole("button", { name: "Email me a sign-in link" })).toBeEnabled();
  await expect(page.getByRole("heading", { name: "Delete account" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Delete account" })).toHaveCount(0);
  await expect(page.getByRole("navigation", { name: "Site" }).getByRole("link", { name: "Sign in" })).toHaveAttribute(
    "href",
    "/account",
  );
});
