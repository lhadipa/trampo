import { beforeEach, describe, expect, it } from "vitest";
import { getRewardProfile, recordProgressMock, resetPilotMock } from "@/lib/pilotMockService";

describe("marketplace rewards", () => {
  beforeEach(() => resetPilotMock());

  it("advances a goal once for the same idempotency key", () => {
    recordProgressMock("mock-professional-1", "mock-goal-explore", "jobs_viewed:mock-job-1", 3);
    recordProgressMock("mock-professional-1", "mock-goal-explore", "jobs_viewed:mock-job-1", 3);
    const profile = getRewardProfile();
    expect(profile.points).toBe(20);
    expect(profile.earnedBadgeIds).toEqual(["explorador-local"]);
  });

  it("calculates level from points without financial effects", () => {
    const result = recordProgressMock("mock-professional-1", "mock-goal-explore", "explore-once", 3);
    expect(result.success).toBe(true);
    expect(getRewardProfile()).toMatchObject({ level: 1, points: 20, nextLevelAt: 100 });
  });

  it("records availability only once", () => {
    recordProgressMock("mock-professional-1", "mock-goal-availability", "availability-set:mock-professional-1", 1);
    recordProgressMock("mock-professional-1", "mock-goal-availability", "availability-set:mock-professional-1", 1);
    expect(getRewardProfile().points).toBe(15);
  });
});
