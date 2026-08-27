# SPEC COMPLETO — Redesign Visual do App Android Trampô

## 1. Objetivo

Executar um redesign estritamente visual do aplicativo Android Trampô para eliminar a aparência de interface genérica produzida por IA/vibe coding.

O resultado deve parecer um aplicativo maduro de contratação de profissionais autônomos: claro, formal, confiável, operacional e pronto para distribuição em lojas.

A referência de marca é o site oficial do Trampô:

- Laranja como assinatura da marca.
- Grafite/preto como base estrutural.
- Fundo claro e neutro.
- Linguagem objetiva.
- Interface centrada em contratar profissionais e gerenciar serviços.

---

## 2. Restrição máxima: não alterar comportamento

Este trabalho não pode alterar absolutamente nada fora da camada visual.

### É proibido alterar

- Lógica de negócio.
- Fluxos existentes.
- Navegação, rotas, deep links ou destino de telas.
- Callbacks, listeners, eventos, intents ou actions.
- ViewModels, use cases, repositories ou qualquer regra de domínio.
- APIs, banco de dados, autenticação ou integrações.
- Estrutura de dados, DTOs, models ou mapeamentos.
- Validações, permissões, estados de loading, erro ou vazio.
- Textos ligados a regras de negócio.
- Cálculos, valores, filtros, ordenação ou busca.
- Condições de exibição.
- Dependências funcionais.
- Build, Gradle, assinatura, configuração de APK ou versão do app.
- Acessibilidade funcional existente.
- Componentes existentes: não recriar componentes do zero.

### É permitido alterar

- Cores.
- Tipografia.
- Tamanhos visuais.
- Espaçamento.
- Margens e paddings.
- Bordas.
- Raios de canto.
- Elevação/sombra.
- Ícones.
- Hierarquia visual.
- Ordem visual interna de informações já existentes, desde que não mude a ordem funcional, a condição de exibição ou o comportamento.
- Estilo de cards, botões, tabs, filtros, campos e banners existentes.
- Temas e tokens visuais.
- Recursos de fonte e vetores de ícone.

---

## 3. Diagnóstico do visual atual

A aparência de IA não vem da funcionalidade. Ela vem da combinação de decisões visuais repetidas e sem uma hierarquia única:

- Excesso de pílulas.
- Muitos botões, tags e filtros com o mesmo formato arredondado.
- Muitos ícones diferentes competindo pela atenção.
- Emojis em áreas de produto.
- Laranja aplicado em muitas prioridades ao mesmo tempo.
- Cards dentro de cards.
- Bordas e contornos demais.
- Banner promocional com mais destaque que a tarefa principal.
- Muitas informações pequenas antes da lista principal.
- Mistura de estilos de ícone.
- Falta de uma escala única de espaçamento, tipografia e raio.

O redesign deve resolver isso por subtração e consistência, não por adicionar novos elementos.

---

## 4. Direção de produto

O Trampô não é uma landing page de SaaS e não deve parecer um dashboard promocional.

O produto é uma ferramenta para:

- Encontrar profissionais.
- Contratar freelancers.
- Publicar vagas.
- Acompanhar serviços.
- Conversar com profissionais.
- Gerenciar pagamentos e segurança operacional.

A interface deve transmitir:

1. **Clareza:** o usuário entende onde está e o que fazer.
2. **Confiança:** pagamentos, disponibilidade e status são fáceis de ler.
3. **Rapidez:** a ação principal aparece sem poluição visual.
4. **Profissionalismo:** menos decoração, mais estrutura.
5. **Humanidade:** trata-se de contratar pessoas reais, não “ativar recursos”.

---

## 5. Biblioteca de ícones

### Escolha obrigatória

Usar exclusivamente **Phosphor Icons para Jetpack Compose**:

```kotlin
implementation("io.github.dev778g-me:phosphoricon-compose:1.0.4")
```

### Regras

- Usar somente Phosphor em toda a interface.
- Usar preferencialmente os pesos `Regular` ou `Medium`.
- Não misturar Phosphor com Lucide, Material Icons, emojis ou SVGs de estilos diferentes.
- Não usar ícones decorativos sem função.
- Não colocar cada ícone em um quadrado, círculo ou pílula.
- Ícone deve servir a uma ação, status ou categoria real.

### Mapeamento visual sugerido

