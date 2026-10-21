# Feature Specification: Marketplace Profissional e Preferências Privadas

**Feature Branch**: `004-professional-marketplace`

**Created**: 2026-09-30

**Status**: Draft

**Input**: User description: "Deixar o lado profissional mais divertido, com marketplace, recompensas, metas, mapa de vagas e currículo de preferência privado por local; o contratante vê somente a quantidade de interessados, nunca suas identidades."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Explorar oportunidades no mapa (Priority: P1)

O profissional acessa um marketplace visual e encontra vagas próximas em mapa interativo e lista sincronizados. Ele pode mover o mapa, aplicar zoom, selecionar marcadores e atualizar os resultados para a área visível. Cada oportunidade apresenta função, faixa de valor, data, distância aproximada e quantidade de posições, sem revelar endereço residencial ou ponto sensível antes da seleção.

**Why this priority**: Encontrar trabalho próximo é o valor principal da experiência profissional e dá contexto às demais mecânicas.

**Independent Test**: Com vagas fictícias em diferentes bairros, o profissional alterna entre mapa e lista, filtra uma categoria e abre os detalhes de uma vaga correspondente.

**Acceptance Scenarios**:

1. **Given** um profissional com localização autorizada, **When** abre o marketplace, **Then** vê vagas próximas ordenadas por distância e marcadas no mapa.
2. **Given** localização negada, **When** abre o marketplace, **Then** vê a lista e um mapa centralizado na região-piloto, sem bloqueio da jornada.
3. **Given** uma vaga não selecionada, **When** consulta o mapa, **Then** vê apenas posição aproximada por bairro; o ponto exato só aparece quando a regra operacional permitir.
4. **Given** várias vagas próximas, **When** altera zoom ou move o mapa, **Then** os marcadores são agrupados ou separados e a lista pode ser atualizada para a área visível.
5. **Given** um marcador selecionado, **When** o profissional abre seu resumo, **Then** a oportunidade correspondente também fica destacada na lista e pode ser aberta sem perder o contexto do mapa.

---

### User Story 2 - Declarar preferência por um local (Priority: P1)

O profissional pode deixar um “currículo de interesse” em estabelecimentos ou regiões onde gostaria de trabalhar como freelancer. Essa preferência fica privada: o contratante recebe apenas a contagem agregada de profissionais interessados, sem nomes, perfis, contatos, localização individual ou ordem de manifestação.

**Why this priority**: Permite medir oferta latente sem expor profissionais ou transformar interesse em candidatura pública.

**Independent Test**: Três profissionais registram preferência no mesmo estabelecimento; o profissional vê e pode remover sua própria preferência, enquanto o contratante vê somente “3 profissionais interessados”.

**Acceptance Scenarios**:

1. **Given** um profissional autenticado, **When** deixa seu currículo de interesse em um local, **Then** vê a preferência salva em sua área privada.
2. **Given** um contratante associado ao local, **When** consulta interesses, **Then** vê somente a quantidade agregada e categorias disponíveis.
3. **Given** uma preferência existente, **When** o profissional a remove, **Then** a contagem agregada diminui sem manter sua identidade visível ao contratante.
4. **Given** uma preferência privada, **When** o contratante publica uma vaga, **Then** a preferência não vira candidatura automaticamente e nenhum perfil é revelado sem uma ação posterior do profissional.

---

### User Story 3 - Cumprir metas e receber recompensas (Priority: P2)

O profissional acompanha metas simples relacionadas a completar perfil, explorar vagas, manter disponibilidade, confirmar trabalhos e concluir diárias. O progresso concede pontos e selos exclusivamente motivacionais, sem alterar artificialmente a seleção, o pagamento ou o acesso a vagas essenciais.

**Why this priority**: Aumenta envolvimento e clareza de progresso depois que descoberta e privacidade já funcionam.

**Independent Test**: Com um perfil incompleto, o profissional executa uma ação elegível, vê a meta avançar uma única vez e recebe o selo correspondente ao atingir o objetivo.

**Acceptance Scenarios**:

1. **Given** uma meta ativa, **When** o profissional conclui uma ação elegível, **Then** o progresso aumenta e explica o motivo.
2. **Given** uma ação repetida ou atualização de página, **When** o progresso é recalculado, **Then** pontos não são duplicados.
3. **Given** uma recompensa conquistada, **When** o profissional abre seu perfil, **Then** vê selo, descrição, data e próximo objetivo.

---

### User Story 4 - Consultar demanda agregada como contratante (Priority: P2)

O contratante visualiza quantos profissionais demonstraram preferência por seu estabelecimento, separados por categoria ampla, e pode usar esse sinal para decidir se publica uma oportunidade. Ele não pode abrir a lista de pessoas nem contatá-las individualmente por essa preferência.

**Why this priority**: Transforma interesse privado em sinal de mercado sem enfraquecer a proteção de identidade.

**Independent Test**: O contratante abre sua área e verifica contagens agregadas, tenta acessar detalhes individuais e não encontra nome, perfil, contato ou posição individual.

