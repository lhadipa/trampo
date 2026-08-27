# Deploy — Trampô (ambiente de demonstração)

Arquitetura, tudo em plano gratuito:

```
Vercel (web SPA)  ──┐
                    ├──► Render Free (API Express) ──► Neon Free (Postgres)
EAS Build (APK)   ──┘
```

Pagamentos são **simulados**: nenhuma integração financeira real, nenhum valor
transita. Ver a seção "Pagamento simulado" no fim.

---

## 1. Banco — Neon

1. <https://neon.tech> → login com GitHub → novo projeto `trampo`, região `AWS São Paulo`.
2. Copiar a connection string (`postgresql://...?sslmode=require`).
3. Criar o schema e popular a demonstração:

```bash
psql "postgresql://...?sslmode=require" -f server/schema.sql
DATABASE_URL="postgresql://...?sslmode=require" npm run seed
```

O seed é idempotente. Logins criados (senha `trampo123`, ou `SEED_PASSWORD`):

| Papel | E-mail |
|---|---|
| Empresa | `empresa@trampo.app` |
| Freelancer (pintor) | `pintor@trampo.app` |
| Freelancer (piscineiro) | `piscineiro@trampo.app` |
| Freelancer (garçom) | `garcom@trampo.app` |
| Admin | `admin@trampo.app` |

## 2. API — Render

O `render.yaml` na raiz já descreve o serviço. New → Blueprint → apontar o repo,
ou criar um Web Service manual com:

- Build: `npm install`
- Start: `npm start`
- Health check: `/api/health`

Variáveis de ambiente:

| Variável | Valor |
|---|---|
| `NODE_ENV` | `production` |
| `JWT_SECRET` | valor aleatório (o Render gera pelo blueprint) |
| `DATABASE_URL` | connection string do Neon |
| `ALLOWED_ORIGINS` | `https://<seu-app>.vercel.app` |

Sem `JWT_SECRET` o processo aborta de propósito — um segredo padrão em produção
permitiria forjar a sessão de qualquer usuário.

Validar: `curl https://trampo-api-5azl.onrender.com/api/health` → `{"ok":true,...}`

### Manter a API acordada

O plano free hiberna após 15 min de ociosidade e a primeira requisição depois
disso leva ~50 s. Criar um job grátis no <https://cron-job.org> chamando
`/api/health` a cada 10 minutos.

## 3. Web — Vercel

Import do repo; o `vercel.json` já define build, output e o rewrite de SPA.

| Variável | Valor |
|---|---|
| `VITE_API_URL` | `https://trampo-api-5azl.onrender.com` |

## 4. APK — EAS Build

```bash
npm i -g eas-cli
eas login
cd mobile
eas init                                  # grava o projectId no app.json
eas build -p android --profile preview    # gera APK
```

Antes de buildar, conferir `EXPO_PUBLIC_API_URL` no perfil `preview` do
`mobile/eas.json` — deve apontar para a URL real do Render.

Perfis disponíveis:

| Perfil | Saída | API |
|---|---|---|
| `development` | APK com dev client | resolvida pelo host do Metro |
| `preview` | **APK** (é o que vai para o cliente) | Render |
| `preview-lan` | APK | IP da LAN, para demo offline |
| `production` | AAB (Play Store) | Render |

O EAS devolve um link `expo.dev/accounts/.../builds/...` com QR code e download
— **é esse link que vai para o cliente**, não o arquivo por WhatsApp.

### Plano B: build local

O diretório `mobile/android/` já existe (prebuild feito):

```bash
cd mobile/android && ./gradlew assembleRelease
# app/build/outputs/apk/release/app-release.apk
```

Requer JDK 17 + Android SDK e um keystore de release gerado com `keytool`.
**Guardar o keystore** — sem ele não dá para publicar atualizações do app.

---

## Pagamento simulado

Não existe PSP integrado. O saldo é um número em `users.balance`, movido
exclusivamente pelo servidor através de dois endpoints:

| Endpoint | O que faz |
|---|---|
| `POST /api/mock/wallet/topup` | credita saldo (teto de R$ 1000), registra em `payments` com status `paid_mock` |
| `POST /api/mock/chat-unlock` | debita o preço, desbloqueia a conversa e registra o pagamento, em uma transação |

O cliente **não** pode escrever em `users.balance` — seria crédito infinito. A
custódia (`escrow`) também é simulada: muda de `held` para `released` sem
movimentação real.

Para integrar um PSP de verdade, substituir essas duas rotas — o resto do fluxo
não muda.

## Checklist antes de entregar

- [ ] `/api/health` responde
- [ ] Login com as contas do seed funciona na web e no app
- [ ] Criar vaga → candidatar → contratar → check-in
- [ ] Desbloqueio de chat debita saldo e registra em `payments`
- [ ] Faixa de "ambiente de demonstração" visível na web e no app
- [ ] Cron de keep-alive ativo
- [ ] APK instalado e testado em aparelho real
