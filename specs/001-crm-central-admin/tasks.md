# Tasks: CRM Central Administrativo

**Input**: Design documents from `/specs/001-crm-central-admin/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md)

**Tests**: Incluídos porque a especificação exige testes de autorização, contrato, integração, responsividade, acessibilidade e preservação da suíte/build.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparar os pontos de entrada existentes sem criar uma nova aplicação ou painel.

- [X] T001 Confirmar o escopo P1/P2 e o inventário de tabelas/endpoints em `specs/001-crm-central-admin/spec.md`
- [X] T002 [P] Confirmar a árvore de arquivos de UI reutilizáveis em `src/pages/DashboardAdmin.tsx` e `src/components/ui/`
- [X] T003 [P] Confirmar o fluxo de sessão, perfil e papel administrativo em `src/hooks/useAuth.tsx` e `src/pages/Dashboard.tsx`
- [X] T004 [P] Confirmar o contrato de consulta, sanitização e política de atualização em `server/index.js` e `src/integrations/supabase/client.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Criar as bases compartilhadas de autorização, projeção de dados e carregamento que bloqueiam todas as histórias.

**⚠️ CRITICAL**: Nenhuma história deve ser implementada antes desta fase.

- [x] T005 [P] Adicionar testes de autorização para leituras globais, sessão ausente, usuário comum e usuário bloqueado em `server/crm-admin.test.js`
- [x] T006 [P] Adicionar testes de contrato para remoção de `password_hash` e atualização exclusiva de `blocked` em `server/crm-admin.test.js`
- [X] T007 Definir no `server/index.js` a guarda administrativa para consultas globais do CRM sem alterar as regras de ownership das consultas comuns
- [X] T008 Garantir no `server/index.js` que toda resposta administrativa continue passando por sanitização e nunca contenha `password_hash`
- [X] T009 Criar a projeção e normalização de `ClienteCRM` em `src/pages/DashboardAdmin.tsx`, deduplicando `users` e associando perfis sem alterar tabelas
- [X] T010 Criar helpers de consulta, formatação de tipo/status/valor/data e agregação de contagens em `src/pages/DashboardAdmin.tsx`, reutilizando o cliente de `src/integrations/supabase/client.ts`
- [ ] T011 [P] Adicionar cobertura de regressão do roteamento administrativo em `src/test/dashboards.test.tsx`, confirmando que `/painel` continua encaminhando administradores para `DashboardAdmin`

**Checkpoint**: A autorização backend e a projeção segura de dados estão prontas; as histórias podem ser implementadas sem duplicar o painel.

---

## Phase 3: User Story 1 - Consultar a base administrativa (Priority: P1) 🎯 MVP

**Goal**: Entregar o CRM central com indicadores reais, lista única de clientes, busca, filtros, ordenação, atualização e estados de carregamento/erro/vazio.

**Independent Test**: Com dados reais de múltiplos tipos/status, abrir `/painel` como administrador, localizar um cliente por nome/e-mail/identificador, aplicar filtros, atualizar e validar indicadores sem dados fictícios.

### Tests for User Story 1

- [ ] T012 [P] [US1] Criar testes de indicadores e estados loading/erro/vazio em `src/test/crm-admin-list.test.tsx`
- [x] T013 [P] [US1] Criar testes de busca, filtros por tipo/status/período e ordenação em `src/test/crm-admin-list.test.tsx`
- [x] T014 [P] [US1] Criar teste de contrato para limite, `select`, `eq` e `order` usados pela lista em `server/crm-admin.test.js`

### Implementation for User Story 1

