import { expect, test } from "@playwright/test";

for (const viewport of [{ width: 360, height: 800 }, { width: 768, height: 900 }, { width: 1280, height: 900 }]) {
  test(`landing do piloto sem overflow em ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Contrate ajuda local");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(overflow).toBe(false);
  });
}
