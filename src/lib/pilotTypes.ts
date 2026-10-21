export type PilotRole = "contractor" | "professional";
export type PlanId = "avulso" | "pro";
export type JobStatus = "draft" | "awaiting_fee_mock" | "open" | "partially_filled" | "filled" | "closed";
export type AssignmentStatus = "awaiting_confirmation" | "assigned" | "checked_in" | "completed" | "no_show";

export interface PilotUser {
  id: string;
  name: string;
  role: PilotRole;
  city: string;
  neighborhood: string;
  accountStatus: "active" | "suspended_mock";
}

export interface PilotPlan {
  id: PlanId;
  name: string;
  monthlyPrice: number;
  contractorFeeRate: number;
  trialDays: number;
  isMock: true;
}

export interface ContractorProfile {
  id: string;
  userId: string;
  displayName: string;
  planId: PlanId;
  trialEndsAt?: string;
  favoriteProfessionalIds: string[];
}

export interface ProfessionalProfile {
  id: string;
  userId: string;
  categoryIds: string[];
  roleLabel: string;
  rating: number;
  completedShifts: number;
  noShowCount: number;
  pixAlias: string;
}

export interface PilotJob {
  id: string;
  contractorId: string;
  categoryId: string;
  title: string;
  roleLabel: string;
  mode: "individual" | "team";
  location: string;
  neighborhood: string;
  startsAt: string;
  endsAt: string;
  quantity: number;
  dailyRate: number;
  note?: string;
  planId: PlanId;
  contractorFee: number;
  feeStatus: "not_applicable" | "pending_mock" | "confirmed_mock";
  status: JobStatus;
  priorityMock?: boolean;
}

export interface JobInterest {
  id: string;
  jobId: string;
  professionalId: string;
  status: "interested" | "selected" | "declined" | "expired";
  selectedAt?: string;
  confirmationDeadline?: string;
}

export interface Assignment {
  id: string;
  jobId: string;
  professionalId: string;
  professionalFee: number;
  feeStatus: "pending_mock" | "confirmed_mock" | "expired_mock";
  status: AssignmentStatus;
  confirmedAt?: string;
}

export interface PilotCheckIn {
  id: string;
  assignmentId: string;
  method: "phone_mock" | "qr_mock";
  status: "confirmed_mock" | "rejected_mock";
  createdAt: string;
}

export interface MockReceipt {
  id: string;
  assignmentId: string;
  contractorName: string;
  professionalName: string;
  dailyAmount: number;
  directPixConfirmed: boolean;
  issuedAt: string;
  disclaimer: "Demonstração — sem validade fiscal";
}

export interface PilotSnapshot {
  users: PilotUser[];
  contractors: ContractorProfile[];
  professionals: ProfessionalProfile[];
  plans: PilotPlan[];
  jobs: PilotJob[];
  interests: JobInterest[];
  assignments: Assignment[];
  checkIns: PilotCheckIn[];
  receipts: MockReceipt[];
  interestLocations: InterestLocation[];
  professionalPreferences: ProfessionalPreference[];
  goals: ProfessionalGoal[];
  progressEvents: ProgressEvent[];
  rewardProfiles: RewardProfile[];
}

export interface MockResult {
  success: boolean;
  snapshot: PilotSnapshot;
  message: string;
  mock: true;
  code?: string;
}

export interface MarketplaceJob extends PilotJob {
  approximateLatitude: number;
  approximateLongitude: number;
  locationPrecision: "neighborhood" | "venue";
}

export interface InterestLocation {
  id: string;
  contractorId: string;
  displayName: string;
  neighborhood: string;
  approximateLatitude: number;
  approximateLongitude: number;
  categoryIds: string[];
}

export interface ProfessionalPreference {
  id: string;
  professionalId: string;
  locationId: string;
  categoryId: string;
  status: "active" | "removed";
  createdAt: string;
  removedAt?: string;
}

export interface PreferenceAggregate { locationId: string; categoryId: string; count: number }
export interface ProfessionalGoal { id: string; title: string; description: string; metric: string; target: number; rewardPoints: number; badgeId?: string; status: "active" | "completed" }
export interface ProgressEvent { idempotencyKey: string; professionalId: string; goalId: string; kind: string; value: number; occurredAt: string }
export interface RewardProfile { professionalId: string; level: number; points: number; nextLevelAt: number; earnedBadgeIds: string[] }
export interface MapViewState { center: [number, number]; zoom: number; bounds?: GeoBounds; selectedJobId?: string; useVisibleBounds: boolean }
export interface GeoBounds { south: number; west: number; north: number; east: number }