- [X] T015 [US1] Substituir o cabeçalho executivo de `src/pages/DashboardAdmin.tsx` por CRM Central, descrição curta, administrador autenticado, atualizar e saída preservada
- [X] T016 [US1] Implementar carregamento inicial coordenado de usuários, perfis, vagas, contratos, pagamentos e escrow em `src/pages/DashboardAdmin.tsx`, evitando chamadas repetidas
- [X] T017 [US1] Implementar indicadores reais de usuários, empresas, freelancers, ativos, bloqueados, vagas abertas, contratos ativos, volume registrado e custódia em `src/pages/DashboardAdmin.tsx`
- [X] T018 [US1] Implementar tabela/lista responsiva de clientes com nome, e-mail, tipo, status, cadastro, saldo e contagens em `src/pages/DashboardAdmin.tsx`, reutilizando `src/components/ui/table.tsx`, `src/components/ui/badge.tsx` e `src/components/ui/card.tsx`
- [X] T019 [US1] Implementar busca por nome, e-mail, CPF, CNPJ e identificador, além de filtros por tipo, status e período e ordenação em `src/pages/DashboardAdmin.tsx`
- [X] T020 [US1] Implementar atualização manual, estados de carregamento, erro, vazio e limite/paginação compatível com `/api/data/:table` em `src/pages/DashboardAdmin.tsx`
- [X] T021 [US1] Ajustar textos, espaçamentos, cores e responsividade em `src/pages/DashboardAdmin.tsx` para preservar a identidade visual sem excesso de pills, sombras, emojis ou biblioteca de ícones nova

**Checkpoint**: US1 é demonstrável sozinha como MVP e não deve exigir as telas de detalhe, timeline ou novas rotas.

---

## Phase 4: User Story 2 - Abrir a visão consolidada de um cliente (Priority: P1)

**Goal**: Permitir abrir um cliente e consultar dados cadastrais, perfis e relações operacionais reais sem misturar registros.

**Independent Test**: Abrir uma empresa, um contratante pessoa física e um profissional com operações relacionadas; confirmar perfil, relações, estados vazios e isolamento por cliente.

### Tests for User Story 2

- [x] T022 [P] [US2] Criar testes de abertura/fechamento do detalhe e estados vazios por seção em `src/test/crm-admin-detail.test.tsx`
- [x] T023 [P] [US2] Criar testes de consolidação de relações e ausência de vazamento entre clientes em `src/test/crm-admin-detail.test.tsx`
- [ ] T024 [P] [US2] Criar teste de contrato para consultas relacionadas e hidratações permitidas em `server/crm-admin.test.js`

### Implementation for User Story 2

- [X] T025 [US2] Implementar seleção de cliente e carregamento sob demanda do detalhe em `src/pages/DashboardAdmin.tsx`, usando somente relações derivadas das chaves de `specs/001-crm-central-admin/data-model.md`
- [X] T026 [US2] Implementar drawer/dialog responsivo com `src/components/ui/sheet.tsx` ou `src/components/ui/dialog.tsx` e abas existentes em `src/components/ui/tabs.tsx`
- [X] T027 [US2] Implementar seção cadastral e perfil de empresa/pessoa física/profissional em `src/pages/DashboardAdmin.tsx`, com CPF/CNPJ ausente ou permitido tratado sem inventar dados
- [X] T028 [US2] Implementar seções de vagas, candidaturas, conversas e mensagens permitidas em `src/pages/DashboardAdmin.tsx`, exibindo origem, status e estados vazios
- [X] T029 [US2] Implementar seções de propostas, contratos, pagamentos, escrow, avaliações e check-ins em `src/pages/DashboardAdmin.tsx`, com valores e status simulados identificados
- [X] T030 [US2] Implementar contagens e status operacionais por cliente em `src/pages/DashboardAdmin.tsx`, garantindo deduplicação e tratamento de relações ausentes/removidas

**Checkpoint**: US1 e US2 devem funcionar juntas; o detalhe deve abrir sem nova rota e sem modificar operações.

---

## Phase 5: User Story 3 - Administrar o status da conta com segurança (Priority: P1)

**Goal**: Bloquear e desbloquear contas a partir da lista ou detalhe, mantendo a regra administrativa e impedindo alterações sensíveis.

**Independent Test**: Alternar uma conta ativa e uma bloqueada como administrador; repetir tentativa como usuário comum e confirmar recusa e ausência de alteração.

