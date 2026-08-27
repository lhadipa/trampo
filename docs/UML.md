# UML — Trampô

Os diagramas abaixo descrevem a arquitetura funcional e o modelo de domínio observados no código e nas migrações. Eles usam Mermaid e podem ser renderizados no GitHub, GitLab, Mermaid Live ou em ferramentas compatíveis.

## 1. Diagrama de casos de uso

```mermaid
flowchart LR
  visitante([Visitante])
  empresa([Contratante / Empresa])
  freelancer([Freelancer])
  admin([Administrador])
  auth[(Autenticação)]

  visitante --> UC1[Consultar landing, categorias e termos]
  visitante --> UC2[Cadastrar / entrar]
  empresa --> UC2
  freelancer --> UC2
  admin --> UC2
  empresa --> UC3[Publicar vaga]
  empresa --> UC4[Buscar profissionais]
  empresa --> UC5[Consultar candidaturas]
  empresa --> UC6[Abrir ou desbloquear conversa]
  empresa --> UC7[Aceitar candidatura]
  empresa --> UC8[Acompanhar contrato]
  empresa --> UC9[Concluir serviço e liberar custódia]
  empresa --> UC10[Gerar recibo]
  empresa --> UC11[Abrir disputa]
  freelancer --> UC12[Manter perfil e disponibilidade]
  freelancer --> UC13[Consultar e filtrar vagas]
  freelancer --> UC14[Enviar candidatura]
  freelancer --> UC15[Conversar]
  freelancer --> UC16[Acompanhar contrato]
  freelancer --> UC17[Fazer check-in / checkout]
  freelancer --> UC18[Consultar pagamentos]
  freelancer --> UC11
  admin --> UC19[Moderar usuários]
  admin --> UC20[Auditar vagas, contratos e pagamentos]
  admin --> UC21[Resolver disputa / reembolso]
  UC2 -.-> auth
  UC7 -.-> UC8
  UC9 -.-> UC8
  UC11 -.-> UC21
```

## 2. Diagrama de classes / entidades

```mermaid
classDiagram
  class User {
    +uuid id
    +uuid auth_id
    +string name
    +string email
    +UserType type
    +boolean blocked
    +decimal balance
  }
  class Company {
    +uuid id
    +uuid user_id
    +string name
  }
  class Freelancer {
    +uuid id
    +uuid user_id
    +string category
  }
  class Job {
    +uuid id
    +uuid company_id
    +string title
    +string description
    +datetime date
    +decimal price
    +JobStatus status
    +boolean urgent
    +string location
    +string category
  }
  class Application {
    +uuid id
    +uuid job_id
    +uuid freelancer_id
    +ApplicationStatus status
  }
  class Conversation {
    +uuid id
    +uuid company_user_id
    +uuid freelancer_user_id
    +decimal unlock_price
    +boolean unlocked
  }
  class Message {
    +uuid id
    +uuid conversation_id
    +uuid sender_id
    +string content
    +datetime created_at
  }
  class Proposal {
    +uuid id
    +uuid application_id
    +decimal amount
    +datetime start_at
    +datetime end_at
    +ProposalStatus status
  }
  class Contract {
    +uuid id
    +uuid job_id
    +uuid company_id
    +uuid freelancer_id
    +uuid proposal_id
    +decimal amount
    +decimal platform_fee
    +decimal freelancer_amount
    +ContractStatus status
  }
  class Payment {
    +uuid id
    +decimal amount
    +PaymentStatus status
    +string service
  }
  class Escrow {
    +uuid id
    +uuid job_id
    +uuid company_id
    +uuid freelancer_id
    +decimal amount
    +EscrowStatus status
  }
  class Checkin {
    +uuid id
    +uuid contract_id
    +uuid freelancer_id
    +CheckinMethod method
    +CheckinStatus status
  }
  class Checkout {
    +uuid id
    +uuid contract_id
    +uuid freelancer_id
    +CheckoutStatus status
  }
  class Dispute {
    +uuid id
    +uuid contract_id
    +uuid opened_by
    +DisputeStatus status
    +Resolution resolution
  }
  class Evidence {
    +uuid id
    +uuid dispute_id
    +string kind
    +string content
  }
  class Refund {
    +uuid id
    +uuid payment_id
    +uuid contract_id
    +decimal amount
    +RefundStatus status
  }
  class Notification {
    +uuid id
    +uuid user_id
    +string event_type
    +datetime read_at
  }
  class AuditLog {
    +uuid id
    +uuid actor_id
    +string action
    +string entity_type
    +uuid entity_id
  }

  User "1" --> "0..1" Company
  User "1" --> "0..1" Freelancer
  Company "1" --> "0..*" Job
  Job "1" --> "0..*" Application
  Freelancer "1" --> "0..*" Application
  Application "1" --> "0..1" Proposal
  Proposal "1" --> "0..1" Contract
  Job "1" --> "0..1" Contract
  Company "1" --> "0..*" Contract
  Freelancer "1" --> "0..*" Contract
  Contract "1" --> "0..1" Payment
  Contract "1" --> "0..1" Escrow
  Contract "1" --> "0..1" Checkin
  Contract "1" --> "0..1" Checkout
  Contract "1" --> "0..*" Dispute
  Dispute "1" --> "0..*" Evidence
  Payment "1" --> "0..*" Refund
  Conversation "1" --> "0..*" Message
  User "1" --> "0..*" Notification
  User "1" --> "0..*" AuditLog
```

