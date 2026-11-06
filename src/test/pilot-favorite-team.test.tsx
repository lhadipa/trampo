import { beforeEach, describe, expect, it } from "vitest";
import {
  getContractorDashboard,
  resetPilotMock,
  toggleFavoriteMock,
} from "@/lib/pilotMockService";

describe("pilot favorite team", () => {
  beforeEach(() => resetPilotMock());

  it("isolates favorites by contractor and makes toggling idempotent", () => {
    expect(
      getContractorDashboard("mock-contractor-1").contractor
        .favoriteProfessionalIds,
    ).toContain("mock-professional-1");
    expect(
      getContractorDashboard("mock-contractor-2").contractor
        .favoriteProfessionalIds,
    ).not.toContain("mock-professional-1");

    toggleFavoriteMock("mock-contractor-2", "mock-professional-1");
    expect(
      getContractorDashboard("mock-contractor-2").contractor
        .favoriteProfessionalIds,
    ).toEqual(["mock-professional-1"]);
    toggleFavoriteMock("mock-contractor-2", "mock-professional-1");
    expect(
      getContractorDashboard("mock-contractor-2").contractor
        .favoriteProfessionalIds,
    ).toEqual([]);
    expect(
      getContractorDashboard("mock-contractor-1").contractor
        .favoriteProfessionalIds,
    ).toEqual(["mock-professional-1"]);
  });
});
