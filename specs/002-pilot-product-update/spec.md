# Feature Specification: Atualização do Produto para o Piloto Local

**Feature Branch**: `002-pilot-product-update`

**Created**: 2026-09-30

**Status**: Draft

**Input**: User description: "Atualizar o Trampô tomando como base a experiência apresentada em https://gem-orchid-yarrow-ruby.grok.me."

## Contexto e limites da atualização

A atualização reposiciona a experiência existente do Trampô para um piloto operacional em São João del-Rei e região. A referência orienta hierarquia, conteúdo, jornadas e regras de negócio, mas não deve ser copiada literalmente. As telas, navegação e componentes já existentes serão evoluídos; não serão criadas versões paralelas ou recriados componentes equivalentes.

A atualização visual seguirá os princípios observados em https://impeccable.style: preservar o sistema e a identidade existentes, projetar cada tela para a tarefa principal do usuário, tornar a hierarquia evidente e remover padrões visuais genéricos ou decorativos que não ajudam a decidir ou agir. A referência serve como orientação de qualidade e crítica visual, não como layout, marca ou código a ser copiado.

O piloto apresentado nesta etapa é demonstrativo. Valores, planos, estabelecimentos, profissionais, vagas, taxas, pagamentos, chaves Pix, check-ins, recibos, avaliações, datas e históricos serão dados mockados, sem cobrança, transferência bancária, documento fiscal ou operação real. A interface deve deixar esse caráter demonstrativo claro sempre que uma ação puder ser interpretada como financeira, contratual ou operacional.

O modelo simulado opera sem custódia do valor da diária. Na narrativa do produto, o contratante paga a diária diretamente na chave Pix do profissional após o turno, enquanto a receita futura da plataforma viria da taxa de conexão do plano Avulso ou da mensalidade do plano Pro. Alegações atuais de escrow, garantia de pagamento, cobertura nacional ativa, gratuidade VIP de 60 dias e ausência de taxas precisam ser removidas ou adequadas onde conflitarem com esse modelo demonstrativo.

## Clarifications

### Session 2026-09-30

- Q: Qual taxa mockada o profissional deve pagar para confirmar um trabalho após ser selecionado? → A: R$ 7,90 após ser selecionado e antes da confirmação do trabalho.

### Experiência de referência a incorporar

| Área | Resultado esperado na experiência atualizada |
|---|---|
| Navegação | Acesso claro a Início, Publicar, Painel, Diárias, Equipe e entrada no piloto, adaptado ao estado autenticado e ao papel do usuário |
| Página inicial | Apresentação do piloto local, proposta de trabalho rápido por diária, chamadas separadas para contratante e profissional e resumo transparente da oferta |
| Fluxo financeiro | Explicação em quatro etapas: publicação, aceite, check-in e pagamento direto com recibo |
| Categorias | Gastronomia e bares, eventos e festas, casa e conservação, obras e reparos, beleza e bem-estar, comércio e apoio e promoção e vendas, incluindo panfletagem e vendas porta a porta, com faixas de diária indicativas |
| Oferta | Valores demonstrativos: contratante Avulso com taxa de conexão de 12%, Pro por R$ 59,90/mês com 14 dias de teste e taxa zero, e profissional sem mensalidade com taxa avulsa de R$ 7,90 por trabalho confirmado |
| Publicação | Simulação de vaga individual ou em lote/equipe, com cálculo demonstrativo das diárias e da taxa antes da confirmação |
| Painel do contratante | Plano, estado da conta, vagas, preenchimento, taxa de conexão e soma de diárias fora da plataforma |
| Diárias do profissional | Vagas abertas na cidade, chamados atribuídos, histórico e indicador de no-show |
| Equipe favorita | Profissionais já validados pelo estabelecimento e ação para favoritar outros profissionais |
| Termos | Modelo sem custódia, pagamento direto, regras de presença, recibo, no-show, inadimplência e foro do piloto |

### Direção visual e de interação

