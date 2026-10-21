# Contract: Admin CRM Data Access

## Purpose

Definir o comportamento externo necessário para o CRM consumir os contratos existentes sem criar operações administrativas amplas ou alterar fluxos operacionais.

## Authentication

Todas as requisições devem enviar `Authorization: Bearer <access_token>` obtido pelo fluxo de autenticação existente.

## Authorization matrix

| Recurso | Administrador | Usuário comum | Sem sessão | Usuário bloqueado |
|---|---:|---:|---:|---:|
| `GET /api/me` | permitido | permitido | `401` | `403` conforme regra existente |
| `GET /api/data/{table}` global para CRM | permitido | `403` | `401` | `403` |
| `PATCH /api/data/users?eq.id={id}` com `{ "blocked": boolean }` | permitido | `403` | `401` | `403` |
| Operações de contrato/pagamento mock | seguem ownership existente | seguem ownership existente | `401` | `403` |

## Read contract

`GET /api/data/{table}` retorna:

```json
{
  "data": [],
  "error": null
}
```

Em erro:

```json
{
  "data": null,
  "error": { "message": "mensagem segura", "code": "opcional" }
}
```

O servidor deve remover `password_hash` de qualquer registro de `users`, independentemente de `select`.

Consultas podem usar os parâmetros já suportados: `select`, `eq.<column>`, `order` e `limit`. A implementação deve respeitar o limite máximo existente e não depender de operadores ainda não suportados.

## Block/unblock contract

Requisição:

```http
PATCH /api/data/users?eq.id={user_id}
Authorization: Bearer <admin_token>
Content-Type: application/json
```

```json
{ "blocked": true }
```

Resposta de sucesso:

```json
{
  "data": [{ "id": "...", "blocked": true }],
  "error": null
}
```

O payload não pode alterar nome, e-mail, tipo, saldo, senha ou qualquer coluna além de `blocked`. Falhas devem preservar os dados e retornar erro seguro.

## Existing operational endpoints out of CRM mutation scope

O CRM não chama para modificar operações:

- `POST /api/contracts/accept-application`
- `POST /api/contracts/check-in`
- `POST /api/contracts/complete`
- `POST /api/mock/wallet/topup`
- `POST /api/mock/chat-unlock`

Eles permanecem com os contratos e regras de ownership atuais.
