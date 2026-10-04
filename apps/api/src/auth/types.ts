/**
 * Authentication session types.
 *
 * ADR 0005 §3. These are the ONLY trusted inputs to `TenantContext`.
 *
 * The critical property: nothing here may be populated from a request body, query
 * parameter, or client header. `organizationId` in particular is session state set
 * only after server-side membership verification (ADR 0005 §4).
 */

/** Account state as established by authentication, not by authorization. */
export type AuthState = "active" | "suspended" | "deleted";

export interface AuthenticatedSession {
  /** Server-side session identifier. Opaque to application code. */
  readonly sessionId: string;
  /** The authenticated principal. Trusted. */
  readonly userId: string;
  /** Account state. A suspended or deleted session is not usable. */
  readonly authState: AuthState;
  readonly createdAt: Date;
  readonly expiresAt: Date;
  /**
   * The organization this session is currently acting for.
   *
   * `null` is legitimate: an authenticated user with no organization selected yet has
   * a valid session but NO tenant context, and tenant-scoped work must fail closed
   * (ADR 0005 §7).
   *
   * This value is written ONLY by the organization-switching service after verifying
   * membership. It is never read from a request.
   */
  readonly activeOrganizationId: string | null;
  /** Backend-generated correlation id for this request. */
  readonly correlationId: string;
}

/** A session that exists but whose account is not usable. */
export function isUsableSession(
  session: AuthenticatedSession | null,
  now: Date = new Date(),
): session is AuthenticatedSession {
  if (!session) return false;
  if (session.authState !== "active") return false;
  return session.expiresAt.getTime() > now.getTime();
}

/** Expiry is re-checked on every resolution regardless of provider behaviour. */
export function isExpired(
  session: AuthenticatedSession,
  now: Date = new Date(),
): boolean {
  return session.expiresAt.getTime() <= now.getTime();
}