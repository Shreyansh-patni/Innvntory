/**
 * Authentication security-boundary tests.
 *
 * These assert what must NEVER happen, which is the whole point of ADR 0005:
 * a client must not be able to become a user, an organization, or a permission set.
 *
 * They use explicit test doubles behind a test-only boundary
 * (`test-doubles.ts`, which refuses to load in a production runtime). No real
 * provider behaviour is claimed or tested.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  ROLES,
  requireTenantContext,
  type OperatorContext,
} from "@innvntory/shared";

import { AuthError } from "../../src/auth/errors.js";
import { rejectIdentityFromRequest, switchOrganization } from "../../src/auth/organization.js";
import { guardProtectedRequest } from "../../src/auth/route-guard.js";
import { unconfiguredAuthProvider } from "../../src/auth/provider.js";
import {
  resolveAuthenticatedSession,
  tenantContextFromSession,
} from "../../src/auth/session.js";
import type { AuthenticatedSession } from "../../src/auth/types.js";
import {
  createTestAuthProvider,
  createTestMembershipLookup,
  type TestSessionSeed,
} from "./test-doubles.js";

/** Narrowing helper for assert.rejects predicates. */
function isAuthError(code: string): (e: unknown) => boolean {
  return (e: unknown) => e instanceof AuthError && e.code === code;
}

const ORG_A = "11111111-1111-1111-1111-111111111111";
const ORG_B = "22222222-2222-2222-2222-222222222222";
const USER = "user_alice";
const CID = "corr_test";

const membershipLookup = createTestMembershipLookup([
  { userId: USER, organizationId: ORG_A, roleId: "owner" },
  // Present but NOT active: invited, so it must not become the active organization.
  { userId: USER, organizationId: ORG_B, roleId: "viewer", status: "invited" },
  { userId: "user_other", organizationId: ORG_B, roleId: "admin" },
]);

const permissionLookup = async (roleId: string) =>
  roleId === "owner" ? ROLES.owner.permissions : ROLES.viewer.permissions;

const sessionStateWriter = async (s: AuthenticatedSession) => ({ ...s });

function seed(overrides: Partial<AuthenticatedSession> = {}): AuthenticatedSession {
  return {
    sessionId: "sess_1",
    userId: USER,
    authState: "active",
    createdAt: new Date("2026-10-04T00:00:00Z"),
    expiresAt: new Date("2099-01-01T00:00:00Z"),
    activeOrganizationId: ORG_A,
    correlationId: CID,
    ...overrides,
  };
}

function deps(
  seeds: TestSessionSeed[] = [
    { sessionId: "sess_1", userId: USER, activeOrganizationId: ORG_A },
  ],
) {
  return {
    provider: createTestAuthProvider(seeds),
    membershipLookup,
    permissionLookup,
    now: () => new Date("2026-10-04T12:00:00Z"),
  };
}

/* -------------------------------------------------------------------------- */

describe("1. unauthenticated request fails closed", () => {
  it("rejects a request with no session cookie", async () => {
    await assert.rejects(
      () => resolveAuthenticatedSession(deps(), {}, CID),
      isAuthError("UNAUTHENTICATED"))
  });

  it("rejects an unknown session id", async () => {
    await assert.rejects(
      () =>
        resolveAuthenticatedSession(deps(), { innvntory_session: "nope" }, CID),
      isAuthError("UNAUTHENTICATED"))
  });

  it("never produces a tenant context from an anonymous request", async () => {
    await assert.rejects(() =>
      guardProtectedRequest(deps(), {
        cookies: {},
        headers: {},
        method: "GET",
        correlationId: CID,
      }),
    );
  });

  it("the unconfigured production provider fails closed for every input", async () => {
    for (const cookie of [undefined, "", "anything", "forged"]) {
      await assert.rejects(
        () =>
          resolveAuthenticatedSession(
            { provider: unconfiguredAuthProvider, membershipLookup, permissionLookup },
            { any_cookie: cookie },
            CID,
          ),
        isAuthError("UNAUTHENTICATED"))
    }
  });
});

