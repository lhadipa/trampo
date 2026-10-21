# Feature Specification: CRM Central Administrativo

**Feature Branch**: `spec-only/crm-central-admin`

**Created**: 2026-09-01

**Status**: Draft

**Input**: User description: "Criar um CRM Central Administrativo do Trampô para visualizar, pesquisar e acompanhar todos os dados de clientes, usuários e operações da plataforma em uma única área."

## Contexto existente e fronteiras

O CRM evolui o `DashboardAdmin` existente dentro do fluxo `/painel`; não cria um segundo painel administrativo, não recria componentes equivalentes e não faz merge. O fluxo atual já identifica administradores por tipo de usuário ou papel administrativo, autentica por sessão Bearer e mantém a ação de bloqueio limitada ao campo `users.blocked`.

O produto utiliza dados reais da plataforma. A movimentação financeira atual é simulada: saldo, pagamentos de carteira/desbloqueio e custódia são registros operacionais mockados, não transações de um provedor financeiro real. Não existe, nas tabelas disponíveis, uma estrutura de auditoria administrativa; portanto, a primeira versão não exibirá eventos de auditoria inventados.

### Mapeamento da experiência existente

| Área existente | Papel no CRM |
|---|---|
| `src/pages/Dashboard.tsx` | Roteador do painel; mantém `/painel` e encaminha administradores para `DashboardAdmin` |
| `src/pages/DashboardAdmin.tsx` | Painel administrativo único a ser evoluído, incluindo indicadores, usuários, vagas, pagamentos e bloqueio |
| `src/pages/DashboardCompany.tsx` | Fluxo de contratante/empresa preservado e usado como referência de relações operacionais |
| `src/pages/DashboardFreelancer.tsx` | Fluxo de profissional preservado e usado como referência de contratos, saldo e custódia |
| `src/pages/Conversations.tsx`, `src/pages/Chat.tsx` | Fluxos existentes de conversa e mensagens; o CRM apenas consulta quando autorizado |
| `src/pages/Contracts.tsx` | Fluxo existente de contratos; o CRM apenas consulta e consolida |
| `src/hooks/useAuth.tsx` | Sessão, perfil, `isAdmin`, carregamento e saída; deve continuar sendo reutilizado |
| `src/integrations/supabase/client.ts` | Cliente de integração que transporta sessão Bearer, consultas de dados e operações existentes |
| `src/components/ui/*` | Componentes de tabela, abas, cards, botões, badges, drawer/modal, estados e demais padrões a reutilizar |
| `src/components/NavLink.tsx` e componentes de landing | Navegação existente; não devem ser quebrados ou duplicados |
| `src/App.tsx` | Rotas existentes; `/painel` permanece a entrada do CRM via roteamento atual |

Não será criada uma rota paralela para o CRM. A atualização deve respeitar a navegação de saída existente, o fluxo de autenticação e as telas de contratante, profissional, conversas e contratos.

### Inventário de tabelas e relacionamentos utilizados

| Tabela | Uso no CRM | Relações relevantes |
|---|---|---|
| `users` | Identidade, tipo, e-mail, bloqueio, saldo e cadastro | `user_roles`, perfis, empresas, profissionais e operações |
| `user_roles` | Confirmação de papel administrativo | `users.id` |
| `companies` | Perfil de empresa, CNPJ, categorias e bio | `companies.user_id` e `jobs.company_id` |
| `individual_contractors` | Perfil de contratante pessoa física, CPF, categorias e bio | `individual_contractors.user_id` |
| `freelancers` | Perfil profissional, categoria, serviços, experiência e bio | `freelancers.user_id` e `applications.freelancer_id` |
| `public_profiles` | Perfil público relacionado | `public_profiles.user_id` |
| `jobs` | Vagas e status operacional | `jobs.company_id`; pode hidratar empresa |
| `applications` | Candidaturas e status | `job_id`, `freelancer_id`; pode hidratar vaga e profissional |
| `conversations` | Relacionamento contratante-profissional e desbloqueio | usuários participantes |
| `messages` | Mensagens relacionadas a conversas, quando permitido | `conversation_id`, `sender_id` |
| `proposals` | Propostas, valores, período e status | vaga, candidatura, empresa e profissional |
| `contracts` | Contratação, valores, período e status | vaga, empresa, profissional, proposta, pagamento e custódia |
| `payments` | Movimentações simuladas, origem/destino, serviço e valor | usuários e, quando disponível, vaga |
| `escrow` | Valores retidos/liberados e participantes | vaga, empresa, profissional e usuários |
| `reviews` | Avaliações, notas e comentários | avaliador e avaliado |
| `checkins` | Presença e execução operacional | contrato e profissional |

