# Tasks: Atualização do Produto para o Piloto Local

**Input**: Design documents from `specs/002-pilot-product-update/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: A especificação define critérios mensuráveis de cálculo, transição, responsividade e acessibilidade; por isso, cada história inclui testes escritos antes da implementação correspondente.

**Organization**: Tarefas agrupadas por história de usuário. A implementação deve refinar arquivos e componentes existentes; não criar versões paralelas ou equivalentes do zero.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: executável em paralelo por atuar em arquivo independente e não depender de tarefa incompleta
- **[Story]**: história correspondente da especificação
- Todos os caminhos são relativos à raiz do projeto

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparar convenções da feature sem alterar comportamento do produto.

- [X] T001 Registrar tokens, tipografia, raios, superfícies, foco, movimento e padrões visuais proibidos em docs/DESIGN.md
- [X] T002 [P] Criar a estrutura inicial dos testes E2E da feature em e2e/pilot-responsive.spec.ts
- [ ] T003 [P] Criar utilitários de renderização com AuthProvider e BrowserRouter para testes em src/test/pilot-test-utils.tsx
- [ ] T004 Atualizar a matriz de validação da feature e comandos executáveis em specs/002-pilot-product-update/quickstart.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Criar o domínio mockado e as regras compartilhadas que bloqueiam todas as histórias.

**⚠️ CRITICAL**: Nenhuma história deve ser implementada antes desta fase.

- [X] T005 [P] Escrever testes unitários inicialmente falhos para total de diárias, Avulso 12%, Pro taxa zero e taxa profissional R$ 7,90 em src/test/pilot-pricing.test.ts
- [X] T006 [P] Definir tipos compartilhados de PilotUser, perfis, planos, vagas, interesses, assignments, check-ins, recibos e UIState em src/lib/pilotTypes.ts
- [X] T007 [P] Acrescentar Promoção & Vendas, Panfletista e Vendedor Porta a Porta no catálogo existente em src/lib/categories.ts
- [X] T008 Implementar funções puras de cálculo e formatação monetária mockada em src/lib/pilotPricing.ts
- [X] T009 Criar fixtures determinísticas e inequivocamente fictícias para todos os estados do piloto em src/lib/pilotMockData.ts
- [X] T010 Implementar snapshot em memória e reset por recarga em src/lib/pilotMockService.ts
- [X] T011 Implementar validação de transições, idempotência e limite de posições conforme contracts/mock-pilot-contract.md em src/lib/pilotMockService.ts
- [X] T012 [P] Adicionar tokenização de contraste, foco, áreas de toque e movimento reduzido preservando os estilos existentes em src/index.css
- [ ] T013 [P] Atualizar mocks compartilhados de autenticação e dados para refletir personas fictícias em src/test/setup.ts
- [X] T014 Executar npm test para pilot-pricing e corrigir somente a fundação até os testes de src/test/pilot-pricing.test.ts passarem

**Checkpoint**: Cálculos, fixtures e transições mockadas estão disponíveis sem API, banco ou efeito externo.

---

## Phase 3: User Story 1 - Entender e entrar no piloto (Priority: P1) 🎯 MVP

**Goal**: Explicar o piloto local, os papéis, o fluxo sem custódia, as categorias e os preços mockados.

**Independent Test**: Abrir `/` em desktop e celular, identificar em até 60 segundos quem paga, quem recebe, como a plataforma monetiza e seguir os dois caminhos de entrada.

### Tests for User Story 1

- [ ] T015 [P] [US1] Escrever testes inicialmente falhos para localidade, sete categorias, fluxo financeiro e preços mockados em src/test/landing-pilot.test.tsx
- [ ] T016 [P] [US1] Escrever cenário E2E inicialmente falho para CTAs de contratante/profissional e ausência de rolagem horizontal em e2e/pilot-responsive.spec.ts

### Implementation for User Story 1

- [ ] T017 [P] [US1] Refinar o componente existente Navbar com Início, Publicar, Painel, Diárias, Equipe, Piloto SJDR e estado autenticado em src/components/landing/Navbar.tsx
- [X] T018 [P] [US1] Refinar o Hero existente com proposta local, aviso demonstrativo e CTAs por papel em src/components/landing/Hero.tsx
- [X] T019 [P] [US1] Adaptar HowItWorks existente para publicação, aceite, check-in e Pix direto com recibo demonstrativo em src/components/landing/HowItWorks.tsx
- [ ] T020 [P] [US1] Renderizar as sete categorias do catálogo compartilhado sem painel aninhado decorativo em src/components/landing/Categories.tsx
- [X] T021 [P] [US1] Substituir VIP/escrow pelos três modelos demonstrativos e taxa profissional pós-seleção em src/components/landing/Pricing.tsx
- [X] T022 [P] [US1] Ajustar CTA e Footer existentes para piloto local, termos demonstrativos e rotas atuais em src/components/landing/CTA.tsx e src/components/landing/Footer.tsx
- [ ] T023 [US1] Compor a landing atualizada preservando os componentes existentes e uma ação primária por seção em src/pages/Index.tsx
- [ ] T024 [US1] Executar os testes de src/test/landing-pilot.test.tsx e validar manualmente o Cenário 1 de specs/002-pilot-product-update/quickstart.md

**Checkpoint**: A landing funciona como MVP independente e não contém promessas de escrow, VIP de 60 dias ou cobertura nacional ativa.

---

## Phase 4: User Story 2 - Publicar uma diária com preço transparente (Priority: P1)

**Goal**: Simular publicação individual ou em lote com cálculo explícito do total e da taxa do contratante.

**Independent Test**: Preencher vagas Pro e Avulso, confirmar R$ 0 ou 12% separadamente e concluir sem cobrança ou publicação externa.

### Tests for User Story 2

- [ ] T025 [P] [US2] Escrever testes inicialmente falhos para formulário individual/lote, preservação de campos e resumo Pro/Avulso em src/test/pilot-create-job.test.tsx
- [ ] T026 [P] [US2] Acrescentar cenário E2E inicialmente falho para R$ 150 Pro e R$ 300 + R$ 36 Avulso em e2e/pilot-responsive.spec.ts

### Implementation for User Story 2

- [X] T027 [US2] Adaptar campos e catálogo existentes para vaga individual/lote e sete categorias em src/pages/CreateJob.tsx
- [X] T028 [US2] Integrar calculateJobPricing e separar diária, taxa do contratante e aviso mockado em src/pages/CreateJob.tsx
- [ ] T029 [US2] Integrar publishJobMock e confirmação Avulso sem chamar API financeira em src/pages/CreateJob.tsx
- [ ] T030 [US2] Implementar estados de validação, confirmação, sucesso e erro recuperável preservando dados digitados em src/pages/CreateJob.tsx
- [ ] T031 [US2] Executar src/test/pilot-create-job.test.tsx e validar o Cenário 2 de specs/002-pilot-product-update/quickstart.md

**Checkpoint**: A publicação mockada é demonstrável isoladamente e nenhum botão produz cobrança real.

---

## Phase 5: User Story 3 - Acompanhar vagas como contratante (Priority: P1)

**Goal**: Mostrar plano, conta, vagas, posições e taxas mockadas no painel existente do contratante.

**Independent Test**: Abrir o painel com vagas abertas, preenchidas e aguardando taxa e distinguir cada estado e valor.

### Tests for User Story 3

- [ ] T032 [P] [US3] Escrever testes inicialmente falhos para plano, teste de 14 dias, conta e estados das vagas em src/test/pilot-company-flow.test.tsx
- [ ] T033 [P] [US3] Escrever testes inicialmente falhos para confirmação idempotente da taxa Avulso e suspensão mockada em src/test/pilot-mock-service.test.ts

### Implementation for User Story 3

- [X] T034 [US3] Substituir indicadores VIP, custódia e ROI conflitantes por plano, conta e resumo operacional em src/pages/DashboardCompany.tsx
- [X] T035 [US3] Integrar getContractorDashboard com vagas, posições abertas, total de diárias e taxa separada em src/pages/DashboardCompany.tsx
- [ ] T036 [US3] Integrar confirmContractorFeeMock e bloqueio demonstrativo de publicação para conta suspensa em src/pages/DashboardCompany.tsx
- [X] T037 [US3] Preservar roteamento por papel e carregamento do painel atual em src/pages/Dashboard.tsx
- [ ] T038 [US3] Executar src/test/pilot-company-flow.test.tsx e validar estados de contratante conforme contracts/ui-flow-contract.md

**Checkpoint**: O contratante acompanha o cenário mockado sem confundir diária e taxa da plataforma.

---

## Phase 6: User Story 4 - Encontrar e cumprir diárias (Priority: P1)

**Goal**: Demonstrar interesse, seleção, taxa de R$ 7,90, reserva, check-in, conclusão e recibo mockados.

**Independent Test**: Percorrer uma vaga do estado aberto até recibo, confirmando que R$ 7,90 aparece somente após seleção.

### Tests for User Story 4

- [ ] T039 [P] [US4] Escrever testes inicialmente falhos para interesse, seleção, taxa, reserva e limite concorrente em src/test/pilot-professional-service.test.ts
- [ ] T040 [P] [US4] Escrever testes inicialmente falhos para estados abertos, chamados, check-in, no-show e recibo em src/test/pilot-professional-flow.test.tsx
- [ ] T041 [P] [US4] Acrescentar jornada E2E inicialmente falha de interesse até recibo demonstrativo em e2e/pilot-responsive.spec.ts

### Implementation for User Story 4

- [X] T042 [US4] Evoluir a página existente de contratos/diárias para consumir getProfessionalDashboard em src/pages/Contracts.tsx
- [ ] T043 [US4] Integrar expressInterestMock sem apresentar taxa antes da seleção em src/pages/Contracts.tsx
- [X] T044 [US4] Integrar seleção demonstrativa e confirmProfessionalFeeMock com aviso de R$ 7,90 em src/pages/Contracts.tsx
- [ ] T045 [US4] Integrar checkInMock, completeShiftMock e markNoShowMock sem usar endpoints reais em src/pages/Contracts.tsx
- [ ] T046 [US4] Exibir recibo “Demonstração — sem validade fiscal” reutilizando Dialog existente em src/pages/Contracts.tsx
- [X] T047 [US4] Remover mensagens de carteira, custódia e anti-calote conflitantes do painel profissional existente em src/pages/DashboardFreelancer.tsx
- [ ] T048 [US4] Executar src/test/pilot-professional-service.test.ts e src/test/pilot-professional-flow.test.tsx e validar Cenários 3 e 4 do quickstart.md

**Checkpoint**: A jornada profissional completa funciona somente no estado mockado da sessão.

---

## Phase 7: User Story 6 - Operar uma interface clara e confiável (Priority: P1)

**Goal**: Garantir hierarquia, consistência, acessibilidade, responsividade e distinção dos valores em todas as telas principais.

**Independent Test**: Completar a ação principal de cada tela por teclado em 360, 768 e 1280 px, com e sem movimento reduzido.

### Tests for User Story 6

- [ ] T049 [P] [US6] Escrever testes inicialmente falhos para títulos, rótulos persistentes, avisos mockados e nomes acessíveis em src/test/pilot-accessibility.test.tsx
- [ ] T050 [P] [US6] Completar testes E2E de teclado, foco, movimento reduzido, texto longo e três breakpoints em e2e/pilot-responsive.spec.ts

### Implementation for User Story 6

- [ ] T051 [P] [US6] Refinar Button, Card, Badge, Tabs, Input e Dialog existentes conforme docs/DESIGN.md sem criar variantes equivalentes em src/components/ui/button.tsx, src/components/ui/card.tsx, src/components/ui/badge.tsx, src/components/ui/tabs.tsx, src/components/ui/input.tsx e src/components/ui/dialog.tsx
- [ ] T052 [US6] Remover cartões aninhados decorativos, selos sem função, sombras redundantes e ícones superdimensionados das páginas alteradas em src/components/landing e src/pages
- [ ] T053 [US6] Corrigir ordem de títulos, rótulos de campos, mensagens de estado e associação de erros nas páginas alteradas em src/components/landing e src/pages
- [X] T054 [US6] Aplicar limites de linha, quebra de conteúdo, alvos de toque e ausência de overflow horizontal nas páginas alteradas em src/index.css
- [X] T055 [US6] Garantir que transições essenciais permaneçam visíveis sem animação e respeitem prefers-reduced-motion em src/index.css
- [ ] T056 [US6] Executar src/test/pilot-accessibility.test.tsx e e2e/pilot-responsive.spec.ts e validar o Cenário 6 do quickstart.md

**Checkpoint**: Todas as histórias P1 atendem aos critérios visuais e de acessibilidade.

---

## Phase 8: User Story 5 - Reconvocar equipe de confiança (Priority: P2)

**Goal**: Reutilizar favoritos existentes como equipe privada do estabelecimento e iniciar convocação pelo fluxo de publicação.

**Independent Test**: Favoritar um profissional, alternar contratante e iniciar convocação sem compartilhar a seleção entre estabelecimentos.

### Tests for User Story 5

- [ ] T057 [P] [US5] Escrever testes inicialmente falhos para isolamento de favoritos e convocação em src/test/pilot-favorite-team.test.tsx

### Implementation for User Story 5

- [X] T058 [US5] Integrar toggleFavoriteMock à área de favoritos existente em src/pages/DashboardCompany.tsx
- [X] T059 [US5] Adaptar a área existente para exibir função, região, avaliação e histórico da equipe em src/pages/DashboardCompany.tsx
- [ ] T060 [US5] Iniciar convocação reaproveitando o formulário existente por estado de navegação em src/pages/DashboardCompany.tsx e src/pages/CreateJob.tsx
- [X] T061 [US5] Mapear `/equipe` para a mesma experiência de equipe do painel sem criar novo componente equivalente em src/App.tsx
- [ ] T062 [US5] Executar src/test/pilot-favorite-team.test.tsx e validar o Cenário 5 de specs/002-pilot-product-update/quickstart.md

**Checkpoint**: A equipe favorita funciona por contratante e reutiliza o fluxo existente.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Termos, remoção de legado conflitante e validação final.

- [ ] T063 [P] Atualizar testes antigos de preços, dashboards e termos para o piloto mockado em src/test/pricing.test.tsx, src/test/dashboards.test.tsx e src/test/terms.test.tsx
- [ ] T064 Atualizar modelo sem custódia, valores mockados, recibo sem validade fiscal, no-show e suspensão simulada em src/pages/Terms.tsx
- [ ] T065 Remover textos residuais de escrow, custódia, garantia anti-calote, VIP de 60 dias, R$ 39,90 e cobertura nacional ativa em src e src/test
- [ ] T066 [P] Inspecionar somente as alterações produzidas por esta feature e confirmar que não adicionam dependências, fluxos duplicados ou efeitos financeiros em server e mobile, preservando alterações preexistentes nesses diretórios
- [ ] T067 Executar npm test e corrigir regressões relacionadas à feature nos arquivos alterados
- [X] T068 Executar npm run build e corrigir erros de compilação relacionados à feature nos arquivos alterados
- [ ] T069 Executar npm run lint e corrigir violações relacionadas à feature nos arquivos alterados
- [ ] T070 Executar npx playwright test e validar os seis cenários de specs/002-pilot-product-update/quickstart.md
- [ ] T071 Revisar a implementação contra specs/002-pilot-product-update/spec.md e registrar qualquer diferença restante em specs/002-pilot-product-update/checklists/requirements.md
- [X] T072 [P] Criar protocolo moderado com amostra, roteiro, métricas e formulário agregado para SC-001, SC-002, SC-003, SC-005, SC-007 e SC-011 a SC-013 em specs/002-pilot-product-update/validation-protocol.md
- [ ] T073 Executar o protocolo com pelo menos 10 participantes e registrar somente resultados agregados em specs/002-pilot-product-update/validation-results.md
- [ ] T074 [P] Escrever matriz inicialmente falha para carregamento, vazio, sucesso, erro recuperável e repetição idempotente em landing, publicação, painéis, diárias e equipe em src/test/pilot-state-matrix.test.tsx
- [ ] T075 Implementar a matriz completa de estados e proteção contra duplicidade reutilizando componentes existentes em src/pages/Index.tsx, src/pages/CreateJob.tsx, src/pages/DashboardCompany.tsx, src/pages/DashboardFreelancer.tsx e src/pages/Contracts.tsx
- [ ] T076 Aplicar e testar aviso explícito de demonstração antes e depois das ações mockadas de taxa, publicação, seleção, check-in, conclusão, no-show e suspensão em src/pages/CreateJob.tsx, src/pages/DashboardCompany.tsx e src/pages/Contracts.tsx
- [ ] T077 Auditar os contrastes 4,5:1 e 3:1 em todas as páginas principais e registrar valores, elementos, larguras e correções em specs/002-pilot-product-update/contrast-audit.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 — Setup**: sem dependências.
- **Phase 2 — Foundation**: depende da Phase 1 e bloqueia todas as histórias.
- **US1, US2, US3, US4 e US6**: iniciam após Foundation; podem avançar em paralelo quando não editarem o mesmo arquivo.
- **US5**: depende de Foundation e reutiliza partes de US2/US3 para convocação, portanto é o incremento P2 final.
- **Polish**: depende das histórias selecionadas para a entrega.

### User Story Dependencies

```text
Setup
  → Foundation
      ├→ US1 Landing ───────────────┐
      ├→ US2 Publicação ──┐         │
      ├→ US3 Contratante ─┼→ US5 Equipe
      ├→ US4 Profissional ┘         │
      └→ US6 UI/Acessibilidade ←────┘
                                  → Polish
