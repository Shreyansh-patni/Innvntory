/**
 * Authentication module public surface.
 *
 * ADR 0005. Application code imports from HERE. Vendor SDKs, if ever added, are
 * confined to an adapter that implements `AuthProvider`.
 */

export type { AuthenticatedSession, AuthState } from "./types.js";
export { isExpired, isUsableSession } from "./types.js";

export type { AuthProvider } from "./provider.js";
export { unconfiguredAuthProvider } from "./provider.js";

export type { AuthErrorCode } from "./errors.js";
export { AuthError } from "./errors.js";

export type {
  AuthorizationResult,
  Membership,
  MembershipLookup,
  PermissionLookup,
} from "./authorization.js";
export {
  assertPermissions,
  resolvePermissions,
  verifyMembership,
} from "./authorization.js";

export type { SessionResolverDependencies } from "./session.js";
export {
  requireTenantContextFromRequest,
  resolveAuthenticatedSession,
  resolveAuthorization,
  revokeCurrentSession,
  tenantContextFromSession,
} from "./session.js";

export type {
  SessionStateWriter,
  SwitchOrganizationDependencies,
  SwitchOrganizationResult,
} from "./organization.js";
export { rejectIdentityFromRequest, switchOrganization } from "./organization.js";

export type { ProtectedRequestResult, RequestContext } from "./route-guard.js";
export {
  assertCsrfToken,
  assertTrustedOrigin,
  guardProtectedRequest,
  toStructuredError,
} from "./route-guard.js";