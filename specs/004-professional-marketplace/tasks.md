# Tasks: Marketplace Profissional e Preferências Privadas

> **CONTINUAR EM T025** — checkpoint detalhado em [CONTINUE.md](./CONTINUE.md). Depois executar T029 e T030 antes de iniciar os agregados do contratante.

**Input**: Design documents from `specs/004-professional-marketplace/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: A especificação define privacidade, idempotência, sincronização, acessibilidade e critérios mensuráveis; por isso cada história inclui testes antes da implementação.

**Organization**: As tarefas são agrupadas por história e refinam páginas/componentes existentes. Não criar dashboard paralelo nem recriar primitivas de UI.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: pode executar em paralelo por atuar em arquivo independente
- **[Story]**: história correspondente da especificação
- Todos os caminhos são relativos à raiz do projeto

## Phase 1: Setup

**Purpose**: preparar dependências e convenções cartográficas sem alterar comportamento.

- [X] T001 Instalar Leaflet, React Leaflet, tipos TypeScript e plugin de clustering compatível em package.json e package-lock.json
- [X] T002 [P] Documentar configuração de tiles, atribuição, limites de uso e troca de provedor em docs/DESIGN.md
- [X] T003 [P] Criar estrutura E2E do marketplace em e2e/professional-marketplace.spec.ts
- [ ] T004 Registrar comandos e matriz de validação da feature em specs/004-professional-marketplace/quickstart.md

---

## Phase 2: Foundational

**Purpose**: domínio mockado e utilitários compartilhados que bloqueiam todas as histórias.

- [X] T005 [P] Estender tipos com MarketplaceJob, InterestLocation, ProfessionalPreference, PreferenceAggregate, ProfessionalGoal, ProgressEvent, RewardProfile e MapViewState em src/lib/pilotTypes.ts
- [X] T006 [P] Acrescentar coordenadas aproximadas, locais, preferências, metas e recompensas fictícias em src/lib/pilotMockData.ts
- [X] T007 [P] Escrever testes inicialmente falhos de bounds, aproximação, distância e filtragem geográfica em src/test/marketplace-geo.test.ts
- [X] T008 Implementar funções puras de bounds, aproximação, distância, filtros e ordenação em src/lib/marketplaceGeo.ts
- [X] T009 Estender snapshot/reset do serviço mockado para preferências, metas, eventos e recompensas em src/lib/pilotMockService.ts
- [X] T010 Implementar consulta de vagas por filtros/bounds e estado vazio/erro mockado em src/lib/pilotMockService.ts
- [X] T011 Executar src/test/marketplace-geo.test.ts e corrigir somente a fundação até passar

**Checkpoint**: dados e regras do marketplace estão disponíveis sem UI, banco ou API externa.

---

## Phase 3: User Story 1 — Explorar oportunidades no mapa (Priority: P1) 🎯 MVP

**Goal**: mapa interativo e lista sincronizada para encontrar vagas próximas.

**Independent Test**: mover/usar zoom, buscar na área, selecionar marcador e lista, filtrar vagas e continuar pela lista quando o mapa falhar.

### Tests

- [ ] T012 [P] [US1] Escrever testes de sincronização mapa/lista, filtros, bounds, seleção e fallback em src/test/marketplace-map.test.tsx
- [ ] T013 [P] [US1] Escrever cenário E2E de pan, zoom, clustering, “Buscar nesta área”, localização negada e falha de tiles em e2e/professional-marketplace.spec.ts
- [ ] T014 [P] [US1] Escrever testes de teclado, nomes acessíveis e alternativa equivalente em src/test/marketplace-accessibility.test.tsx

### Implementation

- [X] T015 [US1] Importar estilos e configurar ícones/atribuição do Leaflet preservando tokens existentes em src/index.css e src/pages/DashboardFreelancer.tsx
- [X] T016 [US1] Integrar MapContainer, TileLayer, controles de zoom e eventos dentro da área existente de oportunidades em src/pages/DashboardFreelancer.tsx
- [X] T017 [US1] Renderizar marcadores aproximados e resumos de vaga sem endereço sensível em src/pages/DashboardFreelancer.tsx
- [X] T018 [US1] Integrar clustering com quantidade e comportamento por zoom em src/pages/DashboardFreelancer.tsx
- [X] T019 [US1] Sincronizar seleção de marcador com destaque/rolagem da lista e seleção da lista com centralização do mapa em src/pages/DashboardFreelancer.tsx
- [X] T020 [US1] Implementar “Buscar nesta área”, centralizar em mim e retornar à região-piloto em src/pages/DashboardFreelancer.tsx
- [ ] T021 [US1] Reutilizar filtros existentes para categoria, data, valor, distância e disponibilidade em src/pages/DashboardFreelancer.tsx
- [X] T022 [US1] Implementar carregamento, mapa indisponível, retry e fallback completo em lista em src/pages/DashboardFreelancer.tsx
- [ ] T023 [US1] Executar testes US1 e validar Cenário 1 de specs/004-professional-marketplace/quickstart.md

**Checkpoint**: o mapa interativo é um MVP independente e todas as ações continuam possíveis pela lista.

---

## Phase 4: User Story 2 — Declarar preferência por um local (Priority: P1)

**Goal**: profissional registra currículo de interesse privado por local/categoria.

**Independent Test**: criar, repetir e remover preferência; confirmar que não surge candidatura nem exposição ao contratante.

### Tests

- [X] T024 [P] [US2] Escrever testes inicialmente falhos de unicidade, criação, remoção e reativação em src/test/marketplace-preferences.test.ts
- [ ] T025 [P] [US2] Escrever teste de UI para explicação de privacidade, confirmação e estado ativo em src/test/marketplace-preference-flow.test.tsx

### Implementation

- [X] T026 [US2] Implementar togglePreferenceMock idempotente e consulta privada por profissional em src/lib/pilotMockService.ts
- [X] T027 [US2] Adaptar detalhes de local/vaga para ação “Tenho preferência por trabalhar aqui” em src/pages/DashboardFreelancer.tsx
- [X] T028 [US2] Exibir claramente que preferência não é candidatura e que identidade não será mostrada em src/pages/DashboardFreelancer.tsx
- [ ] T029 [US2] Adaptar área existente do profissional para listar e remover seus locais/categorias preferidos em src/pages/DashboardFreelancer.tsx
- [ ] T030 [US2] Executar testes US2 e validar lado profissional do Cenário 2 de specs/004-professional-marketplace/quickstart.md

**Checkpoint**: a preferência privada funciona sem criar candidatura, chat ou contato.

---

## Phase 5: User Story 3 — Cumprir metas e receber recompensas (Priority: P2)

**Goal**: progressão motivacional transparente e sem efeito financeiro ou de matching.

**Independent Test**: ação elegível avança uma vez, repetição não duplica pontos e selo aparece no perfil de progresso.

### Tests

- [ ] T031 [P] [US3] Escrever testes inicialmente falhos de evento idempotente, pontos, nível e selo em src/test/marketplace-rewards.test.ts
- [ ] T032 [P] [US3] Escrever teste de UI para meta atual, progresso, recompensa e próximo objetivo em src/test/marketplace-goals-flow.test.tsx

### Implementation

- [ ] T033 [US3] Implementar recordProgressMock com chave idempotente e cálculo de recompensas em src/lib/pilotMockService.ts
- [ ] T034 [US3] Integrar eventos saudáveis de perfil, disponibilidade, exploração e conclusão nos fluxos existentes em src/pages/DashboardFreelancer.tsx e src/pages/Contracts.tsx
- [ ] T035 [US3] Adaptar resumo atual do painel para nível, pontos, meta atual e próximo objetivo em src/pages/DashboardFreelancer.tsx
- [ ] T036 [US3] Reutilizar Badge, Card e Progress existentes para selos e progresso, sem benefício financeiro ou prioridade em src/pages/DashboardFreelancer.tsx
- [ ] T037 [US3] Executar testes US3 e validar Cenário 3 de specs/004-professional-marketplace/quickstart.md

**Checkpoint**: metas são compreensíveis, idempotentes e não alteram vagas, seleção ou dinheiro.

---

## Phase 6: User Story 4 — Consultar demanda agregada (Priority: P2)

**Goal**: contratante vê somente contagens agregadas e inicia publicação sem revelar pessoas.

**Independent Test**: três preferências produzem contagem três; nenhum identificador individual chega à visão; publicação recebe somente categoria/local.

### Tests

- [ ] T038 [P] [US4] Escrever contrato de privacidade inicialmente falho garantindo apenas locationId/categoryId/count em src/test/marketplace-privacy.test.ts
- [ ] T039 [P] [US4] Escrever teste de UI de agregados, estado vazio e ausência de detalhes pessoais em src/test/marketplace-demand-flow.test.tsx

### Implementation

- [ ] T040 [US4] Implementar getPreferenceAggregates sem retornar registros individuais em src/lib/pilotMockService.ts
- [ ] T041 [US4] Adaptar área existente do contratante para contagens totais e por categoria em src/pages/DashboardCompany.tsx
- [ ] T042 [US4] Implementar estado vazio e explicação de privacidade sem ação de revelar/contatar em src/pages/DashboardCompany.tsx
- [ ] T043 [US4] Navegar para publicação preenchendo somente local e categoria em src/pages/DashboardCompany.tsx
- [ ] T044 [US4] Consumir estado de navegação sem candidatos pré-selecionados em src/pages/CreateJob.tsx
- [ ] T045 [US4] Executar testes US4 e validar lado contratante do Cenário 2 de specs/004-professional-marketplace/quickstart.md

**Checkpoint**: contratante usa sinal agregado sem acesso a identidade ou contato.

---

## Phase 7: Polish & Cross-Cutting Concerns

- [ ] T046 Auditar ausência de nome, contato, id profissional, timestamp e posição individual na visão agregada em src/pages/DashboardCompany.tsx e src/lib/pilotMockService.ts
- [ ] T047 [P] Validar atribuição, política de tiles, ausência de prefetch e configuração substituível em src/pages/DashboardFreelancer.tsx e docs/DESIGN.md
- [ ] T048 Remover textos conflitantes de recompensa financeira, ranking de seleção e currículo público em src e src/test
- [ ] T049 Executar npm test e corrigir regressões relacionadas à feature nos arquivos alterados
- [ ] T050 Executar npm run build e corrigir erros de compilação relacionados à feature
- [ ] T051 Executar npm run lint e separar violações preexistentes das introduzidas pela feature
- [ ] T052 Executar npx playwright test e validar os três cenários de specs/004-professional-marketplace/quickstart.md
- [ ] T053 Validar 360, 768 e 1280 px, teclado, leitor de tela, localização negada e movimento reduzido em e2e/professional-marketplace.spec.ts
- [ ] T054 Revisar implementação contra specs/004-professional-marketplace/spec.md e registrar diferenças no checklist da feature
- [X] T055 Exigir endereço do trabalho e integrar preenchimento por CEP com fallback manual em src/pages/CreateJob.tsx

---

## Dependencies & Execution Order

```text
Setup → Foundation
             ├→ US1 mapa/lista ──┐
             ├→ US2 preferência ─┼→ US4 agregados
             └→ US3 recompensas ─┘
                               → Polish
