import { expect, test } from "@playwright/test";
import { expectPaint, installPaintRecorder } from "./paint";

test("opens on create when this browser has no vault", async ({ page }) => {
  await installPaintRecorder(page);
  await page.goto("/dashboard");
  await expectPaint(page, { only: ["checking", "create"], settle: "create" });
  await expect(page.locator("header a.site-signin")).toHaveText("Dashboard");
  await expect(page.getByRole("button", { name: "Create a passkey" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Unlock" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Sign in" })).toHaveCount(0);
});

test("opens on unlock when this browser already has a vault", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("glint-vault", "1"));
  await installPaintRecorder(page);
  await page.goto("/dashboard");
  await expectPaint(page, { only: ["checking", "unlock"], settle: "unlock" });
  await expect(page.getByRole("button", { name: "Unlock" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Create a passkey" })).toHaveCount(0);
});
