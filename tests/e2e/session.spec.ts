import { expect, test, type Page } from "@playwright/test";
import type { PaintStory } from "../paint/screen";
import { expectPaint, installPaintRecorder, paintFrames } from "./paint";

const session = {
  idToken: "tok",
  localId: "uid_1",
  email: "buyer@example.com",
};

const signedOut: PaintStory = { only: ["checking", "out"], settle: "out" };
const signedIn: PaintStory = { only: ["checking", "in"], settle: "in" };

function header(page: Page) {
  return page.locator("header.site-nav");
}

test.beforeEach(async ({ page }) => {
  await installPaintRecorder(page);
});

test("shows only the sign-in form while signed out", async ({ page }) => {
  await page.goto("/login");
  await expectPaint(page, signedOut);
  await expect(page).toHaveURL(/\/login\/?$/);

  await page.goto("/account");
  await expectPaint(page, signedOut);
  await expect(page).toHaveURL(/\/login\/?$/);
});

test("shows account tools while signed in and keeps them off the sign-in page", async ({ page }) => {
  await page.addInitScript((value) => {
    window.localStorage.setItem("glint-session", value);
  }, JSON.stringify(session));

  await page.goto("/account");
  await expectPaint(page, signedIn);
  await expect(page).toHaveURL(/\/account\/?$/);

  await page.goto("/login");
  await expectPaint(page, signedIn);
  await expect(page).toHaveURL(/\/account\/?$/);
});

test("keeps the signed-out screen off while an email link signs you in", async ({ page }) => {
  let releaseSignIn = () => {};
  const released = new Promise<void>((resolve) => {
    releaseSignIn = resolve;
  });
  await page.route(/accounts:signInWithEmailLink/, async (route) => {
    await released;
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ idToken: "tok", localId: "uid_1", email: "buyer@example.com" }),
    });
  });
  await page.route(/claimEntitlement/, async (route) => {
    await route.fulfill({ status: 200, contentType: "application/json", body: "{}" });
  });
  await page.addInitScript(() => {
    window.localStorage.setItem("glint-email", "buyer@example.com");
  });

  const request = page.waitForRequest((req) => req.url().includes("signInWithEmailLink"));
  await page.goto("/account?mode=signIn&oobCode=oob_1");
  await request;
  await expectPaint(page, { only: ["checking"], settle: "checking" });

  releaseSignIn();
  await expectPaint(page, signedIn);
  await expect(page).toHaveURL(/\/account\/?$/);
});

test("sign out leaves the account page and a later sign-in starts signed out", async ({ page }) => {
  await page.addInitScript((value) => {
    if (window.localStorage.getItem("glint-session-seeded")) return;
    window.localStorage.setItem("glint-session", value);
    window.localStorage.setItem("glint-session-seeded", "1");
  }, JSON.stringify(session));

  await page.goto("/account");
  await expectPaint(page, signedIn);

  const from = (await paintFrames(page)).length;
  await header(page).getByRole("button", { name: "Sign out" }).click();
  await expectPaint(page, { ...signedOut, from });
  await expect(page).toHaveURL(/\/login\/?$/);

  await page.goto("/account");
  await expectPaint(page, signedOut);
  await expect(page).toHaveURL(/\/login\/?$/);

  const form = page.locator("main:visible");
  await expect(form.getByRole("button", { name: "Email me a sign-in link" })).toBeDisabled();
  await form.getByLabel("Email").fill("buyer@example.com");
  await expect(form.getByRole("button", { name: "Email me a sign-in link" })).toBeEnabled();
  await expectPaint(page, signedOut);
});