```

- US1 e US2 são P1 e podem começar após Foundation, mas edições em `DashboardFreelancer.tsx` devem ser sequenciais.
- US3 começa após Foundation e integra ações já existentes; não depende funcionalmente do mapa.
- US4 depende da regra de preferência de US2, embora seus testes de contrato possam ser escritos antes.
- Dentro de cada história: testes → serviço/modelo → UI → validação.

## Parallel Opportunities

- T002 e T003 podem rodar em paralelo após T001.
- T005, T006 e T007 atuam em arquivos diferentes.
- Testes marcados `[P]` dentro de cada história podem ser escritos em paralelo.
- Após Foundation, o serviço de recompensas de US3 pode avançar enquanto a UI do mapa de US1 é construída.
- T038/T039 podem ser preparados enquanto US2 é implementada, sem alterar arquivos produtivos.

## Independent Test Criteria

- **US1**: mapa interativo e lista sincronizados, com filtros e fallback sem mapa.
- **US2**: preferência privada idempotente e removível, sem candidatura automática.
- **US3**: meta avança uma vez, recompensa aparece e não afeta matching/dinheiro.
- **US4**: contratante recebe exclusivamente contagens agregadas e publica por categoria/local.

## Implementation Strategy

### MVP First

1. Setup e Foundation.
2. US1 completa: mapa interativo + lista.
3. Parar e validar acessibilidade, tiles, localização negada e fallback.
4. Adicionar US2 como segundo incremento P1.

### Incremental Delivery

1. Base geográfica e dados mockados.
2. Mapa/lista interativos.
3. Preferências privadas.
4. Metas e recompensas.
5. Agregados do contratante.
6. Auditoria final de privacidade e acessibilidade.

## Safe Execution Rules

- Nunca fazer merge.
- Não recriar dashboards ou componentes UI existentes.
- Não persistir localização real, preferências ou progresso no banco.
- Não revelar registros individuais ao contratante, nem apenas escondê-los visualmente.
- Não usar recompensas como dinheiro, desconto, ranking ou prioridade.
- Não bloquear a lista quando o mapa ou a localização falharem.
