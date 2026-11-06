import { beforeEach, describe, expect, it } from "vitest";
import { getContractorDashboard, getProfessionalDashboard, resetPilotMock } from "@/lib/pilotMockService";

describe("pilot dashboard contracts", () => {
  beforeEach(() => resetPilotMock());

  it("exposes the contractor plan, trial and operational jobs", () => {
    const dashboard = getContractorDashboard();
    expect(dashboard.plan.isMock).toBe(true);
    expect(dashboard.plan.trialDays).toBe(14);
    expect(dashboard.jobs.length).toBeGreaterThan(0);
  });

  it("exposes professional opportunities, interests and assignments without payments", () => {
    const dashboard = getProfessionalDashboard();
    expect(dashboard.openJobs.length).toBeGreaterThan(0);
    expect(dashboard.interests).toEqual([]);
    expect(dashboard.assignments).toEqual([]);
    expect(dashboard).not.toHaveProperty("payments");
  });
});
