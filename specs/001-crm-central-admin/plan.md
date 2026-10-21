# Implementation Plan: CRM Central Administrativo

**Branch**: `001-crm-central-admin` | **Date**: 2026-09-01 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-crm-central-admin/spec.md`

**Note**: This template is filled in by the `$speckit-plan` command; its definition describes the execution workflow.

## Summary

Evoluir o `src/pages/DashboardAdmin.tsx`, acessado pelo fluxo existente `/painel`, para oferecer uma visão centralizada e protegida de clientes, perfis e operações reais do Trampô. A solução mantém o cliente de integração atual, reutiliza `useAuth` e os componentes UI existentes, adiciona autorização administrativa também às leituras globais do backend e organiza consultas relacionadas para evitar duplicação e vazamento entre clientes.

A primeira entrega implementável cobre P1: autorização, indicadores reais, lista com busca/filtros/ordenação, detalhe consolidado e bloqueio/desbloqueio. A linha do tempo e indicadores derivados por cliente ficam como P2 e serão implementados somente se incluídos no escopo aprovado de tarefas.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript/TSX no frontend com React 18.3, JavaScript ESM no backend com Node.js 22+, Express 5.1

**Primary Dependencies**: Vite, React Router 6, TanStack React Query 5 já instalado, cliente de integração local em `src/integrations/supabase/client.ts`, componentes shadcn/Radix existentes, `lucide-react`, PostgreSQL via `pg`, JWT existente

**Storage**: PostgreSQL existente definido por `server/schema.sql`; sem nova tabela ou migração necessária para P1

**Testing**: Vitest, Testing Library, testes de integração/contrato do backend a definir conforme harness existente, `npm test`, `npm run build` e `npm run lint`

**Target Platform**: Navegadores desktop, tablet e mobile; API Node.js em ambiente local/Render/Vercel conforme configuração existente

**Project Type**: Aplicação web React + API Express/PostgreSQL

**Performance Goals**: Para até 500 clientes, busca/filtro com retorno percebido em até 2 segundos em 95% das ações; abertura do detalhe em até 30 segundos de tarefa do administrador

**Constraints**: Leituras globais somente para administradores no backend; nunca expor `password_hash`; alterar somente `users.blocked`; preservar `/painel`, autenticação, contratos e pagamentos; evitar chamadas repetidas desnecessárias; não introduzir biblioteca nova; sem dados fictícios; sem merge

**Scale/Scope**: Uma tela administrativa existente, 15 tabelas disponíveis, até 500 clientes no alvo inicial, relações de vagas/candidaturas/conversas/propostas/contratos/pagamentos/custódias/avaliações/check-ins; P1 no primeiro ciclo, P2/P3 fora do aceite inicial

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Gate: PASS (com ressalva documental)** — `constitution.md` ainda contém placeholders e não define princípios ratificados, restrições adicionais ou gates executáveis. As decisões do plano seguem as regras explícitas da especificação e do usuário: reutilização do painel/componentes existentes, segurança backend, testes, compatibilidade retroativa e nenhum merge.

**Gate de segurança: PASS condicionado à implementação** — nenhuma leitura global pode ser liberada antes da verificação administrativa no backend; respostas devem continuar sanitizando segredos; alteração permanece limitada a `blocked`.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file ($speckit-plan command output)
├── research.md          # Phase 0 output ($speckit-plan command)
├── data-model.md        # Phase 1 output ($speckit-plan command)
├── quickstart.md        # Phase 1 output ($speckit-plan command)
├── contracts/           # Phase 1 output ($speckit-plan command)
└── tasks.md             # Phase 2 output ($speckit-tasks command - NOT created by $speckit-plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
src/
├── pages/
│   ├── Dashboard.tsx              # roteamento existente por perfil
│   └── DashboardAdmin.tsx         # painel único evoluído para CRM
├── hooks/
│   └── useAuth.tsx                # sessão, perfil, isAdmin e signOut reutilizados
├── integrations/supabase/
│   └── client.ts                  # transporte de sessão e consultas existentes
├── components/ui/                 # Table, Tabs, Card, Dialog/Sheet, Input, Select, etc.
└── test/                          # suíte Vitest/Testing Library existente

server/
├── index.js                       # autorização e CRUD /api/data/:table existentes
└── schema.sql                     # modelo PostgreSQL existente
```

**Structure Decision**: Manter a estrutura web monolítica atual. A UI será evoluída no `DashboardAdmin.tsx` e, se necessário, apoiada por funções/consultas locais no mesmo módulo ou por utilitários já existentes; não criar pacote, página, rota ou painel administrativo paralelo. A autorização de leituras globais será ajustada no `server/index.js`, preservando as rotas operacionais e o contrato do CRUD.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Nenhuma | N/A | A estrutura existente atende à feature; não há violação constitucional ratificada que exija justificativa adicional. |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