| Princípio | Aplicação no Trampô |
|---|---|
| Hierarquia orientada à tarefa | Cada página deve ter um objetivo dominante, um título claro e uma ação principal visualmente prioritária |
| Clareza antes de decoração | Espaçamento, tipografia, contraste e divisores devem organizar o conteúdo antes do uso de cartões, cores ou sombras |
| Sistema visual consistente | Cores, tipografia, espaçamentos, raios, bordas, ícones e estados devem seguir um conjunto pequeno e documentado de decisões reutilizáveis |
| Superfícies mais planas | Evitar cartões dentro de cartões, camadas de contêineres e combinação redundante de borda fina com sombra ampla |
| Tipografia legível | Texto corrente confortável, linhas controladas, títulos realmente distintos e rótulos curtos sem excesso de caixa alta ou espaçamento entre letras |
| Cor funcional | Laranja da marca destaca ações e informações importantes; cores de estado comunicam significado e mantêm contraste adequado |
| Densidade adequada ao contexto | Landing page deve persuadir com ritmo e síntese; painéis e formulários devem favorecer operação rápida e leitura comparativa |
| Movimento com propósito | Animações devem explicar mudança de estado ou continuidade, ser breves e respeitar preferência por movimento reduzido |
| Conteúdo específico | Textos devem explicar a ação, o custo e o próximo passo sem slogans genéricos, repetição ou promessas vagas |
| Identidade própria | Evitar gradientes genéricos, glassmorphism, halos, brilho neon, paleta bege automática, texto em gradiente e outros atalhos visuais sem relação com o Trampô |

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Entender e entrar no piloto (Priority: P1)

Como visitante de São João del-Rei e região, quero entender rapidamente como o Trampô funciona, quanto custa e qual caminho corresponde ao meu papel para decidir se entro como contratante ou profissional.

**Why this priority**: A comunicação correta do modelo sem custódia e das cobranças evita expectativa financeira incorreta e é a porta de entrada para todas as demais jornadas.

**Independent Test**: Abrir a página inicial em desktop e celular, identificar localidade, proposta, papéis, fluxo do dinheiro, categorias e preços, e seguir cada chamada principal até o fluxo correspondente.

**Acceptance Scenarios**:

1. **Given** um visitante não autenticado, **When** abrir a página inicial, **Then** verá que o produto está em piloto em São João del-Rei, conecta trabalhos por diária e não recebe o valor da mão de obra.
2. **Given** um visitante comparando opções, **When** consultar a oferta, **Then** verá os valores demonstrativos de contratante Avulso com taxa de 12%, Pro por R$ 59,90/mês com 14 dias de teste e taxa zero, e profissional sem mensalidade com taxa avulsa de R$ 7,90 somente após ser selecionado e antes de confirmar o trabalho.
3. **Given** um visitante que quer contratar, **When** escolher a chamada de contratante, **Then** será direcionado ao acesso ou à publicação conforme seu estado de autenticação.
4. **Given** um visitante que quer trabalhar, **When** escolher a chamada de profissional, **Then** será direcionado ao acesso ou às diárias disponíveis conforme seu estado de autenticação.
5. **Given** uma tela pequena, **When** o visitante navegar pela página, **Then** conteúdo, menu, cartões, preços e chamadas permanecerão legíveis, acionáveis e sem rolagem horizontal.

---

### User Story 2 - Publicar uma diária com preço transparente (Priority: P1)

Como contratante, quero publicar uma vaga individual ou para uma equipe sabendo antecipadamente o total das diárias e a taxa do meu plano para contratar sem dúvida sobre quem recebe cada valor.

**Why this priority**: A publicação gera a oferta de trabalho e precisa refletir corretamente o modelo de monetização do piloto.

**Independent Test**: Alternar entre Pro e Avulso, preencher uma vaga individual e uma vaga em lote e confirmar os cálculos, estados e mensagens simulados, sem gerar cobrança ou publicação real.

**Acceptance Scenarios**:

