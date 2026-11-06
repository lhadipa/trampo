# Data Model: Marketplace Profissional

## MarketplaceJob

- `id`, `categoryId`, `title`, `roleLabel`, `neighborhood`
- `approximateLatitude`, `approximateLongitude`
- `startsAt`, `dailyRate`, `quantity`, `status`
- `locationPrecision`: `neighborhood | venue`

Somente estados `open` e `partially_filled` aparecem no marketplace.

## InterestLocation

- `id`, `contractorId`, `displayName`, `neighborhood`
- coordenada aproximada e categorias aceitas

## ProfessionalPreference

- Persistida em `preferences`: `id`, `userId`, `locationId`, `categoryId`, `active`
- `createdAt`, `removedAt?`

Restrição única: `userId + locationId + categoryId`. Remoção é lógica (`active = false`) e reativação reutiliza o mesmo registro. A preferência não constitui candidatura.

## PreferenceAggregate

- `locationId`, `categoryId`, `count`

É a única forma exposta ao contratante. Não inclui ids profissionais, timestamps ou ordenação individual.

## ProfessionalGoal

- `id`, `title`, `description`, `metric`, `target`, `rewardPoints`, `badgeId?`, `status`
- métricas iniciais: perfil, disponibilidade, exploração e trabalho concluído

## ProgressEvent

- `idempotencyKey`, `professionalId`, `goalId`, `kind`, `value`, `occurredAt`

A mesma chave só produz efeito uma vez.

## RewardProfile

- `professionalId`, `level`, `points`, `nextLevelAt`, `earnedBadgeIds`

Não possui equivalência financeira nem influência sobre matching.

## MapViewState

- `center`, `zoom`, `bounds`, `selectedJobId?`, `useVisibleBounds`

Estado efêmero; não guarda a localização real do profissional.

## Transitions

```text
preference: absent → active → removed → active
goal: locked/active → completed
map: loading → ready | failed → retrying
selection: none ↔ job selected
```
