import { describe, expect, it, beforeEach } from "vitest";
import { getPreferenceAggregates, resetPilotMock, togglePreferenceMock } from "@/lib/pilotMockService";

describe("marketplace preference privacy", () => {
  beforeEach(() => resetPilotMock());

  it("returns only location, category and aggregate count", () => {
    togglePreferenceMock("mock-professional-1", "mock-location-cantina", "gastronomia-hospitalidade");
    togglePreferenceMock("mock-professional-2", "mock-location-cantina", "gastronomia-hospitalidade");

    const aggregates = getPreferenceAggregates("mock-contractor-1");
    expect(aggregates).toEqual([{ locationId: "mock-location-cantina", categoryId: "gastronomia-hospitalidade", count: 2 }]);
    expect(JSON.stringify(aggregates)).not.toContain("professional");
    expect(Object.keys(aggregates[0])).toEqual(["locationId", "categoryId", "count"]);
  });

  it("decreases the aggregate when a preference is removed and has an empty state", () => {
    togglePreferenceMock("mock-professional-1", "mock-location-cantina", "gastronomia-hospitalidade");
    expect(getPreferenceAggregates("mock-contractor-1")).toHaveLength(1);
    togglePreferenceMock("mock-professional-1", "mock-location-cantina", "gastronomia-hospitalidade");
    expect(getPreferenceAggregates("mock-contractor-1")).toEqual([]);
  });
});