1. **Given** um contratante mockado no período de teste ou com Pro ativo, **When** preencher uma vaga válida, **Then** verá taxa de publicação igual a zero e poderá concluir a simulação de publicação.
2. **Given** um contratante mockado no Avulso, **When** preencher uma vaga válida, **Then** verá a taxa de conexão de 12% calculada separadamente das diárias e poderá simular sua confirmação sem cobrança real.
3. **Given** uma vaga para mais de uma pessoa, **When** informar quantidade e valor individual, **Then** verá a soma total das diárias e a taxa aplicável calculadas sobre os dados informados.
4. **Given** qualquer modalidade, **When** revisar a publicação, **Then** verá explicitamente que todos os valores são demonstrativos e que nenhum pagamento será processado nesta etapa.
5. **Given** campos obrigatórios ausentes ou inválidos, **When** tentar continuar, **Then** receberá orientação específica sem perder os dados já preenchidos.

---

### User Story 3 - Acompanhar vagas como contratante (Priority: P1)

Como contratante, quero acompanhar meu plano, o estado da conta e o preenchimento das vagas para saber o que ainda depende de taxa, aceite ou presença.

**Why this priority**: Depois da publicação, o contratante precisa operar suas diárias sem confundir taxa de conexão com remuneração do profissional.

**Independent Test**: Acessar o painel com uma massa mockada de vagas abertas, preenchidas e aguardando taxa e validar os resumos e estados exibidos.

**Acceptance Scenarios**:

1. **Given** um contratante autenticado, **When** abrir o painel, **Then** verá identidade do estabelecimento, plano atual, término do teste quando aplicável e estado da conta.
2. **Given** vagas em estados diferentes, **When** consultar a lista, **Then** verá tipo individual ou lote, data, horário, preenchimento, vagas abertas, estado da taxa e total das diárias.
3. **Given** uma vaga Avulso sem confirmação da taxa, **When** consultar o painel, **Then** ela será identificada como aguardando taxa e ainda não aparecerá para matching.
4. **Given** contestação válida de não pagamento, **When** o estado da conta for atualizado, **Then** o painel informará a suspensão e impedirá novas publicações enquanto ela vigorar.

---

### User Story 4 - Encontrar e cumprir diárias (Priority: P1)

Como profissional, quero ver diárias abertas perto de mim, aceitar um chamado, registrar presença e acompanhar meu histórico para trabalhar e receber diretamente no Pix.

**Why this priority**: Sem profissionais encontrando e cumprindo os turnos, o marketplace não entrega sua proposta principal.

**Independent Test**: Usar um perfil profissional mockado para consultar uma vaga demonstrativa, simular o aceite, o check-in e o encerramento com confirmação fictícia de Pix e recibo sem validade fiscal.

**Acceptance Scenarios**:

1. **Given** um profissional autenticado e apto, **When** abrir as diárias, **Then** verá oportunidades abertas na região com função, estabelecimento, bairro, data, horário e valor.
2. **Given** uma vaga ainda disponível, **When** o profissional demonstrar interesse e for selecionado, **Then** verá o resumo do trabalho e a taxa mockada de R$ 7,90 antes de confirmar.
3. **Given** um profissional selecionado, **When** simular a confirmação da taxa de R$ 7,90, **Then** a posição será reservada no ambiente demonstrativo e aparecerá em seus chamados.
4. **Given** um profissional que ainda não foi selecionado, **When** apenas demonstrar interesse em uma vaga, **Then** nenhuma taxa será apresentada como devida ou confirmada.
5. **Given** um chamado no local e horário permitidos, **When** registrar presença, **Then** o comparecimento ficará associado ao turno.
6. **Given** um turno mockado concluído, **When** as partes simularem a confirmação do Pix direto, **Then** um recibo demonstrativo e sem validade fiscal será disponibilizado sem indicar transferência real feita pela plataforma.
7. **Given** ausência confirmada, **When** a vaga precisar de reposição, **Then** ela será reaberta com prioridade e o no-show ficará refletido no histórico do profissional.

---

### User Story 5 - Reconvocar equipe de confiança (Priority: P2)

Como estabelecimento, quero manter uma equipe favorita e reutilizar profissionais já validados para preencher novos turnos com menos esforço.

**Why this priority**: A recorrência melhora a velocidade operacional, mas depende das jornadas básicas de vaga e profissional.

