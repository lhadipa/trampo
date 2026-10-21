# Marketplace UI Contract

## Map and list synchronization

- Selecting a marker sets `selectedJobId` and highlights/scrolls the equivalent list item.
- Selecting a list item centers/highlights its marker without changing filters.
- Map movement does not filter automatically; the explicit “Buscar nesta área” action applies current bounds.
- Reset returns to São João del-Rei pilot bounds.

## Marker summary

Must show role, date, daily rate, approximate distance or neighborhood, open positions and “Ver detalhes”. It must not show a sensitive exact address.

## Failure contract

Tile or map failure shows a recoverable notice and retry action. Filters, list, preference actions and job details remain available.

## Accessibility contract

- Every map job exists in the list with the same accessible name.
- Map-only gestures are never required.
- Selection is announced by text and not only color.
- Cluster count has an accessible label.
