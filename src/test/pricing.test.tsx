import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Pricing from "@/components/landing/Pricing";

describe("Pricing & Monetization Architecture", () => {
  it("renders the pilot pricing disclaimer and avulso plan", () => {
    render(
      <BrowserRouter>
        <Pricing />
      </BrowserRouter>
    );

    expect(screen.getByText(/Valores do piloto/i)).toBeInTheDocument();
    expect(screen.getByText(/Contratante Avulso/i)).toBeInTheDocument();
    expect(screen.getByText(/12%/i)).toBeInTheDocument();
  });

  it("renders the Pro and professional plans", () => {
    render(
      <BrowserRouter>
        <Pricing />
      </BrowserRouter>
    );

    expect(screen.getByText(/Contratante Pro/i)).toBeInTheDocument();
    expect(screen.getByText(/R\$ 59,90/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Profissional" })).toBeInTheDocument();
  });

  it("renders the pilot simulation disclaimer", () => {
    render(
      <BrowserRouter>
        <Pricing />
      </BrowserRouter>
    );

    expect(screen.getByText(/Todos os valores e pagamentos exibidos são simulações/i)).toBeInTheDocument();
  });
});
