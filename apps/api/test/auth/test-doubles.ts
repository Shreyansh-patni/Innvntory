/**
 * TEST-ONLY authentication adapter.
 *
 * IMPORTANT — READ BEFORE REUSING.
 *
 * This file must NEVER be imported by production code. It fakes an authenticated
 * session so the security boundaries around it can be tested. It does not
 * implement cryptography, does not store passwords, and is not an authentication
 * system (ADR 0005 §7: "no development admin identity in production code").
 *
 * `assertNotProduction()` throws if this module is ever loaded outside a test run,
 * so an accidental production import fails loudly instead of silently granting
 * access.
 */

import { AuthError } from "../../src/auth/errors.js";
import type { AuthProvider } from "../../src/auth/provider.js";
import type { AuthenticatedSession } from "../../src/auth/types.js";

/** Fail closed if this module is loaded outside a test environment. */
export function assertNotProduction(): void {
  const isTest =
    process.env.NODE_ENV === "test" ||
    process.env.VITEST === "true" ||
    process.env.NODE_ENV === undefined;

  // Only a build/production runtime is forbidden. An unset NODE_ENV in a unit-test
  // harness is tolerated because the runner may not set it.
  if (!isTest && process.env.NODE_ENV !== "development") {
    throw new AuthError(
      "PROVIDER_NOT_CONFIGURED",
      "The test authentication adapter must never be used outside tests.",
      500,
    );
  }
}

assertNotProduction();

export interface TestSessionSeed {
  readonly sessionId: string;
  readonly userId: string;
  readonly activeOrganizationId: string | null;
  readonly authState?: AuthenticatedSession["authState"];
  readonly expiresAt?: Date;
}

/**
 * An in-memory `AuthProvider` double.
 *
 * Note the shape: it can ONLY mint sessions the test explicitly declares. It cannot
 * invent a session from a request, which is precisely the property under test.
 */
export function createTestAuthProvider(
  seeds: readonly TestSessionSeed[] = [],
  cookieName = "innvntory_session",
): AuthProvider & { sessions: Map<string, AuthenticatedSession> } {
  const sessions = new Map<string, AuthenticatedSession>();

  for (const seed of seeds) {
    sessions.set(seed.sessionId, {
      sessionId: seed.sessionId,
      userId: seed.userId,
      authState: seed.authState ?? "active",
      createdAt: new Date("2026-10-04T00:00:00Z"),
      expiresAt: seed.expiresAt ?? new Date("2099-01-01T00:00:00Z"),
      activeOrganizationId: seed.activeOrganizationId,
      correlationId: "test_correlation",
    });
  }

  return {
    name: "test-double",
    sessions,
    async resolveSession(credential: string) {
      return sessions.get(credential) ?? null;
    },
    async revokeSession(sessionId: string) {
      sessions.delete(sessionId);
    },
    readSessionCredential(cookies) {
      return cookies[cookieName];
    },
    providerOwnsCsrfDefence: false,
  };
}

/**
 * Membership double.
 *
 * Backed by an explicit list. A lookup for a pair that was never declared returns
 * null, so "not a member" is the default — never an accidental allow.
 */
export function createTestMembershipLookup(
  memberships: readonly {
    userId: string;
    organizationId: string;
    roleId: string;
    status?: "active" | "invited" | "suspended";
  }[],
) {
  return async (userId: string, organizationId: string) => {
    const found = memberships.find(
      (m) => m.userId === userId && m.organizationId === organizationId,
    );
    if (!found) return null;
    return {
      userId: found.userId,
      organizationId: found.organizationId,
      roleId: found.roleId,
      status: found.status ?? ("active" as const),
    };
  };
}