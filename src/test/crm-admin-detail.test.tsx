import { describe, expect, it } from "vitest";
import { consolidateCrmRelations } from "@/lib/crmAdmin";

describe("CRM client detail consolidation", () => {
  it("keeps only relations belonging to the selected client", () => {
    const detail = consolidateCrmRelations(
      {
        users: [{ id: "u1" }, { id: "u2" }],
        companies: [
          { id: "c1", user_id: "u1" },
          { id: "c2", user_id: "u2" },
        ],
        jobs: [
          { id: "j1", company_id: "c1" },
          { id: "j2", company_id: "c2" },
        ],
        applications: [
          { id: "a1", job_id: "j1", freelancer_id: "f1" },
          { id: "a2", job_id: "j2", freelancer_id: "f2" },
        ],
        contracts: [
          { id: "ct1", company_id: "c1" },
          { id: "ct2", company_id: "c2" },
        ],
      },
      {
        userId: "u1",
        companyIds: ["c1"],
        jobs: [
          { id: "j1", company_id: "c1" },
          { id: "j2", company_id: "c2" },
        ],
      },
    );
    expect(detail.users).toHaveLength(1);
    expect(detail.companies).toHaveLength(1);
    expect(detail.jobs).toHaveLength(1);
    expect(detail.applications).toHaveLength(1);
    expect(detail.contracts).toHaveLength(1);
  });

  it("returns explicit empty sections instead of borrowing another client", () => {
    const detail = consolidateCrmRelations(
      {
        jobs: [{ id: "j2", company_id: "c2" }],
        payments: [{ id: "p2", company_id: "c2" }],
      },
      { userId: "u1", companyIds: ["c1"] },
    );
    expect(detail.jobs).toEqual([]);
    expect(detail.payments).toEqual([]);
  });
});
