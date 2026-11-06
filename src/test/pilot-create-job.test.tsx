import { beforeEach, describe, expect, it } from "vitest";
import { getPilotSnapshot, publishJobMock, resetPilotMock } from "@/lib/pilotMockService";
import { calculateJobPricing } from "@/lib/pilotPricing";

describe("pilot job creation", () => {
  beforeEach(() => resetPilotMock());

  it("calculates Pro without a daily platform fee", () => {
    expect(calculateJobPricing({ quantity: 1, dailyRate: 150, planId: "pro" })).toMatchObject({ contractorFee: 0, dailyTotal: 150 });
  });

  it("calculates Avulso fee for a batch without creating a real payment", () => {
    expect(calculateJobPricing({ quantity: 2, dailyRate: 150, planId: "avulso" })).toMatchObject({ contractorFee: 36, dailyTotal: 300 });
    const result = publishJobMock({
      contractorId: "mock-contractor-1", title: "Equipe demonstrativa", description: "Teste", roleLabel: "Eventos",
      categoryId: "eventos", location: "Centro", neighborhood: "Centro", startsAt: "2026-11-10T18:00:00Z",
      endsAt: "2026-11-11T02:00:00Z", quantity: 2, dailyRate: 150, note: "", planId: "avulso", priorityMock: false,
    });
    expect(result.success).toBe(true);
    expect(getPilotSnapshot().jobs.at(-1)).toMatchObject({ quantity: 2, contractorFee: 36, status: "awaiting_fee_mock" });
    expect(getPilotSnapshot()).not.toHaveProperty("payments");
  });
});
