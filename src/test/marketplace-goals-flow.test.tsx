import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

const GoalsSummary = ({ points, nextLevelAt, description, badge }: { points: number; nextLevelAt: number; description: string; badge?: string }) => (
  <section aria-label="Progresso profissional">
    <h2>Meta atual</h2>
    <p>{description}</p>
    <p>{points} pontos</p>
    <p>Próximo nível em {Math.max(0, nextLevelAt - points)} pontos</p>
    {badge && <span>{badge}</span>}
  </section>
);

describe("professional goals flow", () => {
  it("shows current goal, progress, reward and next objective", () => {
    render(<GoalsSummary points={20} nextLevelAt={100} description="Abra três oportunidades no marketplace." badge="explorador-local" />);
    expect(screen.getByText(/Abra três oportunidades/)).toBeInTheDocument();
    expect(screen.getByText(/20 pontos/)).toBeInTheDocument();
    expect(screen.getByText(/Próximo nível em 80/)).toBeInTheDocument();
    expect(screen.getByText("explorador-local")).toBeInTheDocument();
  });
});
