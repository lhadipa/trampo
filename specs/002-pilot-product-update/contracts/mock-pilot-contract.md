# Contract: Serviço do Piloto Mockado

## Objetivo

Fronteira usada pelas páginas existentes para consultar fixtures, calcular valores e executar transições demonstrativas. Não é API HTTP e não produz efeitos externos.

## Leituras

- `getPilotSnapshot()`: retorna todas as fixtures em estado determinístico.
- `getOpenJobs(professionalId)`: vagas com taxa aplicável confirmada ou não aplicável e posições disponíveis.
- `getContractorDashboard(contractorId)`: plano, teste, conta mockada, vagas, totais, preenchimento e taxa.
- `getProfessionalDashboard(professionalId)`: vagas, interesses, seleções, assignments, histórico e no-shows.

## Cálculo

`calculateJobPricing({ quantity, dailyRate, planId })` retorna `dailyTotal`, `contractorFee`, `professionalFee: 7.90` e `isMock: true`. A taxa profissional só é exibida no contexto de seleção.

## Ações

Todas retornam `{ success, snapshot, message, mock: true }`.

- `publishJobMock(draft)`: Pro abre com taxa zero; Avulso aguarda taxa mockada.
- `confirmContractorFeeMock(jobId)`: confirma 12% fictícios e abre a vaga.
- `expressInterestMock(jobId, professionalId)`: cria interesse sem taxa e é idempotente.
- `selectProfessionalMock(interestId)`: seleciona e cria assignment aguardando R$ 7,90.
- `confirmProfessionalFeeMock(assignmentId)`: exige seleção e disponibilidade; confirma taxa e reserva uma posição.
- `checkInMock(assignmentId, method)`: exige assignment confirmado e cria check-in fictício.
- `completeShiftMock(assignmentId)`: exige check-in e gera recibo sem validade fiscal.
- `markNoShowMock(assignmentId)`: registra no-show, libera posição e sinaliza prioridade mockada.
- `toggleFavoriteMock(contractorId, professionalId)`: altera somente a equipe do contratante atual.

## Erros previstos

| Código | Condição | Mensagem |
|---|---|---|
| `JOB_NOT_OPEN` | Vaga indisponível | Esta diária não está mais disponível. |
| `POSITION_UNAVAILABLE` | Quantidade preenchida | A última posição acabou de ser confirmada. |
| `NOT_SELECTED` | Taxa antes da seleção | A taxa só aparece depois da seleção. |
| `FEE_NOT_CONFIRMED` | Check-in antes da confirmação | Confirme o trabalho demonstrativo primeiro. |
| `INVALID_TRANSITION` | Ordem inválida | Esta ação não está disponível neste momento. |
| `MOCK_ONLY` | Tentativa externa | Demonstração: nenhuma operação real foi realizada. |