## 3. Sequência — aceite, execução e liberação

```mermaid
sequenceDiagram
  actor C as Contratante
  actor F as Freelancer
  participant UI as Web/Mobile
  participant API as Express API
  participant DB as Postgres/Supabase
  participant P as Provedor de pagamento

  C->>UI: Seleciona candidatura e aceita
  UI->>API: POST accept-application
  API->>DB: Valida usuário, ownership e vaga aberta
  API->>DB: Transação: aceita candidatura
  API->>DB: Rejeita demais candidaturas
  API->>DB: Cria contrato e escrow
  DB-->>API: IDs e estado inicial
  API-->>UI: Contrato criado
  API-->>F: Notificação de aceite

  opt Pagamento real
    C->>UI: Confirma pagamento
    UI->>API: Inicia checkout
    API->>P: Cria cobrança
    P-->>API: Webhook payment_succeeded
    API->>DB: Registra payment_event idempotente
    API->>DB: Atualiza pagamento e contrato para FUNDS_SECURED
  end

  F->>UI: Faz check-in
  UI->>API: POST contracts/check-in
  API->>DB: Valida que F é o contratado
  API->>DB: Transação: cria checkin e move para IN_PROGRESS
  API-->>C: Serviço em andamento

  F->>UI: Envia checkout
  UI->>API: POST checkout
  API->>DB: Persiste checkout e evento
  C->>UI: Confirma conclusão
  UI->>API: POST contracts/complete
  API->>DB: Valida parte, disputa e estado
  API->>DB: Transação: conclui contrato, vaga e escrow
  API->>P: Solicita liberação (produção)
  P-->>API: Webhook release_succeeded
  API->>DB: Registra evento e pagamento liberado
  API-->>C: Recibo disponível
  API-->>F: Pagamento liberado
```

## 4. Máquina de estados do contrato

```mermaid
stateDiagram-v2
  [*] --> DRAFT
  DRAFT --> AWAITING_ACCEPTANCE: proposta criada
  AWAITING_ACCEPTANCE --> AWAITING_PAYMENT: proposta aceita
  AWAITING_ACCEPTANCE --> CANCELLED: recusada/cancelada
  AWAITING_PAYMENT --> PAYMENT_PROCESSING: checkout iniciado
  PAYMENT_PROCESSING --> FUNDS_SECURED: pagamento confirmado
  PAYMENT_PROCESSING --> AWAITING_PAYMENT: pagamento falhou
  FUNDS_SECURED --> SCHEDULED: agenda confirmada
  SCHEDULED --> IN_PROGRESS: check-in confirmado
  IN_PROGRESS --> AWAITING_COMPLETION_CONFIRMATION: checkout enviado
  AWAITING_COMPLETION_CONFIRMATION --> COMPLETED: contratante confirma
  COMPLETED --> RELEASE_PENDING: liberar custódia
  RELEASE_PENDING --> RELEASED: provedor confirma
  AWAITING_COMPLETION_CONFIRMATION --> DISPUTED: parte abre disputa
  IN_PROGRESS --> DISPUTED: parte abre disputa
  DISPUTED --> RELEASE_PENDING: resolução FULL_RELEASE/PARTIAL_RELEASE
  DISPUTED --> REFUND_PENDING: resolução FULL_REFUND/PARTIAL_REFUND
  REFUND_PENDING --> REFUNDED: reembolso confirmado
  SCHEDULED --> NO_SHOW_FREELANCER: ausência validada
  SCHEDULED --> NO_SHOW_COMPANY: ausência validada
  SCHEDULED --> CANCELLED: cancelamento permitido
  RELEASED --> [*]
  REFUNDED --> [*]
  CANCELLED --> [*]
```

## 5. Fluxo de autorização

```mermaid
flowchart TD
  A[Request autenticada] --> B{JWT válido?}
  B -- Não --> X[401 Não autenticado]
  B -- Sim --> C{Usuário bloqueado?}
  C -- Sim --> Y[403 Conta bloqueada]
  C -- Não --> D{Operação crítica?}
  D -- Não --> E[CRUD limitado por tabela e ownership]
  D -- Sim --> F[API valida papel e relação com entidade]
  F --> G{Autorizado?}
  G -- Não --> Z[403 Proibido]
  G -- Sim --> H[Transação, evento e resposta]
  H --> I[Notificação/auditoria quando aplicável]
```

