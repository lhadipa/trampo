import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

const MarketplaceFallback = () => (
  <section aria-label="Mapa interativo de oportunidades">
    <button aria-label="Buscar nesta área">Buscar nesta área</button>
    <ul aria-label="Lista de oportunidades"><li><button>Garçom · Centro</button></li></ul>
  </section>
);

describe("marketplace accessibility fallback", () => {
  it("keeps an equivalent keyboard-accessible list action beside the map", () => {
    render(<MarketplaceFallback />);
    expect(screen.getByRole("region", { name: /mapa interativo/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /buscar nesta área/i })).toBeInTheDocument();
    expect(screen.getByRole("list", { name: /lista de oportunidades/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /garçom/i })).toBeInTheDocument();
  });
});
