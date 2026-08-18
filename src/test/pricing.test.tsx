import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Pricing from "@/components/landing/Pricing";

describe("Pricing & Monetization Architecture", () => {
  it("renders the 60-day Membro Fundador VIP plan", () => {
    render(
      <BrowserRouter>
        <Pricing />
      </BrowserRouter>
    );

    expect(screen.getByText(/Membro Fundador/i)).toBeInTheDocument();
    expect(screen.getByText(/Oferta de Lançamento/i)).toBeInTheDocument();
    expect(screen.getByText(/Garantir 60 Dias VIP/i)).toBeInTheDocument();
    expect(screen.getAllByText(/60 dias/i).length).toBeGreaterThanOrEqual(1);
  });

  it("renders the Pro Negócio plan and Freelancer plan", () => {
    render(
      <BrowserRouter>
        <Pricing />
      </BrowserRouter>
    );

    expect(screen.getByText(/Pro Negócio/i)).toBeInTheDocument();
    expect(screen.getByText(/R\$ 39,90/i)).toBeInTheDocument();
    expect(screen.getByText(/Autônomo & Freelancer/i)).toBeInTheDocument();
  });

  it("renders the Radar Turbo on-demand urgency banner", () => {
    render(
      <BrowserRouter>
        <Pricing />
      </BrowserRouter>
    );

    expect(screen.getByText(/Precisa de alguém para AGORA\?/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Radar Turbo/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Testar Modo Urgente/i)).toBeInTheDocument();
  });
});
