import { expect, test } from "@playwright/test";
import { appReady } from "./ready";

const questions = [
  ["How much does Glint cost?", "$69.99 once"],
  ["Is there a subscription?", "Optional encrypted backup is $10 a year"],
  ["Why is there no screen?", "So your wrist stays quiet"],
  ["What does local first mean?", "stored on your phone"],
  ["Where does my data live?", "ciphertext only"],
  ["What if I forget my password?", "the backup stays locked"],
  ["What happens to my backup if I stop paying?", "30 days"],
  ["Do you sell my data?", "We also cannot read your backup"],
  ["Can I export or delete my data?", "CSV or JSON"],
] as const;

test("shows the FAQ and opens an answer on the homepage", async ({ page }) => {
  await page.goto("/");
  await appReady(page);

  const section = page.locator("section:visible", {
    has: page.getByRole("heading", { name: "Questions" }),
  });
  await expect(section).toBeVisible();
  await expect(section.locator("details.faq-item:visible")).toHaveCount(questions.length);

  for (const [question] of questions) {
    await expect(section.locator("summary.faq-question:visible", { hasText: question })).toBeVisible();
  }

  const price = section.locator("details.faq-item:visible", {
    has: page.locator("summary.faq-question", { hasText: "How much does Glint cost?" }),
  });
  await expect(price).not.toHaveAttribute("open");
  await price.locator("summary.faq-question").click();
  await expect(price).toHaveAttribute("open", "");
  await expect(price).toContainText("$69.99 once");
  await expect(price.getByRole("link", { name: "See pricing" })).toHaveAttribute("href", "/pricing");

  for (const [question, snippet] of questions.slice(1)) {
    const item = section.locator("details.faq-item:visible", {
      has: page.locator("summary.faq-question", { hasText: question }),
    });
    await item.locator("summary.faq-question").click();
    await expect(item).toHaveAttribute("open", "");
    await expect(item).toContainText(snippet);
  }
});
