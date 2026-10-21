# Quickstart: validar o marketplace profissional

## Prerequisites

```powershell
npm install
npm run dev
```

## Scenario 1 — Interactive map

1. Enter as a professional and open the existing dashboard.
2. Move and zoom the map; select “Buscar nesta área”.
3. Select a marker and confirm that the same job is highlighted in the list.
4. Select a list item and confirm marker synchronization.
5. Simulate map failure and confirm the list remains usable.

## Scenario 2 — Private preference

1. Register a preference for a fictitious establishment/category.
2. Repeat the action and confirm the count does not duplicate.
3. Enter as contractor and verify only aggregate count/category.
4. Confirm no identity, contact, timestamp or individual link exists.
5. Remove the preference and verify aggregate decrement.

## Scenario 3 — Goals and rewards

1. Complete one eligible action.
2. Confirm progress and points advance once.
3. Repeat/reload and verify no duplicate points.
4. Confirm reward does not alter job order, payment or access.

## Validation commands

```powershell
npm test
npm run build
npx playwright test e2e/professional-marketplace.spec.ts
```

Validate at 360, 768 and 1280 px, with keyboard navigation and location denied.
