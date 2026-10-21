import { calculateJobPricing } from "./pilotPricing";
import type { PilotSnapshot } from "./pilotTypes";

const proPrice = calculateJobPricing({ quantity: 1, dailyRate: 160, planId: "pro" });
const openPrice = calculateJobPricing({ quantity: 1, dailyRate: 150, planId: "pro" });
const teamPrice = calculateJobPricing({ quantity: 10, dailyRate: 140, planId: "avulso" });

export const createPilotMockData = (): PilotSnapshot => ({
  users: [
    { id: "mock-user-contractor-1", name: "Cantina Piloto", role: "contractor", city: "São João del-Rei", neighborhood: "Centro", accountStatus: "active" },
    { id: "mock-user-contractor-2", name: "Buffet Demonstração", role: "contractor", city: "São João del-Rei", neighborhood: "Matosinhos", accountStatus: "active" },
    { id: "mock-user-professional-1", name: "Ana Exemplo", role: "professional", city: "São João del-Rei", neighborhood: "Centro", accountStatus: "active" },
    { id: "mock-user-professional-2", name: "Pedro Fictício", role: "professional", city: "São João del-Rei", neighborhood: "Matosinhos", accountStatus: "active" },
    { id: "mock-user-professional-3", name: "Carla Demonstração", role: "professional", city: "São João del-Rei", neighborhood: "Tejuco", accountStatus: "active" },
  ],
  plans: [
    { id: "avulso", name: "Avulso", monthlyPrice: 0, contractorFeeRate: 0.12, trialDays: 0, isMock: true },
    { id: "pro", name: "Pro", monthlyPrice: 59.9, contractorFeeRate: 0, trialDays: 14, isMock: true },
  ],
  contractors: [
    { id: "mock-contractor-1", userId: "mock-user-contractor-1", displayName: "Cantina Piloto", planId: "pro", trialEndsAt: "2026-10-14", favoriteProfessionalIds: ["mock-professional-1"] },
    { id: "mock-contractor-2", userId: "mock-user-contractor-2", displayName: "Buffet Demonstração", planId: "avulso", favoriteProfessionalIds: [] },
  ],
  professionals: [
    { id: "mock-professional-1", userId: "mock-user-professional-1", categoryIds: ["gastronomia-hospitalidade"], roleLabel: "Garçonete", rating: 4.9, completedShifts: 38, noShowCount: 0, pixAlias: "ana.exemplo@pix.invalid" },
    { id: "mock-professional-2", userId: "mock-user-professional-2", categoryIds: ["promocao-vendas"], roleLabel: "Panfletista", rating: 4.7, completedShifts: 21, noShowCount: 0, pixAlias: "pedro.mock@pix.invalid" },
    { id: "mock-professional-3", userId: "mock-user-professional-3", categoryIds: ["promocao-vendas"], roleLabel: "Vendedora porta a porta", rating: 4.8, completedShifts: 16, noShowCount: 1, pixAlias: "carla.demo@pix.invalid" },
  ],
  jobs: [
    { id: "mock-job-1", contractorId: "mock-contractor-1", categoryId: "gastronomia-hospitalidade", title: "Garçom — sábado no salão", roleLabel: "Garçom / Garçonete", mode: "individual", location: "Cantina Piloto", neighborhood: "Centro", startsAt: "2026-10-03T18:00:00-03:00", endsAt: "2026-10-03T23:00:00-03:00", quantity: 1, dailyRate: 160, planId: "pro", contractorFee: proPrice.contractorFee, feeStatus: "not_applicable", status: "filled" },
    { id: "mock-job-2", contractorId: "mock-contractor-1", categoryId: "gastronomia-hospitalidade", title: "Apoio de salão — hoje à noite", roleLabel: "Atendente de Salão", mode: "individual", location: "Cantina Piloto", neighborhood: "Centro", startsAt: "2026-10-05T19:00:00-03:00", endsAt: "2026-10-05T23:00:00-03:00", quantity: 1, dailyRate: 150, planId: "pro", contractorFee: openPrice.contractorFee, feeStatus: "not_applicable", status: "open" },
    { id: "mock-job-3", contractorId: "mock-contractor-2", categoryId: "eventos-producao", title: "Equipe de formatura — Largo do Rosário", roleLabel: "Apoio de evento", mode: "team", location: "Buffet Demonstração", neighborhood: "Centro", startsAt: "2026-10-10T17:00:00-03:00", endsAt: "2026-10-11T01:00:00-03:00", quantity: 10, dailyRate: 140, planId: "avulso", contractorFee: teamPrice.contractorFee, feeStatus: "pending_mock", status: "awaiting_fee_mock" },
    { id: "mock-job-4", contractorId: "mock-contractor-1", categoryId: "promocao-vendas", title: "Panfletagem no Centro", roleLabel: "Panfletista", mode: "team", location: "Praça fictícia", neighborhood: "Centro", startsAt: "2026-10-08T09:00:00-03:00", endsAt: "2026-10-08T14:00:00-03:00", quantity: 3, dailyRate: 110, planId: "pro", contractorFee: 0, feeStatus: "not_applicable", status: "open" },
  ],
  interests: [
    { id: "mock-interest-1", jobId: "mock-job-1", professionalId: "mock-professional-1", status: "selected", selectedAt: "2026-09-30T12:00:00-03:00", confirmationDeadline: "2026-10-01T12:00:00-03:00" },
  ],
  assignments: [
    { id: "mock-assignment-1", jobId: "mock-job-1", professionalId: "mock-professional-1", professionalFee: 7.9, feeStatus: "pending_mock", status: "awaiting_confirmation" },
  ],
  checkIns: [],
  receipts: [],
  interestLocations: [
    { id: "mock-location-cantina", contractorId: "mock-contractor-1", displayName: "Cantina Piloto", neighborhood: "Centro", approximateLatitude: -21.1357, approximateLongitude: -44.2613, categoryIds: ["gastronomia-hospitalidade", "promocao-vendas"] },
    { id: "mock-location-buffet", contractorId: "mock-contractor-2", displayName: "Buffet Demonstração", neighborhood: "Matosinhos", approximateLatitude: -21.1294, approximateLongitude: -44.2551, categoryIds: ["eventos-producao", "promocao-vendas"] },
  ],
  professionalPreferences: [],
  goals: [
    { id: "mock-goal-explore", title: "Explore oportunidades", description: "Abra três oportunidades no marketplace.", metric: "jobs_viewed", target: 3, rewardPoints: 20, badgeId: "explorador-local", status: "active" },
  ],
  progressEvents: [],
  rewardProfiles: [
    { professionalId: "mock-professional-1", level: 1, points: 0, nextLevelAt: 100, earnedBadgeIds: [] },
  ],
});
