# Data Model: Piloto Local Mockado

## Princípios

- Todas as entidades são fixtures demonstrativas no cliente.
- Nenhuma entidade gera cobrança, transferência, documento fiscal, contratação ou presença real.
- Identificadores, nomes, contatos e chaves Pix são deliberadamente fictícios.
- Regras são centralizadas e compartilhadas pelas páginas existentes.

## PilotUser

| Campo | Tipo | Regras |
|---|---|---|
| id | string | Único e prefixado como mock |
| name | string | Nome fictício |
| role | `contractor` \| `professional` | Papel ativo |
| city | string | São João del-Rei |
| neighborhood | string | Bairro fictício ou genérico |
| accountStatus | `active` \| `suspended_mock` | Nunca altera conta real |

## ContractorProfile

| Campo | Tipo | Regras |
|---|---|---|
| id | string | Único |
| userId | string | `PilotUser` contratante |
| displayName | string | Estabelecimento fictício |
| planId | string | `PilotPlan` |
| trialEndsAt | date opcional | Apenas Pro em teste |
| favoriteProfessionalIds | string[] | Profissionais mockados |

## ProfessionalProfile

| Campo | Tipo | Regras |
|---|---|---|
| id | string | Único |
| userId | string | `PilotUser` profissional |
| categoryIds | string[] | Pelo menos uma categoria |
| roleLabel | string | Ex.: panfletista, vendedor porta a porta |
| rating | number | Mock entre 0 e 5 |
| completedShifts | number | Inteiro não negativo |
| noShowCount | number | Inteiro não negativo |
| pixAlias | string | Claramente fictício |

## ServiceCategory

| Campo | Tipo | Regras |
|---|---|---|
| id | string | Slug estável |
| name | string | Uma das sete categorias |
| description | string | Texto curto |
| roles | string[] | Funções disponíveis |
| averageDailyRange | `{ min, max }` | Apenas indicativo |

Categorias: Gastronomia & Bares; Eventos & Festas; Casa & Conservação; Obras & Reparos; Beleza & Bem-Estar; Comércio & Apoio; Promoção & Vendas.

## PilotPlan

| Campo | Tipo | Regras |
|---|---|---|
| id | `avulso` \| `pro` | Identificador estável |
| monthlyPrice | number | Avulso 0; Pro 59,90 |
| contractorFeeRate | number | Avulso 0,12; Pro 0 |
| trialDays | number | Pro 14; Avulso 0 |
| isMock | boolean | Sempre `true` |

## PilotJob

| Campo | Tipo | Regras |
|---|---|---|
| id | string | Único |
| contractorId | string | Dono mockado |
| categoryId | string | Categoria existente |
| title | string | Obrigatório |
| roleLabel | string | Obrigatório |
| mode | `individual` \| `team` | Define quantidade |
| location | string | Local fictício |
| neighborhood | string | Obrigatório |
| startsAt / endsAt | datetime | Início anterior ao fim |
| quantity | number | Inteiro maior que zero |
| dailyRate | number | Positivo |
| note | string opcional | Texto demonstrativo |
| contractorFee | number | Total × 12% no Avulso; zero no Pro |
| feeStatus | `not_applicable` \| `pending_mock` \| `confirmed_mock` | Nunca é pagamento real |
| status | `draft` \| `awaiting_fee_mock` \| `open` \| `partially_filled` \| `filled` \| `closed` | Visibilidade mockada |

**Cálculos**: `dailyTotal = quantity × dailyRate`; `contractorFee = avulso ? dailyTotal × 0,12 : 0`; arredondamento em duas casas.

## JobInterest

| Campo | Tipo | Regras |
|---|---|---|
| id | string | Único |
| jobId | string | Vaga aberta |
| professionalId | string | Profissional mockado |
| status | `interested` \| `selected` \| `declined` \| `expired` | Seleção antecede taxa |
| selectedAt | datetime opcional | Ao selecionar |
| confirmationDeadline | datetime opcional | Após seleção |

## Assignment

| Campo | Tipo | Regras |
|---|---|---|
| id | string | Único |
| jobId | string | Vaga relacionada |
| professionalId | string | Profissional selecionado |
| professionalFee | number | Sempre 7,90 |
| feeStatus | `pending_mock` \| `confirmed_mock` \| `expired_mock` | Mock apenas |
| status | `awaiting_confirmation` \| `assigned` \| `checked_in` \| `completed` \| `no_show` | Estado demonstrativo |
| confirmedAt | datetime opcional | Após taxa mockada |

```text
interested → selected → awaiting_confirmation → assigned → checked_in → completed
awaiting_confirmation → expired_mock → posição volta a open
assigned → no_show → posição volta a open com prioridade mockada
```

- R$ 7,90 não aparece antes de `selected`.
- `assigned` exige `feeStatus = confirmed_mock`.
- Assignments ativos nunca excedem `PilotJob.quantity`.

## CheckIn

| Campo | Tipo | Regras |
|---|---|---|
| id | string | Único |
| assignmentId | string | Um por assignment |
| method | `phone_mock` \| `qr_mock` | Sem GPS ou leitura real |
| status | `confirmed_mock` \| `rejected_mock` | Demonstrativo |
| createdAt | datetime | Mockado |

## MockReceipt

| Campo | Tipo | Regras |
|---|---|---|
| id | string | Único |
| assignmentId | string | Assignment concluído |
| contractorName / professionalName | string | Fictícios |
| dailyAmount | number | Diária mockada |
| directPixConfirmed | boolean | Declaração simulada |
| issuedAt | datetime | Mockado |
| disclaimer | string | “Demonstração — sem validade fiscal” |

## UIState

| Campo | Tipo | Regras |
|---|---|---|
| activeRole | `contractor` \| `professional` | Papel exibido |
| notice | string opcional | Resultado da última ação |
| pendingAction | string opcional | Confirmação atual |
| reducedMotion | boolean | Preferência do usuário |

