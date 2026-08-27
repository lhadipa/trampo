# PRD — Trampô

**Produto:** marketplace mobile-first de contratação de profissionais autônomos
**Data da documentação:** 27/08/2026
**Status:** baseline do produto existente + especificação consolidada
**Escopo:** web React/Vite, app Expo/React Native, API Express/Postgres e camada Supabase

## 1. Resumo executivo

O Trampô conecta empresas, imóveis e outros contratantes a profissionais autônomos para diárias e serviços pontuais em São João del-Rei e região. A plataforma deve cobrir o ciclo completo: descoberta, publicação de vaga, candidatura, conversa, contratação, proteção do pagamento, execução, conclusão e resolução de problemas.

O produto já possui uma base funcional relevante. Este PRD consolida essa base, explicita regras de negócio e registra lacunas para evolução. A implementação deve reutilizar as rotas, páginas, componentes, modelos e integrações existentes; não deve criar uma segunda implementação de um fluxo já presente.

## 2. Problema e oportunidade

Contratantes precisam encontrar mão de obra confiável rapidamente, comparar disponibilidade e organizar pagamentos sem depender de grupos informais. Profissionais precisam descobrir oportunidades locais, candidatar-se, comprovar execução e receber com previsibilidade.

Oportunidade: ser a camada operacional de confiança para serviços eventuais locais, com urgência, histórico, comunicação e custódia em um único fluxo.

## 3. Objetivos e não objetivos

### Objetivos

- Reduzir o tempo entre a necessidade e a contratação de um profissional.
- Dar visibilidade do status da vaga, candidatura, contrato e pagamento.
- Proteger as duas partes com autenticação, autorização, evidências e custódia.
- Oferecer experiência consistente em web e mobile.
- Permitir operação e auditoria pela administração.
- Preparar a substituição dos pagamentos mock por um provedor real sem reescrever o fluxo de negócio.

### Não objetivos nesta versão

- Ser um sistema de vínculo empregatício ou folha de pagamento.
- Oferecer marketplace nacional com logística própria.
- Alterar regras de negócio durante um redesign puramente visual.
- Recriar componentes ou telas que já existem.

## 4. Personas e permissões

| Persona | Necessidade principal | Capacidades |
|---|---|---|
| Contratante/empresa | Preencher uma demanda com rapidez e segurança | Criar vaga, marcar urgência, consultar profissionais, abrir/desbloquear conversa, aceitar candidatura, acompanhar contrato, concluir, liberar custódia e gerar recibo |
| Freelancer/profissional | Encontrar trabalho compatível e receber | Manter perfil/categoria, consultar vagas, filtrar, candidatar-se, acompanhar candidatura/contrato, conversar, fazer check-in e visualizar custódia |
| Administrador | Operar, moderar e auditar a plataforma | Consultar usuários, vagas, pagamentos e custódias; bloquear/desbloquear usuários; acompanhar métricas e registros protegidos |
| Visitante | Entender o serviço e iniciar cadastro | Navegar landing page, categorias, planos, termos e entrar/cadastrar |

## 5. Escopo funcional consolidado

### 5.1 Acesso e identidade

- Landing page com proposta de valor, categorias, como funciona, planos e chamadas para cadastro.
- Login e cadastro por nome, e-mail e senha.
- Perfil derivado do usuário autenticado e papel (`company`, `freelancer`, `empresa` ou `admin`).
- Redirecionamento para painel conforme o tipo de usuário.
- Logout e bloqueio de conta.
- Modo demonstração quando previsto pela aplicação.
- Termos de uso acessíveis publicamente.

### 5.2 Jornada do contratante

1. Entrar no painel.
2. Buscar profissionais por nome/categoria e filtrar por categoria.
3. Publicar vaga com título, descrição, data, preço, local, categoria e flag de urgência.
4. Consultar candidaturas recebidas.
5. Criar ou localizar conversa com um profissional; desbloqueio atualmente usa carteira mock.
6. Aceitar uma candidatura. A operação deve aceitar apenas a vaga da própria empresa, impedir dupla contratação, aceitar a candidatura escolhida, rejeitar as demais, marcar a vaga como preenchida, criar contrato e criar custódia.
7. Acompanhar estados do contrato e check-in.
8. Confirmar conclusão, liberar pagamento e gerar recibo.
9. Em evolução: abrir disputa, anexar evidências e acompanhar reembolso.

### 5.3 Jornada do freelancer

