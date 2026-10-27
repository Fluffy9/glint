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

test("asks for the recovery key when a vault exists without a passkey", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("glint-vault", "1"));
  await installPaintRecorder(page);
  await page.goto("/dashboard");
  await expectPaint(page, { only: ["checking", "needs-recovery"], settle: "needs-recovery" });
  await expect(page.getByRole("button", { name: "Paste recovery key" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Unlock" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Create a passkey" })).toHaveCount(0);
});

test("opens on unlock when this browser has a passkey wrap", async ({ page }) => {
  await page.goto("/dashboard");
  await page.evaluate(async () => {
    localStorage.setItem("glint-vault", "1");
    await new Promise<void>((resolve, reject) => {
      const request = indexedDB.open("glint", 1);
      request.onerror = () => reject(request.error);
      request.onupgradeneeded = () => {
        if (!request.result.objectStoreNames.contains("vault")) {
          request.result.createObjectStore("vault");
        }
      };
      request.onsuccess = () => {
        const db = request.result;
        const tx = db.transaction("vault", "readwrite");
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
        tx.objectStore("vault").put(
          {
            record: {
              vaultId: "vault-test",
              recoveryWrappedDataKey: "wrap",
              passkeys: [{ credentialId: "cred-1", salt: "cw==", wrappedDataKey: "wrap" }],
            },
            samples: [],
            capability: null,
            paidUntil: null,
          },
          "local",
        );
      };
    });
  });
  await installPaintRecorder(page);
  await page.reload();
  await expectPaint(page, { only: ["checking", "unlock"], settle: "unlock" });
  await expect(page.getByRole("button", { name: "Unlock" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Create a passkey" })).toHaveCount(0);
});
