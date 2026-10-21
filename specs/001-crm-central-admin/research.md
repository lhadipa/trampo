# Research: CRM Central Administrativo

**Feature**: [spec.md](./spec.md)
**Date**: 2026-09-01

## Decisão 1 — Evoluir o painel existente e manter `/painel`

**Decision**: O CRM será uma evolução de `DashboardAdmin.tsx`, renderizada pelo roteamento já existente em `Dashboard.tsx` quando `isAdmin` for verdadeiro.

**Rationale**: A especificação exige preservar o fluxo, evitar uma segunda implementação e não quebrar as telas de empresa/profissional. O componente já possui indicadores, abas de usuários/vagas/pagamentos e bloqueio.

**Alternatives considered**: Criar uma nova página/rota administrativa; rejeitada por duplicar o painel e aumentar o risco de divergência de autorização e navegação.

## Decisão 2 — Manter o transporte de dados e proteger leituras globais no backend

**Decision**: Reutilizar o cliente existente e o endpoint `/api/data/:table`, aplicando a verificação administrativa às leituras globais necessárias ao CRM; manter `PATCH users` limitado a `blocked`.

**Rationale**: O cliente já injeta Bearer Token e suporta `select`, `eq`, `order` e `limit`. O servidor já possui `userFrom`, `isAdmin`, sanitização de `password_hash` e política administrativa para atualização. A leitura global atual é o ponto que precisa de proteção explícita.

**Alternatives considered**: Criar endpoint paralelo específico de CRM; rejeitada para evitar duplicação de contrato e arquitetura. Liberar a leitura baseada apenas em `isAdmin` no frontend; rejeitada por não atender ao requisito de segurança.

## Decisão 3 — Consultas relacionadas carregadas sob demanda e consolidadas por usuário

**Decision**: Carregar o conjunto mínimo para indicadores/lista e buscar relações adicionais somente ao abrir o detalhe, consolidando IDs de `users`, `companies` e `freelancers` conforme as chaves existentes.

**Rationale**: Reduz chamadas iniciais e evita baixar mensagens/operações de toda a base quando o administrador só precisa localizar um cliente. Também respeita ownership/relacionamentos reais e permite estados parciais no detalhe.

**Alternatives considered**: Baixar todas as 15 tabelas no carregamento inicial; rejeitada por custo, exposição desnecessária de mensagens/dados pessoais e maior risco de falha parcial.

## Decisão 4 — Busca/filtros no cliente para a primeira escala, com limite explícito

**Decision**: Para o alvo inicial de até 500 clientes, manter os registros de usuários e perfis necessários em memória da tela, aplicar busca/filtros/ordenação localmente e usar limite compatível com o endpoint; deixar paginação server-side como evolução se a escala exceder a meta.

**Rationale**: O cliente atual oferece `limit` mas não possui suporte a operadores de busca, intervalo ou paginação completos. A abordagem atende a meta inicial sem alterar o contrato do endpoint e torna as interações imediatas.

**Alternatives considered**: Alterar imediatamente o CRUD com novos operadores e endpoint agregado; rejeitada para P1 por ampliar o contrato e o risco de regressão. Sem limite; rejeitada porque o endpoint limita a 500 linhas.

## Decisão 5 — Indicadores calculados a partir dos registros existentes

**Decision**: Calcular totais, ativos/bloqueados, vagas abertas, contratos ativos, volume de pagamentos e custódia `held` a partir dos dados reais retornados; considerar contratos ativos como estados não finais definidos no modelo de contrato existente.

**Rationale**: Mantém a interface sem dados fictícios e compatível com a natureza simulada de pagamentos/custódia. Os critérios da especificação são verificáveis sem nova tabela agregada.

**Alternatives considered**: Criar materialização/relatório persistido; rejeitada na primeira versão por não haver necessidade nem infraestrutura existente.

## Decisão 6 — Detalhe em componente de sobreposição existente

**Decision**: Preferir `Sheet`/`Dialog` já presentes para o detalhe, com `Tabs` para separar perfil e operações; adaptar para mobile e permitir fechamento/retorno sem nova rota.

**Rationale**: Atende à exigência de visão única, reutiliza primitives instaladas e preserva o contexto da lista.

**Alternatives considered**: Nova rota de detalhes; rejeitada para manter escopo e navegação simples. Uma única seção longa; rejeitada por poluir a experiência com muitas relações.

## Decisão 7 — Linha do tempo como P2 derivada, sem auditoria inventada

**Decision**: Se implementada no ciclo P2, montar eventos somente com `created_at`/datas existentes das tabelas relacionadas e rotular a origem; não incluir bloqueio/desbloqueio histórico sem tabela de auditoria.

**Rationale**: O schema não possui `audit_logs`; inventar eventos violaria a origem real dos dados e os requisitos de segurança/precisão.

**Alternatives considered**: Inferir bloqueios pelo estado atual; rejeitada porque não fornece histórico confiável. Criar auditoria na P1; rejeitada por ampliar escopo e exigir decisão própria de retenção/visibilidade.
