import { expect, test } from "@playwright/test";

for (const viewport of [
  { width: 360, height: 800 },
  { width: 768, height: 900 },
  { width: 1280, height: 900 },
]) {
  test(`landing do piloto sem overflow em ${viewport.width}px`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Contrate ajuda local",
    );
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    );
    expect(overflow).toBe(false);
  });
}

test("landing comunica os dois caminhos do piloto e valores simulados", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByText(/Contratante Avulso/i)).toBeVisible();
  await expect(page.getByText(/Profissional/i).first()).toBeVisible();
  await expect(
    page.getByText(/Todos os valores e pagamentos exibidos são simulações/i),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /quero contratar/i }).first(),
  ).toBeVisible();
});

test("landing mantém foco visível e respeita movimento reduzido", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.keyboard.press("Tab");
  const focused = page.locator(":focus");
  await expect(focused).toBeVisible();
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).not.toBe("smooth");
});
