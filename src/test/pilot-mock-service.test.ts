import { beforeEach, describe, expect, it } from "vitest";
import { confirmProfessionalFeeMock, getPilotSnapshot, resetPilotMock } from "@/lib/pilotMockService";

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
});
