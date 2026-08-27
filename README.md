# Trampô

Plataforma de contratação de diárias e serviços autônomos em São João del-Rei e região.
Conecta contratantes (restaurantes, hotéis, comércio, eventos) a profissionais
autônomos, com custódia do valor até a conclusão do serviço.

- **Web**: https://trampo-hazel.vercel.app
- **API**: https://trampo-api-5azl.onrender.com

## Estrutura

| Pasta | O que é |
|---|---|
| `src/` | App web (React + Vite + Tailwind + shadcn/ui) |
| `server/` | API (Express + Postgres) — `index.js`, `schema.sql`, `seed.js`, `migrate.js` |
| `mobile/` | App React Native (Expo Router + NativeWind) |
| `docs/DEPLOY.md` | Passo a passo de publicação |

## Rodando localmente

Precisa de **Node.js 22+**. Para o banco, use Docker ou aponte para um Postgres existente.

### 1. Variáveis de ambiente

Copie o modelo e ajuste:

```sh
cp .env.example .env
```

As variáveis estão documentadas no próprio arquivo. As que importam para subir local:

| Variável | Para quê | Valor local |
|---|---|---|
| `DATABASE_URL` | conexão do Postgres | `postgres://trampo:trampo_local_dev@localhost:55433/trampo` |
| `JWT_SECRET` | assinatura dos tokens | qualquer valor em dev; **obrigatório** em produção |
| `VITE_API_URL` | URL da API que o front chama | `http://localhost:3001` |
| `ALLOWED_ORIGINS` | origens liberadas no CORS | pode ficar vazio em dev |

`VITE_API_URL` é lida em tempo de **build** pelo Vite: se mudar, reinicie o `npm run dev`.

### 2. Banco de dados

Com Docker:

```sh
docker compose -f docker-compose.local.yml up -d postgres
```

Aplique o schema e popule dados iniciais:

```sh
npm run db:migrate
npm run seed
```

O seed cria contas de teste (senha `trampo123`, ou defina `SEED_PASSWORD`):
`empresa@trampo.app`, `pintor@trampo.app`, `piscineiro@trampo.app`,
`garcom@trampo.app` e `admin@trampo.app`.

### 3. Subir API e web

Em dois terminais:

```sh
npm run dev:api    # API em http://localhost:3001
npm run dev        # web em http://localhost:8080
```

### 4. App mobile (opcional)

```sh
cd mobile
npm install
npm start
```

No Expo Go o celular é outro dispositivo: o app deriva o IP da sua máquina pelo
host do Metro automaticamente. Se precisar forçar, defina `EXPO_PUBLIC_API_URL`.

## Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | web em modo desenvolvimento |
| `npm run dev:api` | API local |
| `npm run build` | build de produção da web |
| `npm start` | API em produção |
| `npm run db:migrate` | aplica `server/schema.sql` |
| `npm run seed` | popula dados iniciais (idempotente) |
| `npm test` | testes (Vitest) |

## Pagamentos

Não há gateway de pagamento integrado. O saldo é um número em `users.balance`,
movido pelos endpoints `POST /api/mock/wallet/topup` e
`POST /api/mock/chat-unlock` — este último debita, desbloqueia a conversa e
registra o pagamento numa transação. A custódia (`escrow`) muda de `held` para
`released` sem movimentação financeira real.

Para integrar um provedor de verdade, substitua essas duas rotas; o resto do
fluxo não muda.

## Deploy

Ver `docs/DEPLOY.md`.
