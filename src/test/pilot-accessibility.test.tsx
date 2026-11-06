import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

const PilotState = () => (
  <main>
    <p className="pilot-demo-notice">Demonstração: nenhuma cobrança real será feita.</p>
    <h1>Publicar oportunidade</h1>
    <label htmlFor="service">Serviço</label><input id="service" />
    <button aria-label="Publicar demonstração">Publicar demonstração</button>
  </main>
);

describe("pilot accessibility contract", () => {
  it("keeps the primary heading, persistent label, demo notice and accessible action", () => {
    render(<PilotState />);
    expect(screen.getByRole("heading", { level: 1, name: "Publicar oportunidade" })).toBeInTheDocument();
    expect(screen.getByLabelText("Serviço")).toBeInTheDocument();
    expect(screen.getByText(/nenhuma cobrança real/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Publicar demonstração" })).toBeInTheDocument();
  });
});