### Inventário de endpoints existentes

| Endpoint | Uso no CRM | Regra de escopo |
|---|---|---|
| `GET /api/me` | Confirmar sessão e perfil do administrador autenticado | Sessão Bearer válida |
| `/api/data/:table` | Consultar as tabelas do inventário e atualizar apenas o bloqueio permitido | Leituras globais do CRM devem exigir administrador no backend; `PATCH users` altera somente `blocked` |
| `POST /api/contracts/accept-application` | Apenas referência operacional; o CRM não executa aceite | Mantém ownership da empresa |
| `POST /api/contracts/check-in` | Apenas referência operacional; o CRM não executa check-in | Mantém ownership do profissional |
| `POST /api/contracts/complete` | Apenas referência operacional; o CRM não conclui contratos | Mantém ownership da empresa |
| `POST /api/mock/wallet/topup` | Apenas referência operacional; o CRM não movimenta saldo | Mantém a regra de saldo no servidor |
| `POST /api/mock/chat-unlock` | Apenas referência operacional; o CRM não desbloqueia conversas | Mantém a regra da empresa participante |
| `GET /api/health` | Não é necessário para a experiência funcional do CRM | Pode apoiar diagnóstico externo |

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Consultar a base administrativa (Priority: P1)

Como administrador autenticado, quero abrir o CRM e visualizar indicadores e uma lista pesquisável de clientes para localizar rapidamente pessoas e empresas da plataforma.

**Why this priority**: É a porta de entrada da operação administrativa e entrega a visão centralizada sem exigir navegação por múltiplos painéis.

**Independent Test**: Com uma base contendo empresas, contratantes pessoa física, profissionais, administradores, contas bloqueadas e vagas, abrir `/painel` como administrador e localizar registros usando busca, filtros, ordenação e atualização.

**Acceptance Scenarios**:

1. **Given** um administrador autenticado e dados carregados, **When** acessar o painel, **Then** visualizar o título CRM Central, a identificação do administrador, a ação de atualização e indicadores reais de usuários, empresas, freelancers, ativos, bloqueados, vagas abertas, contratos ativos, volume registrado e custódia atual.
2. **Given** uma lista com clientes de tipos e status diferentes, **When** pesquisar por nome, e-mail, CPF, CNPJ ou identificador e aplicar tipo, status ou período de cadastro, **Then** somente os registros correspondentes serão exibidos.
3. **Given** a API sem registros, **When** a consulta terminar, **Then** a interface exibirá estado vazio orientando que não há clientes ou operações para mostrar.
4. **Given** falha ou indisponibilidade de uma consulta, **When** o carregamento terminar, **Then** a interface exibirá erro compreensível e permitirá tentar novamente sem quebrar o restante do fluxo administrativo.

### User Story 2 - Abrir a visão consolidada de um cliente (Priority: P1)

Como administrador, quero selecionar um cliente e ver seus dados cadastrais, perfil e operações relacionadas em uma única visão para acompanhar seu relacionamento com a plataforma.

**Why this priority**: A visão individual é o núcleo do CRM e reduz o tempo para investigar uma conta ou operação.

**Independent Test**: Selecionar uma empresa, contratante pessoa física e profissional com registros relacionados e confirmar que cada detalhe mostra apenas relações reais daquele cliente, com seções organizadas e responsivas.

**Acceptance Scenarios**:

