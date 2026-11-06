# Checkpoint de continuação

**Feature ativa**: `004-professional-marketplace`  
**Registrado em**: 2026-10-26  
**Estado**: pausado por solicitação  
**Progresso**: 33 tarefas concluídas, 22 pendentes

## Onde parou

O mapa interativo do painel profissional está implementado com:

- Leaflet e React Leaflet;
- pan, zoom e agrupamento de marcadores;
- seleção sincronizada entre mapa e lista;
- “Buscar nesta área”, “Perto de mim” e retorno à região-piloto;
- localização aproximada por bairro;
- fallback em lista quando o mapa falha;
- filtros por texto e categoria.

O currículo de interesse privado foi iniciado:

- T024, T026, T027 e T028 concluídas;
- botão “Enviar currículo de interesse” disponível no cartão da vaga;
- criação, remoção e reativação idempotentes;
- mensagem de que o contratante vê somente a contagem agregada;
- preferência não cria candidatura automaticamente.

O formulário de vaga também possui endereço obrigatório e busca por CEP:

- CEP, rua, número, bairro, complemento, cidade e UF;
- preenchimento automático via ViaCEP;
- fallback manual sem apagar o formulário;
- T055 concluída.

A área existente "Meus interesses" agora também apresenta as preferências privadas:

- cada item mostra local, categoria e bairro aproximado;
- explica que o contratante só vê a contagem agregada;
- permite remover a preferência sem afetar candidaturas/interesses em vagas;
- T029 concluída.

As preferências privadas agora são persistidas em `preferences`:

- cada escolha possui um `id` próprio e pertence ao `user_id` autenticado;
- `location_id` e `category_id` formam uma chave única por usuário;
- remoção é lógica e reativação reutiliza o mesmo registro;
- a API expõe apenas as preferências do próprio usuário e não usa o CRUD genérico;
- migration local aplicada com sucesso no PostgreSQL da porta `55433`;

O painel de preferências foi extraído do dashboard existente para um componente testável, sem duplicar o fluxo:

- `src/components/marketplace/ProfessionalPreferencesPanel.tsx`;
- T025 validado com teste de privacidade, estado ativo e remoção.
- T030 validado no lado profissional do Cenário 2; os 3 testes de US2 passaram.

## Retomar exatamente daqui

Pausa registrada ao final da US4. Não iniciar trabalho adicional até a retomada.

Executar nesta ordem:

1. **T031–T037** — metas, pontos, níveis e selos.
2. Depois executar **T046–T054** — auditoria de privacidade, acessibilidade, regressões e validação final.

## Validação mais recente

- `src/test/marketplace-preferences.test.ts`: 2 testes aprovados.
- `src/test/marketplace-geo.test.ts`: 3 testes aprovados.
- Build Vite aprovado após CEP e currículo de interesse.
- Nenhum merge realizado.

## Restrições que permanecem

- Nunca fazer merge.
- Não recriar dashboards ou primitivas existentes.
- Não persistir localização real ou recompensas no banco neste MVP. Preferências privadas são persistidas por usuário em `preferences`.
- Nunca fornecer identidade, contato, horário ou posição individual ao contratante.
- Preferência privada não é candidatura.
