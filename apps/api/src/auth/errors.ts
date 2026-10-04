/**
 * Authentication errors.
 *
 * Every failure here is a hard stop. None may be caught and downgraded to an
 * anonymous or fallback identity (ADR 0005 §7, specification §54 "no silent
 * failures").
 */

export type AuthErrorCode =
  | "UNAUTHENTICATED"
  | "SESSION_EXPIRED"
  | "ACCOUNT_NOT_ACTIVE"
  | "ORGANIZATION_NOT_SELECTED"
  | "MEMBERSHIP_NOT_FOUND"
  | "MEMBERSHIP_NOT_ACTIVE"
  | "ORGANIZATION_SWITCH_FORBIDDEN"
  | "CSRF_REJECTED"
  | "ORIGIN_REJECTED"
  | "PROVIDER_NOT_CONFIGURED"
  | "UNTRUSTED_IDENTITY_SOURCE";

export class AuthError extends Error {
  readonly code: AuthErrorCode;
  /** HTTP status. Never derived from provider input. */
  readonly status: number;
  readonly correlationId: string | undefined;

  constructor(
    code: AuthErrorCode,
    message: string,
    status: number,
    correlationId?: string,
  ) {
    super(message);
    this.name = "AuthError";
    this.code = code;
    this.status = status;
    this.correlationId = correlationId;
  }
}

/** No session at all. Fails closed; never becomes an anonymous tenant. */
export function unauthenticated(correlationId?: string): AuthError {
  return new AuthError(
    "UNAUTHENTICATED",
    "Authentication is required for this operation.",
    401,
    correlationId,
  );
}

export function sessionExpired(correlationId?: string): AuthError {
  return new AuthError(
    "SESSION_EXPIRED",
    "The session has expired. Sign in again.",
    401,
    correlationId,
  );
}

/**
 * Generic response for a suspended or deleted account.
 *
 * Deliberately does not distinguish which, to avoid account enumeration.
 */
export function accountNotActive(correlationId?: string): AuthError {
  return new AuthError(
    "ACCOUNT_NOT_ACTIVE",
    "Authentication is required for this operation.",
    401,
    correlationId,
  );
}

/**
 * Authenticated, but no organization selected.
 *
 * This is NOT an authorization failure and NOT a fall back to a default
 * organization. Tenant-scoped work must fail closed (ADR 0005 §7).
 */
export function organizationNotSelected(correlationId?: string): AuthError {
  return new AuthError(
    "ORGANIZATION_NOT_SELECTED",
    "No organization is selected for this session. Select an organization before " +
      "performing organization-scoped work.",
    409,
    correlationId,
  );
}

/**
 * The requested organization is not one the user belongs to.
 *
 * Also deliberately generic, so it does not confirm whether an organization exists.
 */
export function organizationSwitchForbidden(correlationId?: string): AuthError {
  return new AuthError(
    "ORGANIZATION_SWITCH_FORBIDDEN",
    "You do not have access to that organization.",
    403,
    correlationId,
  );
}

export function membershipNotFound(correlationId?: string): AuthError {
  return new AuthError(
    "MEMBERSHIP_NOT_FOUND",
    "You do not have access to that organization.",
    403,
    correlationId,
  );
}

export function membershipNotActive(correlationId?: string): AuthError {
  return new AuthError(
    "MEMBERSHIP_NOT_ACTIVE",
    "You do not have access to that organization.",
    403,
    correlationId,
  );
}

/**
 * Raised when no authentication provider adapter is configured.
 *
 * This is the CURRENT production state and it fails closed by design.
 */
export function providerNotConfigured(correlationId?: string): AuthError {
  return new AuthError(
    "PROVIDER_NOT_CONFIGURED",
    "Authentication is not configured on this deployment.",
    503,
    correlationId,
  );
}

/** Raised when identity is read from an untrusted source. */
export function untrustedIdentitySource(source: string): AuthError {
  return new AuthError(
    "UNTRUSTED_IDENTITY_SOURCE",
    `Identity must be resolved from the authenticated session, never from ` +
      `"${source}".`,
    400,
  );
}