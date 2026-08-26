# SPEC — Evolução do App Trampô

## 1. Objetivo

Analisar o que já existe no aplicativo Trampô e evoluir a aplicação para um fluxo completo, seguro e intuitivo de contratação de freelancers.

O objetivo não é recriar o projeto do zero.

A execução deve:

- preservar o que já está funcional;
- identificar telas, componentes, rotas, tabelas e regras existentes;
- reaproveitar a arquitetura atual sempre que tecnicamente viável;
- corrigir lacunas de segurança;
- completar os fluxos de empresa e freelancer;
- estruturar contratação, execução do serviço e pagamento;
- melhorar a experiência mobile;
- evitar duplicação de telas ou regras já implementadas.

O produto deve ser tratado como um **aplicativo mobile-first de marketplace de freelancers**, e não apenas como um sistema de vagas.

---

# 2. Regra principal de execução

Antes de implementar qualquer alteração:

1. analisar o projeto existente;
2. mapear o que já foi desenvolvido;
3. identificar componentes reutilizáveis;
4. identificar rotas existentes;
5. identificar tabelas e relacionamentos existentes;
6. identificar integrações com Supabase;
7. identificar regras de autenticação e autorização;
8. verificar o fluxo atual no app;
9. comparar o estado atual com esta SPEC;
10. implementar somente o que estiver faltando ou precisar ser corrigido.

Não criar uma segunda implementação de uma funcionalidade já existente.

Se existir algo parcialmente implementado, completar a implementação existente.

---

# 3. Contexto atual identificado

O projeto atualmente possui ou aparenta possuir:

## Autenticação

- Login;
- Cadastro;
- Supabase Auth;
- AuthProvider;
- leitura de perfil;
- leitura de roles;
- roteamento baseado no tipo de usuário;
- modo demonstração.

## Perfis

Existem fluxos separados para:

- Empresa;
- Freelancer;
- Administrador.

## Banco

Já foram identificadas estruturas semelhantes a:

```text
users
user_roles
companies
freelancers
jobs
applications
conversations
messages
payments
escrow
```

## Empresa

Já existem conceitos relacionados a:

- publicar vaga;
- visualizar candidaturas;
- criar ou abrir conversa;
- desbloquear chat;
- liberar custódia;
- gerar recibo.

## Freelancer

Já existem conceitos relacionados a:

- criar perfil profissional;
- visualizar vagas;
- enviar candidatura;
- acompanhar candidatura;
- enviar mensagens;
- confirmar check-in.

## Administrador

Já existem funcionalidades relacionadas a:

- consultar usuários;
- consultar vagas;
- consultar pagamentos;
- bloquear/desbloquear usuários;
- consultar custódias.

Tudo isso deve ser validado diretamente no código antes de qualquer alteração.

---

# 4. Problema estrutural atual

O fluxo atual está centrado principalmente em:

```text
Vaga
→ Candidatura
→ Chat
→ Pagamento
```

O fluxo correto do produto deve ser:

```text
Descoberta
→ Vaga
→ Candidatura
→ Seleção
→ Proposta
→ Contratação
→ Pagamento protegido
→ Trabalho agendado
→ Check-in
→ Execução
→ Check-out
→ Confirmação
→ Liberação de pagamento
→ Avaliação
```

A principal entidade operacional do aplicativo depois da aceitação não deve continuar sendo apenas a vaga ou candidatura.

Deve existir o conceito de:

# Contratação / Contract

---

# 5. Arquitetura funcional esperada

O aplicativo deve possuir cinco fluxos principais:

```text
1. Autenticação e onboarding
2. Descoberta e candidatura
3. Contratação
4. Execução do trabalho
5. Pagamento e pós-serviço
```

Além de três camadas transversais:

```text
Segurança
Notificações
Administração
```

---

# 6. Fluxo de autenticação

## Validar o que já existe

Antes de alterar:

- verificar Supabase Auth;
- verificar persistência de sessão;
- verificar refresh de token;
- verificar logout;
- verificar AuthProvider;
- verificar proteção das rotas.

## Fluxo desejado

```text
Abrir App
↓
Sessão válida?
├── Sim → Home
└── Não → Login/Cadastro
```

Após cadastro:

```text
Cadastro
↓
Escolher perfil
├── Quero contratar
└── Quero trabalhar
```

