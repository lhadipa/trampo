import { createPilotMockData } from "./pilotMockData";
import {
  calculateJobPricing,
  PROFESSIONAL_CONFIRMATION_FEE,
} from "./pilotPricing";
import type { MockResult, PilotJob, PilotSnapshot } from "./pilotTypes";
import { filterMarketplaceJobs, toMarketplaceJob } from "./marketplaceGeo";
import type { GeoBounds } from "./pilotTypes";

let snapshot = createPilotMockData();
let sequence = 100;
const id = (prefix: string) => `mock-${prefix}-${sequence++}`;
const clone = <T>(value: T): T => structuredClone(value);
const result = (
  success: boolean,
  message: string,
  code?: string,
): MockResult => ({
  success,
  message,
  code,
  mock: true,
  snapshot: clone(snapshot),
});

export const resetPilotMock = () => {
  snapshot = createPilotMockData();
  sequence = 100;
  return clone(snapshot);
};
export const getPilotSnapshot = () => clone(snapshot);

export const getOpenJobs = () =>
  snapshot.jobs
    .filter((job) => ["open", "partially_filled"].includes(job.status))
    .map(clone);
export const getMarketplaceJobs = (
  filters: {
    search?: string;
    categoryId?: string;
    bounds?: GeoBounds;
    origin?: { latitude: number; longitude: number };
  } = {},
) =>
  filterMarketplaceJobs(getOpenJobs().map(toMarketplaceJob), filters).map(
    clone,
  );

export const getProfessionalPreferences = (
  professionalId = "mock-professional-1",
) =>
  snapshot.professionalPreferences
    .filter(
      (preference) =>
        preference.professionalId === professionalId &&
        preference.status === "active",
    )
    .map(clone);

export const getRewardProfile = (professionalId = "mock-professional-1") =>
  clone(
    snapshot.rewardProfiles.find(
      (profile) => profile.professionalId === professionalId,
    ) ?? {
      professionalId,
      level: 1,
      points: 0,
      nextLevelAt: 100,
      earnedBadgeIds: [],
    },
  );

export const updateGoalMock = (
  goalId: string,
  changes: Partial<PilotSnapshot["goals"][number]>,
): MockResult => {
  const goal = snapshot.goals.find((item) => item.id === goalId);
  if (!goal)
    return result(
      false,
      "Meta demonstrativa não encontrada.",
      "GOAL_NOT_FOUND",
    );
  Object.assign(goal, changes);
  return result(true, "Meta atualizada.");
};

export const recordProgressMock = (
  professionalId: string,
  goalId: string,
  idempotencyKey: string,
  value = 1,
): MockResult => {
  if (
    snapshot.progressEvents.some(
      (event) =>
        event.professionalId === professionalId &&
        event.idempotencyKey === idempotencyKey,
    )
  )
    return result(true, "Progresso já registrado.");
  const goal = snapshot.goals.find((item) => item.id === goalId);
  if (!goal)
    return result(
      false,
      "Meta demonstrativa não encontrada.",
      "GOAL_NOT_FOUND",
    );
  snapshot.progressEvents.push({
    idempotencyKey,
    professionalId,
    goalId,
    kind: goal.metric,
    value,
    occurredAt: new Date().toISOString(),
  });
  const total = snapshot.progressEvents
    .filter(
      (event) =>
        event.professionalId === professionalId && event.goalId === goalId,
    )
    .reduce((sum, event) => sum + event.value, 0);
  if (total >= goal.target && goal.status !== "completed") {
    goal.status = "completed";
    const profile = snapshot.rewardProfiles.find(
      (item) => item.professionalId === professionalId,
    ) ?? {
      professionalId,
      level: 1,
      points: 0,
      nextLevelAt: 100,
      earnedBadgeIds: [],
    };
    profile.points += goal.rewardPoints;
    profile.level = Math.floor(profile.points / 100) + 1;
    profile.nextLevelAt = profile.level * 100;
    if (goal.badgeId && !profile.earnedBadgeIds.includes(goal.badgeId))
      profile.earnedBadgeIds.push(goal.badgeId);
    if (
      !snapshot.rewardProfiles.some(
        (item) => item.professionalId === professionalId,
      )
    )
      snapshot.rewardProfiles.push(profile);
    return result(true, `Meta concluída: +${goal.rewardPoints} pontos.`);
  }
  return result(true, "Progresso atualizado.");
};

