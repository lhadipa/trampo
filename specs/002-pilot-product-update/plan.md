# Implementation Plan: Atualização do Produto para o Piloto Local

**Branch**: `002-pilot-product-update` | **Date**: 2026-09-30 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/002-pilot-product-update/spec.md`

## Summary

Evoluir a aplicação web responsiva existente para demonstrar o piloto local do Trampô em São João del-Rei. A entrega reposiciona landing page, publicação, painel do contratante, diárias do profissional, equipe favorita e termos; acrescenta Promoção & Vendas; simula o plano Avulso, o Pro e a taxa profissional de R$ 7,90; remove mensagens conflitantes de escrow; e refina a UI conforme princípios de hierarquia, clareza e consistência visual.

A implementação reutiliza rotas, páginas, componentes de landing e componentes de UI já existentes. O comportamento do piloto será alimentado por uma camada única de fixtures e operações mockadas no cliente, claramente identificadas como demonstração. Nenhuma cobrança, Pix, emissão fiscal, geolocalização, suspensão real, nova tabela ou integração financeira será criada.

## Technical Context

**Language/Version**: TypeScript 5.8, React 18.3; JavaScript Node.js 22 apenas no servidor existente

**Primary Dependencies**: Vite 5, React Router 6, TanStack Query 5, React Hook Form 7, Zod 3, Tailwind CSS 3, Radix UI, Lucide React

**Storage**: Fixtures TypeScript e estado local do navegador durante a demonstração; PostgreSQL e endpoints existentes permanecem disponíveis, mas não recebem novos dados financeiros ou operacionais desta feature

**Testing**: Vitest 3, Testing Library, jest-dom e Playwright já instalado para validação responsiva e de jornadas

**Target Platform**: Navegadores modernos em desktop e celular, com larguras de validação de 360 px, 768 px e 1280 px

**Project Type**: Aplicação web responsiva existente com API Express/PostgreSQL e app Expo no mesmo repositório; esta entrega altera somente a aplicação web e seus testes

**Performance Goals**: Preservar o desempenho atual da aplicação, sem introduzir carregamentos remotos nas jornadas mockadas; esta feature não estabelece um novo gate numérico de desempenho

**Constraints**: Não fazer merge; não recriar componentes do zero; não efetuar cobranças ou operações externas; não alterar schema para a demonstração; preservar autenticação e roteamento atuais; contraste WCAG AA; alvos de toque de 44 px; respeito a movimento reduzido

**Scale/Scope**: 7 categorias, 2 papéis operacionais, 3 ofertas/taxas demonstrativas, 6 jornadas/telas principais e massas pequenas de dados fictícios determinísticos

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*

A constituição existente ainda contém somente placeholders e não define princípios ratificados ou gates executáveis. Foram aplicadas as instruções vigentes do projeto e as restrições aprovadas na especificação:

- **PASS — Sem merge**: o plano não inclui merge, publicação ou alteração de branch.
- **PASS — Reutilização obrigatória**: páginas e componentes existentes serão refinados; nenhuma biblioteca visual paralela ou componente equivalente será recriado.
- **PASS — Demonstração isolada**: operações financeiras, fiscais, de presença e suspensão continuam mockadas e sem efeito externo.
- **PASS — Escopo controlado**: a aplicação web responsiva é o alvo desta feature; a implementação nativa Expo não será duplicada neste ciclo.
- **PASS — Testabilidade**: regras monetárias, estados, responsividade e acessibilidade têm contratos e cenários verificáveis.

### Post-design re-check

- O modelo de dados utiliza entidades de demonstração separadas das tabelas existentes: **PASS**.
- Os contratos são de UI e de repositório mockado, sem novo endpoint externo: **PASS**.
- O desenho referencia componentes e rotas existentes como pontos de evolução: **PASS**.
- Não há exceções que exijam registro em Complexity Tracking: **PASS**.

## Project Structure

### Documentation (this feature)

```text
specs/002-pilot-product-update/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── mock-pilot-contract.md
│   └── ui-flow-contract.md
└── tasks.md                    # gerado posteriormente por speckit-tasks
```

### Source Code (repository root)

```text
src/
├── App.tsx                     # preservar rotas e completar /equipe quando necessário
├── index.css                   # refinar tokens e regras globais existentes
├── components/
│   ├── landing/                # evoluir Navbar, Hero, HowItWorks, Categories, Pricing, CTA e Footer
│   └── ui/                     # reutilizar Button, Card, Dialog, Tabs, Badge, Input etc.
├── hooks/
│   └── useAuth.tsx             # preservar sessão e papéis atuais
├── lib/
│   ├── categories.ts           # acrescentar Promoção & Vendas
│   ├── pilotMockData.ts        # fixtures determinísticas do piloto
│   ├── pilotMockService.ts     # transições e cálculos simulados
│   └── pilotPricing.ts         # regras puras de 12%, R$ 59,90 e R$ 7,90
├── pages/
│   ├── Index.tsx
│   ├── CreateJob.tsx
│   ├── Dashboard.tsx
│   ├── DashboardCompany.tsx
│   ├── DashboardFreelancer.tsx
│   ├── Contracts.tsx
│   └── Terms.tsx
└── test/
    ├── landing-pilot.test.tsx
    ├── pilot-pricing.test.ts
    ├── pilot-company-flow.test.tsx
    ├── pilot-professional-flow.test.tsx
    └── pilot-accessibility.test.tsx

