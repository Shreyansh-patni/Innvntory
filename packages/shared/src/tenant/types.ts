/**
 * Tenant context primitives.
 *
 * ADR 0003 §"Tenant context propagation" and ADR 0004 §"TenantContext propagation"
 * both require ONE authoritative tenant context, established inside the authenticated
 * backend boundary and threaded explicitly. Nothing in this file may be derived from
 * untrusted request input or model output.
 */

/**
 * Opaque, branded identifier.
 *
 * Branding is a compile-time guard, not decoration: it stops an arbitrary
 * `string` (a request parameter, a form field, an AI tool argument) from being passed
 * where a trusted identifier is expected. `Brand` carries no runtime cost.
 */
export type Brand<T, B extends string> = T & { readonly __brand: B };

/** A tenant organization. Established from an authenticated session only. */
export type OrganizationId = Brand<string, "OrganizationId">;

/** The acting principal: a user, a worker principal, or a platform operator. */
export type ActorId = Brand<string, "ActorId">;

/** A role identifier from the platform-owned `roles` catalogue (ADR 0004 Q3). */
export type RoleId = Brand<string, "RoleId">;

/**
 * Granular permission strings, per specification §32.
 *
 * This is a closed union so a typo is a compile error rather than a permission that
 * silently never matches. Adding a permission requires adding it here first.
 */
export type Permission =
  | "products.read"
  | "products.create"
  | "products.update"
  | "products.delete"
  | "inventory.read"
  | "inventory.adjust"
  | "inventory.transfer"
  | "sales.read"
  | "sales.create"
  | "sales.cancel"
  | "purchases.read"
  | "purchases.create"
  | "purchases.approve";

/**
 * Who is acting.
 *
 * `operator` is the explicit platform/cross-tenant path from ADR 0004 Q2. It is
 * assigned deliberately at the platform boundary and is NEVER derived from a missing
 * or invalid organization id.
 */
export type ActorType = "user" | "worker" | "ai_tool" | "operator";

/**
 * Platform-level permissions. Separate from tenant permissions on purpose: a tenant
 * role never confers these, and they are only ever granted to an operator context
 * (ADR 0004 Q2).
 */
export type PlatformPermission =
  | "platform.read"
  | "platform.support.read"
  | "platform.audit.read";

/**
 * The trusted execution context.
 *
 * Read-only and frozen: a context is a value passed down the call chain, never a
 * mutable thing that a callee mutates to change "the current tenant" for everyone
 * else. There is deliberately no module-level current-tenant variable anywhere in
 * this package.
 */
export interface TenantContext {
  readonly organizationId: OrganizationId;
  readonly actorId: ActorId;
  readonly actorType: ActorType;
  readonly permissions: readonly Permission[];
  readonly roleId: RoleId;
  readonly correlationId: string;
}

/**
 * Explicit platform/operator context.
 *
 * Modelled as a DISTINCT type rather than a flag on TenantContext, so that an
 * operator capability cannot be passed where tenant context is expected, and so the
 * compiler forces a caller to acknowledge which kind of context it holds.
 */
export interface OperatorContext {
  readonly actorId: ActorId;
  readonly actorType: "operator";
  readonly platformPermissions: readonly PlatformPermission[];
  readonly correlationId: string;
  /** Always set, so operator intent is explicit even in an audit record. */
  readonly organizationId: null;
}

/** Either kind of trusted context. */
export type ExecutionContext = TenantContext | OperatorContext;

/** Narrows an execution context to tenant context. */
export function isTenantContext(ctx: ExecutionContext): ctx is TenantContext {
  return ctx.actorType !== "operator";
}

/** Narrows an execution context to operator context. */
export function isOperatorContext(ctx: ExecutionContext): ctx is OperatorContext {
  return ctx.actorType === "operator";
}

/**
 * Durable organization context carried by background jobs (ADR 0004 §Worker
 * implications). Written at enqueue time, reconstructed by the worker.
 *
 * Deliberately a plain serialisable shape: this is what crosses the queue boundary,
 * so it must not be the branded in-process context type.
 */
export interface JobTenantContext {
  readonly organizationId: string;
  readonly actorId: string;
  readonly roleId: string;
  readonly correlationId: string;
}