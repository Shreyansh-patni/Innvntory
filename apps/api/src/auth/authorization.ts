/**
 * Authorization — Innvntory-owned.
 *
 * ADR 0005 §6. This module is the ONLY source of effective permissions.
 *
 * Provider role/permission claims are deliberately not consulted anywhere here. The
 * derivation is:
 *
 *   authenticated user + active organization + membership + assigned role
 *                     + role permissions
 *
 * Data comes from Innvntory's own tables (ADR 0004 Q6): `roles`, `permissions`,
 * `role_permissions`, and the organization-scoped assignment on
 * `organization_memberships`.
 */

import type { Permission } from "@innvntory/shared";
import { requirePermissions } from "@innvntory/shared";

import { AuthError } from "./errors.js";

/**
 * A membership, as stored by Innvntory.
 *
 * `status` is the organization-scoped lifecycle state. Only `active` may become the
 * active organization (ADR 0005 §4).
 */
export interface Membership {
  readonly organizationId: string;
  readonly userId: string;
  readonly roleId: string;
  readonly status: "active" | "invited" | "suspended";
}

/**
 * Server-side membership lookup.
 *
 * Injected rather than imported so the boundary is testable and so this module
 * contains no data access of its own.
 */
export type MembershipLookup = (
  userId: string,
  organizationId: string,
) => Promise<Membership | null>;

/** Server-side permission resolution for a membership's role. */
export type PermissionLookup = (
  roleId: string,
) => Promise<readonly Permission[]>;

export interface AuthorizationResult {
  readonly organizationId: string;
  readonly userId: string;
  readonly roleId: string;
  readonly permissions: readonly Permission[];
}

/**
 * Verify membership in a target organization.
 *
 * Membership is ALWAYS verified server-side. A client-supplied organizationId is a
 * request to switch, never evidence of access (ADR 0005 §4). This is the single most
 * important control in the authentication design.
 */
export async function verifyMembership(
  lookup: MembershipLookup,
  userId: string,
  organizationId: string,
  correlationId?: string,
): Promise<Membership> {
  const membership = await lookup(userId, organizationId);

  if (!membership) {
    // Generic message: does not reveal whether the organization exists.
    throw new AuthError(
      "MEMBERSHIP_NOT_FOUND",
      "You do not have access to that organization.",
      403,
      correlationId,
    );
  }

  if (membership.status !== "active") {
    throw new AuthError(
      "MEMBERSHIP_NOT_ACTIVE",
      "You do not have access to that organization.",
      403,
      correlationId,
    );
  }

  return membership;
}

/**
 * Resolve effective permissions from Innvntory's own tables.
 *
 * Never from a session claim, never from a request.
 */
export async function resolvePermissions(
  permissionLookup: PermissionLookup,
  membership: Membership,
): Promise<readonly Permission[]> {
  return permissionLookup(membership.roleId);
}

/** Assert the actor holds every required permission. Delegates to the shared guard. */
export function assertPermissions(
  ctx: { permissions: readonly Permission[]; correlationId: string },
  operation: string,
  required: readonly Permission[],
): void {
  requirePermissions(
    ctx as Parameters<typeof requirePermissions>[0],
    operation,
    required,
  );
}