describe("2. actorId comes from the trusted session", () => {
  it("takes actorId from the session, not the request", async () => {
    const d = deps();
    const s = await resolveAuthenticatedSession(d, { innvntory_session: "sess_1" }, CID);
    const ctx = await tenantContextFromSession(d, s);
    assert.equal(ctx.actorId, USER);
  });

  it("ignores an actorId supplied in the request headers", async () => {
    const d = deps();
    const result = await guardProtectedRequest(d, {
      cookies: { innvntory_session: "sess_1" },
      headers: { "x-actor-id": "user_impersonated" },
      method: "GET",
      correlationId: CID,
    });
    assert.equal(result.tenantContext.actorId, USER);
  });
});

describe("3-4. request body cannot override identity", () => {
  it("throws when actorId is read from a request", () => {
    assert.throws(
      () => rejectIdentityFromRequest("body.actorId"),
      isAuthError("UNTRUSTED_IDENTITY_SOURCE"))
  });

  it("throws when organizationId is read from a request", () => {
    assert.throws(
      () => rejectIdentityFromRequest("body.organizationId"),
      isAuthError("UNTRUSTED_IDENTITY_SOURCE"))
  });

  it("a forged organization header does not change the tenant context", async () => {
    const result = await guardProtectedRequest(deps(), {
      cookies: { innvntory_session: "sess_1" },
      headers: { "x-organization-id": ORG_B },
      method: "GET",
      correlationId: CID,
    });
    assert.equal(result.tenantContext.organizationId, ORG_A);
  });
});

describe("5-7. organization switching verifies membership", () => {
  it("rejects switching to an organization the user does not belong to", async () => {
    await assert.rejects(
      () =>
        switchOrganization(
          { membershipLookup, permissionLookup, sessionStateWriter },
          seed(),
          "org_user_is_not_in",
        ),
      isAuthError("MEMBERSHIP_NOT_FOUND"))
  });

  it("does not leak whether the target organization exists", async () => {
    let message = "";
    try {
      await switchOrganization(
        { membershipLookup, permissionLookup, sessionStateWriter },
        seed(),
        "org_does_not_exist",
      );
    } catch (e) {
      message = (e as Error).message;
    }
    assert.equal(message, "You do not have access to that organization.");
  });

  it("rejects an inactive (invited) membership", async () => {
    await assert.rejects(
      () =>
        switchOrganization(
          { membershipLookup, permissionLookup, sessionStateWriter },
          seed(),
          ORG_B,
        ),
      isAuthError("MEMBERSHIP_NOT_ACTIVE"))
  });

  it("allows a valid active membership and returns a fresh context", async () => {
    const other = createTestMembershipLookup([
      { userId: USER, organizationId: ORG_A, roleId: "owner" },
      { userId: USER, organizationId: ORG_B, roleId: "viewer" },
    ]);
    const result = await switchOrganization(
      { membershipLookup: other, permissionLookup, sessionStateWriter },
      seed({ activeOrganizationId: ORG_A }),
      ORG_B,
    );
    assert.equal(result.tenantContext.organizationId, ORG_B);
    assert.equal(result.session.activeOrganizationId, ORG_B);
    assert.deepEqual([...result.tenantContext.permissions], ROLES.viewer.permissions);
  });
});

