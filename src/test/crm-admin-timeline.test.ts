import { describe, expect, it } from "vitest";
import {
  canToggleAccount,
  deriveCrmClientIndicators,
  normalizeCrmTimeline,
} from "@/lib/crmAdmin";

describe("CRM derived timeline", () => {
  it("orders only real dated relation events and preserves their source", () => {
    const events = normalizeCrmTimeline({
      jobs: [
        { id: "job-1", created_at: "2026-01-01T10:00:00Z", status: "open" },
      ],
      applications: [
        {
          id: "app-1",
          created_at: "2026-01-02T10:00:00Z",
          status: "interested",
        },
      ],
      messages: [{ id: "msg-1", created_at: "invalid" }],
    });
    expect(events.map((event) => event.source)).toEqual([
      "applications",
      "jobs",
    ]);
    expect(events[0].status).toBe("interested");
  });

  it("does not infer events from missing dates or blocked status", () => {
    expect(
      normalizeCrmTimeline({ users: [{ id: "user-1", status: "blocked" }] }),
    ).toEqual([]);
  });

  it("does not allow an administrator to toggle their own account", () => {
    expect(canToggleAccount("admin-1", "admin-1")).toBe(false);
    expect(canToggleAccount("admin-1", "user-1")).toBe(true);
  });

  it("derives operational and financial indicators without inventing audit events", () => {
    expect(
      deriveCrmClientIndicators({
        jobs: [{ id: "job", created_at: "2026-01-01T00:00:00Z" }],
        contracts: [{ id: "contract", created_at: "2026-01-02T00:00:00Z" }],
        payments: [
          { id: "payment", amount: 25, created_at: "2026-01-03T00:00:00Z" },
        ],
      }),
    ).toMatchObject({
      operationalRecords: 2,
      contracts: 1,
      payments: 1,
      paymentVolume: 25,
      lastActivityAt: "2026-01-03T00:00:00Z",
    });
  });
});
