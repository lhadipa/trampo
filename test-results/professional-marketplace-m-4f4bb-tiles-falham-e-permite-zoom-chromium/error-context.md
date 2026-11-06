# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: professional-marketplace.spec.ts >> marketplace mantém a lista quando os tiles falham e permite zoom
- Location: e2e\professional-marketplace.spec.ts:99:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Zoom in' })

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - region "Notifications (F8)":
    - list
  - region "Notifications alt+T"
  - generic [ref=e3]:
    - banner [ref=e4]:
      - generic [ref=e5]:
        - generic [ref=e6]:
          - button "Início" [ref=e7] [cursor=pointer]
          - img "Trampô" [ref=e8]
          - generic [ref=e9]: Painel profissional
        - button "Sair" [ref=e10] [cursor=pointer]
    - main [ref=e11]:
      - paragraph [ref=e12]: "Demonstração: vagas, seleções, taxa de confirmação, check-in e recibos são fictícios."
      - generic [ref=e13]:
        - generic [ref=e14]:
          - heading "Olá, Profissional E2E" [level=1] [ref=e15]
          - paragraph [ref=e16]: Garçonete · sem assinatura mensal
        - button "Ver trabalho selecionado" [ref=e17] [cursor=pointer]
      - generic [ref=e18]:
        - generic [ref=e20]:
          - paragraph [ref=e21]: Oportunidades abertas
          - paragraph [ref=e22]: "2"
        - generic [ref=e24]:
          - paragraph [ref=e25]: Diárias concluídas
          - paragraph [ref=e26]: "38"
        - generic [ref=e28]:
          - paragraph [ref=e29]: Nível de progresso
          - paragraph [ref=e30]: Nível 1
          - paragraph [ref=e31]: 25/100 pontos
        - generic [ref=e33]:
          - paragraph [ref=e34]: Taxa após seleção
          - paragraph [ref=e35]: R$ 7,90
          - paragraph [ref=e36]: Nunca para demonstrar interesse
      - generic [ref=e37]:
        - tablist [ref=e38]:
          - tab "Oportunidades" [selected] [ref=e39] [cursor=pointer]
          - tab "Meus interesses" [ref=e40] [cursor=pointer]
          - tab "Selecionado" [ref=e41] [cursor=pointer]
        - tabpanel "Oportunidades" [ref=e42]:
          - generic [ref=e44]:
            - generic [ref=e45]:
              - generic [ref=e46]:
                - paragraph [ref=e47]: Meta atual
                - paragraph [ref=e48]: Abra três oportunidades no marketplace.
              - generic [ref=e49]: 25 pontos
            - paragraph [ref=e52]: Próximo nível em 75 pontos
          - generic [ref=e53]:
            - textbox "Buscar oportunidades" [ref=e58]:
              - /placeholder: Buscar por função ou bairro
            - combobox "Filtrar categoria" [ref=e59]:
              - option "Todas as categorias" [selected]
              - option "Reformas & Manutenção"
              - option "Piscinas & Conservação"
              - option "Gastronomia & Bares"
              - option "Eventos & Festas"
              - option "Beleza & Bem-Estar"
              - option "Comércio, Carga & Apoio"
              - option "Promoção & Vendas"
          - generic [ref=e60]:
            - button "Perto de mim" [ref=e61] [cursor=pointer]
            - button "Região-piloto" [ref=e62] [cursor=pointer]
          - generic [ref=e63]:
            - paragraph [ref=e64]: O mapa não carregou
            - paragraph [ref=e65]: A lista continua disponível com todas as ações.
            - button "Tentar mapa novamente" [ref=e66] [cursor=pointer]
          - paragraph [ref=e67]: Os marcadores indicam o bairro aproximado. O endereço exato não é exibido nesta etapa.
          - generic [ref=e68]:
            - generic [ref=e70]:
              - generic [ref=e71]:
                - button [ref=e72] [cursor=pointer]:
                  - paragraph [ref=e73]: Apoio de salão — hoje à noite
                  - paragraph [ref=e74]: Atendente de Salão · Centro · 05/10/2026
                - generic [ref=e75]:
                  - strong [ref=e76]: R$ 150,00
                  - text: valor da diária
              - paragraph [ref=e77]: 1 posição(ões). Local mostrado de forma aproximada.
              - generic [ref=e78]:
                - paragraph [ref=e79]: Gostaria de fazer freelas neste local?
                - paragraph [ref=e80]: Envie seu currículo de interesse. O contratante verá apenas quantas pessoas têm preferência — nunca seu nome ou perfil.
                - button "Enviar currículo de interesse" [ref=e81] [cursor=pointer]
              - button "Candidatar-se a esta vaga" [ref=e82] [cursor=pointer]
            - generic [ref=e84]:
              - generic [ref=e85]:
                - button [ref=e86] [cursor=pointer]:
                  - paragraph [ref=e87]: Panfletagem no Centro
                  - paragraph [ref=e88]: Panfletista · Centro · 08/10/2026
                - generic [ref=e89]:
                  - strong [ref=e90]: R$ 110,00
                  - text: valor da diária
              - paragraph [ref=e91]: 3 posição(ões). Local mostrado de forma aproximada.
              - generic [ref=e92]:
                - paragraph [ref=e93]: Gostaria de fazer freelas neste local?
                - paragraph [ref=e94]: Envie seu currículo de interesse. O contratante verá apenas quantas pessoas têm preferência — nunca seu nome ou perfil.
                - button "Enviar currículo de interesse" [ref=e95] [cursor=pointer]
              - button "Candidatar-se a esta vaga" [ref=e96] [cursor=pointer]
```

# Test source

```ts
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
  92  |   await page.setGeolocation(null);
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
> 109 |   await page.getByRole("button", { name: "Zoom in" }).click();
      |                                                       ^ Error: locator.click: Test timeout of 30000ms exceeded.
  110 |   await page.getByRole("button", { name: "Zoom out" }).click();
  111 |   await expect(page.getByText(/A lista continua disponível/i)).toBeVisible();
  112 | });
  113 | 
```