**Acceptance Scenarios**:

1. **Given** interesses privados no estabelecimento, **When** o contratante abre o resumo, **Then** vê total e distribuição por categoria.
2. **Given** qualquer quantidade de interessados, **When** consulta o resumo, **Then** não consegue identificar, ordenar ou contactar os profissionais.
3. **Given** uma categoria com interesse, **When** escolhe publicar uma vaga, **Then** o formulário existente abre preenchido apenas com categoria e local, sem candidatos pré-selecionados.

### Edge Cases

- A mesma pessoa não aumenta duas vezes a contagem do mesmo local e categoria.
- Um profissional pode trocar ou remover categorias e locais de preferência.
- Estabelecimentos sem interesse mostram estado vazio e convite neutro para publicar vaga.
- Vagas expiradas, preenchidas ou canceladas deixam de aparecer como disponíveis no mapa.
- Marcadores sobrepostos são agrupados e continuam acessíveis por teclado e lista; o agrupamento se desfaz conforme o zoom permite distinguir as oportunidades.
- Localização negada, indisponível ou imprecisa não impede uso por bairro e filtros.
- CEP inexistente ou consulta indisponível mantém todos os campos de endereço editáveis e não apaga o formulário.
- Contagens pequenas continuam anônimas e nunca oferecem lista detalhada, exportação ou ordem temporal.
- Metas não punem recusa de trabalho, pausa de disponibilidade ou remoção de preferência.
- Pontos, selos e sequências não possuem valor financeiro e não prometem prioridade de contratação.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: A área profissional MUST apresentar oportunidades em visualização de mapa interativo e lista sincronizadas; uma imagem, captura ou mapa sem controles não atende ao requisito.
- **FR-002**: O profissional MUST poder filtrar oportunidades por categoria, data, faixa de valor, distância aproximada e disponibilidade.
- **FR-003**: O mapa MUST permitir uso sem localização atual, adotando como alternativa a região-piloto ou local escolhido manualmente.
- **FR-004**: O mapa MUST ocultar o ponto exato de locais sensíveis antes da seleção e MUST comunicar quando a posição for aproximada.
- **FR-005**: O profissional MUST poder registrar, consultar e remover uma preferência de freelance vinculada a estabelecimento ou região e categoria.
- **FR-006**: Cada combinação profissional–local–categoria MUST contar no máximo uma vez.
- **FR-007**: Uma preferência MUST NOT criar candidatura, aceitar vaga, compartilhar currículo completo ou autorizar contato automaticamente.
- **FR-008**: O contratante MUST visualizar somente contagens agregadas de preferências vinculadas ao próprio estabelecimento.
- **FR-009**: O contratante MUST NOT visualizar identidade, perfil, contato, localização individual, ordem ou horário da manifestação de preferência.
- **FR-010**: A visão agregada MUST permitir distribuição por categoria ampla sem criar caminho para revelar indivíduos.
- **FR-011**: O profissional MUST receber confirmação clara ao registrar ou remover uma preferência e MUST entender quem pode ver cada informação.
- **FR-012**: A área profissional MUST apresentar metas com objetivo, progresso atual, condição de conclusão e recompensa prevista.
- **FR-013**: O progresso de uma ação elegível MUST ser idempotente e MUST NOT conceder pontos duplicados por repetição técnica.
- **FR-014**: Recompensas MUST ser limitadas a pontos, selos, níveis e feedback visual sem valor financeiro no MVP.
- **FR-015**: Recompensas MUST NOT alterar remuneração, prioridade de seleção, acesso a vagas essenciais ou avaliação profissional.
- **FR-016**: Metas MUST NOT incentivar aceitar trabalho inadequado, compartilhar localização sem necessidade ou manter disponibilidade falsa.
- **FR-017**: O profissional MUST poder compreender seu nível, pontos, selos conquistados e próximo objetivo em uma única área.
- **FR-018**: A ação do contratante para publicar com base na demanda MUST reutilizar o formulário existente e preencher somente local e categoria.
- **FR-019**: Estados vazio, carregando, erro recuperável, localização negada, preferência ativa e remoção MUST ser distinguíveis por texto além de cor.
- **FR-020**: Dados, vagas, pontos, metas, recompensas e preferências MUST permanecer demonstrativos e sem efeitos externos no MVP.
- **FR-021**: A implementação futura MUST evoluir o painel profissional, o painel contratante e os componentes existentes, sem criar versões paralelas equivalentes.
- **FR-022**: O mapa MUST permitir deslocamento, zoom, seleção de marcador, centralização na localização autorizada e retorno à região-piloto.
- **FR-023**: O profissional MUST poder atualizar resultados para os limites visíveis do mapa sem alterar permanentemente suas preferências.
- **FR-024**: Selecionar uma oportunidade no mapa MUST destacar o item correspondente na lista, e selecionar um item na lista MUST centralizar ou destacar seu marcador.
- **FR-025**: Marcadores próximos MUST ser agrupados de acordo com o nível de zoom e MUST revelar a quantidade de oportunidades no agrupamento.
- **FR-026**: Abrir um marcador MUST exibir resumo com função, data, faixa de valor, distância aproximada e ação para ver detalhes.
- **FR-027**: Toda ação oferecida pelo mapa MUST possuir alternativa equivalente fora dele para teclado, leitor de tela e casos de falha do mapa.
- **FR-028**: Falha no carregamento do mapa MUST preservar filtros, lista de vagas e ações essenciais, com opção de tentar carregar novamente.
- **FR-029**: A publicação de vaga MUST exigir o local do trabalho com CEP, logradouro, número, bairro, cidade e UF; quando o CEP for encontrado, os campos disponíveis MUST ser preenchidos automaticamente e continuar editáveis.
- **FR-030**: CEP inválido, inexistente ou serviço de consulta indisponível MUST permitir preenchimento manual sem perder os demais dados da vaga.

