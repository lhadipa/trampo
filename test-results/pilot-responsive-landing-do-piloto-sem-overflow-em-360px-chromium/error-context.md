# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: pilot-responsive.spec.ts >> landing do piloto sem overflow em 360px
- Location: e2e\pilot-responsive.spec.ts:8:3

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: getByRole('heading', { level: 1 })
Expected substring: "Contrate ajuda local"
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for getByRole('heading', { level: 1 })

```

```yaml
- region "Notifications alt+T"
- dialog "Garanta sua pré-reserva":
  - paragraph: Lista antecipada
  - heading "Garanta sua pré-reserva" [level=2]
  - paragraph: Entre na white list do Trampô e receba prioridade quando abrirmos novas oportunidades na sua região.
  - text: Nome
  - textbox "Nome":
    - /placeholder: Como podemos chamar você?
  - text: E-mail
  - textbox "E-mail":
    - /placeholder: voce@email.com
  - text: Você quer
  - combobox "Você quer":
    - option "Selecione uma opção" [disabled] [selected]
    - option "Contratar profissionais"
    - option "Encontrar trabalhos"
  - button "Entrar na white list"
  - paragraph: Sem cobrança. Seus dados serão usados apenas para avisar sobre o lançamento.
  - button "Close":
    - img
    - text: Close
```

# Test source

```ts
  1  | import { expect, test } from "@playwright/test";
  2  | 
  3  | for (const viewport of [
  4  |   { width: 360, height: 800 },
  5  |   { width: 768, height: 900 },
  6  |   { width: 1280, height: 900 },
  7  | ]) {
  8  |   test(`landing do piloto sem overflow em ${viewport.width}px`, async ({
  9  |     page,
  10 |   }) => {
  11 |     await page.setViewportSize(viewport);
  12 |     await page.goto("/");
> 13 |     await expect(page.getByRole("heading", { level: 1 })).toContainText(
     |                                                           ^ Error: expect(locator).toContainText(expected) failed
  14 |       "Contrate ajuda local",
  15 |     );
  16 |     const overflow = await page.evaluate(
  17 |       () =>
  18 |         document.documentElement.scrollWidth >
  19 |         document.documentElement.clientWidth,
  20 |     );
  21 |     expect(overflow).toBe(false);
  22 |   });
  23 | }
  24 | 
  25 | test("landing comunica os dois caminhos do piloto e valores simulados", async ({
  26 |   page,
  27 | }) => {
  28 |   await page.goto("/");
  29 |   await expect(page.getByText(/Contratante Avulso/i)).toBeVisible();
  30 |   await expect(page.getByText(/Profissional/i).first()).toBeVisible();
  31 |   await expect(
  32 |     page.getByText(/Todos os valores e pagamentos exibidos são simulações/i),
  33 |   ).toBeVisible();
  34 |   await expect(
  35 |     page.getByRole("button", { name: /quero contratar/i }).first(),
  36 |   ).toBeVisible();
  37 | });
  38 | 
  39 | test("landing mantém foco visível e respeita movimento reduzido", async ({
  40 |   page,
  41 | }) => {
  42 |   await page.emulateMedia({ reducedMotion: "reduce" });
  43 |   await page.goto("/");
  44 |   await page.keyboard.press("Tab");
  45 |   const focused = page.locator(":focus");
  46 |   await expect(focused).toBeVisible();
  47 |   expect(
  48 |     await page.evaluate(
  49 |       () => getComputedStyle(document.documentElement).scrollBehavior,
  50 |     ),
  51 |   ).not.toBe("smooth");
  52 | });
  53 | 
```