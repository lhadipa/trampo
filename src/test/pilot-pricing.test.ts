import { describe, expect, it } from "vitest";
import { calculateJobPricing, formatBRL, PROFESSIONAL_CONFIRMATION_FEE } from "@/lib/pilotPricing";

describe("regras de preço do piloto", () => {
  it("calcula total e 12% para Avulso", () => {
    expect(calculateJobPricing({ quantity: 2, dailyRate: 150, planId: "avulso" })).toMatchObject({ dailyTotal: 300, contractorFee: 36, professionalFee: 7.9, isMock: true });
  });

  it("não cobra taxa por diária no Pro", () => {
    expect(calculateJobPricing({ quantity: 1, dailyRate: 150, planId: "pro" })).toMatchObject({ dailyTotal: 150, contractorFee: 0, professionalFee: 7.9, isMock: true });
  });

  it("mantém taxa profissional e formatação brasileira", () => {
    expect(PROFESSIONAL_CONFIRMATION_FEE).toBe(7.9);
    expect(formatBRL(PROFESSIONAL_CONFIRMATION_FEE)).toContain("7,90");
  });
});