export const getPreferenceAggregates = (contractorId = "mock-contractor-1") => {
  const locationIds = new Set(
    snapshot.interestLocations
      .filter((location) => location.contractorId === contractorId)
      .map((location) => location.id),
  );
  const counts = new Map<
    string,
    { locationId: string; categoryId: string; count: number }
  >();
  snapshot.professionalPreferences
    .filter(
      (preference) =>
        preference.status === "active" &&
        locationIds.has(preference.locationId),
    )
    .forEach((preference) => {
      const key = `${preference.locationId}:${preference.categoryId}`;
      const current = counts.get(key);
      if (current) current.count += 1;
      else
        counts.set(key, {
          locationId: preference.locationId,
          categoryId: preference.categoryId,
          count: 1,
        });
    });
  return [...counts.values()]
    .sort(
      (left, right) =>
        left.locationId.localeCompare(right.locationId) ||
        left.categoryId.localeCompare(right.categoryId),
    )
    .map(clone);
};

export const togglePreferenceMock = (
  professionalId: string,
  locationId: string,
  categoryId: string,
): MockResult => {
  const location = snapshot.interestLocations.find(
    (item) => item.id === locationId,
  );
  if (!location)
    return result(
      false,
      "Local demonstrativo não encontrado.",
      "INVALID_TRANSITION",
    );
  const existing = snapshot.professionalPreferences.find(
    (item) =>
      item.professionalId === professionalId &&
      item.locationId === locationId &&
      item.categoryId === categoryId,
  );
  if (existing?.status === "active") {
    existing.status = "removed";
    existing.removedAt = new Date().toISOString();
    return result(
      true,
      "Preferência removida. Sua identidade continuou privada.",
    );
  }
  if (existing) {
    existing.status = "active";
    existing.removedAt = undefined;
  } else {
    snapshot.professionalPreferences.push({
      id: id("preference"),
      professionalId,
      locationId,
      categoryId,
      status: "active",
      createdAt: new Date().toISOString(),
    });
  }
  return result(
    true,
    "Currículo de interesse enviado. O contratante verá somente a contagem agregada.",
  );
};

export const getContractorDashboard = (contractorId = "mock-contractor-1") => {
  const contractor =
    snapshot.contractors.find((item) => item.id === contractorId) ??
    snapshot.contractors[0];
  return {
    contractor: clone(contractor),
    plan: clone(snapshot.plans.find((item) => item.id === contractor.planId)!),
    jobs: snapshot.jobs
      .filter((job) => job.contractorId === contractor.id)
      .map(clone),
  };
};

export const setContractorStatusMock = (
  contractorId: string,
  status: "active" | "suspended_mock",
): MockResult => {
  const contractor = snapshot.contractors.find(
    (item) => item.id === contractorId,
  );
  const user =
    contractor && snapshot.users.find((item) => item.id === contractor.userId);
  if (!user)
    return result(
      false,
      "Contratante demonstrativo não encontrado.",
      "CONTRACTOR_NOT_FOUND",
    );
  user.accountStatus = status;
  return result(
    true,
    status === "suspended_mock"
      ? "Conta demonstrativa suspensa."
      : "Conta demonstrativa reativada.",
  );
};

export const getProfessionalDashboard = (
  professionalId = "mock-professional-1",
) => ({
  professional: clone(
    snapshot.professionals.find((item) => item.id === professionalId) ??
      snapshot.professionals[0],
  ),
  jobs: snapshot.jobs.map(clone),
  openJobs: getOpenJobs(),
  goals: snapshot.goals.map(clone),
  interests: snapshot.interests
    .filter((item) => item.professionalId === professionalId)
    .map(clone),
  assignments: snapshot.assignments
    .filter((item) => item.professionalId === professionalId)
    .map(clone),
  receipts: snapshot.receipts
    .filter((receipt) =>
      snapshot.assignments.some(
        (assignment) =>
          assignment.id === receipt.assignmentId &&
          assignment.professionalId === professionalId,
      ),
    )
    .map(clone),
});

