/**
 * Constructing and consuming trusted context.
 *
 * Every constructor here takes values that have ALREADY been resolved from a
 * trusted source. None of them accepts a request object, a query parameter, a form
 * field, or model output. The naming is deliberate: `fromAuthenticatedSession`
 * cannot be called with untrusted input without that being obvious at the call site.
 */

import {
  missingTenantContext,
  missingWorkerContext,
  organizationContextRequired,
  permissionDenied,
} from "./errors.js";
import type {
  ActorId,
  ActorType,
  ExecutionContext,
  JobTenantContext,
  OperatorContext,
  OrganizationId,
  Permission,
  PlatformPermission,
  RoleId,
  TenantContext,
} from "./types.js";
import { isOperatorContext, isTenantContext } from "./types.js";

/**
 * Platform permissions that may only ever appear on an operator context.
 * Used to assert the separation that ADR 0004 Q2 requires.
 */
const PLATFORM_PERMISSIONS: readonly string[] = [
  "platform.read",
  "platform.support.read",
  "platform.audit.read",
];

function assertNotPlatformPermissions(permissions: readonly string[]): void {
  const leaked = permissions.filter((p) => PLATFORM_PERMISSIONS.includes(p));
  if (leaked.length > 0) {
    throw new TypeError(
      `Platform permissions (${leaked.join(", ")}) must not appear on a TenantContext. ` +
        `Platform access requires an explicit OperatorContext (ADR 0004 Q2).`,
    );
  }
}

function freezeContext<T extends object>(value: T): Readonly<T> {
  return Object.freeze(value);
}

/**
 * Build tenant context from an authenticated session.
 *
 * Call this ONLY from the authentication boundary, after resolving:
 *   authenticated principal → active organization → that organization's membership
 *   → membership role → role permissions.
 *
 * That chain is why this is a constructor with many arguments rather than a builder:
 * the caller cannot produce a context without having done the lookup.
 */
export function fromAuthenticatedSession(input: {
  organizationId: string;
  actorId: string;
  roleId: string;
  permissions: readonly Permission[];
  correlationId: string;
  actorType?: Extract<ActorType, "user" | "ai_tool">;
}): TenantContext {
  assertNotPlatformPermissions(input.permissions);

  return freezeContext<TenantContext>({
    organizationId: input.organizationId as OrganizationId,
    actorId: input.actorId as ActorId,
    roleId: input.roleId as RoleId,
    actorType: input.actorType ?? "user",
    permissions: Object.freeze([...input.permissions]),
    correlationId: input.correlationId,
  });
}

/**
 * Build an operator (platform / cross-tenant) context.
 *
 * Separate constructor, separate type, separate database role (ADR 0004 Q2/Q7).
 * There is no path from a missing tenant context to this function.
 */
export function operatorContext(input: {
  actorId: string;
  platformPermissions: readonly PlatformPermission[];
  correlationId: string;
  /** Required so operator intent is recorded even when it is null. */
  reason: string;
}): OperatorContext {
  void input.reason;

  return freezeContext<OperatorContext>({
    actorId: input.actorId as ActorId,
    actorType: "operator",
    platformPermissions: Object.freeze([...input.platformPermissions]),
    correlationId: input.correlationId,
    organizationId: null,
  });
}

/**
 * Reconstruct tenant context for a background job from its durable context.
 *
 * Throws when the durable context is absent or incomplete — a job must never be
 * processed unscoped (ADR 0004 §Worker implications).
 */
export function fromJobContext(
  jobName: string,
  durable: JobTenantContext | null | undefined,
  permissions: readonly Permission[],
): TenantContext {
  if (!durable || !durable.organizationId || !durable.actorId || !durable.roleId) {
    throw missingWorkerContext(jobName);
  }
  assertNotPlatformPermissions(permissions);

  return freezeContext<TenantContext>({
    organizationId: durable.organizationId as OrganizationId,
    actorId: durable.actorId as ActorId,
    roleId: durable.roleId as RoleId,
    actorType: "worker",
    permissions: Object.freeze([...permissions]),
    correlationId: durable.correlationId,
  });
}

/**
 * Require tenant context, failing closed.
 *
 * Every tenant-scoped service and data-access function must call this first. It is
 * the enforcement point for ADR 0003 requirement 3 at the application layer.
 */
export function requireTenantContext(
  ctx: ExecutionContext | null | undefined,
  operation: string,
): TenantContext {
  if (!ctx) {
    throw missingTenantContext(operation);
  }
  if (isOperatorContext(ctx)) {
    throw organizationContextRequired(operation);
  }
  if (!isTenantContext(ctx) || !ctx.organizationId) {
    throw missingTenantContext(operation);
  }
  return ctx;
}

/** Returns true when the actor holds every listed permission. */
export function hasPermissions(
  ctx: TenantContext,
  required: readonly Permission[],
): boolean {
  return required.every((p) => ctx.permissions.includes(p));
}

/**
 * Assert the actor holds the required permissions, or throw.
 *
 * Business authorization lives here and in services — never in the database, and
 * never in a React component (ADR 0004 Q4 layer table).
 */
export function requirePermissions(
  ctx: TenantContext,
  operation: string,
  required: readonly Permission[],
): void {
  if (!hasPermissions(ctx, required)) {
    throw permissionDenied(
      operation,
      required.join(", "),
      ctx.correlationId,
    );
  }
}

/** Assert operator context and the required platform permissions, or throw. */
export function requirePlatformPermissions(
  ctx: ExecutionContext | null | undefined,
  operation: string,
  required: readonly PlatformPermission[],
): OperatorContext {
  if (!ctx || !isOperatorContext(ctx)) {
    throw organizationContextRequired(operation);
  }
  const ok = required.every((p) => ctx.platformPermissions.includes(p));
  if (!ok) {
    throw permissionDenied(
      operation,
      required.join(", "),
      ctx.correlationId,
    );
  }
  return ctx;
}