1. Entrar no painel e completar/criar o registro profissional.
2. Consultar vagas abertas, inclusive urgentes.
3. Filtrar por texto e categoria.
4. Enviar candidatura única por vaga.
5. Acompanhar candidatura aceita/rejeitada/pendente.
6. Acompanhar contratos em próximos, andamento e concluídos.
7. Fazer check-in no contrato ativo. A operação deve validar que o solicitante é o profissional contratado, registrar presença e mover o contrato para `IN_PROGRESS` em transação.
8. Consultar custódia, valor e status de liberação.
9. Em evolução: enviar checkout, avaliar contratante e contestar um contrato.

### 5.4 Comunicação

- Lista de conversas do usuário autenticado.
- Chat por conversa.
- Mensagens persistidas com remetente e data.
- Conversa única por par empresa/profissional.
- Conteúdo sensível deve permanecer protegido pelas regras de autorização existentes.

### 5.5 Urgência e disponibilidade

- Tela de chamada urgente com especialidade, detalhes, local e disparo para profissionais disponíveis.
- Oferta de urgência deve ser claramente distinguida de uma vaga comum.
- Disponibilidade deve permitir que o profissional comunique prontidão para chamados.
- O raio, critérios de plantão e eventuais taxas devem ser configuráveis e auditáveis.

### 5.6 Contratos, custódia e pagamentos

- O contrato é a fonte operacional do serviço aceito.
- A custódia retém o valor até a conclusão/liberação.
- A aplicação atual possui carteira e desbloqueio de chat mock; não há gateway financeiro real.
- A conclusão atual pelo backend move contrato para `RELEASED`, custódia para `released`, vaga para `completed` e registra pagamento mock.
- O desenho de produção deve suportar idempotência, webhooks, reconciliação, estorno, taxa da plataforma e trilha de eventos.

### 5.7 Governança

- Painel administrativo com usuários, vagas, pagamentos, custódias, volume transacionado, valor em custódia e vagas abertas.
- Bloqueio/desbloqueio de usuário.
- Acesso administrativo a auditoria, eventos de pagamento e reembolsos.
- Toda ação sensível deve registrar ator, entidade, antes/depois, motivo e horário.

## 6. Requisitos funcionais

| ID | Requisito | Prioridade | Critério de aceite |
|---|---|---:|---|
| RF-01 | Usuário pode criar conta e autenticar | P0 | Credenciais válidas iniciam sessão; inválidas retornam erro claro |
| RF-02 | Conta bloqueada não acessa operações autenticadas | P0 | API retorna `403` e UI informa bloqueio |
| RF-03 | Usuário é direcionado ao painel de seu papel | P0 | Empresa, freelancer e admin recebem sua visão correspondente |
| RF-04 | Contratante publica vaga | P0 | Registro contém título, data, preço, descrição, local, categoria, status e urgência |
| RF-05 | Freelancer visualiza e filtra vagas abertas | P0 | Somente vagas abertas são exibidas na jornada padrão |
| RF-06 | Freelancer envia candidatura única | P0 | Restrição `UNIQUE(job_id, freelancer_id)` impede duplicata |
| RF-07 | Contratante aceita candidatura com autorização de ownership | P0 | Apenas dono da vaga pode aceitar; uma vaga não pode ter dois contratos |
| RF-08 | Aceite cria contrato e custódia atomicamente | P0 | Falha em uma etapa não deixa estado parcial |
| RF-09 | Partes visualizam o contrato | P0 | Apenas empresa, freelancer associado ou admin acessa |
| RF-10 | Freelancer faz check-in | P0 | Apenas contratado; check-in idempotente; status vira `IN_PROGRESS` |
| RF-11 | Contratante conclui serviço | P0 | Apenas contratante; contrato, vaga, custódia e pagamento ficam consistentes |
| RF-12 | Usuários trocam mensagens em conversa autorizada | P0 | Mensagem é persistida e não vaza para terceiros |
| RF-13 | Empresa desbloqueia chat mediante saldo | P1 | Débito e registro de pagamento ocorrem na mesma transação |
| RF-14 | Usuário consulta seus contratos | P0 | Próximos, andamento e concluídos têm agrupamento correto |
| RF-15 | Admin modera usuários e consulta KPIs | P0 | Apenas admin executa ações administrativas |
| RF-16 | Disputa suporta evidências e resolução | P1 | Estados e resoluções respeitam enumerações e autorização |
| RF-17 | Gateway real recebe eventos idempotentes | P1 | Evento repetido não duplica pagamento, estorno ou liberação |
| RF-18 | Notificações informam eventos importantes | P1 | Aceite, rejeição, mensagem, check-in, conclusão e disputa geram notificação |