**Independent Test**: Favoritar um profissional elegível, consultar a equipe do estabelecimento e iniciar uma nova convocação reaproveitando informações permitidas.

**Acceptance Scenarios**:

1. **Given** um profissional com histórico elegível, **When** o estabelecimento o favoritar, **Then** ele aparecerá na equipe favorita daquele estabelecimento.
2. **Given** uma equipe favorita existente, **When** o contratante consultar a lista, **Then** verá função, região, avaliação e histórico de diárias de cada integrante.
3. **Given** um integrante favorito, **When** iniciar uma convocação, **Then** poderá reaproveitar local, data e valor da diária antes de revisar e publicar.
4. **Given** estabelecimentos diferentes, **When** consultarem suas equipes, **Then** cada um verá apenas sua própria seleção de favoritos.

---

### User Story 6 - Operar uma interface clara e confiável (Priority: P1)

Como visitante, contratante ou profissional, quero reconhecer rapidamente o que é informação, estado e ação em cada tela para concluir minha tarefa sem me perder em elementos decorativos ou mensagens repetidas.

**Why this priority**: A nova monetização e os fluxos mockados exigem hierarquia visual forte para que ninguém confunda demonstração, taxa, valor da diária, seleção e confirmação.

**Independent Test**: Revisar landing page, publicação, painel, diárias, equipe e termos em celular e desktop, executando a tarefa principal de cada tela e verificando hierarquia, leitura, contraste, estados e consistência.

**Acceptance Scenarios**:

1. **Given** qualquer página principal, **When** o usuário abrir a tela, **Then** identificará o propósito, a informação mais importante e a ação principal sem depender de tentativa e erro.
2. **Given** uma tela com informações financeiras mockadas, **When** comparar diária, taxa do contratante e taxa do profissional, **Then** cada valor terá rótulo, contexto e hierarquia distintos sem depender apenas de cor.
3. **Given** uma sequência operacional, **When** o estado mudar após uma ação, **Then** a interface mostrará a mudança perto do elemento afetado e manterá o próximo passo evidente.
4. **Given** navegação por teclado ou tecnologia assistiva, **When** percorrer conteúdo e controles, **Then** a ordem, os títulos, os rótulos, o foco e as mensagens acompanharão a estrutura visual.
5. **Given** preferência por movimento reduzido, **When** usar a aplicação, **Then** animações não essenciais serão removidas e nenhuma informação dependerá de movimento.

### Edge Cases

