# Feature Specification: Oferta MVP e Geolocalização

**Created**: 2026-09-30  
**Status**: Approved for MVP

## User Scenarios & Testing

### US1 — Escolher como encontrar profissionais

Ao publicar uma oportunidade, o contratante escolhe entre busca única por R$ 5,00, plano Fim de Semana por R$ 19,90 ou plano Mensal por R$ 59,90. A busca única informa reembolso integral quando nenhum profissional adequado for encontrado.

**Acceptance**: as três opções aparecem antes da publicação, o preço selecionado entra no resumo e toda cobrança/restituição permanece simulada.

### US2 — Calcular deslocamento de funções externas

Garçons e profissionais de panfletagem autorizam localização para registrar ponto inicial e check-in. O MVP calcula distância geodésica entre os pontos, oferece tolerância de 3 km e adiciona R$ 1,50 por quilômetro excedente ao valor apresentado.

**Acceptance**: permissão negada não bloqueia a candidatura, mas impede o cálculo e apresenta orientação; coordenadas e valores são identificados como demonstração.

### US3 — Registrar check-in verificável

O profissional selecionado pode solicitar a localização atual no check-in. A interface mostra distância, tolerância, adicional e total estimado antes de confirmar.

**Acceptance**: após capturar a localização, a interface apresenta o ponto em mapa para confirmação explícita; somente depois o check-in é registrado e marcado na agenda do profissional.

## Functional Requirements

- **FR-001**: A publicação MUST oferecer `Única`, `Fim de Semana` e `Mensal`.
- **FR-002**: A oferta Única MUST custar R$ 5,00 por publicação e informar reembolso integral simulado quando não houver profissional adequado.
- **FR-003**: O Fim de Semana MUST custar R$ 19,90 e cobrir oportunidades de sexta-feira 18h até segunda-feira 06h.
- **FR-004**: O Mensal MUST custar R$ 59,90 por mês.
- **FR-005**: Garçom e Panfletista MUST visualizar solicitação de geolocalização.
- **FR-006**: O adicional MUST ser R$ 1,50 por km além de 3 km, arredondado para centavos.
- **FR-007**: O cálculo MUST usar distância entre origem e check-in; não representa roteamento viário.
- **FR-008**: Negar ou indisponibilizar localização MUST produzir estado recuperável e alternativa sem cálculo.
- **FR-009**: Nenhuma cobrança, restituição, localização, presença ou transferência real MUST ser persistida no MVP.
- **FR-010**: Componentes, páginas e fluxos existentes MUST ser evoluídos, sem versões paralelas.
- **FR-011**: O check-in geolocalizado MUST exibir o ponto em mapa e solicitar confirmação explícita antes do registro.
- **FR-012**: Um check-in confirmado MUST ficar marcado na agenda do profissional com estado textual.

## Edge Cases

- Coordenadas inválidas ou precisão insuficiente não geram adicional.
- Distâncias até 3 km geram adicional zero.
- Resultado repetido com os mesmos pontos é idempotente.
- Funções internas não solicitam localização obrigatória.

## Success Criteria

- **SC-001**: 95% dos testes identificam preço e período das três ofertas sem ajuda.
- **SC-002**: 100% dos cálculos de referência respeitam tolerância, preço por km e arredondamento.
- **SC-003**: A negação da localização nunca bloqueia o restante do formulário.
- **SC-004**: Nenhum teste do MVP produz efeito financeiro ou persiste coordenadas reais.

## Assumptions

- “Rota” no MVP significa distância geodésica entre dois pontos, não trajeto por ruas.
- O cálculo e a restituição são demonstrações locais.
- As regras poderão ser recalibradas após validação do MVP.