## 7. Regras de negócio e estados

### Vaga

Estados observados: `open`, `filled`, `completed`, `closed` (e estados adicionais podem ser introduzidos apenas com migração e contrato de API). Uma vaga aberta pode receber candidaturas; uma vaga preenchida não pode receber novo aceite.

### Candidatura

Estados observados: `pending`, `accepted`, `rejected`. O aceite de uma candidatura rejeita as demais da mesma vaga.

### Contrato

Estados persistidos previstos pela evolução: `DRAFT`, `AWAITING_ACCEPTANCE`, `AWAITING_PAYMENT`, `PAYMENT_PROCESSING`, `FUNDS_SECURED`, `SCHEDULED`, `IN_PROGRESS`, `AWAITING_COMPLETION_CONFIRMATION`, `COMPLETED`, `RELEASE_PENDING`, `RELEASED`, `CANCELLED`, `DISPUTED`, `REFUND_PENDING`, `REFUNDED`, `NO_SHOW_FREELANCER`, `NO_SHOW_COMPANY`.

Regras essenciais:

- Só a parte correta ou admin pode ler dados protegidos.
- O cliente não é fonte de verdade para autorização nem transição crítica.
- Transições financeiras e de contratação devem ser transacionais e idempotentes.
- Contratos, custódias, pagamentos e eventos devem manter correlação por IDs.
- Disputa impede liberação automática até resolução autorizada.

### Custódia e pagamento

Estados atuais observados: `held`, `released`, `refunded`; pagamentos também usam `pending` e `paid_mock`. Em produção, separar claramente pagamento iniciado, confirmado, falho, reembolsado e liberado ao profissional.

## 8. Modelo de dados existente

Entidades principais: `users`, `user_roles`, `companies`, `freelancers`, `public_profiles`, `jobs`, `applications`, `conversations`, `messages`, `payments`, `escrow`, `reviews`, `contracts`, `checkins`.

Entidades já previstas na migração de fluxo seguro: `proposals`, `contract_events`, `checkouts`, `disputes`, `dispute_evidence`, `refunds`, `payment_events`, `audit_logs`, `notifications`, `saved_jobs`.

Relações-chave:

- `users` possui no máximo um registro de `companies` ou `freelancers`.
- `companies` publica `jobs`; `jobs` recebe `applications`.
- `applications` referencia `freelancers` e pode originar `proposals`/`contracts`.
- `contracts` relaciona vaga, empresa, freelancer, pagamento e custódia.
- `conversations` liga empresa e freelancer; `messages` pertence a uma conversa.
- `disputes` e evidências pertencem a contrato; `refunds` pertencem a pagamento e contrato.

## 9. Superfície atual de produto

### Web

Rotas existentes: `/`, `/auth`, `/termos`, `/painel`, `/disponibilidade`, `/criar-vaga`, `/urgente`, `/conversas`, `/chat/:conversationId`, `/meus-trampos`, `/contratacoes`.

Páginas e componentes relevantes: `Index`, `Auth`, `Dashboard`, `DashboardCompany`, `DashboardFreelancer`, `DashboardAdmin`, `CreateJob`, `UrgentRequest`, `Conversations`, `Chat`, `Contracts`, `Availability`, componentes de landing e biblioteca shadcn/ui.

### Mobile

Expo Router possui telas equivalentes para autenticação, painel, criação de vaga, urgência, disponibilidade, conversas, chat, termos e meus trampos.

### Backend e infraestrutura

- Express com JWT, bcrypt, CORS e Postgres.
- CRUD protegido por tabela em `/api/data/:table`.
- Operações críticas em `/api/contracts/accept-application`, `/api/contracts/check-in` e `/api/contracts/complete`.
- Operações mock em `/api/mock/wallet/topup` e `/api/mock/chat-unlock`.
- Migrações SQL e políticas RLS no diretório `supabase/migrations`.
- Deploy documentado para Vercel (web) e Render (API), com Docker para banco local.

## 10. Requisitos não funcionais

- Segurança: JWT seguro, senha com hash, RLS/ownership, validação server-side, CORS restrito em produção, rate limit e logs sem dados sensíveis.
- Consistência: transações para aceite, check-in, conclusão, débito e liberação; idempotência por operação/evento.
- Disponibilidade: API com endpoint `/api/health`; falhas devem apresentar estado de erro recuperável na UI.
- Performance: listas paginadas no crescimento, índices por status/owner/data, evitar consultas N+1.
- Acessibilidade: teclado, foco, contraste, labels, mensagens de erro e tamanhos de toque adequados.
- Observabilidade: logs estruturados, métricas de funil, erros, pagamentos e transições de estado.
- Privacidade: minimizar dados públicos, proteger e-mail/telefone/conteúdo de conversa e definir retenção de evidências.
- Compatibilidade: Node.js 22+ para o projeto web/API; Android/iOS via Expo conforme configuração mobile.

