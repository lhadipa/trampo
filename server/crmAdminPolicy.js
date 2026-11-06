export const crmAdminPolicies = {
  users: { insert: false, update: { adminOnly: true, columns: ["blocked"] } },
  user_roles: { insert: false, update: false },
  payments: { insert: false, update: false },
  escrow: { insert: false, update: false },
  contracts: { insert: false, update: false },
  proposals: { insert: false, update: false },
  checkins: { insert: false, update: false },
};

export const crmAdminHiddenColumns = { users: ["password_hash"] };
export const crmListQueryContract = { select: "*", orderColumn: "created_at", ascending: false, limit: 500 };

export const canReadCrmGlobally = (user) => Boolean(user && !user.blocked && (user.type === "admin" || user.role === "admin"));

export const isAllowedUserUpdate = (user, payload) =>
  canReadCrmGlobally(user) && Object.keys(payload || {}).length > 0 && Object.keys(payload).every((key) => key === "blocked");
