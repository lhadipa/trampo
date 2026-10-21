# Research: Atualização do Produto para o Piloto Local

## Decision 1 — Escopo web responsivo

**Decision**: Implementar esta feature na aplicação web sob `src/`, validada também em viewport móvel.

**Rationale**: A especificação referencia rotas web existentes e exige desktop/celular, enquanto a aplicação web já é responsiva e possui todas as jornadas. Alterar simultaneamente o app Expo duplicaria trabalho e ampliaria o risco de divergência.

**Alternatives considered**: Web e Expo no mesmo ciclo foi rejeitado por duplicar UI e testes. Apenas landing page foi rejeitado porque publicação, seleção, taxa profissional, check-in e equipe fazem parte do escopo.

## Decision 2 — Dados mockados centralizados no cliente

**Decision**: Usar fixtures determinísticas e um serviço mockado em `src/lib`, sem novas tabelas, migrations ou endpoints.

**Rationale**: A feature não pode produzir efeitos reais. Um domínio mockado central evita espalhar números e estados pelas páginas, facilita testes e deixa clara a fronteira entre demonstração e infraestrutura existente.

**Alternatives considered**: Persistir mocks no PostgreSQL foi rejeitado por criar aparência de operação real. Reaproveitar pagamentos/escrow foi rejeitado porque contradiz o modelo. Objetos isolados em cada página foram rejeitados por duplicação.

## Decision 3 — Estado reiniciado ao recarregar

**Decision**: Manter transições mockadas apenas durante a sessão da página e restaurar as fixtures ao recarregar.

**Rationale**: O reset reforça que a experiência é uma demonstração e mantém cenários previsíveis.

**Alternatives considered**: Persistência local foi rejeitada porque ações fictícias poderiam parecer duráveis. Estado totalmente estático foi rejeitado porque não demonstraria as jornadas.

## Decision 4 — Regras monetárias como funções puras

**Decision**: Centralizar total das diárias, taxa Avulso de 12%, Pro com taxa zero e taxa profissional fixa de R$ 7,90 em funções sem efeitos colaterais.

**Rationale**: Evita divergência entre landing, publicação e painéis e facilita testes.

**Alternatives considered**: Calcular em cada tela foi rejeitado por inconsistência. Chamar API foi rejeitado por ser desnecessário na demonstração.

## Decision 5 — Seleção antes da taxa profissional

**Decision**: A sequência será interesse → seleção → apresentação da taxa mockada de R$ 7,90 → confirmação → reserva da posição.

**Rationale**: Corresponde à clarificação aprovada e evita simular cobrança para quem apenas demonstrou interesse ou não foi selecionado.

**Alternatives considered**: Taxa ao candidatar e taxa depois do trabalho foram rejeitadas por contrariar o fluxo aprovado.

## Decision 6 — Refinar o sistema visual existente

**Decision**: Manter Manrope, o laranja da marca, tokens CSS/Tailwind e componentes Radix existentes; reduzir camadas, raios exagerados, sombras redundantes e decoração sem função.

**Rationale**: Atende à instrução de não recriar componentes e aos princípios do Impeccable sem copiar sua identidade.

**Alternatives considered**: Novo kit visual e cópia do Impeccable foram rejeitados. Manter a UI sem auditoria foi rejeitado por preservar conflitos.

## Decision 7 — Reutilizar favoritos existentes para equipe

**Decision**: Evoluir favoritos já presentes no painel do contratante para representar “Equipe favorita”.

**Rationale**: A base atende ao comportamento essencial e evita criar um segundo componente equivalente.

**Alternatives considered**: Criar módulo do zero viola as instruções. Remover equipe contradiz a especificação.

## Decision 8 — Estratégia de testes

**Decision**: Combinar testes unitários, Testing Library e uma suíte Playwright pequena para responsividade, teclado e fluxo crítico.

**Rationale**: Cada nível verifica um risco diferente sem infraestrutura externa.

**Alternatives considered**: Somente snapshots não comprovam comportamento. Somente E2E seria lento e pouco preciso para cálculos.

