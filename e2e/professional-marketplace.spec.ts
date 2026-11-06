import { expect, test, type Page } from "@playwright/test";

const useProfessionalSession = async (page: Page) => {
  await page.addInitScript(() => {
    localStorage.setItem("trampo_local_token", "e2e-professional-token");
    localStorage.setItem(
      "trampo_local_session",
      JSON.stringify({
        access_token: "e2e-professional-token",
        user: { id: "e2e-professional-auth" },
      }),
    );
  });
  await page.route("**/api/preferences**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ data: [] }),
    }),
  );
  await page.route("**/api/data/**", async (route) => {
    const url = new URL(route.request().url());
    const table = url.pathname.split("/").pop();
    const data =
      table === "users"
        ? [
            {
              id: "e2e-user",
              auth_id: "e2e-professional-auth",
              name: "Profissional E2E",
              email: "e2e@example.invalid",
              type: "freelancer",
              blocked: false,
              balance: 0,
            },
          ]
        : table === "freelancers" && route.request().method() === "POST"
          ? { id: "e2e-freelancer", user_id: "e2e-user", category: "Eventos" }
          : [];
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ data }),
    });
  });
};

test("marketplace mantém alternativa em lista", async ({ page }) => {
  await useProfessionalSession(page);
  await page.goto("/painel");
  await expect(page.getByText("Painel profissional")).toBeVisible();
  await expect(page.getByLabel("Buscar oportunidades")).toBeVisible();
  await expect(
    page.getByLabel("Mapa interativo de oportunidades"),
  ).toBeVisible();
});

test("marketplace não cria overflow em celular", async ({ page }) => {
  await useProfessionalSession(page);
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/painel");
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth <=
        document.documentElement.clientWidth,
    ),
  ).toBe(true);
});

test("marketplace oferece busca por área e fallback de lista", async ({
  page,
}) => {
  await useProfessionalSession(page);
  await page.goto("/painel");
  await expect(
    page.getByRole("button", { name: "Buscar nesta área" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Buscar nesta área" }).click();
  await expect(
    page.getByLabel("Mapa interativo de oportunidades"),
  ).toBeVisible();
  await expect(
    page.getByText(/A lista continua disponível|oportunidades/i).first(),
  ).toBeVisible();
});

test("marketplace preserva a região-piloto com localização negada", async ({
  page,
}) => {
  await useProfessionalSession(page);
  await page.setGeolocation(null);
  await page.goto("/painel");
  await expect(
    page.getByText(/região-piloto|Localização não autorizada/i).first(),
  ).toBeVisible();
});

test("marketplace mantém a lista quando os tiles falham e permite zoom", async ({
  page,
}) => {
  await useProfessionalSession(page);
  await page.route("**/tile.openstreetmap.org/**", (route) =>
    route.fulfill({ status: 503, body: "tile unavailable" }),
  );
  await page.goto("/painel");
  const map = page.getByLabel("Mapa interativo de oportunidades");
  await expect(map).toBeVisible();
  await page.getByRole("button", { name: "Zoom in" }).click();
  await page.getByRole("button", { name: "Zoom out" }).click();
  await expect(page.getByText(/A lista continua disponível/i)).toBeVisible();
});
