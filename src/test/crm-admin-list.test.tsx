import { describe, expect, it } from "vitest";
import { crmListQueryContract, filterCrmClients } from "@/lib/crmAdmin";

const clients = [
  {
    id: "1",
    name: "Ana",
    email: "ana@example.com",
    crmType: "empresa",
    blocked: false,
    created_at: "2026-01-02T00:00:00Z",
  },
  {
    id: "2",
    name: "Bruno",
    email: "bruno@example.com",
    crmType: "freelancer",
    blocked: true,
    created_at: "2026-01-01T00:00:00Z",
  },
];

describe("CRM client list filters", () => {
  it("keeps the bounded query contract stable", () => {
    expect(crmListQueryContract).toEqual({
      select: "*",
      orderColumn: "created_at",
      ascending: false,
      limit: 500,
    });
  });

  it("searches, filters by type/status and orders newest first", () => {
    expect(
      filterCrmClients(clients, {
        query: "ana",
        type: "empresa",
        status: "active",
      }).map((client) => client.id),
    ).toEqual(["1"]);
    expect(
      filterCrmClients(clients, { status: "blocked" }).map(
        (client) => client.id,
      ),
    ).toEqual(["2"]);
    expect(filterCrmClients(clients, {}).map((client) => client.id)).toEqual([
      "1",
      "2",
    ]);
  });

  it("supports a created-at period without leaking clients outside it", () => {
    expect(
      filterCrmClients(clients, { from: "2026-01-02", to: "2026-01-02" }).map(
        (client) => client.id,
      ),
    ).toEqual(["1"]);
  });
});