Nunca utilizar apenas o frontend para determinar permissões.

---

# 7. Segurança de roles

O `AuthProvider` pode decidir o que aparece na interface.

Porém:

> autorização real deve existir no backend/Supabase.

Não considerar seguro algo como:

```javascript
if (user.role === "admin")
```

Isso serve apenas para interface.

Todas as ações sensíveis devem validar permissão no servidor ou via políticas RLS.

---

# 8. Row Level Security

Analisar se as tabelas atuais possuem RLS.

Caso não possuam, implementar políticas apropriadas.

Prioridade:

```text
users
user_roles
companies
freelancers
jobs
applications
conversations
messages
contracts
payments
escrow
reviews
disputes
```

Exemplos de regras:

### Freelancer

Pode:

- visualizar e editar apenas seu perfil;
- visualizar vagas públicas;
- visualizar suas candidaturas;
- visualizar contratos dos quais participa;
- visualizar conversas das quais participa.

### Empresa

Pode:

- editar apenas sua empresa;
- gerenciar suas próprias vagas;
- visualizar candidaturas referentes às suas vagas;
- visualizar contratos dos quais participa.

### Admin

Permissões explícitas conforme função administrativa.

---

# 9. Não utilizar LocalStorage como fonte de verdade

O projeto atualmente utiliza `LocalStorage`.

Realizar auditoria completa de tudo o que é armazenado nele.

LocalStorage pode guardar:

```text
tema
preferências visuais
filtros
onboarding visual
modo demonstração
```

Não pode determinar:

```text
role
pagamento
check-in
check-out
contrato
liberação financeira
saldo
custódia
estado do trabalho
```

Qualquer dado operacional deve ser persistido no backend.

---

# 10. Onboarding do Freelancer

Criar ou completar fluxo mobile:

```text
Criar conta
↓
Selecionar "Quero trabalhar"
↓
Dados básicos
↓
Foto
↓
Cidade/região
↓
Categorias
↓
Habilidades
↓
Experiência
↓
Disponibilidade
↓
Portfólio
↓
Validação de perfil
↓
Home
```

Mostrar indicador:

```text
Perfil 80% completo
```

Não impedir necessariamente o uso inicial do app, mas sinalizar os itens que aumentam as chances de contratação.

---

# 11. Perfil do Freelancer

O perfil deve contemplar:

```text
Foto
Nome
Cidade
Bio
Categorias
Habilidades
Experiência
Portfólio
Disponibilidade
Avaliações
Quantidade de trabalhos
Taxa de comparecimento
Status de verificação
```

Exemplo:

```text
João Silva
✓ Perfil verificado

4,8 ★
32 trabalhos realizados
97% de comparecimento
```

---

# 12. Onboarding da Empresa

Fluxo esperado:

```text
Criar conta
↓
Selecionar "Quero contratar"
↓
Pessoa ou empresa
↓
Nome / Razão social
↓
CPF/CNPJ
↓
Localização
↓
Responsável
↓
Contato
↓
Verificação
↓
Publicar primeiro trabalho
```

---

# 13. Perfil da Empresa

Mostrar:

```text
Nome
Logo/foto
Descrição
Localização
Status de verificação
Nota
Quantidade de contratações
Histórico
Avaliações recebidas
```

Exemplo:

```text
Restaurante XPTO
✓ Empresa verificada

4,7 ★
86 contratações
```

---

# 14. Home do Freelancer

A Home não deve ser apenas uma listagem genérica.

Estrutura recomendada:

```text
Header
Busca
Categorias
Vagas recomendadas
Vagas próximas
Trabalhos recentes
```

Filtros:

```text
Categoria
Localização
Distância
Valor
Data
Horário
Presencial/remoto
```

Adicionar possibilidade de:

```text
Salvar vaga
```

---

# 15. Card de vaga

O card deve ser legível rapidamente em tela mobile.

Exemplo:

```text
Garçom para evento

R$ 180
Sábado • 19h às 01h

3,2 km

Empresa verificada
4,8 ★

Pagamento protegido pelo Trampô
```

Ações:

```text
Ver detalhes
Salvar
```

---

# 16. Detalhes da vaga

Mostrar:

```text
Título
Empresa
Descrição
Valor
Data
Horário
Duração
Quantidade de vagas
Localização aproximada
Categoria
Requisitos
Forma de contratação
Política de cancelamento
Status da empresa
```

