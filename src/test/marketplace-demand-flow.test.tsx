import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

const DemandSummary = ({ aggregates }: { aggregates: Array<{ locationId: string; categoryId: string; count: number }> }) => (
  <section aria-label="Demanda agregada">
    <h2>Demanda agregada</h2>
    {aggregates.length ? aggregates.map((item) => <p key={`${item.locationId}-${item.categoryId}`}>{item.count} pessoas demonstraram interesse</p>) : <p>Nenhuma preferência registrada ainda.</p>}
    <p>O contratante não vê nomes, contatos ou perfis individuais.</p>
  </section>
);

describe("contractor demand flow", () => {
  it("shows aggregate demand without personal details", () => {
    render(<DemandSummary aggregates={[{ locationId: "mock-location-cantina", categoryId: "gastronomia-hospitalidade", count: 3 }]} />);
    expect(screen.getByText(/3 pessoas/)).toBeInTheDocument();
    expect(screen.getByText(/não vê nomes/)).toBeInTheDocument();
    expect(screen.queryByText(/Ana|Pedro|Carla|profissional/i)).not.toBeInTheDocument();
  });

  it("shows an explicit empty state", () => {
    render(<DemandSummary aggregates={[]} />);
    expect(screen.getByText(/Nenhuma preferência registrada/)).toBeInTheDocument();
  });
});
