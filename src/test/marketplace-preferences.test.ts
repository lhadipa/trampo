import { beforeEach, describe, expect, it } from "vitest";
import { getProfessionalPreferences, resetPilotMock, togglePreferenceMock } from "@/lib/pilotMockService";

describe("preferências privadas do marketplace", () => {
  beforeEach(() => resetPilotMock());

  it("cria, remove e reativa sem duplicar", () => {
    togglePreferenceMock("mock-professional-1", "mock-location-cantina", "promocao-vendas");
    expect(getProfessionalPreferences()).toHaveLength(1);
    togglePreferenceMock("mock-professional-1", "mock-location-cantina", "promocao-vendas");
    expect(getProfessionalPreferences()).toHaveLength(0);
    togglePreferenceMock("mock-professional-1", "mock-location-cantina", "promocao-vendas");
    expect(getProfessionalPreferences()).toHaveLength(1);
  });

  it("não cria preferência para local inexistente", () => {
    expect(togglePreferenceMock("mock-professional-1", "inexistente", "promocao-vendas").success).toBe(false);
  });
});
