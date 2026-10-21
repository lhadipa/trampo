import { expect, test } from "@playwright/test";

test("marketplace mantém alternativa em lista", async ({ page }) => {
  await page.goto("/painel");
  await expect(page.getByText("Painel profissional")).toBeVisible();
  await expect(page.getByLabel("Buscar oportunidades")).toBeVisible();
  await expect(page.getByLabel("Mapa interativo de oportunidades")).toBeVisible();
});

test("marketplace não cria overflow em celular", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/painel");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});