1. **Given** um cliente existente, **When** o administrador abrir seus detalhes, **Then** visualizar nome, e-mail, tipo, status, data de cadastro, identificador e saldo quando aplicável.
2. **Given** um cliente com perfil relacionado, **When** abrir a seção de perfil, **Then** visualizar empresa ou perfil profissional correspondente, incluindo CPF/CNPJ somente quando existente e permitido, categorias, serviços, experiência e bio.
3. **Given** um cliente com operações relacionadas, **When** consultar as seções operacionais, **Then** visualizar vagas, candidaturas, conversas, mensagens quando permitido, propostas, contratos, pagamentos, custódias, avaliações e check-ins relacionados.
4. **Given** um cliente sem registros em uma relação, **When** abrir a seção correspondente, **Then** visualizar estado vazio específico daquela seção, sem dados de outro cliente.

### User Story 3 - Administrar o status da conta com segurança (Priority: P1)

Como administrador, quero bloquear ou desbloquear uma conta pela lista ou detalhe para aplicar a regra administrativa existente sem alterar outros dados do usuário.

**Why this priority**: Moderação de acesso é uma responsabilidade essencial do administrador e já possui uma regra de negócio existente que deve ser preservada.

**Independent Test**: Com uma conta ativa e outra bloqueada, alternar seus status como administrador e tentar executar a mesma ação como usuário não administrador.

**Acceptance Scenarios**:

1. **Given** um administrador autorizado e uma conta ativa, **When** confirmar o bloqueio, **Then** o status passa a bloqueado, a lista é atualizada e uma mensagem de resultado é exibida.
2. **Given** um administrador autorizado e uma conta bloqueada, **When** confirmar o desbloqueio, **Then** o status passa a ativo, a lista é atualizada e uma mensagem de resultado é exibida.
3. **Given** um usuário autenticado que não é administrador, **When** tentar consultar a base global ou alterar bloqueio, **Then** a API recusa a operação e nenhum dado global ou alteração é entregue.
4. **Given** qualquer consulta ou alteração, **When** a resposta for produzida, **Then** `password_hash` nunca será exibido nem utilizado na interface.

### User Story 4 - Acompanhar a operação agregada (Priority: P2)

Como administrador, quero revisar uma linha do tempo operacional derivada de dados existentes e indicadores por cliente para entender a evolução do relacionamento.

**Why this priority**: Agrega contexto para investigação, mas depende da organização das relações da primeira versão e não deve atrasar o acesso básico ao CRM.

**Independent Test**: Selecionar um cliente com registros em datas diferentes e verificar eventos derivados em ordem decrescente, sem incluir eventos sem fonte real.

**Acceptance Scenarios**:

1. **Given** registros reais com datas de cadastro, vagas, candidaturas, conversas, contratos, pagamentos, custódias, check-ins e avaliações, **When** visualizar a linha do tempo, **Then** os eventos derivados aparecem ordenados por data e identificam sua origem.
2. **Given** ausência de auditoria administrativa, **When** visualizar a linha do tempo, **Then** bloqueios/desbloqueios não são apresentados como eventos históricos salvo se houver registro existente que os sustente.

## Edge Cases