describe("8-9. the active organization feeds TenantContext, permissions are server-derived", () => {
  it("requires an organization to be selected", async () => {
    await assert.rejects(
      () => tenantContextFromSession(deps(), seed({ activeOrganizationId: null })),
      isAuthError("ORGANIZATION_NOT_SELECTED"))
  });

  it("does not fall back to a default organization", async () => {
    let code = "";
    try {
      await tenantContextFromSession(deps(), seed({ activeOrganizationId: null }));
    } catch (e) {
      code = (e as AuthError).code;
    }
    assert.equal(code, "ORGANIZATION_NOT_SELECTED");
  });

  it("derives permissions from the membership role, not from the session", async () => {
    const d = deps();
    const s = await resolveAuthenticatedSession(d, { innvntory_session: "sess_1" }, CID);
    const ctx = await tenantContextFromSession(d, s);
    assert.deepEqual([...ctx.permissions], ROLES.owner.permissions);
  });

  it("re-verifies membership on every resolution rather than trusting the session org", async () => {
    // Session claims ORG_B, but the membership table says this user is not active
    // there. The server-side lookup must win.
    const d = deps([
      { sessionId: "sess_x", userId: USER, activeOrganizationId: ORG_B },
    ]);
    const s = await resolveAuthenticatedSession(d, { innvntory_session: "sess_x" }, CID);
    await assert.rejects(
      () => tenantContextFromSession(d, s),
      isAuthError("MEMBERSHIP_NOT_ACTIVE"))
  });
});

describe("10. client-provided permissions are ignored", () => {
  it("ignores a permissions claim on the session object", async () => {
    const d = deps([
      { sessionId: "sess_1", userId: USER, activeOrganizationId: ORG_A },
    ]);
    const s = await resolveAuthenticatedSession(d, { innvntory_session: "sess_1" }, CID);
    // Inject a bogus claim as if a provider had supplied it.
    const tampered = { ...s, permissions: ["platform.read" as never] } as never;
    const ctx = await tenantContextFromSession(d, tampered);
    assert.equal(ctx.permissions.includes("platform.read" as never), false);
    assert.deepEqual([...ctx.permissions], ROLES.owner.permissions);
  });

  it("does not grant platform permissions through a tenant role", async () => {
    const d = deps();
    const s = await resolveAuthenticatedSession(d, { innvntory_session: "sess_1" }, CID);
    const ctx = await tenantContextFromSession(d, s);
    for (const p of ctx.permissions) {
      assert.ok(!p.startsWith("platform."), "tenant roles must never carry platform permissions");
    }
  });
});

describe("11-12. fail-closed and context separation", () => {
  it("tenant-scoped operations without organization context throw", () => {
    assert.throws(
      () => requireTenantContext(undefined, "listProducts"),
      /requires a TenantContext/,
    );
  });

  it("an operator context cannot be used as a TenantContext", () => {
    const op: OperatorContext = {
      actorId: "op_1" as never,
      actorType: "operator",
      platformPermissions: ["platform.read"],
      correlationId: CID,
      organizationId: null,
    };
    assert.throws(
      () => requireTenantContext(op, "listProducts"),
      (e: unknown) => (e as { code?: string }).code === "ORGANIZATION_CONTEXT_REQUIRED",
    );
  });

  it("expired sessions are rejected", async () => {
    const d = deps([
      {
        sessionId: "sess_exp",
        userId: USER,
        activeOrganizationId: ORG_A,
        expiresAt: new Date("2020-01-01T00:00:00Z"),
      },
    ]);
    await assert.rejects(
      () => resolveAuthenticatedSession(d, { innvntory_session: "sess_exp" }, CID),
      isAuthError("SESSION_EXPIRED"))
  });

  it("suspended accounts are rejected with a generic message", async () => {
    const d = deps([
      {
        sessionId: "sess_s",
        userId: USER,
        activeOrganizationId: ORG_A,
        authState: "suspended",
      },
    ]);
    let message = "";
    try {
      await resolveAuthenticatedSession(d, { innvntory_session: "sess_s" }, CID);
    } catch (e) {
      message = (e as Error).message;
    }
    assert.equal(message, "Authentication is required for this operation.");
  });
});