- O visitante encontra conteúdo antigo que promete escrow, garantia integral de pagamento, expansão nacional ativa ou teste de 60 dias: nenhuma dessas alegações conflitantes pode permanecer em páginas públicas, termos ou chamadas.
- O plano Pro expira durante o preenchimento de uma vaga: o preço e a condição de publicação devem ser recalculados e apresentados antes da confirmação.
- A taxa Avulso é iniciada, mas não confirmada: a vaga deve permanecer fora do matching e o painel deve indicar a pendência sem duplicar a cobrança.
- Duas pessoas tentam aceitar a última posição de uma vaga ao mesmo tempo: apenas a quantidade disponível pode ser atribuída; a outra pessoa recebe informação clara de indisponibilidade.
- O profissional não possui chave Pix ou dados mínimos para recibo: o sistema deve orientar a conclusão do perfil antes do aceite ou encerramento, conforme a etapa necessária.
- O check-in é tentado fora da janela ou do local permitido: o comparecimento não deve ser confirmado automaticamente e deve existir orientação para contestação.
- Uma vaga em lote é parcialmente preenchida: o painel deve separar posições preenchidas e abertas sem duplicar a vaga.
- O usuário alterna entre os papéis de contratante e profissional: a identidade, os dados e as ações do papel ativo devem permanecer inequívocos.
- Não há vagas abertas, favoritos ou histórico: cada área deve exibir um estado vazio útil com a próxima ação adequada.
- Falha de carregamento ou ação: a interface deve preservar dados preenchidos quando seguro e oferecer nova tentativa sem criar registros duplicados.
- Uma ação demonstrativa pode parecer real, especialmente cobrança, Pix, recibo, publicação, check-in ou suspensão: a interface deve identificá-la como simulação antes da confirmação e no resultado.
- Dados mockados incluem nomes, contatos ou chaves Pix com aparência real: devem ser claramente fictícios e não corresponder intencionalmente a pessoas ou contas reais.
- O profissional é selecionado, mas não confirma a taxa mockada de R$ 7,90: a posição não deve ser reservada e deve voltar a ficar disponível após o prazo demonstrativo informado.
- O profissional apenas demonstra interesse ou não é selecionado: nenhuma taxa deve ser simulada como cobrada ou devida.
- Uma página acumula cartões aninhados, selos, ícones ou chamadas que disputam atenção: a hierarquia deve ser simplificada até existir uma ação principal inequívoca.
- Um texto longo ultrapassa uma medida confortável, fica pequeno demais ou perde contraste: o conteúdo deve se adaptar sem exigir zoom e atender contraste mínimo de leitura.
- Uma animação falha, é interrompida ou está desativada: conteúdo e controles devem permanecer visíveis, estáveis e utilizáveis.
- Conteúdo mockado possui nomes ou valores extensos: cartões, tabelas, botões e rótulos devem acomodar quebra e expansão sem sobreposição ou rolagem horizontal da página.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O produto MUST identificar publicamente a experiência como piloto em São João del-Rei e região.
- **FR-002**: O produto MUST comunicar de forma consistente que a etapa é demonstrativa e não recebe, retém, antecipa nem garante o valor da diária.
- **FR-003**: O produto MUST comunicar que a diária é paga pelo contratante diretamente na chave Pix do profissional.
- **FR-004**: A página inicial MUST oferecer caminhos distintos e inequívocos para contratante e profissional.
- **FR-005**: A página inicial MUST explicar o fluxo em publicação, aceite, check-in e Pix direto com recibo.
- **FR-006**: A página inicial MUST apresentar as sete categorias do piloto e suas faixas indicativas de diária, incluindo Promoção & Vendas com panfletagem e vendas porta a porta.
- **FR-007**: O produto MUST apresentar como valores mockados contratante Avulso por 12% da vaga, Pro por R$ 59,90/mês com 14 dias de teste e taxa zero, e profissional sem mensalidade com taxa avulsa de R$ 7,90 por trabalho confirmado.
- **FR-008**: O produto MUST remover ou corrigir alegações conflitantes sobre escrow, pagamento garantido, teste VIP de 60 dias, cobertura nacional ativa e gratuidade irrestrita para contratantes.
- **FR-009**: A navegação MUST oferecer acesso coerente a início, publicação, painel, diárias, equipe e termos, respeitando autenticação e papel ativo.
- **FR-010**: O contratante MUST poder criar vaga individual ou em lote com categoria, função, local, bairro, data, horários, quantidade, valor individual e observação.
- **FR-011**: A revisão da vaga MUST separar soma das diárias, valor por profissional e taxa da plataforma.
- **FR-012**: Uma vaga Pro mockada ativa MUST poder concluir a simulação de publicação com taxa de conexão igual a zero.
- **FR-013**: Uma vaga Avulso mockada MUST simular a pendência da taxa de 12% e ficar fora do matching demonstrativo até sua confirmação fictícia.
- **FR-014**: O painel do contratante MUST exibir plano, validade do teste, estado da conta, vagas, preenchimento, posições abertas, situação da taxa e total de diárias.
- **FR-015**: O profissional MUST visualizar vagas abertas com função, estabelecimento, bairro, data, horário, valor da diária e eventual taxa de confirmação antes de demonstrar interesse.
- **FR-016**: Após demonstrar interesse, somente o profissional selecionado MUST visualizar a ação para simular o pagamento da taxa avulsa de R$ 7,90 e confirmar o trabalho.
- **FR-016A**: A posição MUST ser reservada e registrada nos chamados somente após a confirmação mockada da taxa pelo profissional selecionado.
- **FR-016B**: Demonstrar interesse, não ser selecionado ou desistir antes da confirmação MUST NOT gerar taxa devida, cobrada ou registrada como paga.
- **FR-017**: O produto MUST permitir simular presença por check-in associado ao profissional e ao turno mockados.
- **FR-018**: A conclusão demonstrativa do turno MUST permitir simular a confirmação do pagamento direto e disponibilizar recibo claramente marcado como sem validade fiscal.
- **FR-019**: Um no-show confirmado MUST atualizar o histórico aplicável e permitir a reabertura prioritária da posição.
- **FR-020**: O estabelecimento MUST poder favoritar profissionais elegíveis e consultar sua própria equipe favorita.
- **FR-021**: A equipe favorita MUST permitir iniciar nova convocação reaproveitando dados permitidos, com revisão obrigatória antes da publicação.
- **FR-022**: Uma contestação mockada de não pagamento MUST simular a suspensão de novas publicações do estabelecimento até uma resolução fictícia.
- **FR-023**: Os termos MUST descrever o papel de aproximação da plataforma, o modelo sem custódia, as cobranças, presença, recibo, no-show, suspensão por não pagamento e foro do piloto.
- **FR-024**: Todas as jornadas MUST oferecer estados de carregamento, vazio, sucesso e erro compreensíveis e impedir duplicidade após nova tentativa.
- **FR-025**: A experiência MUST ser utilizável em celular e desktop, com navegação por teclado, foco visível, rótulos compreensíveis e contraste suficiente.
- **FR-026**: A atualização MUST evoluir as telas e componentes existentes e MUST NOT criar versões paralelas ou recriar componentes equivalentes do zero.
- **FR-027**: Valores, planos, usuários, vagas, seleções, taxas de contratante e profissional, pagamentos, chaves Pix, check-ins, recibos, avaliações, datas, históricos e estados operacionais MUST ser mockados nesta etapa.
- **FR-028**: Nenhuma ação da feature MUST iniciar cobrança, Pix, transferência, emissão fiscal, contratação, publicação externa, verificação de presença real ou suspensão real de conta.
- **FR-029**: Toda confirmação de ação financeira, contratual ou operacional MUST informar que se trata de uma simulação antes da ação e no resultado apresentado.
- **FR-030**: Dados pessoais mockados MUST ser inequivocamente fictícios e não devem utilizar intencionalmente informações de pessoas, empresas ou contas reais.
- **FR-031**: Cada página principal MUST apresentar um título descritivo, uma hierarquia de informações reconhecível e uma única ação primária por contexto imediato.
- **FR-032**: A atualização visual MUST preservar e refinar os componentes existentes, aplicando decisões compartilhadas de cor, tipografia, espaçamento, raio, borda, ícone e estado em vez de criar variações equivalentes.
- **FR-033**: A interface MUST usar cartões apenas quando agrupamento ou interação justificar uma superfície própria e MUST NOT aninhar cartões como recurso puramente visual.
- **FR-034**: A interface MUST NOT usar como decoração recorrente gradientes genéricos, glassmorphism, brilho neon, halos, texto em gradiente, bordas laterais grossas, selos sem função ou ícones superdimensionados.
- **FR-035**: Uma superfície MUST preferir borda ou sombra como principal definição de contorno e MUST NOT combinar sistematicamente borda fina com sombra ampla redundante.
- **FR-036**: Títulos, textos, metadados e rótulos MUST possuir diferenças claras de tamanho, peso e espaçamento; corpo de texto MUST manter tamanho equivalente a pelo menos 16 px e altura de linha confortável.
- **FR-037**: Blocos longos de texto MUST manter medida aproximada de 65 a 75 caracteres por linha em telas amplas e alinhamento inicial, sem justificação forçada.
- **FR-038**: Texto e controles MUST atender contraste mínimo de 4,5:1 para texto regular e 3:1 para texto grande ou componentes visuais essenciais.
- **FR-039**: Informação de estado ou significado MUST NOT depender somente de cor e deve incluir texto, forma, ícone ou outra indicação complementar compreensível.
- **FR-040**: Navegação, controles e links MUST permanecer confortavelmente legíveis e acionáveis, com área interativa mínima de 44 por 44 px quando usados por toque.
- **FR-041**: A estrutura de títulos MUST seguir uma ordem sem saltos e os rótulos de campos MUST permanecer visíveis independentemente do conteúdo de exemplo.
- **FR-042**: Animações MUST ser breves, não deslocar conteúdo de forma inesperada, não repetir sem necessidade e respeitar a preferência por movimento reduzido.
- **FR-043**: Conteúdo essencial MUST permanecer visível e utilizável caso uma animação ou melhoria progressiva não seja executada.
- **FR-044**: Textos de interface MUST descrever ações, condições, custos e próximos passos de forma direta, evitando repetição, jargão promocional genérico e contraste forçado em formato de slogan.
- **FR-045**: A landing page, os painéis e os formulários MUST compartilhar identidade visual, mas ajustar ritmo, densidade e composição à tarefa de persuadir, operar ou preencher.
- **FR-046**: A interface MUST acomodar dados mockados curtos e longos sem sobreposição, corte de conteúdo essencial ou rolagem horizontal da página em larguras a partir de 360 px.

