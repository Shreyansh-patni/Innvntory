/**
 * Authentication boundary.
 *
 * STATUS: placeholder. Authentication has NOT been architecturally specified yet
 * (docs/ARCHITECTURE.md §15 row 4 — auth provider and session strategy are open).
 * This module therefore defines the INTERFACE that a real authenticator will
 * populate, and returns no fabricated identity.
 *
 * It deliberately does NOT read an organization id from a request body, query
 * parameter, or header supplied by the caller. `resolveSession` receives the raw
 * session cookie only, and whatever it returns must come from a trusted store.
 */

import type { ActorId, Permission, TenantContext } from "@innvntory/shared";
import {
  fromAuthenticatedSession,
  missingTenantContext,
  untrustedOrganizationSource,
} from "@innvntory/shared";

/**
 * What a real authenticator must supply.
 *
 * Every field here is expected to be resolved from a trusted source. The active
 * organization comes from the session (ADR 0004 Q6); it is never taken from
 * request input.
 */
export interface ResolvedSession {
  readonly userId: string;
  readonly activeOrganizationId: string;
  readonly roleId: string;
  readonly permissions: readonly Permission[];
  readonly correlationId: string;
}

/** A session store implementation, injected. Keeps this module testable. */
export type SessionResolver = (
  sessionToken: string,
) => Promise<ResolvedSession | null>;

/**
 * Resolve a `TenantContext` from a session token.
 *
 * Throws when there is no session, and when the session resolves but carries no
 * active organization — that is a fail-closed condition, never an invitation to
 * fall back to cross-tenant access (ADR 0004 Q2).
 */
export async function resolveTenantContext(
  resolveSession: SessionResolver,
  sessionToken: string | undefined,
  operation: string,
): Promise<TenantContext> {
  if (!sessionToken) {
    throw missingTenantContext(operation);
  }

  const session = await resolveSession(sessionToken);
  if (!session) {
    throw missingTenantContext(operation);
  }

  if (!session.activeOrganizationId) {
    throw missingTenantContext(operation);
  }

  return fromAuthenticatedSession({
    organizationId: session.activeOrganizationId,
    actorId: session.userId as ActorId,
    roleId: session.roleId,
    permissions: session.permissions,
    correlationId: session.correlationId,
  });
}

/**
 * Read an organization id from an UNTRUSTED source.
 *
 * Exists so that misusing request input fails loudly. Use
 * `resolveTenantContext` for real authorisation; this helper only exists to reject
 * the pattern.
 */
export function rejectUntrustedOrganizationId(_source: string): never {
  throw untrustedOrganizationSource(_source);
}

/**
 * No authenticator is wired yet.
 *
 * Returning null makes every authenticated route fail closed with
 * TENANT_CONTEXT_MISSING until a real provider is chosen and implemented.
 */
export const unconfiguredSessionResolver: SessionResolver = async () => null;