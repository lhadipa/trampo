import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Auth from "@/pages/Auth";

describe("Auth Page & Compliance Flows", () => {
  it("renders login and signup buttons with 60-day VIP banner", () => {
    render(
      <BrowserRouter>
        <Auth />
      </BrowserRouter>
    );

    expect(screen.getByText(/Lançamento SJDR/i)).toBeInTheDocument();
    expect(screen.getByText(/60 Dias Grátis de Membro Fundador VIP/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^Entrar$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^Cadastrar$/i })).toBeInTheDocument();
  });

  it("switches to signup and displays compliance terms and options", () => {
    render(
      <BrowserRouter>
        <Auth />
      </BrowserRouter>
    );

    const signupBtn = screen.getByRole("button", { name: /^Cadastrar$/i });
    fireEvent.click(signupBtn);

    expect(screen.getByText(/Trabalhador Autônomo/i)).toBeInTheDocument();
    expect(screen.getByText(/Empresa \/ Contratante/i)).toBeInTheDocument();
    expect(screen.getByText(/Termos de Uso, Mediação Tecnológica e Declaração de Autonomia/i)).toBeInTheDocument();
    expect(screen.getByText(/Criar Conta com 60 Dias Grátis/i)).toBeInTheDocument();
  });
});
