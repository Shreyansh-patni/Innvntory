/**
 * Fail-closed errors for tenant context.
 *
 * Specification §54 names "no silent failures" as a reliability target, and ADR 0003
 * requires that a tenant-scoped operation with no tenant context THROW rather than
 * run unscoped. Every error here is a hard stop, not a warning.
 */

export type TenantContextErrorCode =
  | "TENANT_CONTEXT_MISSING"
  | "ORGANIZATION_CONTEXT_REQUIRED"
  | "PERMISSION_DENIED"
  | "UNTRUSTED_ORGANIZATION_SOURCE"
  | "WORKER_CONTEXT_MISSING";

export class TenantContextError extends Error {
  readonly code: TenantContextErrorCode;
  readonly correlationId: string | undefined;

  constructor(
    code: TenantContextErrorCode,
    message: string,
    correlationId?: string,
  ) {
    super(message);
    this.name = "TenantContextError";
    this.code = code;
    this.correlationId = correlationId;
  }
}

/**
 * Raised when a tenant-scoped operation is attempted with no tenant context.
 *
 * This is the single most important failure in the system. It must never be caught
 * and downgraded to "return nothing" or "run unscoped".
 */
export function missingTenantContext(operation: string): TenantContextError {
  return new TenantContextError(
    "TENANT_CONTEXT_MISSING",
    `Tenant-scoped operation "${operation}" requires a TenantContext. ` +
      `Refusing to proceed without one. A tenant request must never run unscoped, ` +
      `and operator access must be requested explicitly (ADR 0004 Q2), never inferred ` +
      `from a missing organizationId.`,
  );
}

/** Raised when a context is present but carries no organization scope. */
export function organizationContextRequired(operation: string): TenantContextError {
  return new TenantContextError(
    "ORGANIZATION_CONTEXT_REQUIRED",
    `Operation "${operation}" requires an organization-scoped TenantContext. ` +
      `An operator context cannot substitute for a tenant context here.`,
  );
}

/** Raised when an operation is attempted without the required permission (§32). */
export function permissionDenied(
  operation: string,
  required: string,
  correlationId?: string,
): TenantContextError {
  return new TenantContextError(
    "PERMISSION_DENIED",
    `Operation "${operation}" requires permission "${required}", which the current ` +
      `actor does not hold.`,
    correlationId,
  );
}

/**
 * Raised when an organization id appears to have come from an untrusted source.
 *
 * This exists to make a specific class of bug loud: passing a raw request parameter
 * or model output where a session-derived id was required.
 */
export function untrustedOrganizationSource(source: string): TenantContextError {
  return new TenantContextError(
    "UNTRUSTED_ORGANIZATION_SOURCE",
    `Organization id must be resolved from an authenticated session, never from ` +
      `"${source}". Request payloads and model output are untrusted input (ADR 0002 ` +
      `constraint 8, ADR 0003 §Tenant context propagation).`,
  );
}

/** Raised when a worker job carries no durable organization context (ADR 0004). */
export function missingWorkerContext(jobName: string): TenantContextError {
  return new TenantContextError(
    "WORKER_CONTEXT_MISSING",
    `Job "${jobName}" carries no durable organization context and has been refused. ` +
      `A job must never run unscoped.`,
  );
}