export const publishJobMock = (
  draft: Omit<PilotJob, "id" | "contractorFee" | "feeStatus" | "status">,
): MockResult => {
  const contractor = snapshot.contractors.find(
    (item) => item.id === draft.contractorId,
  );
  const user =
    contractor && snapshot.users.find((item) => item.id === contractor.userId);
  if (user?.accountStatus === "suspended_mock")
    return result(
      false,
      "A conta demonstrativa está suspensa e não pode publicar vagas.",
      "ACCOUNT_SUSPENDED",
    );
  const pricing = calculateJobPricing({
    quantity: draft.quantity,
    dailyRate: draft.dailyRate,
    planId: draft.planId,
  });
  snapshot.jobs.push({
    ...draft,
    id: id("job"),
    contractorFee: pricing.contractorFee,
    feeStatus: draft.planId === "pro" ? "not_applicable" : "pending_mock",
    status: draft.planId === "pro" ? "open" : "awaiting_fee_mock",
  });
  return result(
    true,
    draft.planId === "pro"
      ? "Demonstração concluída: vaga aberta sem cobrança real."
      : "Demonstração concluída: vaga aguardando confirmação fictícia da taxa.",
  );
};

export const confirmContractorFeeMock = (jobId: string): MockResult => {
  const job = snapshot.jobs.find((item) => item.id === jobId);
  if (!job)
    return result(false, "Vaga demonstrativa não encontrada.", "JOB_NOT_OPEN");
  if (job.feeStatus === "confirmed_mock")
    return result(true, "A taxa demonstrativa já foi confirmada.");
  job.feeStatus = "confirmed_mock";
  job.status = "open";
  return result(
    true,
    "Demonstração concluída: taxa fictícia confirmada e vaga aberta.",
  );
};

export const expressInterestMock = (
  jobId: string,
  professionalId = "mock-professional-1",
): MockResult => {
  const job = snapshot.jobs.find((item) => item.id === jobId);
  if (!job || !["open", "partially_filled"].includes(job.status))
    return result(
      false,
      "Esta diária não está mais disponível.",
      "JOB_NOT_OPEN",
    );
  const existing = snapshot.interests.find(
    (item) => item.jobId === jobId && item.professionalId === professionalId,
  );
  if (existing)
    return result(true, "Seu interesse demonstrativo já está registrado.");
  snapshot.interests.push({
    id: id("interest"),
    jobId,
    professionalId,
    status: "interested",
  });
  return result(
    true,
    "Interesse demonstrativo registrado. Nenhuma taxa foi gerada.",
  );
};

export const selectProfessionalMock = (interestId: string): MockResult => {
  const interest = snapshot.interests.find((item) => item.id === interestId);
  if (!interest)
    return result(
      false,
      "Interesse demonstrativo não encontrado.",
      "INVALID_TRANSITION",
    );
  interest.status = "selected";
  interest.selectedAt = new Date().toISOString();
  interest.confirmationDeadline = new Date(Date.now() + 86400000).toISOString();
  if (
    !snapshot.assignments.some(
      (item) =>
        item.jobId === interest.jobId &&
        item.professionalId === interest.professionalId,
    )
  )
    snapshot.assignments.push({
      id: id("assignment"),
      jobId: interest.jobId,
      professionalId: interest.professionalId,
      professionalFee: PROFESSIONAL_CONFIRMATION_FEE,
      feeStatus: "pending_mock",
      status: "awaiting_confirmation",
    });
  return result(
    true,
    "Profissional selecionado. A taxa fictícia de R$ 7,90 agora pode ser confirmada.",
  );
};

export const confirmProfessionalFeeMock = (
  assignmentId: string,
): MockResult => {
  const assignment = snapshot.assignments.find(
    (item) => item.id === assignmentId,
  );
  if (!assignment)
    return result(
      false,
      "A taxa só aparece depois da seleção.",
      "NOT_SELECTED",
    );
  if (
    assignment.status === "assigned" ||
    assignment.feeStatus === "confirmed_mock"
  )
    return result(true, "O trabalho demonstrativo já está confirmado.");
  const job = snapshot.jobs.find((item) => item.id === assignment.jobId)!;
  const active = snapshot.assignments.filter(
    (item) =>
      item.jobId === job.id &&
      ["assigned", "checked_in", "completed"].includes(item.status),
  ).length;
  if (active >= job.quantity)
    return result(
      false,
      "A última posição acabou de ser confirmada.",
      "POSITION_UNAVAILABLE",
    );
  assignment.feeStatus = "confirmed_mock";
  assignment.status = "assigned";
  assignment.confirmedAt = new Date().toISOString();
  if (active + 1 >= job.quantity) job.status = "filled";
  else job.status = "partially_filled";
  return result(
    true,
    "Demonstração concluída: R$ 7,90 fictícios confirmados e posição reservada.",
  );
};

