# Contract: Jornadas e Estados de UI

## Regras globais

- Toda tela possui título descritivo e uma ação primária por contexto.
- Ações financeiras ou operacionais mostram “Demonstração” antes e depois.
- Diária, taxa do contratante e taxa do profissional usam rótulos explícitos.
- Estados mínimos: carregando, vazio, pronto, confirmação, sucesso e erro recuperável.
- Teclado, foco visível e alvos de toque de 44 × 44 px são obrigatórios.

## `/` — Landing page

Objetivo: explicar o piloto. Ações: entrar como contratante (primária) ou profissional (secundária). Deve conter localidade, quatro etapas, sete categorias, Avulso 12%, Pro R$ 59,90/14 dias, taxa profissional R$ 7,90 e ausência de custódia.

## `/criar-vaga` — Publicação

Objetivo: montar vaga e entender custos. Pro publica mock com taxa zero. Avulso separa 12% e exige confirmação fictícia antes de abrir. Erros preservam os campos.

## `/painel` — Contratante

Objetivo: acompanhar plano e vagas. Mostra estabelecimento fictício, teste, conta mockada, preenchimento, posições, taxas, diária total e equipe favorita existente.

## `/meus-trampos` — Profissional

Objetivo: encontrar e confirmar diárias. A ação muda por estado: demonstrar interesse; confirmar R$ 7,90 após seleção; fazer check-in; concluir turno. R$ 7,90 nunca aparece como devido antes da seleção.

## Equipe favorita

Objetivo: consultar e reutilizar profissionais. Deve reutilizar a experiência no painel; qualquer acesso `/equipe` aponta para a mesma fonte, sem componente duplicado.

## `/termos` — Termos demonstrativos

Explica aproximação, valores mockados, ausência de custódia/garantia, nenhuma operação financeira ou fiscal real, check-in/recibo demonstrativos, no-show e suspensão simulados.

## Critérios visuais

- Sem cartões aninhados decorativos, texto em gradiente, halo, neon ou glassmorphism recorrente.
- Borda ou sombra define a superfície; evitar redundância.
- Corpo equivalente a 16 px ou maior, WCAG AA e linhas controladas.
- Sem rolagem horizontal em 360, 768 e 1280 px.
- Movimento breve, funcional e removível por preferência reduzida.

