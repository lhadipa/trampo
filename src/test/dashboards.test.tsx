import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import DashboardCompany from "@/pages/DashboardCompany";
import DashboardFreelancer from "@/pages/DashboardFreelancer";

// Mock useAuth
vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    profile: { id: "test-user-id", name: "Restaurante Sabor Mineiro", balance: 150.0 },
    signOut: vi.fn(),
  }),
}));

// Mock Supabase Client
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: { id: "company-123", name: "Restaurante Sabor Mineiro" }, error: null }),
          order: () => Promise.resolve({ data: [], error: null }),
        }),
        order: () => Promise.resolve({ data: [], error: null }),
      }),
      insert: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: { id: "comp-new" }, error: null }),
        }),
      }),
    }),
  },
}));

describe("Company Dashboard Features", () => {
  it("renders the VIP founder period counter and ROI widget", async () => {
    render(
      <BrowserRouter>
        <DashboardCompany />
      </BrowserRouter>
    );

    expect(screen.getByText(/Membro Fundador VIP/i)).toBeInTheDocument();
    expect(screen.getByText(/Período Gratuito Ativo: Restam 54 dias de 60/i)).toBeInTheDocument();
    expect(screen.getByText(/Tempo Poupado/i)).toBeInTheDocument();
    expect(screen.getByText(/Operação Protegida/i)).toBeInTheDocument();
  });

  it("renders Minha Equipe, Custódia, and Recibos tabs", () => {
    render(
      <BrowserRouter>
        <DashboardCompany />
      </BrowserRouter>
    );

    expect(screen.getByText(/Minha Equipe/i)).toBeInTheDocument();
    expect(screen.getByText(/Custódia/i)).toBeInTheDocument();
    expect(screen.getByText(/Recibos/i)).toBeInTheDocument();
  });
});

describe("Freelancer Dashboard Features", () => {
  it("renders Selo Ouro, wallet balance and Anti-Calote protection", () => {
    render(
      <BrowserRouter>
        <DashboardFreelancer />
      </BrowserRouter>
    );

    expect(screen.getByText(/Selo Ouro Verificado/i)).toBeInTheDocument();
    expect(screen.getByText(/Garantia Anti-Calote/i)).toBeInTheDocument();
    expect(screen.getByText(/Vagas Abertas/i)).toBeInTheDocument();
    expect(screen.getByText(/Minhas Vagas/i)).toBeInTheDocument();
  });
});