| Contexto | Ícone |
|---|---|
| Explorar | `House` |
| Buscar | `MagnifyingGlass` |
| Vagas | `Briefcase` |
| Publicar vaga | `Plus` |
| Mensagens | `ChatCircle` |
| Favoritos | `Heart` |
| Perfil | `User` |
| Localização | `MapPin` |
| Avaliação | `Star` |
| Verificação | `SealCheck` |
| Disponibilidade | `CheckCircle` |
| Pagamento | `CurrencyCircleDollar` |
| Segurança | `ShieldCheck` |
| Sair | `SignOut` |
| Chamada urgente | `BellRinging` ou `Siren` |
| Categorias | ícones Phosphor coerentes com cada serviço |

Não usar mão acenando, raio, cruz decorativa, emojis de serviço ou outros símbolos sem uma função clara.

---

## 6. Tipografia

### Fonte única

Usar **Manrope** em todo o aplicativo.

Não misturar fontes.

### Pesos

| Uso | Peso |
|---|---|
| Título principal | Bold / 700 |
| Título de seção | Bold / 700 |
| Nome de profissional | SemiBold / 600 |
| Botões e itens de navegação | SemiBold / 600 |
| Texto comum | Regular / 400 |
| Metadados e status | Medium / 500 |

### Escala

| Elemento | Tamanho sugerido |
|---|---|
| Título de tela | 24–28sp |
| Título de seção | 18–20sp |
| Título de card | 16sp |
| Texto principal | 14–16sp |
| Texto auxiliar | 13–14sp |
| Metadado/label | 12sp |
| Navegação inferior | 12sp |

Evitar texto pequeno demais, excesso de variações de peso e títulos enormes em telas operacionais.

---

## 7. Paleta e tokens visuais

### Papel de cada cor

| Papel | Uso |
|---|---|
| Laranja Trampô | CTA principal, item ativo, ação urgente, marca |
| Grafite/preto | Títulos, estrutura, ícones neutros |
| Off-white | Fundo da tela |
| Branco | Cards e superfícies |
| Verde | Disponível, verificado, confirmado, concluído |
| Vermelho | Erro, cancelamento e alerta real |
| Cinza médio | Texto auxiliar |
| Cinza claro | Bordas, divisores, estado inativo |

### Regras obrigatórias

- Laranja não deve preencher tudo.
- Verde não é cor decorativa; é apenas status positivo.
- Vermelho não é cor de destaque comum.
- Não usar gradientes.
- Não usar glow.
- Não usar sombra colorida.
- Não usar múltiplos tons saturados na mesma área.

---

## 8. Espaçamento, bordas e superfícies

### Escala de espaçamento

Usar apenas:

`4dp, 8dp, 12dp, 16dp, 24dp, 32dp`

Não criar espaçamentos arbitrários.

### Raios

| Componente | Raio |
|---|---|
| Card | 12dp |
| Campo de busca | 10dp |
| Botão | 8dp |
| Tag estritamente necessária | 999dp |
| Modal/sheet | 16dp |

### Bordas e sombras

- Fundo geral em off-white.
- Cards em branco.
- Borda cinza clara, fina e discreta.
- Sem sombra em cards comuns.
- Usar separação por espaço, não por muitas linhas.
- Não empilhar card dentro de card sem necessidade.

---

## 9. Remoção das pílulas

A remoção de pílulas é uma prioridade central deste redesign.

### Remover ou reduzir

- Tabs em formato de cápsula.
- Filtros como botões arredondados em excesso.
- Selos decorativos.
- Botões pequenos com raio máximo.
- Ícones presos em fundos arredondados.
- Chips de categorias com aparência de confete visual.

### Substituir por

| Hoje | Redesign |
|---|---|
| Tab em pílula | Texto com indicador inferior laranja |
| Filtro em cápsula | Texto simples ou bloco neutro de raio moderado |
| Ícone em quadrado | Ícone isolado ao lado do texto |
| Selo grande | Texto auxiliar curto e discreto |
| Métrica em subcard | Linha de informação com divisor |
| Vários CTAs | Uma ação principal e ações secundárias neutras |

Pílulas ficam permitidas somente quando a informação realmente for uma tag curta, como status ou categoria selecionada.

---

## 10. Hierarquia por tela

### Topo da tela

Estrutura visual:

1. Título ou saudação.
2. Contexto mínimo.
3. Uma ação principal.
4. Conteúdo operacional.

Não iniciar a tela com banner grande, plano, promoção ou métricas secundárias.

### Tela inicial do contratante

Manter funcionalidades e dados atuais, reorganizando apenas visualmente:

