# Trampô — sistema visual do piloto

## Voz e objetivo

Interface direta, local e operacional. Cada tela tem um propósito, uma ação principal e textos que explicam valor, condição e próximo passo. “Demonstração” aparece antes e depois de toda ação mockada.

## Cores

- `primary`: laranja da marca para ações principais e ênfase funcional.
- `secondary`: azul-noite para navegação e painéis de explicação.
- `background`, `card`, `muted` e `border`: superfícies neutras claras.
- `success` e `destructive`: somente para estados, sempre acompanhados de texto ou ícone.
- Contraste mínimo: 4,5:1 para texto regular; 3:1 para texto grande e componentes essenciais.

## Tipografia

- Família: Manrope, com fallback de sistema.
- Corpo: 16 px ou maior, altura de linha próxima de 1,5.
- Hierarquia por tamanho, peso e espaçamento; nunca por caixa alta prolongada.
- Texto corrido limitado a aproximadamente 65–75 caracteres por linha.

## Forma e espaço

- Raios: 8 px para campos, 10 px para controles, 12 px para superfícies maiores.
- Preferir borda ou sombra; não usar ambas com a mesma intensidade.
- Cartões somente quando agrupam informação ou ação; nunca cartões decorativos aninhados.
- Alvos de toque: mínimo de 44 × 44 px.

## Movimento

- Transições breves e funcionais, sem bounce, pulso ou marquee.
- Conteúdo visível por padrão.
- `prefers-reduced-motion` remove animações não essenciais.

## Evitar

Gradientes genéricos, texto em gradiente, glassmorphism, halos, neon, paleta bege automática, badges sem função, ícones enormes, bordas laterais decorativas e slogans vagos.

## Mapas

- Usar mapa interativo somente quando localização muda a decisão; toda ação deve existir também em lista.
- Tiles são configuráveis. No desenvolvimento, usar `https://tile.openstreetmap.org/{z}/{x}/{y}.png` com atribuição visível “© OpenStreetMap contributors”.
- Não fazer prefetch, download em lote ou ocultar atribuição. O serviço público não possui SLA e deve ser substituído por provedor adequado antes de produção comercial.
- Vagas públicas exibem coordenada aproximada por bairro; endereço exato não aparece no marketplace.
- Falha de mapa ou localização nunca bloqueia filtros, detalhes ou candidatura pela lista.