## 11. Métricas e eventos

### Funil

- visitantes → cadastros → usuários ativos → vagas publicadas → candidaturas → aceites → contratos com fundos protegidos → serviços concluídos → pagamentos liberados.
- Tempo mediano até primeira candidatura e até aceite.
- Taxa de conversão de vaga para contratação.
- Taxa de check-in e conclusão.

### Confiança e operação

- disputas por 100 contratos;
- reembolsos e valor em disputa;
- falhas de pagamento/webhook;
- tempo de resolução administrativa;
- usuários bloqueados e motivos;
- mensagens sinalizadas.

Eventos mínimos: `signup_completed`, `job_created`, `application_created`, `application_accepted`, `contract_created`, `funds_secured`, `checkin_confirmed`, `checkout_submitted`, `contract_completed`, `escrow_released`, `dispute_opened`, `refund_completed`.

## 12. Lacunas e riscos identificados

- Pagamento ainda é mock; não há gateway real.
- A migração segura já prevê propostas, checkout, disputas, eventos e auditoria, mas o CRUD/API atual ainda não expõe todas essas entidades/ações.
- A aplicação web mistura `lucide-react` com `@phosphor-icons/react`; o redesign visual deve padronizar ícones sem alterar comportamento.
- Há fallback local/demo em alguns fluxos; deve ser claramente separado de produção.
- Alguns estados de contrato existentes na UI e no backend não estão totalmente alinhados com a máquina de estados expandida.
- Checkout, avaliações, notificações, favoritos persistentes e reembolsos estão previstos no modelo, mas precisam de jornada completa.
- É necessário revisar autorização por tabela e ownership em todas as consultas genéricas antes de habilitar dados sensíveis em produção.
- O app mobile tem algumas ações otimistas/mock; operações críticas devem usar a API transacional.

## 13. Roadmap recomendado

### Fase 0 — Confiabilidade da base

Alinhar schema, API, tipos e estados; cobrir aceite/check-in/conclusão com testes de integração; remover inconsistências de autorização e deixar mocks explicitamente isolados.

### Fase 1 — MVP operacional

Finalizar vagas, candidaturas, chat, contrato, custódia, check-in/out, notificações básicas, recibos e painel admin com auditoria.

### Fase 2 — Pagamentos reais e proteção

Integrar provedor, webhooks idempotentes, reconciliação, estornos, taxas, disputa com evidências e resolução administrativa.

### Fase 3 — Retenção e escala local

Favoritos, avaliações verificadas, recomendações, busca geográfica, agenda/disponibilidade robusta, planos comerciais e métricas de cohort.

### Fase 4 — Qualidade de experiência

Padronização visual mobile-first, acessibilidade, performance, notificações push, suporte offline limitado e publicação em lojas.

## 14. Critérios de aceite do produto

- Um contratante consegue publicar uma vaga e um freelancer consegue candidatar-se.
- O contratante só aceita candidaturas de vagas próprias e uma vaga só gera um contrato.
- O aceite gera contrato e custódia sem estado parcial.
- Apenas as partes e o admin visualizam contrato, chat, custódia e evidências correspondentes.
- Check-in e conclusão são autorizados pelo backend e deixam histórico.
- Liberação/reembolso nunca ocorre duas vezes para o mesmo evento.
- O admin consegue bloquear conta e consultar indicadores essenciais.
- Web e mobile mantêm as mesmas regras de negócio.
- O redesign reutiliza componentes existentes e não altera callbacks, rotas, dados ou regras sem uma decisão explícita.
- Todos os fluxos críticos têm estados de loading, vazio, erro, sucesso e retry.

## 15. Decisões em aberto

- Provedor de pagamento e modelo de split/taxa.
- Critérios de verificação de identidade e profissionais.
- Política de cancelamento, no-show, prazo de disputa e retenção de evidências.
- Raio e critérios do Radar SOS.
- Modelo comercial: comissão, assinatura, desbloqueio ou combinação.
- Região inicial definitiva e expansão geográfica.
- Responsabilidade de emissão fiscal/recibo e requisitos jurídicos locais.

