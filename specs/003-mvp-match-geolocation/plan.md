# Implementation Plan: Oferta MVP e Geolocalização

## Summary

Evoluir `CreateJob`, `Contracts` e o domínio mockado existente. Usar `@turf/distance` para distância geodésica, mantendo coordenadas apenas no estado da sessão e todos os valores simulados.

## Technical Context

- React 18, TypeScript, Vite, Vitest.
- Browser Geolocation API para consentimento e coordenada atual.
- `@turf/distance` para Haversine em quilômetros.
- Sem endpoints, migrations, cobrança ou persistência.

## Constitution Check

- PASS: nenhum merge.
- PASS: páginas e componentes existentes são refinados.
- PASS: dados financeiros e geográficos permanecem mockados.

## Files

- `src/lib/pilotPricing.ts`: ofertas e cálculo de deslocamento.
- `src/pages/CreateJob.tsx`: seletor de oferta e origem/check-in demonstrativos.
- `src/pages/Contracts.tsx`: check-in com consentimento e resumo.
- `src/test/pilot-mvp-offers.test.ts`: regras puras.
