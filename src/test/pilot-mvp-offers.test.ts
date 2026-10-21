import { describe, expect, it } from "vitest";
import { calculateTravelPricing, getMatchOfferPrice } from "@/lib/pilotPricing";

describe("ofertas e deslocamento do MVP", () => {
  it("expõe os três preços acordados", () => {
    expect(getMatchOfferPrice("single")).toBe(5);
    expect(getMatchOfferPrice("weekend")).toBe(19.9);
    expect(getMatchOfferPrice("monthly")).toBe(59.9);
  });

  it("não cobra deslocamento dentro de 3 km", () => {
    expect(calculateTravelPricing({ latitude: -21.1357, longitude: -44.2613 }, { latitude: -21.1357, longitude: -44.2613 }).travelFee).toBe(0);
  });

  it("cobra R$ 1,50 por quilômetro excedente", () => {
    const result = calculateTravelPricing({ latitude: 0, longitude: 0 }, { latitude: 0, longitude: 0.045 });
    expect(result.distanceKm).toBeGreaterThan(4.9);
    expect(result.chargeableKm).toBeGreaterThan(1.9);
    expect(result.travelFee).toBeCloseTo(result.chargeableKm * 1.5, 1);
  });
});
