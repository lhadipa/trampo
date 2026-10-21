# Quickstart: Validar o CRM Central Administrativo

## Pré-requisitos

- Node.js 22+.
- Dependências instaladas na raiz.
- PostgreSQL disponível conforme `DATABASE_URL`.
- Schema e seed aplicados.
- Conta administrativa e pelo menos uma conta de empresa, pessoa física ou profissional.

## Preparar ambiente

```powershell
npm install
npm run db:migrate
npm run seed
```

Em terminais separados:

```powershell
npm run dev:api
npm run dev
```

Abrir `http://localhost:8080/auth`, entrar com uma conta administrativa e acessar `/painel`.

## Cenários de validação P1

1. Confirmar que o administrador vê o título CRM Central, identificação, atualização e indicadores reais.
2. Pesquisar por nome/e-mail e aplicar tipo, status e período; confirmar que a lista não mistura clientes.
3. Abrir uma empresa e um profissional; confirmar perfil, contagens e relações reais. Confirmar estados vazios para relações inexistentes.
4. Bloquear uma conta ativa e desbloquear uma conta bloqueada; confirmar atualização e mensagem de resultado.
5. Entrar como usuário comum e tentar acessar a visão global; confirmar recusa do backend e ausência de dados globais.
6. Inspecionar respostas de `users`; confirmar que `password_hash` nunca aparece.
7. Usar viewport desktop, tablet e mobile; confirmar busca, detalhe, atualização, bloqueio e saída utilizáveis.

## Verificações automatizadas

```powershell
npm test
npm run build
npm run lint
```

Os resultados esperados são suíte aprovada, build concluído e lint sem novos erros relacionados ao CRM. Testes de autorização devem ser executados com tokens de administrador, usuário comum, sessão ausente e usuário bloqueado conforme [admin-crm-api.md](./contracts/admin-crm-api.md).

## Pós-validação

Não executar merge. Registrar falhas como ajustes de implementação/tarefas antes de considerar o plano concluído.