### Tests for User Story 3

- [ ] T031 [P] [US3] Criar testes de bloqueio/desbloqueio, confirmação visual, erro e recarregamento em `src/test/crm-admin-blocking.test.tsx`
- [x] T032 [P] [US3] Criar teste de contrato para impedir atualização de qualquer coluna além de `blocked` em `server/crm-admin.test.js`
- [ ] T033 [P] [US3] Criar teste de regressão para preservar as rotas operacionais de contratos e pagamentos em `server/crm-admin.test.js`

### Implementation for User Story 3

- [X] T034 [US3] Reutilizar a ação existente de atualização de `users` e restringir o fluxo visual ao campo `blocked` em `src/pages/DashboardAdmin.tsx`
- [X] T035 [US3] Adicionar confirmação, estado pendente, mensagem de sucesso/erro e atualização local da lista/detalhe em `src/pages/DashboardAdmin.tsx`
- [X] T036 [US3] Impedir no `src/pages/DashboardAdmin.tsx` a ação de bloquear/desbloquear a própria conta administrativa sem confirmação e regra explícita
- [X] T037 [US3] Validar no `server/index.js` que autorização administrativa é reavaliada no backend para cada `PATCH users`, sem confiar em `isAdmin` do frontend
- [X] T038 [US3] Validar no `server/index.js` que usuário comum não consegue consultar dados globais nem alterar bloqueio, preservando respostas de erro seguras

**Checkpoint**: US3 deve ser testável com a lista e o detalhe, sem alterar nome, e-mail, saldo, papel, senha ou operações.

---

## Phase 6: User Story 4 - Acompanhar a operação agregada (Priority: P2)

**Goal**: Adicionar linha do tempo derivada e indicadores por cliente somente a partir de registros reais existentes.

**Independent Test**: Abrir um cliente com eventos em datas diferentes, verificar ordem e origem; confirmar que bloqueios/desbloqueios não aparecem sem auditoria persistida.

### Tests for User Story 4

- [X] T039 [P] [US4] Criar testes de ordenação, origem e ausência de eventos inventados na timeline em `src/test/crm-admin-timeline.test.tsx`
- [X] T040 [P] [US4] Criar testes de indicadores derivados por cliente e de datas nulas/inválidas em `src/test/crm-admin-timeline.test.tsx`

### Implementation for User Story 4

- [X] T041 [US4] Criar normalizador de eventos derivados de `created_at` e datas operacionais em `src/pages/DashboardAdmin.tsx`, identificando tabela/origem
- [X] T042 [US4] Renderizar timeline P2 nas abas do detalhe usando componentes existentes em `src/pages/DashboardAdmin.tsx`, com fallback para ausência de eventos
- [x] T043 [US4] Adicionar indicadores derivados por cliente em `src/pages/DashboardAdmin.tsx`, sem inferir auditoria de bloqueio/desbloqueio

**Checkpoint**: P2 deve ser opcionalmente entregável após P1 e não pode introduzir auditoria fictícia ou mudar regras de negócio.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Validar qualidade, segurança, compatibilidade e documentação antes da entrega.

