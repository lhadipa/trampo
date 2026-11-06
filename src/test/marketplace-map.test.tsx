import { describe, expect, it } from "vitest";
import { filterMarketplaceJobs, isInsideBounds } from "@/lib/marketplaceGeo";
import type { MarketplaceJob } from "@/lib/pilotTypes";

const jobs: MarketplaceJob[] = [
  { id: "a", title: "Garçom Centro", roleLabel: "Garçom", categoryId: "gastronomia-hospitalidade", neighborhood: "Centro", approximateLatitude: -21.13, approximateLongitude: -44.26, locationPrecision: "neighborhood", startsAt: "2026-11-10T18:00:00.000Z", dailyRate: 150, quantity: 1, contractorId: "c" } as MarketplaceJob,
  { id: "b", title: "Panfletagem Matosinhos", roleLabel: "Panfletista", categoryId: "promocao-vendas", neighborhood: "Matosinhos", approximateLatitude: -21.15, approximateLongitude: -44.28, locationPrecision: "neighborhood", startsAt: "2026-11-09T18:00:00.000Z", dailyRate: 120, quantity: 2, contractorId: "c" } as MarketplaceJob,
];

describe("marketplace map/list synchronization rules", () => {
  it("filters by category and search while preserving deterministic ordering", () => {
    expect(filterMarketplaceJobs(jobs, { categoryId: "gastronomia-hospitalidade" }).map((job) => job.id)).toEqual(["a"]);
    expect(filterMarketplaceJobs(jobs, { search: "matosinhos" }).map((job) => job.id)).toEqual(["b"]);
  });

  it("keeps jobs outside visible bounds out of the map result", () => {
    const bounds = { south: -21.14, west: -44.27, north: -21.12, east: -44.25 };
    expect(isInsideBounds(jobs[0], bounds)).toBe(true);
    expect(filterMarketplaceJobs(jobs, { bounds }).map((job) => job.id)).toEqual(["a"]);
  });
});
