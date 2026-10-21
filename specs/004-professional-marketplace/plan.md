# Implementation Plan: Marketplace Profissional e Preferências Privadas

**Branch**: `004-professional-marketplace` | **Date**: 2026-09-30 | **Spec**: [spec.md](./spec.md)

## Summary

Evoluir os painéis atuais para um marketplace profissional demonstrativo com mapa interativo, lista sincronizada, preferências privadas por local, contagens agregadas para contratantes e progressão motivacional. A solução reutiliza páginas e componentes existentes, centraliza estado em um serviço mockado e mantém identidade, localização e ações sem persistência externa.

O mapa usará Leaflet com bindings React. A escolha oferece pan, zoom, marcadores, popups, eventos e controle programático sem exigir conta de provedor. O clustering será aplicado por uma extensão compatível, e a lista permanecerá a alternativa acessível e funcional quando o mapa falhar.

## Technical Context

**Language/Version**: TypeScript 5.8, React 18.3, Node.js 22

**Primary Dependencies**: React Router 6, Tailwind CSS 3, Radix UI, Leaflet, React Leaflet, plugin de agrupamento compatível com Leaflet, Turf já instalado para distâncias

**Storage**: Fixtures TypeScript e estado em memória reiniciado por recarga; PostgreSQL e API existentes não serão alterados nesta demonstração

**Testing**: Vitest 3, Testing Library, jest-dom e Playwright

**Target Platform**: Web responsiva em navegadores modernos, 360 px, 768 px e 1280 px

**Project Type**: Aplicação web React dentro do monorepo existente com API e mobile fora do escopo

**Performance Goals**: interação fluida com até 100 vagas mockadas; alterações de filtro, seleção e área visível perceptíveis em até 300 ms no conjunto de teste

**Constraints**: sem merge; sem recriar painéis ou primitivas; sem persistir localização real; sem revelar preferências individuais; sem efeito financeiro; mapa precisa ter fallback completo em lista; atribuição cartográfica visível

**Scale/Scope**: 2 papéis, 1 região-piloto, até 100 vagas, até 20 locais, 7 categorias, 5 metas e 4 selos iniciais

## Constitution Check

*GATE: passed before research and re-checked after design.*

A constituição permanece apenas com placeholders, portanto foram aplicadas as regras vigentes do projeto:

- **PASS — Sem merge**: nenhum passo inclui merge, publicação ou troca destrutiva de branch.
- **PASS — Reutilização**: `DashboardFreelancer`, `DashboardCompany`, `CreateJob`, Tabs, Card, Button, Badge, Dialog e Input serão refinados; não haverá painel paralelo.
- **PASS — Privacidade por desenho**: a consulta do contratante deriva somente agregados e não recebe registros individuais.
- **PASS — MVP mockado**: preferências, pontos, metas e coordenadas ficam em memória e são restaurados por recarga.
- **PASS — Acessibilidade**: a lista oferece todas as ações do mapa; foco, teclado e estados textuais são obrigatórios.
- **PASS — Dependência proporcional**: Leaflet resolve interação geográfica; não será introduzido um segundo design system.

### Post-design re-check

- O modelo separa preferência privada e resumo agregado: **PASS**.
- O contrato proíbe retorno de identidade na visão do contratante: **PASS**.
- Falha do mapa preserva lista, filtros e ações: **PASS**.
- Metas são idempotentes e não alteram seleção ou dinheiro: **PASS**.

## Project Structure

### Documentation

```text
specs/004-professional-marketplace/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── marketplace-ui-contract.md
│   └── preference-privacy-contract.md
└── tasks.md
```

### Source Code

```text
src/
├── components/
│   └── ui/                         # reutilizar controles existentes
├── lib/
│   ├── pilotTypes.ts               # estender entidades do marketplace
│   ├── pilotMockData.ts            # vagas, locais, metas e preferências fictícias
│   ├── pilotMockService.ts         # consultas, preferências e progressão
│   └── marketplaceGeo.ts           # bounds, aproximação e adaptação de coordenadas
├── pages/
│   ├── DashboardFreelancer.tsx     # mapa/lista, metas e preferências
│   ├── DashboardCompany.tsx        # contagens agregadas
│   └── CreateJob.tsx               # preenchimento por categoria/local agregado
└── test/
    ├── marketplace-map.test.tsx
    ├── marketplace-preferences.test.ts
    ├── marketplace-rewards.test.ts
    └── marketplace-privacy.test.ts

e2e/
└── professional-marketplace.spec.ts
```

**Structure Decision**: manter a aplicação web e sua camada mockada existentes. O mapa será incorporado dentro de `DashboardFreelancer`; não será criada uma página ou dashboard equivalente. Funções geográficas puras ficam isoladas para teste, enquanto controle visual permanece na página existente.

## Implementation Strategy

1. Estender tipos e fixtures com coordenadas aproximadas, locais, preferências, metas, eventos e recompensas.
2. Criar consultas puras para filtros, bounds, agrupamento e sincronização de seleção.
3. Integrar Leaflet no painel profissional com carregamento resiliente, atribuição e fallback de lista.
4. Acrescentar registro/remoção de preferência com explicação de privacidade.
5. Expor ao contratante somente `localId`, `categoryId` e `count` agregados.
6. Integrar metas e eventos idempotentes sem impacto na seleção.
7. Validar privacidade, mapa/lista, teclado, breakpoints e falha do provedor de tiles.

## Complexity Tracking

Nenhuma violação. A única dependência nova de domínio é a biblioteca cartográfica e seu binding React, necessários para interação real de mapa. A camada mockada existente continua como fonte única de estado.
