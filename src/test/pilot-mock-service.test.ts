import { beforeEach, describe, expect, it } from "vitest";
import { confirmProfessionalFeeMock, getPilotSnapshot, publishJobMock, resetPilotMock, setContractorStatusMock } from "@/lib/pilotMockService";

describe("serviço mockado do piloto", () => {
  beforeEach(() => resetPilotMock());

  it("confirma a taxa de forma idempotente", () => {
    const assignment = getPilotSnapshot().assignments[0];
    const first = confirmProfessionalFeeMock(assignment.id);
    const second = confirmProfessionalFeeMock(assignment.id);
    expect(first.success).toBe(true);
    expect(second.success).toBe(true);
    expect(second.snapshot.assignments.filter((item) => item.id === assignment.id)).toHaveLength(1);
  });

  it("não confirma sem assignment selecionado", () => {
    expect(confirmProfessionalFeeMock("inexistente").code).toBe("NOT_SELECTED");
  });

  it("bloqueia publicação durante suspensão demonstrativa", () => {
    setContractorStatusMock("mock-contractor-1", "suspended_mock");
    const draft = { contractorId: "mock-contractor-1", categoryId: "eventos-producao", title: "Teste", roleLabel: "Apoio", mode: "individual" as const, location: "Centro", neighborhood: "Centro", startsAt: "2026-11-10T18:00:00Z", endsAt: "2026-11-11T02:00:00Z", quantity: 1, dailyRate: 100, note: "", planId: "pro" as const, priorityMock: false };
    expect(publishJobMock(draft)).toMatchObject({ success: false, code: "ACCOUNT_SUSPENDED" });
    setContractorStatusMock("mock-contractor-1", "active");
    expect(publishJobMock(draft).success).toBe(true);
    expect(getPilotSnapshot().jobs.at(-1)?.title).toBe("Teste");
  });
});
