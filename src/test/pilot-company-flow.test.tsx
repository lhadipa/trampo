import { beforeEach, describe, expect, it } from "vitest";
import {
  confirmContractorFeeMock,
  getContractorDashboard,
  publishJobMock,
  resetPilotMock,
  setContractorStatusMock,
} from "@/lib/pilotMockService";

describe("pilot contractor state flow", () => {
  beforeEach(() => resetPilotMock());

  it("exposes plan and trial data and publishes a Pro job without a fee", () => {
    const dashboard = getContractorDashboard("mock-contractor-1");
    expect(dashboard.plan.id).toBe("pro");
    expect(dashboard.plan.trialDays).toBe(14);

    const result = publishJobMock({
      contractorId: "mock-contractor-1",
      categoryId: "promocao-vendas",
      title: "Vaga Pro demonstrativa",
      roleLabel: "Promotor",
      mode: "individual",
      location: "Local piloto",
      neighborhood: "Centro",
      startsAt: "2026-11-10T09:00:00-03:00",
      endsAt: "2026-11-10T17:00:00-03:00",
      quantity: 1,
      dailyRate: 150,
      planId: "pro",
    });

    expect(result.success).toBe(true);
    const job = result.snapshot.jobs.at(-1);
    expect(job?.contractorFee).toBe(0);
    expect(job?.status).toBe("open");
  });

  it("keeps an Avulso job waiting for its simulated fee confirmation", () => {
    const result = publishJobMock({
      contractorId: "mock-contractor-2",
      categoryId: "eventos-producao",
      title: "Equipe Avulso demonstrativa",
      roleLabel: "Apoio",
      mode: "team",
      location: "Local piloto",
      neighborhood: "Centro",
      startsAt: "2026-11-11T09:00:00-03:00",
      endsAt: "2026-11-11T17:00:00-03:00",
      quantity: 2,
      dailyRate: 150,
      planId: "avulso",
    });
    const job = result.snapshot.jobs.at(-1)!;
    expect(job.contractorFee).toBe(36);
    expect(job.status).toBe("awaiting_fee_mock");
    expect(confirmContractorFeeMock(job.id).success).toBe(true);
    expect(
      getContractorDashboard("mock-contractor-2").jobs.find(
        (item) => item.id === job.id,
      )?.status,
    ).toBe("open");
  });

  it("blocks publication while the demonstration account is suspended", () => {
    expect(
      setContractorStatusMock("mock-contractor-1", "suspended_mock").success,
    ).toBe(true);
    const result = publishJobMock({
      contractorId: "mock-contractor-1",
      categoryId: "promocao-vendas",
      title: "Não deve publicar",
      roleLabel: "Promotor",
      mode: "individual",
      location: "Local piloto",
      neighborhood: "Centro",
      startsAt: "2026-11-12T09:00:00-03:00",
      endsAt: "2026-11-12T17:00:00-03:00",
      quantity: 1,
      dailyRate: 150,
      planId: "pro",
    });
    expect(result).toMatchObject({ success: false, code: "ACCOUNT_SUSPENDED" });
  });
});
