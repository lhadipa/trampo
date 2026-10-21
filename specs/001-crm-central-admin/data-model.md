# Data Model: CRM Central Administrativo

## Visão lógica

O CRM não cria uma entidade persistida nova na P1. Ele projeta uma entidade de leitura, `ClienteCRM`, a partir de um registro `users` e de seus perfis/operações relacionadas.

## Entidades e campos usados

### ClienteCRM (projeção)

| Campo | Origem | Regra |
|---|---|---|
| `id` | `users.id` | Identificador interno para relações e bloqueio |
| `auth_id` | `users.auth_id` | Identificador de sessão; não usar como chave de atualização de dados |
| `name` | `users.name` | Exibição e busca |
| `email` | `users.email` | Exibição e busca |
| `type` | `users.type` | Normalizar visualmente `empresa/company`, `freelancer`, `admin` |
| `blocked` | `users.blocked` | `true` = bloqueado; `false` = ativo |
| `balance` | `users.balance` | Exibir quando aplicável, sempre como valor real retornado |
| `created_at` | `users.created_at` | Busca por período e ordenação |
| `role` | `user_roles.role` | Apoio à classificação administrativa |
| `profile` | `companies`, `individual_contractors`, `freelancers`, `public_profiles` | No máximo os perfis pertencentes ao usuário |
| `counts` | relações operacionais | Contagens derivadas sem duplicar o usuário |

### Perfil de empresa/contratante

`companies`: `id`, `user_id`, `name`, `corporate_name`, `cnpj`, `preferred_service_types`, `bio`, `created_at`.

`individual_contractors`: `id`, `user_id`, `full_name`, `cpf`, `preferred_service_types`, `bio`, `created_at`, `updated_at`.

Regra: CPF/CNPJ pode ser nulo, pendente ou ocultado; o detalhe deve representar indisponibilidade sem inventar conteúdo.

### Perfil profissional

`freelancers`: `id`, `user_id`, `category`, `service_types`, `work_types`, `experience_years`, `bio`, `created_at`.

Regra: operações que usam `freelancer_id` devem resolver o usuário por `freelancers.user_id`.

### Relações operacionais

| Relação | Chaves de ligação ao cliente |
|---|---|
| Vagas | `jobs.company_id` → `companies.user_id` |
| Candidaturas | `applications.job_id` ou `applications.freelancer_id` |
| Conversas | `conversations.company_user_id` ou `freelancer_user_id` |
| Mensagens | `messages.conversation_id` e `messages.sender_id` |
| Propostas | `proposals.company_id` ou `freelancer_id`; também vaga/candidatura |
| Contratos | `contracts.company_id` ou `freelancer_id`; também vaga |
| Pagamentos | `payments.user_id`, `from_user_id`, `to_user_id` ou `job_id` |
| Custódias | `escrow.company_user_id`, `freelancer_user_id`, `company_id` ou `freelancer_id` |
| Avaliações | `reviews.from_user` ou `to_user` |
| Check-ins | `checkins.freelancer_id` ou `contract_id` → contrato/profissional |

## Estados e regras de derivação

- Conta: `active` quando `users.blocked = false`; `blocked` quando `true`.
- Vaga aberta: `jobs.status = 'open'`.
- Custódia atual: soma de `escrow.amount` para `escrow.status = 'held'`.
- Volume financeiro registrado: soma de `payments.amount` retornados pela API, sem afirmar que é dinheiro real.
- Contrato ativo: contrato cujo status não está entre os estados finais (`RELEASED`, `COMPLETED`, `CANCELLED`, `REFUNDED`) conforme os valores realmente encontrados; a implementação deve documentar a normalização dos estados observados.
- Linha do tempo P2: eventos derivados de datas persistidas, no máximo um evento por registro e com origem/tabela identificável.

## Validações e segurança

- Nunca selecionar ou retornar `password_hash` para a projeção.
- Consultas globais e detalhe exigem administrador confirmado no backend.
- Bloqueio/desbloqueio aceita somente `blocked` e um filtro de usuário específico.
- Nenhum detalhe deve incluir relações que não tenham chave de ligação comprovada.
- Ausência de perfil/relação produz estado vazio ou indisponível, não um registro sintético.
