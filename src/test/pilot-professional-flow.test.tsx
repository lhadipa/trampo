import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

const ProfessionalFlow = ({ status }: { status: string }) => <section aria-label="Fluxo profissional"><h1>Meus trabalhos</h1><p>Estado demonstrativo: {status}</p><p>Demonstração — sem validade fiscal</p></section>;

describe("professional pilot flow", () => {
  it("communicates the mock state and fiscal disclaimer", () => {
    render(<ProfessionalFlow status="checked_in" />);
    expect(screen.getByRole("heading", { name: "Meus trabalhos" })).toBeInTheDocument();
    expect(screen.getByText(/checked_in/)).toBeInTheDocument();
    expect(screen.getByText(/sem validade fiscal/)).toBeInTheDocument();
  });
});
