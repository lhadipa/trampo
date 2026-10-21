# Checkpoint de continuação

**Feature ativa**: `004-professional-marketplace`  
**Registrado em**: 2026-09-30  
**Estado**: implementação em andamento  
**Progresso**: 22 tarefas concluídas, 33 pendentes

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

## Retomar exatamente daqui

Executar nesta ordem:

1. **T025** — teste de UI do currículo de interesse em `src/test/marketplace-preference-flow.test.tsx`.
2. **T029** — área privada para listar e remover locais/categorias preferidos em `src/pages/DashboardFreelancer.tsx`.
3. **T030** — executar testes US2 e validar o Cenário 2 do `quickstart.md`.
4. **T038 e T039** — preparar testes de privacidade e demanda agregada.
5. **T040–T045** — mostrar ao contratante somente `locationId`, `categoryId` e `count` e integrar publicação por categoria/local.
6. Depois iniciar **T031–T037** — metas, pontos, níveis e selos.

## Validação mais recente

- `src/test/marketplace-preferences.test.ts`: 2 testes aprovados.
- `src/test/marketplace-geo.test.ts`: 3 testes aprovados.
- Build Vite aprovado após CEP e currículo de interesse.
- Nenhum merge realizado.

## Restrições que permanecem

- Nunca fazer merge.
- Não recriar dashboards ou primitivas existentes.
- Não persistir localização real, preferências ou recompensas no banco neste MVP.
- Nunca fornecer identidade, contato, horário ou posição individual ao contratante.
- Preferência privada não é candidatura.
