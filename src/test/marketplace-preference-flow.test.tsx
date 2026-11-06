import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ProfessionalPreferencesPanel } from "@/components/marketplace/ProfessionalPreferencesPanel";

describe("fluxo de preferência privada", () => {
  it("explica a privacidade, mostra a preferência ativa e permite removê-la", async () => {
    const onRemove = vi.fn();
    const { rerender } = render(<ProfessionalPreferencesPanel preferences={[{ id: "preference-1", location_id: "mock-location-cantina", category_id: "gastronomia-hospitalidade" }]} locations={[{ id: "mock-location-cantina", displayName: "Cantina Piloto", neighborhood: "Centro" }]} onRemove={onRemove} />);

    expect(screen.getByText("Preferências privadas")).toBeInTheDocument();
    expect(screen.getByText(/contratante vê somente uma contagem agregada/i)).toBeInTheDocument();
    expect(screen.getByText("Cantina Piloto")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Remover preferência por/i }));
    expect(onRemove).toHaveBeenCalledWith("preference-1");

    rerender(<ProfessionalPreferencesPanel preferences={[]} locations={[]} onRemove={onRemove} />);
    await waitFor(() => expect(screen.getByText(/Você ainda não salvou preferências/i)).toBeInTheDocument());
  });
});