- O administrador autenticado não possui perfil carregado, está bloqueado ou perde a sessão durante o carregamento: impedir a visão global e preservar o redirecionamento/saída existente.
- Uma conta tem `type` de empresa sem registro em `companies`, ou profissional sem `freelancers`: mostrar o tipo disponível e sinalizar perfil não encontrado.
- O mesmo cliente possui operações vinculadas por IDs de usuário, empresa, profissional, vaga ou contrato diferentes: consolidar sem duplicar o cliente na lista.
- CPF/CNPJ está ausente, pendente ou não deve ser mostrado: exibir estado mascarado/indisponível conforme a permissão, sem inventar valor.
- Campos de data, valor ou status estão nulos ou em formato inesperado: mostrar fallback legível e manter a página utilizável.
- Busca sem resultados, filtros incompatíveis, paginação além do último resultado ou limite de dados: informar estado vazio sem erro técnico.
- Uma operação relacionada foi removida ou não pode ser hidratada: manter o registro principal e indicar relação indisponível.
- Falha parcial em uma tabela: informar a seção afetada e evitar apresentar dados como completos.
- Usuário tenta acessar rota ou consultas globais sem administrador, inclusive manipulando o frontend: backend deve negar com resposta de não autorizado/proibido.
- Administrador tenta bloquear/desbloquear a própria conta: preservar uma sessão válida e impedir uma ação que possa remover o acesso administrativo sem confirmação e regra explícita existente.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST disponibilizar o CRM dentro do fluxo administrativo existente e evoluir o `DashboardAdmin`, sem criar uma segunda implementação do painel.
- **FR-002**: O sistema MUST permitir acesso ao CRM somente após autenticação válida e autorização administrativa verificada no backend, considerando o tipo administrativo e o papel administrativo existente.
- **FR-003**: O sistema MUST impedir que usuários não administradores consultem dados globais ou alterem o status de contas.
- **FR-004**: O sistema MUST apresentar uma lista única de clientes cadastrados, deduplicada por usuário, incluindo empresa, contratante pessoa física, freelancer/profissional e administrador.
- **FR-005**: O sistema MUST permitir pesquisar por nome, e-mail, CPF, CNPJ e identificador.
- **FR-006**: O sistema MUST permitir filtrar por tipo de cliente, status da conta e período de cadastro, além de ordenar os resultados por campos relevantes.
- **FR-007**: O sistema MUST exibir estados de carregamento, vazio, erro e atualização manual para a base e para os detalhes.
- **FR-008**: O sistema MUST calcular a partir de dados reais os indicadores de total de usuários, empresas, freelancers, clientes ativos, clientes bloqueados, vagas abertas, contratos ativos, volume financeiro registrado e custódia em aberto.
- **FR-009**: O sistema MUST tratar valores financeiros e estados de pagamentos/custódias como registros simulados existentes, identificando-os de forma clara quando apresentados.
- **FR-010**: O sistema MUST permitir abrir uma visão detalhada de cada cliente usando componentes e padrões visuais existentes, em página, drawer ou modal conforme a composição já adotada no projeto.
- **FR-011**: O detalhe MUST apresentar dados cadastrais, perfil relacionado e as relações reais de vagas, candidaturas, conversas, mensagens quando permitido, propostas, contratos, pagamentos, custódias, avaliações e check-ins.
- **FR-012**: O sistema MUST consolidar contagens e status operacionais por cliente sem misturar registros de clientes diferentes.
- **FR-013**: O sistema MUST permitir bloquear e desbloquear usuários reutilizando a regra administrativa existente, alterando somente o campo permitido e refletindo o resultado na interface.
- **FR-014**: O backend MUST garantir que nenhuma resposta do CRM contenha `password_hash` ou outro segredo de autenticação.
- **FR-015**: O sistema MUST limitar a exposição de mensagens, CPF/CNPJ e demais dados pessoais ao necessário para a função administrativa autorizada.
- **FR-016**: O CRM MUST ser responsivo em desktop, tablet e mobile e manter a identidade visual existente do Trampô: fundo claro, grafite para estrutura, laranja reservado a marca/ações/destaques, poucos adornos e sem emojis.
- **FR-017**: O CRM MUST reutilizar a biblioteca de ícones e os componentes UI já presentes, sem adicionar biblioteca nova sem necessidade.
- **FR-018**: O CRM MUST preservar as rotas, fluxos de autenticação, pagamentos, contratos e demais regras de negócio não necessárias diretamente à funcionalidade.
- **FR-019**: A linha do tempo P2 MUST usar somente eventos derivados de tabelas e datas existentes, identificando que são derivados, e MUST omitir eventos de auditoria inexistentes.
- **FR-020**: Exportação, auditoria administrativa persistida, segmentação avançada, alertas e histórico de relacionamento somente poderão entrar após validação de infraestrutura e aprovação de escopo posterior.

### Critérios de segurança e autorização

- Toda leitura global e toda alteração de bloqueio devem ser verificadas pelo backend; a condição de frontend é apenas uma camada de experiência.
- O servidor deve rejeitar sessão ausente, inválida ou bloqueada antes de entregar dados do CRM.
- A autorização administrativa deve aceitar as formas administrativas já existentes, sem confiar em um valor enviado pelo cliente.
- O CRM é somente leitura para dados sensíveis e operacionais, exceto a alternância autorizada de `blocked`; não executa aceite, check-in, conclusão, top-up ou desbloqueio de conversa.
- Respostas, logs de interface e estados locais não podem expor `password_hash`.
- Mensagens e documentos pessoais devem ser carregados e exibidos somente no detalhe de uma conta autorizada e apenas quando necessários ao acompanhamento administrativo.