e2e/
└── pilot-responsive.spec.ts

server/
└── ...                         # preservado; nenhum endpoint novo para esta feature

mobile/
└── ...                         # fora do escopo desta entrega, sem duplicação
```

**Structure Decision**: Manter a arquitetura web atual e introduzir apenas uma camada de domínio mockado sob `src/lib`. As páginas existentes consomem cálculos e transições comuns, enquanto os componentes de UI existentes fornecem controles e superfícies. Não será criado um segundo design system, um novo dashboard ou uma API mock paralela no servidor.

## Implementation Strategy

### 1. Base visual e conteúdo comum

- Consolidar tokens existentes de cor, tipografia, espaçamento, raio, borda, sombra, foco e movimento reduzido.
- Manter Manrope e a identidade laranja/escura do Trampô, corrigindo contraste onde necessário.
- Remover padrões conflitantes: gradientes decorativos, cartões aninhados, excesso de selos, escrow e promessas de garantia.
- Criar sinalização reutilizável de “Demonstração” com componentes existentes, aplicada a ações financeiras e operacionais.

### 2. Domínio mockado central

- Criar fixtures determinísticas para estabelecimento, profissionais, vagas, posições, plano, taxas, equipe favorita, check-ins e recibos.
- Centralizar regras puras: total de diárias, 12% do Avulso, taxa zero do Pro e R$ 7,90 após seleção do profissional.
- Modelar transições sem persistência externa: interesse → seleção → taxa pendente → confirmação → check-in → conclusão/no-show.
- Garantir que recarregar a aplicação restaure o cenário conhecido, evitando aparência de operação real persistida.

### 3. Landing page e navegação

- Reescrever a proposta para o piloto local sem recriar Navbar, Hero, HowItWorks, Categories, Pricing, CTA ou Footer.
- Apresentar sete categorias e separar claramente contratante, profissional e fluxo do dinheiro.
- Ajustar navegação conforme autenticação/papel, preservando as rotas existentes.
- Aplicar composição mais plana, ação primária por contexto e texto específico.

### 4. Jornada do contratante

- Adaptar `CreateJob` para vaga individual/lote e resumo de custos mockados.
- Evoluir `DashboardCompany` para plano, validade do teste, conta, vagas, preenchimento e pendência de taxa.
- Reutilizar a área de favoritos existente para a equipe favorita; expor acesso direto somente para a mesma experiência.
- Simular confirmação da taxa Avulso sem tocar em pagamentos ou saldo reais.

### 5. Jornada do profissional

- Evoluir a visualização existente de trabalhos/contratos para vagas abertas, interesse, seleção e chamados.
- Exibir R$ 7,90 somente após seleção e antes da confirmação.
- Simular confirmação, check-in, conclusão, no-show e recibo demonstrativo.
- Remover carteira, custódia e garantia anti-calote quando conflitarem com o modelo.

### 6. Termos e confiança

- Atualizar `Terms` para o modelo demonstrativo sem custódia.
- Diferenciar valores mockados, proposta futura de monetização e ausência de cobrança real.
- Manter linguagem clara sobre pagamento direto, recibo sem validade fiscal e ausência de garantia financeira nesta demonstração.

### 7. Verificação

- Atualizar testes antigos que codificam o modelo VIP/escrow obsoleto.
- Cobrir cálculos e transições do domínio com testes unitários.
- Cobrir conteúdo e estados das páginas com Testing Library.
- Cobrir jornadas, teclado e breakpoints com Playwright.
- Executar uma matriz de estados para carregamento, vazio, sucesso, erro recuperável e repetição idempotente em todas as jornadas principais.
- Aplicar aviso explícito de demonstração antes e depois de cada ação financeira ou operacional mockada.
- Executar auditoria reproduzível dos contrastes 4,5:1 e 3:1 e registrar evidências por página.
- Executar o protocolo moderado com pelo menos 10 participantes e registrar somente resultados agregados.
- Executar build, testes e lint; registrar problemas preexistentes separadamente se estiverem fora da feature.

## Complexity Tracking

Nenhuma violação justificada. A solução reduz complexidade ao centralizar fixtures e regras mockadas e reutilizar a estrutura existente.
