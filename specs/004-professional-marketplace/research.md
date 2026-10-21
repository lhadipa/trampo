# Research: Marketplace Profissional

## Biblioteca de mapa

**Decision**: Leaflet + React Leaflet, com agrupamento de marcadores por plugin compatível.

**Rationale**: atende pan, zoom, eventos, marcadores, popup e controle programático; combina com a aplicação React/Vite; não exige token para o motor do mapa; permite trocar a origem dos tiles sem alterar o domínio.

**Alternatives considered**:

- MapLibre GL: excelente para mapas vetoriais e clustering nativo, porém adiciona complexidade de estilos e provedor desnecessária para o conjunto pequeno do MVP.
- Google Maps: ecossistema maduro, mas exige conta, chave, cobrança e termos adicionais.
- iframe: rejeitado porque não oferece sincronização confiável, clustering controlado nem contrato acessível suficiente.

## Tiles e atribuição

**Decision**: tornar URL e atribuição configuráveis. Em desenvolvimento do MVP, permitir tiles padrão do OpenStreetMap com atribuição visível e sem prefetch; antes de produção, selecionar provedor com capacidade e termos adequados.

**Rationale**: os servidores públicos do OpenStreetMap são best-effort, exigem atribuição, cache normal e proíbem bulk download. O produto não deve depender deles como SLA comercial.

**Alternatives considered**: hard-code de tiles públicos foi rejeitado; self-hosting foi adiado por custo operacional.

## Privacidade das preferências

**Decision**: a interface de contratante recebe apenas agregados por local e categoria. Registros individuais nunca são passados para essa visão, mesmo que a UI não os mostre.

**Rationale**: ocultar no componente não é proteção suficiente; o contrato de dados deve impedir reidentificação por nome, ordem ou horário.

## Localização de vagas

**Decision**: usar coordenadas aproximadas por bairro para descoberta; endereço exato continua fora do marketplace público.

**Rationale**: oferece utilidade geográfica sem divulgar residência ou ponto operacional sensível.

## Metas e recompensas

**Decision**: eventos com chave idempotente, pontos não financeiros e selos transparentes. Recusa, pausa e remoção de preferência não reduzem pontuação.

**Rationale**: evita duplicação técnica e incentivos manipulativos que pressionariam profissionais a aceitar trabalhos inadequados.
