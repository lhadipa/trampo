import { describe, expect, it } from "vitest";
import { canReadCrmGlobally, crmAdminHiddenColumns, crmAdminPolicies, crmListQueryContract, isAllowedUserUpdate } from "./crmAdminPolicy.js";

describe("CRM admin API policy contract", () => {
  it("requires an administrator for global reads", () => {
    expect(canReadCrmGlobally({ type: "admin" })).toBe(true);
    expect(canReadCrmGlobally({ type: "empresa" })).toBe(false);
    expect(canReadCrmGlobally({ type: "admin", blocked: true })).toBe(false);
    expect(canReadCrmGlobally(null)).toBe(false);
  });

  it("never exposes password hashes and only permits blocked updates", () => {
    expect(crmAdminHiddenColumns.users).toContain("password_hash");
    expect(crmAdminPolicies.users.update.columns).toEqual(["blocked"]);
    expect(isAllowedUserUpdate({ type: "admin" }, { blocked: true })).toBe(true);
    expect(isAllowedUserUpdate({ type: "admin" }, { name: "changed" })).toBe(false);
    expect(isAllowedUserUpdate({ type: "empresa" }, { blocked: true })).toBe(false);
  });

  it("keeps list reads bounded and ordered", () => {
    expect(crmListQueryContract).toEqual({ select: "*", orderColumn: "created_at", ascending: false, limit: 500 });
  });
});