### Key Entities

- **Usuário**: Pessoa autenticada, seus dados de acesso, estado da conta e papéis disponíveis.
- **Contratante/Estabelecimento**: Pessoa ou negócio que publica vagas, possui plano e mantém equipe favorita.
- **Profissional**: Pessoa que consulta e aceita diárias, registra presença, recebe via Pix e acumula histórico.
- **Plano**: Modalidade Avulso ou Pro, com preço, percentual, período de teste, vigência e estado.
- **Vaga**: Oferta individual ou em lote com categoria, função, local, agenda, quantidade, diária, observação e estado.
- **Posição/Chamado**: Unidade de uma vaga atribuída a um profissional, com estados de aceite, presença, conclusão ou no-show.
- **Taxa de conexão**: Valor demonstrativo vinculado à publicação Avulso, sem cobrança nesta etapa e distinto da remuneração profissional mockada.
- **Taxa de confirmação profissional**: Valor avulso mockado de R$ 7,90 apresentado ao profissional selecionado e confirmado antes da reserva do trabalho, sem cobrança real nesta etapa.
- **Confirmação de diária**: Registro fictício de que o contratante teria pago diretamente o profissional, sem representar movimentação bancária.
- **Recibo de prestação**: Comprovante demonstrativo, sem validade fiscal, relacionado ao turno e às partes mockadas.
- **Equipe favorita**: Relação privada entre estabelecimento e profissionais validados para futuras convocações.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Pelo menos 90% dos participantes de teste identificam corretamente, em até 60 segundos, quem paga a diária, quem recebe e como a plataforma ganha receita.
- **SC-002**: Pelo menos 90% dos visitantes conseguem escolher o caminho de contratante ou profissional na primeira tentativa.
- **SC-003**: Um contratante com dados preparados consegue revisar e publicar uma vaga Pro individual em até 3 minutos.
- **SC-004**: 100% das simulações Avulso exibem a taxa de 12% separada das diárias, identificam que não haverá cobrança real e impedem matching enquanto a taxa mockada estiver pendente.
- **SC-005**: Pelo menos 95% dos profissionais de teste encontram os dados essenciais de uma diária e realizam o aceite na primeira tentativa.
- **SC-005A**: Pelo menos 95% dos profissionais de teste identificam corretamente que a taxa de R$ 7,90 só se aplica depois da seleção e antes da confirmação do trabalho.
- **SC-006**: Em testes concorrentes, o número de posições atribuídas nunca excede a quantidade publicada.
- **SC-007**: Pelo menos 90% dos turnos de teste completam aceite, check-in, confirmação fictícia de Pix direto e geração de recibo demonstrativo sem suporte manual.
- **SC-008**: Todas as páginas públicas e operacionais ficam livres de alegações conflitantes sobre escrow, garantia de pagamento, teste de 60 dias e disponibilidade nacional ativa.
- **SC-009**: As jornadas principais podem ser concluídas em telas de 360 px ou mais sem rolagem horizontal e com todos os controles essenciais acessíveis por teclado.
- **SC-010**: Em 100% dos testes, nenhuma jornada gera cobrança, transferência, documento fiscal, publicação externa, presença real ou alteração real de conta.
- **SC-011**: Pelo menos 95% dos participantes reconhecem antes de confirmar uma ação financeira ou operacional que estão usando uma demonstração com dados mockados.
- **SC-012**: Pelo menos 90% dos participantes identificam em até 5 segundos o propósito e a ação principal de cada tela testada.
- **SC-013**: Pelo menos 90% dos participantes concluem a tarefa principal de landing page, publicação, painel e diárias sem acionar uma ação secundária por engano.
- **SC-014**: 100% dos textos e controles avaliados atendem os contrastes mínimos definidos e permanecem compreensíveis em simulação sem percepção de cores.
- **SC-015**: 100% das páginas principais permanecem utilizáveis com navegação por teclado, foco visível, ordem de títulos coerente e movimento reduzido.
- **SC-016**: Em larguras de 360 px, 768 px e 1280 px, nenhuma página principal apresenta sobreposição, corte de ação essencial ou rolagem horizontal da página.
- **SC-017**: A revisão visual final não encontra cartões aninhados decorativos, selos sem função, texto em gradiente, halos, glassmorphism recorrente ou animações automáticas sem propósito.