1. Saudação: “Olá, Hotel Fazenda Solar”.
2. Contexto curto: tipo de conta ou operação.
3. CTA principal: **Contratar profissional**.
4. CTA secundário: **Publicar vaga**.
5. Busca.
6. Categorias.
7. Lista de profissionais.
8. Vagas/chamados em andamento.
9. Informação de plano, de forma discreta.

O bloco VIP não deve dominar a primeira dobra da tela.

### Busca e filtros

- Campo de busca limpo, com ícone de lupa Phosphor.
- Filtro ativo usa texto ou indicador laranja.
- Filtros inativos usam texto neutro.
- Não usar chips arredondados em sequência ocupando toda a tela.
- Preservar os filtros, eventos e resultados existentes.

### Lista de profissionais

Priorizar a leitura:

1. Foto/avatar.
2. Nome.
3. Especialidade.
4. Localização.
5. Avaliação.
6. Disponibilidade.
7. Ação existente.

Não alterar os dados, o clique, as condições ou o comportamento.

### Card de profissional

Aplicar:

- Fundo branco.
- Borda suave.
- Raio de 12dp.
- Avatar com tamanho consistente.
- Nome em destaque.
- Especialidade e local em texto auxiliar.
- Status positivo em verde.
- Avaliação discreta.
- Ação principal já existente preservada.

Favoritar e chat devem ser visualmente secundários, sem alterar seus callbacks.

### Vagas e chamados

- Preservar todos os status e regras.
- Dar prioridade para título, data, local, status e ação.
- Usar cor apenas para o status.
- Remover decorações, selos ou fundos extras.

### Mensagens

- Não mudar fluxo, chat ou lógica.
- Padronizar ícones com Phosphor.
- Usar separadores e hierarquia de texto em vez de múltiplos contornos.

### Perfil e conta

- Agrupar configurações visualmente.
- Usar ícones Phosphor consistentes.
- Plano, benefícios e informações comerciais devem aparecer como uma seção neutra, não como anúncio.

---

## 11. Botões

### Botão primário

- Fundo laranja.
- Texto branco.
- Raio de 8dp.
- Ícone apenas quando ajudar a leitura.
- Usar para a principal ação da tela.

### Botão secundário

- Fundo branco ou transparente.
- Borda cinza discreta.
- Texto grafite.
- Raio de 8dp.

### Botão de texto

- Sem borda.
- Sem fundo.
- Texto grafite ou laranja, conforme prioridade.
- Usar para ações secundárias.

Não alterar ações, navegação ou estados habilitado/desabilitado existentes.

---

## 12. Tom de voz visual

### Preferir

- Contratar profissional
- Publicar vaga
- Chamada urgente
- Profissional verificado
- Pagamento protegido
- Aguardando confirmação
- Serviço em andamento
- Serviço concluído
- Pagamento liberado

### Reduzir visualmente

- VIP
- Turbo
- Fundador
- Métricas promocionais
- Linguagem de urgência sem urgência real
- Frases longas explicando o produto dentro da tela operacional

Não mudar textos que tenham impacto funcional sem aprovação; quando possível, priorizar alteração de hierarquia, estilo e apresentação.

---

## 13. Processo de execução

1. Mapear os componentes visuais existentes.
2. Criar ou ajustar tokens de cor, tipografia, espaçamento, raio e borda.
3. Adicionar Manrope como recurso visual.
4. Adicionar Phosphor Icons.
5. Substituir emojis e ícones visualmente inconsistentes.
6. Ajustar tema e componentes existentes.
7. Remover estilos de cápsula excessivos.
8. Simplificar cards e banners sem alterar dados ou ações.
9. Ajustar hierarquia de cada tela.
10. Validar que nenhum fluxo ou comportamento mudou.
11. Gerar o APK normalmente, sem mudança de configuração funcional.

---

## 14. Critérios de aceite

O redesign só estará concluído quando:

- Nenhuma lógica ou funcionalidade tiver sido alterada.
- Nenhuma navegação ou callback tiver sido alterado.
- Nenhuma API, dado, estado ou regra tiver sido alterado.
- Nenhum componente tiver sido recriado do zero.
- Não houver emojis na UI.
- Todos os ícones vierem de Phosphor Icons.
- Não houver mistura de bibliotecas de ícones.
- O laranja estiver limitado a marca, CTA e destaque.
- O verde estiver limitado a estados positivos.
- O excesso de pílulas tiver sido removido.
- Cards não estiverem aninhados sem necessidade.
- A primeira ação operacional estiver mais visível que banners promocionais.
- O app parecer uma ferramenta confiável de contratação de freelancers.
- O APK continuar sendo gerado com o mesmo comportamento funcional anterior.