- [ ] T044 [P] Atualizar `src/test/dashboards.test.tsx` e testes relacionados para cobrir o painel administrativo evoluído sem quebrar empresa/profissional
- [ ] T045 [P] Revisar acessibilidade de tabela, filtros, drawer/dialog, abas, confirmações e mensagens em `src/pages/DashboardAdmin.tsx`
- [ ] T046 [P] Revisar responsividade em `src/pages/DashboardAdmin.tsx` para desktop, tablet e mobile conforme `specs/001-crm-central-admin/quickstart.md`
- [X] T047 Executar `npm test` e corrigir regressões relacionadas ao CRM sem alterar testes de fluxos não relacionados
- [X] T048 Executar `npm run build` e corrigir falhas de compilação do CRM sem alterar contratos não relacionados
- [X] T049 Executar `npm run lint` e corrigir erros introduzidos pelo CRM em `src/pages/DashboardAdmin.tsx`, `server/index.js` e testes
- [ ] T050 Executar todos os cenários de `specs/001-crm-central-admin/quickstart.md` com base real e registrar resultados sem fazer merge

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sem dependências; confirma contexto e arquivos existentes.
- **Foundational (Phase 2)**: Depende da Setup e bloqueia todas as histórias.
- **US1 (Phase 3)**: Depende da Foundational; é o MVP funcional.
- **US2 (Phase 4)**: Depende da Foundational e da projeção de dados de T009/T010; integra com a lista da US1.
- **US3 (Phase 5)**: Depende da Foundational e integra com lista/detalhe; pode ser implementada em paralelo com US2 após T009/T010, evitando edição simultânea do mesmo trecho de `DashboardAdmin.tsx`.
- **US4 (Phase 6)**: Depende de US2, pois usa o detalhe consolidado e suas relações.
- **Polish (Phase 7)**: Depende das histórias aprovadas para o release.

### User Story Dependencies

- **US1 (P1)**: Nenhuma dependência de história; inicia após Phase 2.
- **US2 (P1)**: Depende da projeção compartilhada; funcionalmente pode ser validada com uma lista mínima, mas integra após US1.
- **US3 (P1)**: Depende da autorização compartilhada; usa a lista/detalhe para a experiência completa.
- **US4 (P2)**: Depende de US2 para exibir eventos no detalhe.

### Parallel Opportunities

- T002, T003 e T004 podem executar em paralelo.
- T005, T006 e T011 podem executar em paralelo antes da implementação da UI.
- T012, T013 e T014 podem executar em paralelo.
- T022, T023 e T024 podem executar em paralelo.
- T031, T032 e T033 podem executar em paralelo.
- T039 e T040 podem executar em paralelo.
- Após a fundação, equipes separadas podem trabalhar em US1, US2 e US3, desde que evitem alterações simultâneas conflitantes em `DashboardAdmin.tsx`.
- T044, T045 e T046 podem executar em paralelo após as histórias selecionadas.

## Parallel Example: User Story 1

```text
Task: "T012 [US1] Testar indicadores e estados em src/test/crm-admin-list.test.tsx"
Task: "T013 [US1] Testar busca, filtros e ordenação em src/test/crm-admin-list.test.tsx"
Task: "T014 [US1] Testar contrato de consulta em server/crm-admin.test.js"
```

## Parallel Example: User Story 3

```text
Task: "T031 [US3] Testar bloqueio/desbloqueio em src/test/crm-admin-blocking.test.tsx"
Task: "T032 [US3] Testar payload exclusivo de blocked em server/crm-admin.test.js"
Task: "T033 [US3] Testar regressão de contratos/pagamentos em server/crm-admin.test.js"
```

## Implementation Strategy

### MVP First (US1 + autorização fundamental)

1. Concluir Phase 1 e Phase 2.
2. Implementar US1 e validar lista, indicadores, busca, filtros e estados.
3. Validar autorização backend e ausência de `password_hash`.
4. Parar no checkpoint para demonstração do MVP; não implementar P2 sem aprovação.

### Incremental Delivery

1. Entregar US1 como base administrativa pesquisável.
2. Adicionar US2 para visão consolidada.
3. Adicionar US3 para bloqueio/desbloqueio com segurança.
4. Adicionar US4 somente como P2 aprovado.
5. Executar Polish e quickstart; nenhum merge.

## Traceability

| História | Requisitos principais | Artefatos/tarefas |
|---|---|---|
| US1 | FR-001 a FR-012, FR-016 a FR-018 | T009–T021 |
| US2 | FR-010 a FR-012, FR-015 a FR-018 | T022–T030 |
| US3 | FR-002, FR-003, FR-013 a FR-015, FR-018 | T005–T008, T031–T038 |
| US4 | FR-019 e FR-020 | T039–T043 |