### Validation Protocol

- Os critérios SC-001, SC-002, SC-003, SC-005, SC-007, SC-011, SC-012 e SC-013 serão avaliados em uma sessão moderada com pelo menos 10 participantes, incluindo no mínimo 5 pessoas no papel de contratante e 5 no papel de profissional.
- Cada participante executará as tarefas com o mesmo conjunto inicial de dados mockados, sem orientação durante a tentativa e com registro de tempo, conclusão, erros de caminho e compreensão das cobranças.
- Uma tentativa será considerada bem-sucedida somente quando o participante concluir a tarefa e explicar corretamente se a ação é demonstrativa, quem pagaria cada valor e em que momento a taxa profissional seria apresentada.
- Os resultados devem ser registrados de forma agregada, sem dados pessoais dos participantes, e comparados individualmente com cada percentual ou limite de tempo definido nos critérios.
- Os critérios SC-014 a SC-017 serão avaliados por auditoria reproduzível nas páginas e larguras especificadas, com evidência dos contrastes, navegação por teclado, movimento reduzido, ausência de overflow e padrões visuais proibidos.

## Assumptions

- O lançamento inicial permanece restrito a São João del-Rei e região; outras localidades podem ser comunicadas apenas como expansão futura.
- Todos os dados e estados operacionais desta feature são mockados e destinados à demonstração da experiência.
- Os preços demonstrativos do piloto são contratante Avulso a 12%, Pro a R$ 59,90 por mês com 14 dias de teste e profissional sem mensalidade com taxa de confirmação de R$ 7,90 por trabalho selecionado.
- A taxa profissional é exibida apenas depois da seleção e sua confirmação mockada reserva a posição; candidatura ou interesse sem seleção não gera taxa.
- A taxa Avulso é apenas simulada antes da publicação; a diária e a taxa nunca transitam pela plataforma nesta etapa.
- A plataforma cria confirmações e recibos demonstrativos, mas não consulta banco, não liquida Pix e não emite documento fiscal nesta etapa.
- O fluxo de autenticação e a possibilidade existente de alternar papéis serão preservados e adaptados.
- As categorias e faixas de valor são orientativas e não obrigam o preço final da vaga.
- A atualização reutilizará as rotas, telas, dados e componentes existentes sempre que atenderem ao comportamento especificado.
- A identidade visual da referência serve como direção de clareza, hierarquia e densidade; a marca e os ativos próprios do projeto permanecem.
- Os princípios do Impeccable orientam a crítica e o refinamento visual, mas sua marca, tipografia, composição e exemplos não serão copiados.
- O laranja e os elementos de marca já reconhecíveis do Trampô serão preservados, com ajustes de contraste e uso funcional quando necessário.
- Esta feature não inclui merge, expansão geográfica, persistência operacional real, intermediação financeira, cobrança, garantia de pagamento, documento fiscal, contratação real ou criação de uma instituição de pagamento.
