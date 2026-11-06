import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Index from "@/pages/Index";

describe("pilot landing", () => {
  it("communicates local coverage, categories and simulated values", () => {
    render(<BrowserRouter><Index /></BrowserRouter>);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Contrate ajuda local");
    expect(screen.getByText(/Contratante Avulso/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Profissional" })).toBeInTheDocument();
    expect(screen.getByText(/Todos os valores e pagamentos exibidos são simulações/i)).toBeInTheDocument();
    expect(screen.getByText(/Promoção & Vendas/i)).toBeInTheDocument();
  });
});
