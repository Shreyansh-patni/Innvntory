/**
 * Organization switching.
 *
 * ADR 0005 §4. The control that makes multi-tenancy safe at the session layer.
 *
 * A request carrying an `organizationId` is a REQUEST TO SWITCH. It is never proof
 * of membership. Membership is verified server-side before any session state changes,
 * so a client cannot escalate by sending another organization's id.
 */

import type { ActorId, Permission, TenantContext } from "@innvntory/shared";

import {
  type Membership,
  type MembershipLookup,
  type PermissionLookup,
  resolvePermissions,
  verifyMembership,
} from "./authorization.js";
import {
  unauthenticated,
  untrustedIdentitySource,
} from "./errors.js";
import type { AuthenticatedSession } from "./types.js";

/**
 * Persists session state changes server-side.
 *
 * Injected so this module has no storage implementation of its own. A real
 * implementation must rotate the session identifier when the active organization
 * changes — that is session-fixation defence (ADR 0005 §9).
 */
export type SessionStateWriter = (
  session: AuthenticatedSession,
) => Promise<AuthenticatedSession>;

export interface SwitchOrganizationDependencies {
  readonly membershipLookup: MembershipLookup;
  readonly permissionLookup: PermissionLookup;
  readonly sessionStateWriter: SessionStateWriter;
}

export interface SwitchOrganizationResult {
  readonly session: AuthenticatedSession;
  readonly tenantContext: TenantContext;
}

/**
 * Switch the session's active organization.
 *
 * Order matters and is not incidental:
 *   1. authenticate      — no session, no switch
 *   2. verify membership — server-side lookup, active only
 *   3. persist state     — via the injected writer
 *   4. build context     — from server-derived permissions
 *
 * There is intentionally no path that sets `activeOrganizationId` without step 2.
 */
export async function switchOrganization(
  deps: SwitchOrganizationDependencies,
  session: AuthenticatedSession,
  targetOrganizationId: string,
  now: () => Date = () => new Date(),
): Promise<SwitchOrganizationResult> {
  // 1. Authenticate.
  if (!session || !session.userId) {
    throw unauthenticated();
  }

  if (!targetOrganizationId) {
    throw untrustedIdentitySource("request body organizationId");
  }

  // 2. Verify membership server-side. This is the control that prevents a client
  //    from becoming any organization it can name.
  const membership: Membership = await verifyMembership(
    deps.membershipLookup,
    session.userId,
    targetOrganizationId,
    session.correlationId,
  );

  // 3. Persist. The writer is responsible for session-id rotation.
  const updatedSession = await deps.sessionStateWriter({
    ...session,
    activeOrganizationId: membership.organizationId,
  });

  // 4. Derive permissions server-side. Never from a claim or the request.
  const permissions: readonly Permission[] = await resolvePermissions(
    deps.permissionLookup,
    membership,
  );

  return {
    session: updatedSession,
    tenantContext: buildTenantContext(updatedSession, membership, permissions),
  };
}

function buildTenantContext(
  session: AuthenticatedSession,
  membership: Membership,
  permissions: readonly Permission[],
): TenantContext {
  return {
    organizationId: membership.organizationId as TenantContext["organizationId"],
    actorId: membership.userId as ActorId,
    roleId: membership.roleId as TenantContext["roleId"],
    actorType: "user",
    permissions: Object.freeze([...permissions]),
    correlationId: session.correlationId,
  } as TenantContext;
}

/**
 * Reject identity read from a request.
 *
 * Exists so that `actorId` / `organizationId` / `permissions` taken from a body or
 * query fail loudly and immediately rather than silently being ignored. Tests assert
 * that this is what happens.
 */
export function rejectIdentityFromRequest(field: string): never {
  throw untrustedIdentitySource(`request ${field}`);
}