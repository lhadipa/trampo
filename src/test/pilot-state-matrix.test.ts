import { beforeEach, describe, expect, it } from "vitest";
import {
  completeShiftMock,
  checkInMock,
  confirmContractorFeeMock,
  confirmProfessionalFeeMock,
  expressInterestMock,
  getPilotSnapshot,
  markNoShowMock,
  publishJobMock,
  resetPilotMock,
  selectProfessionalMock,
} from "@/lib/pilotMockService";

describe("pilot mock state matrix", () => {
  beforeEach(() => resetPilotMock());

  it("keeps Avulso publication pending until its mock fee is confirmed", () => {
    const result = publishJobMock({
      contractorId: "mock-contractor-1",
      title: "Auxiliar de evento",
      description: "Demonstração",
      roleLabel: "Eventos",
      categoryId: "eventos",
      location: "São João del-Rei",
      neighborhood: "Centro",
      startsAt: "2026-11-10T18:00:00.000Z",
      quantity: 1,
      dailyRate: 300,
      planId: "avulso",
    });
    expect(result.success).toBe(true);
    const job = getPilotSnapshot().jobs.find(
      (item) => item.title === "Auxiliar de evento",
    );
    expect(job?.status).toBe("awaiting_fee_mock");
    expect(job?.feeStatus).toBe("pending_mock");
    expect(confirmContractorFeeMock(job!.id).success).toBe(true);
    expect(
      getPilotSnapshot().jobs.find((item) => item.id === job!.id)?.status,
    ).toBe("open");
  });

  it("keeps interest and selection idempotent across the mock flow", () => {
    const openJob = getPilotSnapshot().jobs.find(
      (job) => job.status === "open",
    )!;
    expressInterestMock(openJob.id);
    expressInterestMock(openJob.id);
    const interests = getPilotSnapshot().interests.filter(
      (item) => item.jobId === openJob.id,
    );
    expect(interests).toHaveLength(1);
    selectProfessionalMock(interests[0].id);
    selectProfessionalMock(interests[0].id);
    expect(
      getPilotSnapshot().assignments.filter(
        (item) => item.jobId === openJob.id,
      ),
    ).toHaveLength(1);
  });

  it("does not duplicate completion or create a real payment", () => {
    const openJob = getPilotSnapshot().jobs.find(
      (job) => job.status === "open",
    )!;
    expressInterestMock(openJob.id);
    const interest = getPilotSnapshot().interests.find(
      (item) => item.jobId === openJob.id,
    )!;
    selectProfessionalMock(interest.id);
    const assignment = getPilotSnapshot().assignments.find(
      (item) => item.jobId === openJob.id,
    )!;
    confirmProfessionalFeeMock(assignment.id);
    checkInMock(assignment.id);
    completeShiftMock(assignment.id);
    completeShiftMock(assignment.id);
    const finalSnapshot = getPilotSnapshot();
    expect(
      finalSnapshot.receipts.filter(
        (item) => item.assignmentId === assignment.id,
      ),
    ).toHaveLength(1);
    expect(finalSnapshot.receipts[0].disclaimer).toMatch(
      /sem validade fiscal/i,
    );
    expect(finalSnapshot).not.toHaveProperty("payments");
  });

  it("keeps check-in and no-show retries idempotent", () => {
    const openJob = getPilotSnapshot().jobs.find(
      (job) => job.status === "open",
    )!;
    expressInterestMock(openJob.id);
    const interest = getPilotSnapshot().interests.find(
      (item) => item.jobId === openJob.id,
    )!;
    selectProfessionalMock(interest.id);
    const assignment = getPilotSnapshot().assignments.find(
      (item) => item.jobId === openJob.id,
    )!;
    confirmProfessionalFeeMock(assignment.id);
    expect(checkInMock(assignment.id).success).toBe(true);
    expect(checkInMock(assignment.id).success).toBe(true);
    resetPilotMock();
    const nextJob = getPilotSnapshot().jobs.find(
      (job) => job.status === "open",
    )!;
    expressInterestMock(nextJob.id);
    const nextInterest = getPilotSnapshot().interests.find(
      (item) => item.jobId === nextJob.id,
    )!;
    selectProfessionalMock(nextInterest.id);
    const nextAssignment = getPilotSnapshot().assignments.find(
      (item) => item.jobId === nextJob.id,
    )!;
    expect(markNoShowMock(nextAssignment.id).success).toBe(true);
    expect(markNoShowMock(nextAssignment.id).success).toBe(true);
  });
});
