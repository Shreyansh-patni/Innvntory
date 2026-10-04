/**
 * Session resolution and TenantContext construction.
 *
 * This is the join between authentication (identity) and Innvntory's authorization
 * model. It is the ONLY place a `TenantContext` is constructed from a session.
 */

import type { ActorId, Permission, TenantContext } from "@innvntory/shared";
import { fromAuthenticatedSession } from "@innvntory/shared";

import {
  type AuthorizationResult,
  type MembershipLookup,
  type PermissionLookup,
  resolvePermissions,
  verifyMembership,
} from "./authorization.js";
import {
  accountNotActive,
  organizationNotSelected,
  sessionExpired,
  unauthenticated,
} from "./errors.js";
import type { AuthProvider } from "./provider.js";
import { isExpired, type AuthenticatedSession } from "./types.js";

export interface SessionResolverDependencies {
  readonly provider: AuthProvider;
  readonly membershipLookup: MembershipLookup;
  readonly permissionLookup: PermissionLookup;
  /** Injected so tests can control time. */
  readonly now?: () => Date;
}

/**
 * Resolve the authenticated session from a request's cookies.
 *
 * Fails closed. Absence of a session is UNAUTHENTICATED, never an anonymous tenant
 * and never a fallback identity (ADR 0005 §7).
 */
export async function resolveAuthenticatedSession(
  deps: SessionResolverDependencies,
  cookies: Readonly<Record<string, string | undefined>>,
  correlationId: string,
): Promise<AuthenticatedSession> {
  const credential = deps.provider.readSessionCredential(cookies);

  if (!credential) {
    throw unauthenticated(correlationId);
  }

  const session = await deps.provider.resolveSession(credential);

  if (!session) {
    throw unauthenticated(correlationId);
  }

  // Expiry is re-checked here regardless of provider behaviour (ADR 0005 §9).
  const now = deps.now?.() ?? new Date();
  if (isExpired(session, now)) {
    throw sessionExpired(correlationId);
  }

  // Deliberately generic: does not reveal whether an account is suspended or deleted.
  if (session.authState !== "active") {
    throw accountNotActive(correlationId);
  }

  return session;
}

/**
 * Build authorization for the session's active organization.
 *
 * Requires an active organization. An authenticated user who has not selected one
 * has a valid session but NO tenant context, and tenant-scoped work must fail closed
 * rather than defaulting to some organization.
 */
export async function resolveAuthorization(
  deps: SessionResolverDependencies,
  session: AuthenticatedSession,
): Promise<AuthorizationResult> {
  // Defence in depth: a null session must fail closed with a typed error rather
  // than a raw TypeError. Found by the security-boundary tests.
  if (!session) {
    throw unauthenticated();
  }

  if (!session.activeOrganizationId) {
    throw organizationNotSelected(session.correlationId);
  }

  const membership = await verifyMembership(
    deps.membershipLookup,
    session.userId,
    session.activeOrganizationId,
    session.correlationId,
  );

  const permissions = await resolvePermissions(deps.permissionLookup, membership);

  return {
    organizationId: membership.organizationId,
    userId: membership.userId,
    roleId: membership.roleId,
    permissions,
  };
}

/**
 * Construct a `TenantContext` from a trusted session plus server-derived
 * authorization.
 *
 * Both halves are required. There is deliberately no overload that accepts a session
 * and invents permissions, and none that accepts permissions without a verified
 * organization — that is how a client-supplied permission list would slip in.
 */
export async function tenantContextFromSession(
  deps: SessionResolverDependencies,
  session: AuthenticatedSession,
): Promise<TenantContext> {
  if (!session) {
    throw unauthenticated();
  }

  const authorization = await resolveAuthorization(deps, session);

  return fromAuthenticatedSession({
    organizationId: authorization.organizationId,
    actorId: authorization.userId as ActorId,
    roleId: authorization.roleId,
    // Server-derived only. Never a session claim, never a request.
    permissions: authorization.permissions as readonly Permission[],
    correlationId: session.correlationId,
  });
}

/**
 * The complete path: cookies → session → TenantContext.
 */
export async function requireTenantContextFromRequest(
  deps: SessionResolverDependencies,
  cookies: Readonly<Record<string, string | undefined>>,
  correlationId: string,
): Promise<{ session: AuthenticatedSession; tenantContext: TenantContext }> {
  const session = await resolveAuthenticatedSession(deps, cookies, correlationId);
  const tenantContext = await tenantContextFromSession(deps, session);
  return { session, tenantContext };
}

/**
 * Revoke the current session. Idempotent.
 */
export async function revokeCurrentSession(
  provider: AuthProvider,
  session: AuthenticatedSession,
): Promise<void> {
  await provider.revokeSession(session.sessionId);
}