### Estratégia de testes

- Testes de autorização backend para administrador, usuário comum, sessão ausente e usuário bloqueado em consultas globais e alteração de bloqueio.
- Testes de contrato para confirmar remoção de `password_hash`, preservação do payload de bloqueio e compatibilidade das rotas existentes.
- Testes de componente para indicadores reais, busca, filtros, ordenação, estados de loading/erro/vazio, abertura de detalhe e alternância de bloqueio.
- Testes de integração para consolidar relações de empresa, pessoa física, profissional, vaga, candidatura, conversa, contrato, pagamento e custódia sem duplicação ou vazamento entre clientes.
- Testes responsivos e de acessibilidade para tabela/lista, detalhe, navegação por teclado, mensagens de erro e ações destrutivas.
- Executar a suíte existente e o build antes da implementação ser considerada concluída; não alterar testes de fluxos não relacionados.

## Key Entities

- **Cliente administrativo**: usuário único da plataforma identificado por nome, e-mail, tipo, status, cadastro, identificador e saldo quando aplicável.
- **Perfil relacionado**: dados de empresa, contratante pessoa física, profissional ou perfil público associados ao cliente.
- **Relação operacional**: vaga, candidatura, conversa, mensagem, proposta, contrato, pagamento, custódia, avaliação ou check-in conectado direta ou indiretamente ao cliente.
- **Indicador da base**: total agregado calculado exclusivamente a partir dos registros reais carregados.
- **Evento derivado**: ocorrência apresentada na linha do tempo a partir de uma tabela e data existentes, sem representar auditoria inexistente.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em uma base de até 500 clientes, um administrador consegue localizar um cliente conhecido por nome, e-mail ou identificador em até 10 segundos após abrir o CRM.
- **SC-002**: Em uma base de até 500 clientes, pelo menos 95% das buscas e filtros retornam a lista correspondente em até 2 segundos após a ação do administrador.
- **SC-003**: Para um cliente com dados relacionados, o administrador consegue abrir a visão consolidada e identificar seu tipo, status, perfil, contratos e situação financeira em até 30 segundos.
- **SC-004**: 100% das respostas e estados visíveis do CRM não contêm `password_hash` nem credenciais equivalentes.
- **SC-005**: 100% das tentativas de acesso global ou bloqueio realizadas por usuários não administradores são recusadas e não alteram dados.
- **SC-006**: 100% das contas ativas e bloqueadas exibidas na lista refletem o estado persistido após atualização manual ou ação de bloqueio/desbloqueio bem-sucedida.
- **SC-007**: A interface mantém operação utilizável em larguras desktop, tablet e mobile, sem perda das ações de busca, detalhe, atualização e saída.
- **SC-008**: A suíte de testes existente e o build do projeto permanecem aprovados após a implementação, sem regressões em autenticação, navegação, contratos e pagamentos.

## Assumptions

- A primeira entrega implementável cobre P1; a linha do tempo, abas avançadas e indicadores derivados por cliente são P2 e não bloqueiam o aceite da base/lista/detalhe/bloqueio.
- O administrador acessa o CRM pelo fluxo `/painel`; não será criada uma nova rota pública ou uma nova entrada independente para o painel.
- A autenticação existente, o Bearer Token, `useAuth`, o cliente de integração atual e o CRUD `/api/data/:table` serão preservados e evoluídos somente onde necessário para aplicar autorização administrativa global.
- O modelo atual de tipos (`empresa`/`company`, `freelancer` e `admin`) será normalizado apenas na apresentação, sem migração de dados nesta feature.
- Busca, filtros e paginação podem começar sobre um conjunto limitado compatível com os limites existentes, desde que o comportamento permaneça correto e seja escalável para a meta de 500 clientes.
- Mensagens e dados pessoais serão visíveis somente a administradores e somente quando a investigação exigir; a primeira versão não cria exportação.
- Não há dados fictícios na interface final; estados sem registros são apresentados como vazios.
- A implementação somente começa após aprovação desta especificação e do plano técnico; nenhum merge será realizado.
