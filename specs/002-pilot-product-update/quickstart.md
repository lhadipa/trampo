# Quickstart: Validar o Piloto Local Mockado

## Pré-requisitos

- Node.js 22 ou superior
- Dependências instaladas
- Nenhum provedor financeiro, chave Pix, banco ou conta real

## Preparação e execução

```powershell
npm install
npm run dev
```

Abrir `http://localhost:8080`. A API não é necessária para as jornadas mockadas; partes legadas podem usar `npm run dev:api` sem alterar schema.

## Cenário 1 — Landing e oferta

1. Abrir `/` em 1280 px e 360 px.
2. Confirmar piloto local e demonstração.
3. Confirmar sete categorias e Promoção & Vendas.
4. Confirmar Avulso 12%, Pro R$ 59,90/14 dias e R$ 7,90 após seleção.
5. Confirmar ausência de escrow, garantia anti-calote, VIP de 60 dias e cobertura nacional ativa.

## Cenário 2 — Publicação Pro e Avulso

1. Abrir `/criar-vaga` e preencher diária de R$ 150.
2. No Pro, confirmar total R$ 150 e taxa R$ 0.
3. No Avulso com quantidade 2, confirmar total R$ 300 e taxa mockada R$ 36.
4. Concluir a confirmação demonstrativa.

**Esperado**: nenhuma cobrança; mudança apenas no snapshot da sessão.

## Cenário 3 — Seleção e taxa profissional

1. Abrir `/meus-trampos` e demonstrar interesse.
2. Confirmar que R$ 7,90 não aparece como devido.
3. Simular seleção pelo contratante.
4. Confirmar o trabalho por R$ 7,90 mockados.

**Esperado**: posição reservada somente após confirmação fictícia.

## Cenário 4 — Check-in, conclusão e recibo

Executar check-in mockado, concluir turno e abrir recibo.

**Esperado**: recibo contém “Demonstração — sem validade fiscal” e não afirma verificação bancária.

## Cenário 5 — Equipe favorita

Favoritar profissional de Promoção & Vendas, iniciar convocação e alternar contratante.

**Esperado**: favoritos isolados e publicação existente reutilizada.

## Cenário 6 — Acessibilidade e robustez

Percorrer por teclado, verificar foco e títulos, ativar movimento reduzido, testar 360/768/1280 px e conteúdo longo.

**Esperado**: sem sobreposição, corte essencial ou rolagem horizontal.

## Verificações automatizadas

```powershell
npm test
npm run build
npm run lint
npx playwright test e2e/pilot-responsive.spec.ts
```

## Validação moderada e auditorias

1. Executar o protocolo de `validation-protocol.md` com pelo menos 10 participantes, divididos igualmente entre contratante e profissional.
2. Registrar apenas resultados agregados em `validation-results.md` e conferir SC-001, SC-002, SC-003, SC-005, SC-007 e SC-011 a SC-013.
3. Executar a matriz de carregamento, vazio, sucesso, erro e repetição em todas as jornadas.
4. Auditar contraste regular de 4,5:1, contraste de texto grande/controles de 3:1 e compreensão sem depender de cor.
5. Registrar evidências reproduzíveis da auditoria em `contrast-audit.md`.

## Referências

- [data-model.md](./data-model.md)
- [contracts/mock-pilot-contract.md](./contracts/mock-pilot-contract.md)
- [contracts/ui-flow-contract.md](./contracts/ui-flow-contract.md)
