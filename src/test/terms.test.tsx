import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Terms from "@/pages/Terms";

describe("Terms of Service & Legal Armor Page", () => {
  it("renders the legal protection title and Anti-CLT framework", () => {
    render(
      <BrowserRouter>
        <Terms />
      </BrowserRouter>
    );

    expect(screen.getByText(/Marco Jurídico e Termos de Uso/i)).toBeInTheDocument();
    expect(screen.getByText(/Ausência de Vínculo Empregatício/i)).toBeInTheDocument();
    expect(screen.getByText(/Art\. 442-B da CLT/i)).toBeInTheDocument();
    expect(screen.getByText(/São João del-Rei, Estado de Minas Gerais/i)).toBeInTheDocument();
  });

  it("contains clear clauses on non-exclusivity and no subordination", () => {
    render(
      <BrowserRouter>
        <Terms />
      </BrowserRouter>
    );

    expect(screen.getByText(/Inexistência de Subordinação Jurídica/i)).toBeInTheDocument();
    expect(screen.getByText(/Não-Exclusividade/i)).toBeInTheDocument();
    expect(screen.getByText(/Compreendi e Concordo/i)).toBeInTheDocument();
  });
});