CTA:

```text
Candidatar-se
```

---

# 17. Fluxo de candidatura

Fluxo:

```text
Vaga
↓
Candidatar-se
↓
Revisar candidatura
↓
Enviar
↓
Candidatura enviada
```

Status possíveis:

```text
ENVIADA
EM_ANALISE
SELECIONADA
RECUSADA
CANCELADA
CONTRATADA
```

O freelancer precisa acompanhar isso em uma tela:

# Minhas candidaturas

---

# 18. Fluxo da empresa após publicar vaga

Empresa deve acessar:

```text
Minhas vagas
↓
Abrir vaga
↓
Ver candidatos
```

Para cada freelancer:

```text
Foto
Nome
Nota
Experiência
Distância
Trabalhos realizados
Status de verificação
```

Ações:

```text
Ver perfil
Conversar
Selecionar
Recusar
```

---

# 19. Criar etapa explícita de seleção

Hoje existe um salto entre candidatura e conversa/pagamento.

Adicionar:

```text
Candidatura
↓
Selecionar freelancer
↓
Criar proposta
```

---

# 20. Proposta

Criar a entidade ou estrutura necessária para representar:

```text
proposal
```

Campos sugeridos:

```text
id
job_id
application_id
company_id
freelancer_id
amount
start_at
end_at
description
status
created_at
accepted_at
rejected_at
```

Estados:

```text
PENDING
ACCEPTED
REJECTED
EXPIRED
CANCELLED
```

---

# 21. Contratação / Contract

Ao aceitar a proposta:

```text
proposal
↓
contract
```

Criar ou validar uma tabela equivalente.

Campos mínimos:

```text
id
job_id
company_id
freelancer_id

amount
platform_fee
freelancer_amount

start_at
end_at

location
description

status

payment_id
escrow_id

created_at
accepted_at
started_at
completed_at
cancelled_at
```

---

# 22. Máquina de estados do contrato

Implementar formalmente.

```text
DRAFT
↓
AWAITING_ACCEPTANCE
↓
AWAITING_PAYMENT
↓
PAYMENT_PROCESSING
↓
FUNDS_SECURED
↓
SCHEDULED
↓
IN_PROGRESS
↓
AWAITING_COMPLETION_CONFIRMATION
↓
COMPLETED
↓
RELEASE_PENDING
↓
RELEASED
```

Estados alternativos:

```text
CANCELLED
DISPUTED
REFUND_PENDING
REFUNDED
NO_SHOW_FREELANCER
NO_SHOW_COMPANY
```

Não utilizar vários booleanos como:

```text
is_paid
is_finished
is_cancelled
is_active
```

para representar o estado principal.

Utilizar um estado explícito.

---

# 23. Tela "Meus Trampos"

Criar como área central para o freelancer.

Categorias:

```text
Candidaturas
Próximos
Em andamento
Concluídos
Cancelados
```

Card de trabalho futuro:

```text
Garçom • Evento XPTO

Hoje • 19:00

R$180

Começa em 2h30

[Ver detalhes]
```

---

# 24. Área da empresa

Criar ou evoluir:

# Minhas Contratações

Estados:

```text
Aguardando aceite
Aguardando pagamento
Agendadas
Em andamento
Aguardando confirmação
Finalizadas
Problemas
```

---

# 25. Pagamento

Antes de implementar, analisar a integração financeira já existente.

O frontend nunca deve definir o pagamento como aprovado diretamente.

Fluxo esperado:

```text
Empresa
↓
Criar pagamento
↓
Backend
↓
Gateway
↓
Pagamento
↓
Webhook
↓
Backend valida webhook
↓
payments
↓
escrow
```

---

# 26. Webhooks

Todos os webhooks financeiros devem:

- validar assinatura;
- validar origem;
- ser idempotentes;
- armazenar evento processado;
- impedir reprocessamento financeiro.

Criar, se necessário:

```text
payment_events
```

Campos:

```text
id
provider
provider_event_id
event_type
payload_hash
processed_at
status
```

---

# 27. Idempotência

Aplicar idempotência em:

```text
criação de pagamento
confirmação de pagamento
criação de custódia
liberação
reembolso
cancelamento
```

Nunca permitir pagamento/liberação duplicados por clique duplo ou webhook duplicado.

---

# 28. Custódia / Escrow