### Key Entities

- **Oportunidade no marketplace**: Vaga disponível com categoria, data, faixa de valor, quantidade, bairro, posição aproximada e estado.
- **Estado do mapa**: Área visível, nível de zoom, centro, agrupamentos e oportunidade selecionada durante a exploração.
- **Local de interesse**: Estabelecimento ou região em que profissionais podem declarar preferência de freelance.
- **Preferência profissional**: Relação privada entre profissional, local e categoria; possui estado ativo/removido, mas não constitui candidatura.
- **Resumo de demanda**: Contagem agregada por estabelecimento e categoria, sem atributos que identifiquem profissionais.
- **Meta profissional**: Objetivo mensurável com progresso, limite, período e condição de conclusão.
- **Evento de progresso**: Registro idempotente de uma ação elegível para uma meta.
- **Recompensa**: Ponto, selo ou nível motivacional sem valor financeiro ou impacto na seleção.
- **Perfil de progresso**: Visão privada do profissional sobre pontos, nível, selos e próximo objetivo.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Pelo menos 90% dos profissionais de teste encontram uma vaga adequada no mapa ou lista em até 90 segundos.
- **SC-002**: Pelo menos 95% dos profissionais conseguem registrar e remover uma preferência sem ajuda na primeira tentativa.
- **SC-003**: 100% dos testes de contratante exibem apenas contagens agregadas, sem nome, contato, perfil, localização individual ou ordem de interesse.
- **SC-004**: Em 100% dos cenários repetidos, uma mesma preferência conta no máximo uma vez por local e categoria.
- **SC-005**: Pelo menos 90% dos profissionais explicam corretamente que preferência não é candidatura e que o contratante não vê sua identidade.
- **SC-006**: Pelo menos 85% dos profissionais identificam sua meta atual, progresso e próximo objetivo em até 10 segundos.
- **SC-007**: 100% das ações repetidas de progresso não duplicam pontos ou recompensas.
- **SC-008**: Nenhuma recompensa altera pagamento, prioridade de seleção ou acesso básico às vagas em todos os testes.
- **SC-009**: A jornada permanece utilizável sem permissão de localização e em telas a partir de 360 px.
- **SC-010**: 100% dos elementos interativos do mapa possuem alternativa equivalente na lista e são utilizáveis por teclado.
- **SC-011**: Nenhum teste do MVP persiste localização real, envia contato, cria candidatura automática ou produz benefício financeiro.
- **SC-012**: Pelo menos 90% dos profissionais de teste conseguem mover o mapa, ajustar zoom e abrir uma oportunidade sem ajuda na primeira tentativa.
- **SC-013**: Em 100% dos testes, selecionar uma vaga no mapa e na lista mantém ambas as visualizações sincronizadas.
- **SC-014**: Em caso de falha do mapa, 100% das vagas e ações essenciais permanecem disponíveis pela lista.

## Assumptions

- O MVP permanece restrito a dados demonstrativos de São João del-Rei e região.
- “Currículo” nesta feature significa manifestação privada de interesse por local e categoria, não envio do documento completo ao contratante.
- O contratante associado a um local pode ver contagens daquele local, mas nunca registros individuais.
- Uma identidade só poderá ser revelada futuramente por candidatura explícita do profissional a uma vaga publicada, fora da preferência privada.
- Pontos, selos e níveis são motivacionais; não são moeda, saldo, desconto ou critério automático de seleção.
- As metas iniciais serão poucas, transparentes e relacionadas a ações saudáveis: completar perfil, definir disponibilidade, explorar vagas e concluir trabalhos confirmados.
- A posição de vagas no mapa será aproximada quando a divulgação exata puder expor residência ou pessoa.
- O mapa será um componente interativo do marketplace, não uma imagem nem incorporação somente para visualização.
- O fluxo reutilizará autenticação, painéis, filtros, formulário de vaga e componentes de interface existentes.
- Nenhuma alteração desta feature autoriza merge, cobrança, persistência de localização real ou contato automático.
