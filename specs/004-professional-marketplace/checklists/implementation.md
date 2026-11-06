# Revisão de implementação — Marketplace profissional

- [x] Preferências privadas retornam somente local, categoria e contagem agregada.
- [x] Preferências não criam candidatura e são idempotentes na criação, remoção e reativação.
- [x] Recompensas são mockadas, idempotentes e não alteram pagamento, ordem ou matching.
- [x] Mapa usa localização aproximada, atribuição visível e alternativa equivalente em lista.
- [x] Publicação recebe endereço obrigatório com fallback manual e busca por CEP.
- [ ] E2E autenticado do dashboard profissional: o cenário ainda depende de uma sessão local de teste.
- [ ] Auditoria visual completa em leitor de tela e movimento reduzido ainda precisa de execução manual.

## Diferenças restantes

Os dois itens pendentes são validações de ambiente/execução, não mudanças de domínio: o Playwright precisa iniciar uma sessão profissional mockada para acessar `/painel`, e a revisão com leitor de tela/movimento reduzido ainda não foi executada manualmente.