Analisar a estrutura já existente.

Fluxo esperado:

```text
Pagamento aprovado
↓
FUNDS_SECURED
↓
Trabalho realizado
↓
Confirmação
↓
Release
```

A empresa não deve conseguir liberar valores de contratos alheios.

O freelancer não deve conseguir liberar o próprio pagamento.

---

# 29. Check-in

Remover qualquer dependência operacional de LocalStorage.

Criar estrutura equivalente:

```text
checkins
```

Campos:

```text
id
contract_id
freelancer_id
method
timestamp
status
metadata
```

Métodos possíveis:

```text
PIN
QR_CODE
GPS
MANUAL_ADMIN
```

Para MVP, preferir:

# PIN de check-in

Fluxo:

```text
Trabalho próximo
↓
Check-in disponível
↓
Freelancer informa código
↓
Backend valida
↓
Check-in confirmado
↓
Contrato → IN_PROGRESS
```

---

# 30. Check-out

Criar fluxo complementar.

```text
Trabalho em andamento
↓
Finalizar trabalho
↓
Check-out
↓
Aguardando confirmação da empresa
```

Criar estrutura:

```text
checkouts
```

ou utilizar uma estrutura única de eventos operacionais.

---

# 31. Confirmação de conclusão

Após o freelancer finalizar:

Empresa recebe:

```text
"João informou que o serviço foi concluído."
```

Ações:

```text
Confirmar serviço
Reportar problema
```

Caso confirme:

```text
contract
→ COMPLETED
→ RELEASE_PENDING
→ RELEASED
```

---

# 32. No-show

Criar suporte para:

```text
Freelancer não apareceu
Empresa não apareceu
```

Ações disponíveis durante período permitido:

```text
Reportar ausência
```

Criar evento e impedir liberação automática até resolução.

---

# 33. Disputa

Criar entidade:

```text
disputes
```

Campos:

```text
id
contract_id
opened_by
reason
description
status
created_at
resolved_at
resolved_by
resolution
```

Status:

```text
OPEN
UNDER_REVIEW
RESOLVED
REJECTED
```

Possíveis resoluções:

```text
FULL_RELEASE
FULL_REFUND
PARTIAL_RELEASE
PARTIAL_REFUND
```

---

# 34. Evidências

Criar suporte a:

```text
dispute_evidence
```

Permitindo:

```text
texto
imagem
comprovante
referência a mensagem
check-in
check-out
```

Não permitir upload arbitrário sem validação de formato/tamanho.

---

# 35. Cancelamento

Criar fluxo explícito.

Antes do trabalho:

```text
Cancelar contratação
↓
Exibir política
↓
Confirmar
↓
Calcular impacto
↓
Atualizar contrato
↓
Processar eventual reembolso
```

Não simplesmente excluir registros.

---

# 36. Reembolso

Criar estrutura:

```text
refunds
```

Campos mínimos:

```text
id
payment_id
contract_id
amount
reason
status
provider_ref
created_at
processed_at
```

Estados:

```text
PENDING
PROCESSING
COMPLETED
FAILED
```

---

# 37. Avaliações

Após conclusão:

```text
Empresa → avalia freelancer
Freelancer → avalia empresa
```

Criar:

```text
reviews
```

Campos:

```text
contract_id
reviewer_id
reviewed_id
rating
comment
created_at
```

Somente participantes de contrato concluído podem avaliar.

Uma avaliação por participante por contrato.

---

# 38. Reputação

Calcular métricas de maneira server-side.

Freelancer:

```text
rating_average
jobs_completed
attendance_rate
completion_rate
```

Empresa:

```text
rating_average
hires_count
cancellation_rate
```

Evitar permitir atualização direta dessas métricas pelo frontend.

---

# 39. Chat

Analisar a implementação atual antes de alterar.

Garantir que apenas usuários autorizados participem da conversa.

Criar ou validar:

```text
conversation_participants
```

Regra:

```text
usuário só pode ler mensagens
se participar da conversation
```

---

# 40. Segurança do chat

Adicionar:

```text
denunciar mensagem
bloquear usuário
rate limiting
proteção anti-spam
```

Não permitir que um usuário consulte mensagens modificando manualmente o `conversation_id`.

---

# 41. Notificações

Criar camada central:

```text
notifications
```

Eventos:

```text
Nova candidatura
Nova mensagem
Candidatura selecionada
Proposta recebida
Proposta aceita
Pagamento confirmado
Trabalho amanhã
Trabalho em 1 hora
Check-in disponível
Serviço concluído
Pagamento liberado
Avaliação pendente
Disputa atualizada
```

---

# 42. Push mobile

Como o produto é um app, preparar arquitetura para push notification.

Considerar:

```text
device_tokens
```

Campos:

```text
user_id
device_token
platform
enabled
last_seen_at
```

Não depender exclusivamente de notificações dentro da aplicação.

---

# 43. Navegação mobile

Evitar arquitetura visual de dashboard web.

Para freelancer, considerar bottom navigation:

```text
Início
Explorar
Trampos
Mensagens
Perfil
```

Para empresa:

```text
Início
Vagas
Contratações
Mensagens
Perfil
```

O fluxo deve ser otimizado para uso com uma mão e telas pequenas.

---

# 44. Estados de interface obrigatórios

Todas as telas que dependem de dados devem tratar:

```text
loading
empty
success
error
offline
permission denied
```

Exemplo:

Não mostrar tela vazia quando não existir candidatura.

Mostrar:

```text
Você ainda não se candidatou a nenhum trampo.
```

---

# 45. Tratamento offline

Como é aplicativo, analisar comportamento sem conexão.

Não permitir que ações financeiras ou contratuais sejam tratadas como concluídas localmente.

Para ações sensíveis:

```text
mostrar erro
permitir tentar novamente
```

Não utilizar optimistic update em:

```text
pagamento
check-in
check-out
contratação
cancelamento
liberação
```

sem mecanismo robusto de reconciliação.

---

# 46. Segurança de API

Auditar:

```text
inputs
IDs
queries
mutations
uploads
```

Aplicar:

- validação server-side;
- sanitização quando necessário;
- rate limiting;
- verificação de ownership;
- proteção contra IDOR;
- limite de tamanho de payload;
- validação de upload.

---

# 47. IDOR

Testar especificamente casos como:

```text
/api/contracts/123
/api/contracts/124
```

Alterar ID manualmente nunca pode permitir consultar contrato de outro usuário.

Mesmo princípio para:

```text
applications
messages
payments
escrow
reviews
disputes
```

---

# 48. Admin

Analisar o painel atual.

Não utilizar apenas:

```text
admin
```

como permissão universal caso o sistema cresça.

Preparar papéis como:

```text
support
moderator
finance
operations
super_admin
```

Para MVP, pode continuar simples desde que a arquitetura não dependa exclusivamente do frontend.

---

# 49. Audit Logs

Criar:

```text
audit_logs
```

Registrar ações administrativas sensíveis:

```text
bloquear usuário
desbloquear
alterar status
resolver disputa
reembolsar
liberar pagamento manualmente
alterar permissão
```

Campos:

```text
actor_id
action
entity_type
entity_id
before
after
reason
created_at
```

---

# 50. Verificação de usuários

Criar status para empresa/freelancer:

```text
UNVERIFIED
PENDING
VERIFIED
REJECTED
```

Inicialmente pode existir apenas:

```text
email
telefone
CPF/CNPJ
```

Não criar tecnologia própria para validação documental avançada caso um fornecedor externo seja mais adequado.

---

# 51. LGPD

Criar ou validar:

```text
Termos de uso
Política de privacidade
Consentimentos
Excluir conta
Solicitar dados
```

Registrar consentimentos importantes.

Não excluir registros financeiros que legalmente precisem ser mantidos apenas porque o usuário excluiu o perfil.

---

# 52. Estruturas adicionais sugeridas

Após analisar o banco atual, criar somente as ausentes necessárias.

Possíveis tabelas:

```text
contracts
proposals
contract_events
checkins
checkouts
reviews
disputes
dispute_evidence
refunds
notifications
notification_preferences
device_tokens
conversation_participants
user_blocks
reports
audit_logs
security_events
payment_events
user_verifications
saved_jobs
```

---

# 53. Contract Events

Recomendado criar:

```text
contract_events
```

Para registrar timeline imutável.

Exemplo:

```text
CONTRACT_CREATED
PROPOSAL_ACCEPTED
PAYMENT_STARTED
PAYMENT_CONFIRMED
CHECKIN_CONFIRMED
CHECKOUT_CONFIRMED
COMPLETION_REQUESTED
CONTRACT_COMPLETED
PAYMENT_RELEASED
```