```

- **US1 (P1)**: independente após Foundation.
- **US2 (P1)**: independente após Foundation.
- **US3 (P1)**: independente após Foundation.
- **US4 (P1)**: independente após Foundation.
- **US6 (P1)**: valida e refina as superfícies alteradas; testes podem começar após Foundation, acabamento acompanha US1–US4.
- **US5 (P2)**: depende das jornadas de publicação e painel para reutilizar convocação e favoritos.

### Within Each User Story

- Escrever e observar os testes falharem antes da implementação.
- Tipos/fixtures e regras antes da integração visual.
- Transições de serviço antes dos botões que as acionam.
- Conteúdo e comportamento antes do acabamento visual.
- Finalizar o checkpoint independente antes de iniciar dependentes.

## Parallel Opportunities

- T002 e T003 podem avançar em paralelo após T001 ser acordado.
- T005, T006, T007 e T012 atuam em arquivos diferentes.
- Após Foundation, US1, US2, US3 e US4 podem ser distribuídas, observando conflitos entre `DashboardCompany.tsx` e US5.
- Dentro da US1, Navbar, Hero, HowItWorks, Categories, Pricing e CTA/Footer podem ser refinados em paralelo.
- Testes `[P]` de cada história podem ser escritos em paralelo antes da implementação.
- T063 e T066 podem avançar em paralelo com a atualização de Terms.
- T072, T074 e a preparação da auditoria T077 podem avançar em paralelo; T073 depende da implementação das histórias P1.

## Parallel Examples

### User Story 1

```text
T017 Navbar existente
T018 Hero existente
T019 HowItWorks existente
T020 Categories existente
T021 Pricing existente
T022 CTA e Footer existentes
```

### User Story 4

```text
T039 testes de serviço profissional
T040 testes da UI profissional
T041 jornada E2E profissional
```

### User Story 6

```text
T049 testes de acessibilidade em componentes
T050 testes E2E de responsividade e teclado
```

## Implementation Strategy

### MVP First

1. Concluir Setup.
2. Concluir Foundation.
3. Concluir US1.
4. Parar e validar landing, oferta, categorias, papéis e ausência de promessas conflitantes.
5. Demonstrar o MVP antes de adicionar operação simulada.

### Incremental Delivery

1. Setup + Foundation → domínio mockado estável.
2. US1 → comunicação pública do piloto.
3. US2 → publicação transparente.
4. US3 → operação do contratante.
5. US4 → operação do profissional.
6. US6 → gate visual e de acessibilidade P1.
7. US5 → recorrência por equipe favorita.
8. Polish → termos, limpeza de legado e validação integral.

### Safe Execution Rules

- Não fazer merge.
- Não recriar componentes do zero.
- Não criar migrations ou endpoints para a demonstração.
- Não usar pagamentos, Pix, presença, recibos ou suspensões reais.
- Preservar alterações existentes do usuário fora do escopo.
- Parar em qualquer checkpoint se testes indicarem efeito externo ou conflito com dados reais.

## Notes

- `[P]` indica paralelismo seguro por arquivo e dependência, não autorização para editar o mesmo componente simultaneamente.
- `[US#]` mantém rastreabilidade com a especificação.
- Cada tarefa de implementação possui caminho explícito e resultado verificável.
- Nenhuma tarefa inclui commit ou merge.
