# Trampô Mobile

App React Native (Expo) portado do app web na raiz deste repositório. Mesmo layout,
mesmas cores, mesmos textos — adaptado para tela de celular.

O app web em `../src` continua funcionando e não foi alterado.

---

## Rodar em 1 comando (apresentação)

Na raiz do repositório:

```powershell
.\apresentacao.ps1
```

Sobe Postgres, API local e Expo em modo LAN, e mostra o QR code.
Abra o **Expo Go** no celular e leia o QR.

> Celular e PC precisam estar no **mesmo Wi-Fi**.

Para subir junto o app web original (útil para comparar lado a lado):

```powershell
.\apresentacao.ps1 -ComWeb
```

---

## Rodar manualmente

```bash
# 1. Banco + API (na raiz do repo)
docker compose -f docker-compose.local.yml up -d postgres
npm run dev:api

# 2. App mobile
cd mobile
npm install
npx expo start --lan
```

| Alvo | Comando | Observação |
|---|---|---|
| Celular (Expo Go) | `npx expo start --lan` | leia o QR code |
| Emulador Android | `npx expo start --android` | precisa do Android Studio |
| Navegador | `npx expo start --web` | demo reserva, sem celular |

---

## Como o app acha a API

No Expo Go o celular é um **dispositivo separado**: `localhost` apontaria para o
próprio telefone, não para o PC que roda a API.

`src/lib/config.ts` resolve isso derivando o IP do host do Metro — o mesmo IP que
o Expo já usa para servir o bundle. **Não é preciso editar IP a cada rede.**

Ordem de precedência:

1. `EXPO_PUBLIC_API_URL` (override manual)
2. IP do host do Metro + porta `3001`
3. `localhost:3001` (emulador / web)

Se a API não responder, as telas caem nos dados de demonstração de
`src/lib/demoData.ts` — a apresentação nunca mostra tela vazia.

---

## Gerar o APK para instalar no Android

Não há Android SDK nem Java nesta máquina, então o build é feito na nuvem (EAS Build).
São passos **seus**, porque exigem login na sua conta Expo:

```bash
npm install -g eas-cli
eas login                      # sua conta Expo
cd mobile
eas build:configure
eas build --platform android --profile preview
```

O perfil `preview` (em `eas.json`) gera um **APK** — o formato que instala direto no
celular. Ao terminar, o EAS devolve um link de download; abra no Android, permita
"instalar de fontes desconhecidas" e pronto.

> ⚠️ **Importante para o APK:** um app instalado não tem Metro de onde derivar o IP.
> Por isso o perfil `preview` fixa `EXPO_PUBLIC_API_URL` em `eas.json`. Hoje está
> `http://192.168.15.7:3001`. **Se o IP do seu PC mudar, atualize lá antes de buildar** —
> senão o APK não acha a API. Para uma demo fora da sua rede, aponte para uma API
> publicada em vez de um IP local.

---

## Estrutura

```
mobile/
├── app/                    # rotas (expo-router) — espelham as rotas do web
│   ├── _layout.tsx         # AuthProvider + Stack + Toaster
│   ├── index.tsx           # landing
│   ├── auth.tsx            # login / cadastro / acesso rápido
│   ├── painel.tsx          # roteia por papel do usuário
│   ├── criar-vaga.tsx
│   ├── urgente.tsx         # Radar SOS Turbo
│   ├── conversas.tsx
│   ├── chat/[id].tsx
│   ├── disponibilidade.tsx
│   ├── meus-trampos.tsx
│   └── termos.tsx
└── src/
    ├── components/
    │   ├── landing/        # Hero, Categories, Pricing, ...
    │   └── ui/             # Button, Card, Badge, Input, Tabs, Toast
    ├── screens/            # os 3 dashboards
    ├── hooks/useAuth.tsx
    └── lib/
        ├── api.ts          # cliente da API local (AsyncStorage)
        ├── config.ts       # resolução do IP da API
        ├── categories.ts   # cópia literal do web
        ├── contractState.ts# cópia literal do web
        └── demoData.ts     # seeds da apresentação
```

### Rotas: web ↔ mobile

| Web | Mobile |
|---|---|
| `/` | `app/index.tsx` |
| `/auth` | `app/auth.tsx` |
| `/painel` | `app/painel.tsx` |
| `/criar-vaga` | `app/criar-vaga.tsx` |
| `/urgente` | `app/urgente.tsx` |
| `/conversas` | `app/conversas.tsx` |
| `/chat/:id` | `app/chat/[id].tsx` |
| `/disponibilidade` | `app/disponibilidade.tsx` |
| `/meus-trampos` | `app/meus-trampos.tsx` |
| `/termos` | `app/termos.tsx` |

---

## Como o layout foi mantido igual

- **NativeWind v4** interpreta `className` do Tailwind em React Native, então o JSX
  foi portado quase 1:1 em vez de reescrito com `StyleSheet`.
- **`global.css`** replica os tokens HSL de `../src/index.css`, então as cores são as
  mesmas — não aproximações.
- **`lucide-react-native`** tem os mesmos nomes de ícone do `lucide-react` do web.

O que **precisou** mudar (o conteúdo é o mesmo, só o arranjo):

| Web | Mobile | Por quê |
|---|---|---|
| Grids de 2–5 colunas | Coluna única / wrap | largura de celular |
| `TabsList` fixa | Faixa rolável | 5 rótulos não cabem lado a lado |
| `<Select>` modal | Chips roláveis | melhor no toque para ~40 opções |
| Botão voltar do navegador | `ScreenHeader` | mobile não tem |
| `radial-gradient`, `backdrop-blur`, `hover` | removidos / `:active` | sem equivalente em RN |

---

## Notas de build

Três ajustes que o Expo SDK 57 exigiu — todos já aplicados:

- `babel-preset-expo`, `react-native-worklets` e `@babel/core` instalados no topo
  (vêm aninhados e o `babel.config.js` precisa resolvê-los).
- `@babel/core` fixado em `^7` — a versão 8 quebra o preset do Expo.
- `.npmrc` com `legacy-peer-deps=true`: `expo-router` puxa `react-dom@19.2.8`
  enquanto `expo` fixa `react@19.2.3`. Inofensivo para native.

Verificar antes de apresentar:

```bash
npx tsc --noEmit                                    # tipos
npx expo export --platform android --output-dir /tmp/t   # bundle compila
```