Campos:

```text
contract_id
event_type
actor_id
metadata
created_at
```

Isso facilita:

- suporte;
- auditoria;
- disputas;
- debugging.

---

# 54. Regras de integridade

Implementar proteções como:

```text
freelancer não pode se candidatar duas vezes à mesma vaga
```

```text
empresa não pode contratar usuário para vaga de outra empresa
```

```text
usuário não pode avaliar contrato que não participou
```

```text
contrato não pode ser concluído antes de começar
```

```text
pagamento não pode ser liberado duas vezes
```

```text
check-in não pode ocorrer após contrato cancelado
```

---

# 55. UX de ações críticas

Toda ação irreversível deve ter confirmação adequada.

Exemplos:

```text
Cancelar contratação?
```

```text
Liberar R$ 180 para João?
```

```text
Reportar ausência?
```

Evitar modais excessivos para ações simples.

---

# 56. Home baseada no momento do usuário

Se houver trabalho próximo, ele deve ter prioridade sobre descoberta.

Exemplo:

```text
Seu próximo trampo

Hoje • 19:00
Garçom • Restaurante XPTO

Check-in disponível às 18:30
```

E abaixo:

```text
Novos trampos para você
```

---

# 57. Estados prioritários para o app

O app deve sempre responder:

### Freelancer

```text
Onde vou trabalhar?
Quando?
Quanto vou receber?
Qual o status?
O pagamento está protegido?
O que eu preciso fazer agora?
```

### Empresa

```text
Quem contratei?
Quem chegou?
Quem está trabalhando?
Quanto vou pagar?
Existe algum problema?
O que preciso fazer agora?
```

Se essas respostas não estiverem evidentes na interface, o fluxo deve ser revisado.

---

# 58. Não criar funcionalidades desnecessárias no MVP

Não priorizar agora:

```text
gamificação
feed social
IA de recomendação complexa
ranking avançado
chatbot
NFT
sistema de pontos
features cosméticas
```

Antes disso, garantir:

```text
contratação
pagamento
check-in
execução
conclusão
disputa
reputação
```

---

# 59. Prioridade P0

Obrigatório antes de operar com pagamentos reais:

- auditoria completa da autenticação;
- RLS;
- ownership server-side;
- correção de dados críticos em LocalStorage;
- criação de Contract;
- máquina de estados;
- pagamento server-side;
- webhook seguro;
- idempotência;
- escrow seguro;
- check-in server-side;
- cancelamento;
- reembolso;
- disputa básica;
- audit log;
- proteção contra IDOR.

---

# 60. Prioridade P1

Necessário para o app ter boa experiência:

- onboarding freelancer;
- onboarding empresa;
- busca e filtros;
- perfil completo;
- seleção do candidato;
- proposta;
- aceitar contratação;
- Meus Trampos;
- Minhas Contratações;
- notificações;
- push;
- check-out;
- no-show;
- avaliações;
- reputação.

---

# 61. Prioridade P2

Após validação e crescimento:

- antifraude avançado;
- score de risco;
- KYC/KYB avançado;
- matching inteligente;
- recomendações;
- detecção de abuso;
- automação de disputas;
- ranking inteligente.

---

# 62. Estratégia obrigatória de implementação

Executar em etapas.

## Etapa 1 — Auditoria

Entregar antes das alterações:

```text
O que já existe
O que está parcial
O que está ausente
O que está inseguro
O que pode ser reutilizado
```

Mapear:

```text
rotas
telas
componentes
hooks
providers
services
Supabase
SQL/migrations
RLS
Edge Functions/API
pagamento
storage
```

---

# 63. Etapa 2 — Gap Analysis

Criar tabela interna semelhante a:

| Item | Existe | Parcial | Ausente | Correção necessária |
|---|---|---|---|---|
| Auth | | | | |
| RLS | | | | |
| Freelancer | | | | |
| Empresa | | | | |
| Jobs | | | | |
| Applications | | | | |
| Contract | | | | |
| Payment | | | | |
| Escrow | | | | |
| Check-in | | | | |
| Dispute | | | | |

Não implementar cegamente a SPEC sem essa análise.

---

# 64. Etapa 3 — Banco e segurança

Implementar primeiro:

