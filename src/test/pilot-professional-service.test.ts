import { beforeEach, describe, expect, it } from "vitest";
import { checkInMock, completeShiftMock, confirmProfessionalFeeMock, expressInterestMock, getPilotSnapshot, resetPilotMock, selectProfessionalMock } from "@/lib/pilotMockService";

describe("professional pilot service", () => {
  beforeEach(() => resetPilotMock());

  it("keeps the fee unavailable until selection and completes the mock journey", () => {
    const job = getPilotSnapshot().jobs.find((item) => item.status === "open")!;
    const interest = expressInterestMock(job.id).success;
    expect(interest).toBe(true);
    const interestId = getPilotSnapshot().interests.find((item) => item.jobId === job.id)!.id;
    selectProfessionalMock(interestId);
    const assignment = getPilotSnapshot().assignments.find((item) => item.jobId === job.id)!;
    expect(assignment.feeStatus).toBe("pending_mock");
    confirmProfessionalFeeMock(assignment.id);
    checkInMock(assignment.id);
    expect(completeShiftMock(assignment.id).success).toBe(true);
    expect(getPilotSnapshot().assignments.find((item) => item.id === assignment.id)?.status).toBe("completed");
  });
});
