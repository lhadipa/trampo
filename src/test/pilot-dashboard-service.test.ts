import { beforeEach, describe, expect, it } from "vitest";
import {
  expressInterestMock,
  getContractorDashboard,
  getProfessionalDashboard,
  resetPilotMock,
  toggleFavoriteMock,
} from "@/lib/pilotMockService";

describe("dados mockados dos painéis", () => {
  beforeEach(() => resetPilotMock());

  it("expõe plano, vagas e equipe do contratante", () => {
    const dashboard = getContractorDashboard();
    expect(dashboard.plan.name).toBe("Pro");
    expect(dashboard.plan.trialDays).toBe(14);
    expect(dashboard.jobs.length).toBeGreaterThan(0);
    expect(dashboard.contractor.favoriteProfessionalIds).toContain("mock-professional-1");
  });

  it("isola a equipe favorita por contratante", () => {
    toggleFavoriteMock("mock-contractor-2", "mock-professional-2");
    expect(getContractorDashboard("mock-contractor-2").contractor.favoriteProfessionalIds).toEqual(["mock-professional-2"]);
    expect(getContractorDashboard().contractor.favoriteProfessionalIds).not.toContain("mock-professional-2");
  });

  it("registra interesse sem criar taxa profissional", () => {
    const before = getProfessionalDashboard("mock-professional-2");
    const job = before.openJobs[0];
    const result = expressInterestMock(job.id, before.professional.id);
    const after = getProfessionalDashboard("mock-professional-2");
    expect(result.success).toBe(true);
    expect(after.interests.some((interest) => interest.jobId === job.id)).toBe(true);
    expect(after.assignments).toHaveLength(0);
  });
});