export const checkInMock = (
  assignmentId: string,
  method: "phone_mock" | "qr_mock" = "phone_mock",
): MockResult => {
  const assignment = snapshot.assignments.find(
    (item) => item.id === assignmentId,
  );
  if (assignment?.status === "checked_in")
    return result(true, "O check-in demonstrativo já foi registrado.");
  if (!assignment || assignment.status !== "assigned")
    return result(
      false,
      "Confirme o trabalho demonstrativo primeiro.",
      "FEE_NOT_CONFIRMED",
    );
  assignment.status = "checked_in";
  if (!snapshot.checkIns.some((item) => item.assignmentId === assignmentId))
    snapshot.checkIns.push({
      id: id("checkin"),
      assignmentId,
      method,
      status: "confirmed_mock",
      createdAt: new Date().toISOString(),
    });
  return result(true, "Demonstração concluída: check-in fictício registrado.");
};

export const completeShiftMock = (assignmentId: string): MockResult => {
  const assignment = snapshot.assignments.find(
    (item) => item.id === assignmentId,
  );
  if (assignment?.status === "completed")
    return result(true, "O turno demonstrativo já foi finalizado.");
  if (!assignment || assignment.status !== "checked_in")
    return result(
      false,
      "Esta ação não está disponível neste momento.",
      "INVALID_TRANSITION",
    );
  assignment.status = "completed";
  if (!snapshot.receipts.some((item) => item.assignmentId === assignmentId)) {
    const job = snapshot.jobs.find((item) => item.id === assignment.jobId)!;
    const professional = snapshot.professionals.find(
      (item) => item.id === assignment.professionalId,
    )!;
    const user = snapshot.users.find(
      (item) => item.id === professional.userId,
    )!;
    const contractor = snapshot.contractors.find(
      (item) => item.id === job.contractorId,
    )!;
    snapshot.receipts.push({
      id: id("receipt"),
      assignmentId,
      contractorName: contractor.displayName,
      professionalName: user.name,
      dailyAmount: job.dailyRate,
      directPixConfirmed: true,
      issuedAt: new Date().toISOString(),
      disclaimer: "Demonstração — sem validade fiscal",
    });
  }
  return result(
    true,
    "Demonstração concluída: turno finalizado e recibo fictício disponível.",
  );
};

export const markNoShowMock = (assignmentId: string): MockResult => {
  const assignment = snapshot.assignments.find(
    (item) => item.id === assignmentId,
  );
  if (assignment?.status === "no_show")
    return result(true, "O no-show demonstrativo já foi registrado.");
  if (!assignment)
    return result(
      false,
      "Esta ação não está disponível neste momento.",
      "INVALID_TRANSITION",
    );
  assignment.status = "no_show";
  const job = snapshot.jobs.find((item) => item.id === assignment.jobId)!;
  job.status = "open";
  job.priorityMock = true;
  const professional = snapshot.professionals.find(
    (item) => item.id === assignment.professionalId,
  );
  if (professional) professional.noShowCount += 1;
  return result(
    true,
    "Demonstração concluída: no-show fictício registrado e posição reaberta.",
  );
};

export const toggleFavoriteMock = (
  contractorId: string,
  professionalId: string,
): MockResult => {
  const contractor = snapshot.contractors.find(
    (item) => item.id === contractorId,
  );
  if (!contractor)
    return result(
      false,
      "Contratante demonstrativo não encontrado.",
      "INVALID_TRANSITION",
    );
  contractor.favoriteProfessionalIds =
    contractor.favoriteProfessionalIds.includes(professionalId)
      ? contractor.favoriteProfessionalIds.filter(
          (item) => item !== professionalId,
        )
      : [...contractor.favoriteProfessionalIds, professionalId];
  return result(true, "Demonstração concluída: equipe favorita atualizada.");
};
