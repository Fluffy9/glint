import { expect, test } from "@playwright/test";
import { expectPaint, installPaintRecorder } from "./paint";

test("keeps the local sign-in form closed until an email is entered", async ({ page }) => {
  await installPaintRecorder(page);
  await page.goto("/login");
  await expectPaint(page, { only: ["checking", "out"], settle: "out" });

  await expect(page.getByText("talking to the local emulators")).toBeVisible();
  await expect(page.getByRole("button", { name: "Email me a sign-in link" })).toBeDisabled();
  await page.getByLabel("Email").fill("not-an-email");
  await expect(page.getByRole("button", { name: "Email me a sign-in link" })).toBeDisabled();
  await page.getByLabel("Email").fill("buyer@example.com");
  await expect(page.getByRole("button", { name: "Email me a sign-in link" })).toBeEnabled();
});