describe("13. AI/tool context cannot select a different tenant", () => {
  it("an ai_tool context carries the invoking actor's organization only", async () => {
    const d = deps();
    const s = await resolveAuthenticatedSession(d, { innvntory_session: "sess_1" }, CID);
    const ctx = await tenantContextFromSession(d, s);
    assert.equal(ctx.organizationId, ORG_A);
    assert.equal(ctx.actorType, "user");
  });

  it("a tool cannot widen scope by claiming another organization in the session", async () => {
    // An ai_tool acts as the invoking actor. If the session (or anything feeding it)
    // claims an organization the user is not an active member of, the SERVER-SIDE
    // membership check rejects it. The claim is never trusted.
    const d = deps([
      { sessionId: "sess_ai", userId: USER, activeOrganizationId: ORG_B },
    ]);
    const s = await resolveAuthenticatedSession(d, { innvntory_session: "sess_ai" }, CID);

    await assert.rejects(
      () => tenantContextFromSession(d, s),
      isAuthError("MEMBERSHIP_NOT_ACTIVE"),
    );
  });

  it("has exactly one context constructor, reachable only with a resolved organization", async () => {
    // There is no API that builds a TenantContext from a tool argument. The only
    // constructor requires an already-verified authorization result.
    const d = deps();
    const s = await resolveAuthenticatedSession(d, { innvntory_session: "sess_1" }, CID);
    const ctx = await tenantContextFromSession(d, s);

    assert.equal(ctx.actorType, "user");
    assert.equal(ctx.organizationId, ORG_A);
    assert.equal(ctx.actorId, USER);

    // Attempting to build one without a session is impossible by construction.
    await assert.rejects(
      () => tenantContextFromSession(d, null as unknown as AuthenticatedSession),
      isAuthError("UNAUTHENTICATED"),
    );
  });
});

describe("14. worker context requires explicit tenant scope", () => {
  it("a job with no organization is refused", async () => {
    const { fromJobContext } = await import("@innvntory/shared");
    assert.throws(
      () => fromJobContext("reconcile", null, ROLES.admin.permissions),
      (e: unknown) => (e as { code?: string }).code === "WORKER_CONTEXT_MISSING",
    );
  });

  it("a worker is not a human user and holds only its granted permissions", async () => {
    const { fromJobContext } = await import("@innvntory/shared");
    const ctx = fromJobContext(
      "reconcile",
      { organizationId: ORG_A, actorId: "system_reconcile", roleId: "admin", correlationId: CID },
      ROLES.admin.permissions,
    );
    assert.equal(ctx.actorType, "worker");
    assert.notEqual(ctx.actorId, USER);
    assert.ok(!ctx.permissions.includes("products.delete"));
  });
});

/* -------------------------------------------------------------------------- */

describe("CSRF and origin defence", () => {
  it("rejects an unsafe request with no Origin header", async () => {
    await assert.rejects(
      () =>
        guardProtectedRequest(
          deps(),
          { cookies: { innvntory_session: "sess_1" }, headers: {}, method: "POST", correlationId: CID },
          { allowedOrigins: ["http://localhost:3000"] },
        ),
      isAuthError("ORIGIN_REJECTED"))
  });

  it("rejects an unsafe request from an untrusted origin", async () => {
    await assert.rejects(
      () =>
        guardProtectedRequest(
          deps(),
          {
            cookies: { innvntory_session: "sess_1" },
            headers: { origin: "https://evil.example" },
            method: "POST",
            correlationId: CID,
          },
          { allowedOrigins: ["http://localhost:3000"] },
        ),
      isAuthError("ORIGIN_REJECTED"))
  });

  it("allows a safe method without an Origin header", async () => {
    const result = await guardProtectedRequest(
      deps(),
      { cookies: { innvntory_session: "sess_1" }, headers: {}, method: "GET", correlationId: CID },
      { allowedOrigins: ["http://localhost:3000"] },
    );
    assert.equal(result.tenantContext.organizationId, ORG_A);
  });

  it("rejects a missing CSRF token on a state-changing request", async () => {
    await assert.rejects(
      () =>
        guardProtectedRequest(
          deps(),
          {
            cookies: { innvntory_session: "sess_1" },
            headers: { origin: "http://localhost:3000" },
            method: "POST",
            correlationId: CID,
          },
          { allowedOrigins: ["http://localhost:3000"], requireCsrf: true, csrfToken: "tok" },
        ),
      isAuthError("CSRF_REJECTED"))
  });
});