import type { PlanId } from "./pilotTypes";
import distance from "@turf/distance";
import { point } from "@turf/helpers";

export const PROFESSIONAL_CONFIRMATION_FEE = 7.9;
export const PRO_MONTHLY_PRICE = 59.9;
export const AVULSO_RATE = 0.12;
export const SINGLE_MATCH_PRICE = 5;
export const WEEKEND_PRICE = 19.9;
export const DISTANCE_INCLUDED_KM = 3;
export const DISTANCE_RATE_PER_KM = 1.5;
export type MatchOffer = "single" | "weekend" | "monthly";

const money = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

export const calculateJobPricing = ({
  quantity,
  dailyRate,
  planId,
}: {
  quantity: number;
  dailyRate: number;
  planId: PlanId;
}) => {
  const safeQuantity = Math.max(0, Math.trunc(Number(quantity) || 0));
  const safeRate = Math.max(0, Number(dailyRate) || 0);
  const dailyTotal = money(safeQuantity * safeRate);
  return {
    dailyTotal,
    contractorFee: planId === "avulso" ? money(dailyTotal * AVULSO_RATE) : 0,
    professionalFee: PROFESSIONAL_CONFIRMATION_FEE,
    isMock: true as const,
  };
};

export const formatBRL = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

export const getMatchOfferPrice = (offer: MatchOffer) =>
  offer === "single" ? SINGLE_MATCH_PRICE : offer === "weekend" ? WEEKEND_PRICE : PRO_MONTHLY_PRICE;

export const calculateTravelPricing = (
  origin: { latitude: number; longitude: number },
  checkIn: { latitude: number; longitude: number },
) => {
  const distanceKm = distance(point([origin.longitude, origin.latitude]), point([checkIn.longitude, checkIn.latitude]), { units: "kilometers" });
  const chargeableKm = Math.max(0, distanceKm - DISTANCE_INCLUDED_KM);
  return { distanceKm: money(distanceKm), includedKm: DISTANCE_INCLUDED_KM, chargeableKm: money(chargeableKm), travelFee: money(chargeableKm * DISTANCE_RATE_PER_KM), isMock: true as const };
};
