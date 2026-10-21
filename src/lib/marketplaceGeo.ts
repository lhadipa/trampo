import distance from "@turf/distance";
import { point } from "@turf/helpers";
import type { GeoBounds, MarketplaceJob } from "./pilotTypes";

export const PILOT_CENTER: [number, number] = [-21.1357, -44.2613];
export const PILOT_ZOOM = 13;

export const isInsideBounds = (job: MarketplaceJob, bounds: GeoBounds) =>
  job.approximateLatitude >= bounds.south && job.approximateLatitude <= bounds.north && job.approximateLongitude >= bounds.west && job.approximateLongitude <= bounds.east;

export const distanceFrom = (job: MarketplaceJob, origin: { latitude: number; longitude: number }) =>
  distance(point([origin.longitude, origin.latitude]), point([job.approximateLongitude, job.approximateLatitude]), { units: "kilometers" });

export const filterMarketplaceJobs = (jobs: MarketplaceJob[], filters: { search?: string; categoryId?: string; bounds?: GeoBounds; origin?: { latitude: number; longitude: number } }) => {
  const search = filters.search?.trim().toLocaleLowerCase("pt-BR") || "";
  return jobs
    .filter((job) => !filters.bounds || isInsideBounds(job, filters.bounds))
    .filter((job) => !filters.categoryId || filters.categoryId === "all" || job.categoryId === filters.categoryId)
    .filter((job) => !search || `${job.title} ${job.roleLabel} ${job.neighborhood}`.toLocaleLowerCase("pt-BR").includes(search))
    .sort((a, b) => filters.origin ? distanceFrom(a, filters.origin) - distanceFrom(b, filters.origin) : a.startsAt.localeCompare(b.startsAt));
};

export const toMarketplaceJob = (job: import("./pilotTypes").PilotJob, index: number): MarketplaceJob => ({
  ...job,
  approximateLatitude: [-21.1357, -21.1294, -21.1412, -21.1321][index % 4],
  approximateLongitude: [-44.2613, -44.2551, -44.2694, -44.2478][index % 4],
  locationPrecision: "neighborhood",
});
