import { describe, expect, it } from "vitest";
import { filterMarketplaceJobs, isInsideBounds, toMarketplaceJob } from "@/lib/marketplaceGeo";
import { createPilotMockData } from "@/lib/pilotMockData";

const jobs = createPilotMockData().jobs.map(toMarketplaceJob);

describe("geografia do marketplace", () => {
  it("filtra por bounds", () => {
    const bounds = { south: -21.137, west: -44.263, north: -21.134, east: -44.259 };
    expect(isInsideBounds(jobs[0], bounds)).toBe(true);
    expect(filterMarketplaceJobs(jobs, { bounds })).toEqual([jobs[0]]);
  });

  it("filtra categoria e busca", () => {
    expect(filterMarketplaceJobs(jobs, { categoryId: "promocao-vendas", search: "panfletagem" }).map((job) => job.id)).toEqual(["mock-job-4"]);
  });

  it("ordena por distância quando há origem", () => {
    expect(filterMarketplaceJobs(jobs, { origin: { latitude: -21.1357, longitude: -44.2613 } })[0].id).toBe("mock-job-1");
  });
});
