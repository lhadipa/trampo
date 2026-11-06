# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: professional-marketplace.spec.ts >> marketplace preserva a região-piloto com localização negada
- Location: e2e\professional-marketplace.spec.ts:88:1

# Error details

```
TypeError: page.setGeolocation is not a function
```

# Test source

```ts
  1   | import { expect, test, type Page } from "@playwright/test";
  2   | 
  3   | const useProfessionalSession = async (page: Page) => {
  4   |   await page.addInitScript(() => {
  5   |     localStorage.setItem("trampo_local_token", "e2e-professional-token");
  6   |     localStorage.setItem(
  7   |       "trampo_local_session",
  8   |       JSON.stringify({
  9   |         access_token: "e2e-professional-token",
  10  |         user: { id: "e2e-professional-auth" },
  11  |       }),
  12  |     );
  13  |   });
  14  |   await page.route("**/api/preferences**", (route) =>
  15  |     route.fulfill({
  16  |       status: 200,
  17  |       contentType: "application/json",
  18  |       body: JSON.stringify({ data: [] }),
  19  |     }),
  20  |   );
  21  |   await page.route("**/api/data/**", async (route) => {
  22  |     const url = new URL(route.request().url());
  23  |     const table = url.pathname.split("/").pop();
  24  |     const data =
  25  |       table === "users"
  26  |         ? [
  27  |             {
  28  |               id: "e2e-user",
  29  |               auth_id: "e2e-professional-auth",
  30  |               name: "Profissional E2E",
  31  |               email: "e2e@example.invalid",
  32  |               type: "freelancer",
  33  |               blocked: false,
  34  |               balance: 0,
  35  |             },
  36  |           ]
  37  |         : table === "freelancers" && route.request().method() === "POST"
  38  |           ? { id: "e2e-freelancer", user_id: "e2e-user", category: "Eventos" }
  39  |           : [];
  40  |     await route.fulfill({
  41  |       status: 200,
  42  |       contentType: "application/json",
  43  |       body: JSON.stringify({ data }),
  44  |     });
  45  |   });
  46  | };
  47  | 
  48  | test("marketplace mantém alternativa em lista", async ({ page }) => {
  49  |   await useProfessionalSession(page);
  50  |   await page.goto("/painel");
  51  |   await expect(page.getByText("Painel profissional")).toBeVisible();
  52  |   await expect(page.getByLabel("Buscar oportunidades")).toBeVisible();
  53  |   await expect(
  54  |     page.getByLabel("Mapa interativo de oportunidades"),
  55  |   ).toBeVisible();
  56  | });
  57  | 
  58  | test("marketplace não cria overflow em celular", async ({ page }) => {
  59  |   await useProfessionalSession(page);
  60  |   await page.setViewportSize({ width: 360, height: 800 });
  61  |   await page.goto("/painel");
  62  |   expect(
  63  |     await page.evaluate(
  64  |       () =>
  65  |         document.documentElement.scrollWidth <=
  66  |         document.documentElement.clientWidth,
  67  |     ),
  68  |   ).toBe(true);
  69  | });
  70  | 
  71  | test("marketplace oferece busca por área e fallback de lista", async ({
  72  |   page,
  73  | }) => {
  74  |   await useProfessionalSession(page);
  75  |   await page.goto("/painel");
  76  |   await expect(
  77  |     page.getByRole("button", { name: "Buscar nesta área" }),
  78  |   ).toBeVisible();
  79  |   await page.getByRole("button", { name: "Buscar nesta área" }).click();
  80  |   await expect(
  81  |     page.getByLabel("Mapa interativo de oportunidades"),
  82  |   ).toBeVisible();
  83  |   await expect(
  84  |     page.getByText(/A lista continua disponível|oportunidades/i).first(),
  85  |   ).toBeVisible();
  86  | });
  87  | 
  88  | test("marketplace preserva a região-piloto com localização negada", async ({
  89  |   page,
  90  | }) => {
  91  |   await useProfessionalSession(page);
> 92  |   await page.setGeolocation(null);
      |              ^ TypeError: page.setGeolocation is not a function
  93  |   await page.goto("/painel");
  94  |   await expect(
  95  |     page.getByText(/região-piloto|Localização não autorizada/i).first(),
  96  |   ).toBeVisible();
  97  | });
  98  | 
  99  | test("marketplace mantém a lista quando os tiles falham e permite zoom", async ({
  100 |   page,
  101 | }) => {
  102 |   await useProfessionalSession(page);
  103 |   await page.route("**/tile.openstreetmap.org/**", (route) =>
  104 |     route.fulfill({ status: 503, body: "tile unavailable" }),
  105 |   );
  106 |   await page.goto("/painel");
  107 |   const map = page.getByLabel("Mapa interativo de oportunidades");
  108 |   await expect(map).toBeVisible();
  109 |   await page.getByRole("button", { name: "Zoom in" }).click();
  110 |   await page.getByRole("button", { name: "Zoom out" }).click();
  111 |   await expect(page.getByText(/A lista continua disponível/i)).toBeVisible();
  112 | });
  113 | 
```