```text
contracts
proposals
states
RLS
payment_events
audit_logs
check-in server-side
```

Depois alterar interface.

---

# 65. Etapa 4 — Fluxo funcional

Conectar:

```text
Vaga
↓
Candidatura
↓
Seleção
↓
Proposta
↓
Aceite
↓
Contrato
↓
Pagamento
↓
Agendamento
```

---

# 66. Etapa 5 — Execução do serviço

Implementar:

```text
Trabalho próximo
↓
Check-in
↓
Em andamento
↓
Check-out
↓
Confirmação
```

---

# 67. Etapa 6 — Pós-serviço

Implementar:

```text
Liberação
Avaliação
Recibo
Histórico
```

---

# 68. Etapa 7 — Exceções

Implementar:

```text
Cancelamento
No-show
Disputa
Reembolso
Falha de pagamento
Falha de conexão
```

---

# 69. Requisitos de UI/UX

A aplicação é um app.

Portanto:

- mobile-first;
- evitar tabelas grandes;
- evitar telas com aparência de sistema administrativo;
- usar cards;
- usar bottom navigation;
- CTAs claros;
- hierarquia visual forte;
- informação principal acima da dobra;
- áreas clicáveis adequadas para toque;
- feedback visual imediato;
- skeletons durante carregamento;
- empty states úteis;
- mensagens de erro em linguagem comum.

---

# 70. Não alterar desnecessariamente

Durante a implementação:

- não refatorar arquivos sem necessidade;
- não trocar bibliotecas apenas por preferência;
- não mudar identidade visual sem necessidade;
- não renomear entidades existentes sem justificativa;
- não quebrar APIs já utilizadas;
- não duplicar componentes;
- não criar uma nova arquitetura paralela.

Manter compatibilidade sempre que possível.

---

# 71. Testes obrigatórios

Criar ou executar testes para cenários críticos.

## Segurança

```text
usuário A tenta acessar contrato do usuário B
freelancer chama endpoint de admin
empresa tenta editar vaga de outra empresa
usuário tenta ler conversa alheia
```

Todos devem falhar.

## Pagamento

```text
webhook duplicado
clique duplo
falha durante pagamento
refund
release duplicado
```

## Contratação

```text
proposta aceita
proposta recusada
contrato cancelado
vaga encerrada
```

## Execução

```text
check-in válido
check-in inválido
check-in fora do horário
check-out
no-show
```

---

# 72. Critério de conclusão

Considerar esta evolução concluída quando:

### Freelancer conseguir:

```text
criar perfil
encontrar vaga
candidatar
acompanhar candidatura
conversar
receber proposta
aceitar
acompanhar contratação
fazer check-in
executar
fazer check-out
acompanhar pagamento
avaliar empresa
```

### Empresa conseguir:

```text
criar perfil
publicar vaga
receber candidatos
visualizar perfis
conversar
selecionar
enviar proposta
contratar
pagar
acompanhar check-in
confirmar serviço
resolver problema
avaliar freelancer
```

### Plataforma conseguir:

```text
proteger acesso
proteger dados
controlar contratos
controlar pagamentos
registrar eventos
processar disputas
auditar ações
```

---

# 73. Entrega esperada do agente

Ao executar esta SPEC, não começar diretamente alterando arquivos.

Primeiro retornar um relatório curto:

```text
1. Arquitetura encontrada
2. Funcionalidades existentes
3. Funcionalidades parcialmente existentes
4. Lacunas
5. Vulnerabilidades encontradas
6. Plano de implementação
7. Arquivos/tabelas que serão impactados
```

Somente depois iniciar as alterações.

Ao final, retornar:

```text
O que foi alterado
O que foi criado
O que foi reaproveitado
Migrations executadas
RLS adicionadas
Fluxos implementados
Testes realizados
Pendências restantes
```

---

# 74. Resultado esperado

Ao final, o Trampô deve deixar de funcionar apenas como:

```text
app de vagas + candidatura + chat
```

e passar a funcionar como:

```text
marketplace mobile de contratação de freelancers
```

com ciclo completo:

```text
DESCOBRIR
→ CANDIDATAR
→ CONTRATAR
→ PAGAR
→ TRABALHAR
→ CONFIRMAR
→ RECEBER
→ AVALIAR
```

Todo o ciclo deve ser:

**simples para o usuário, rastreável para a plataforma e seguro no backend.**