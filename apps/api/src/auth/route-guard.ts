/**
 * Protected-route helper and CSRF/origin defence.
 *
 * ADR 0005 §7 and §9. This is the entry point every protected backend route uses.
 *
 * Responsibilities that are INNVENTORY's, not the provider's (ADR 0005 §9):
 *   - resolving the session before any TenantContext is built
 *   - failing closed on absence
 *   - CSRF defence where cookie session auth is used
 *   - origin validation on session-mutating requests
 */

import { AuthError } from "./errors.js";
import type { AuthProvider } from "./provider.js";
import {
  type SessionResolverDependencies,
  requireTenantContextFromRequest,
} from "./session.js";

export interface RequestContext {
  readonly cookies: Readonly<Record<string, string | undefined>>;
  readonly headers: Readonly<Record<string, string | undefined>>;
  readonly method: string;
  /** Backend-generated. Never taken from a request header that a client can forge. */
  readonly correlationId: string;
}

/** Methods that may change session or business state. */
const UNSAFE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

/**
 * Validate origin for a session-mutating request.
 *
 * Required because the provider does not own CSRF defence while cookie sessions
 * are in use. A missing Origin on an unsafe method is treated as a failure, not
 * waved through.
 */
export function assertTrustedOrigin(
  provider: AuthProvider,
  request: RequestContext,
  allowedOrigins: readonly string[],
): void {
  if (!provider.providerOwnsCsrfDefence && UNSAFE_METHODS.has(request.method)) {
    const origin = request.headers["origin"];
    if (!origin || !allowedOrigins.includes(origin)) {
      throw new AuthError(
        "ORIGIN_REJECTED",
        "Request origin is not trusted for this operation.",
        403,
        request.correlationId,
      );
    }
  }
}

/** Assert an explicit anti-CSRF token when the provider does not supply one. */
export function assertCsrfToken(
  provider: AuthProvider,
  request: RequestContext,
  expectedToken: string | undefined,
): void {
  if (provider.providerOwnsCsrfDefence) return;
  if (!UNSAFE_METHODS.has(request.method)) return;

  const presented = request.headers["x-csrf-token"];
  if (!expectedToken || !presented || presented !== expectedToken) {
    throw new AuthError(
      "CSRF_REJECTED",
      "Request could not be verified. Refresh and try again.",
      403,
      request.correlationId,
    );
  }
}

export interface ProtectedRequestResult {
  readonly tenantContext: Awaited<
    ReturnType<typeof requireTenantContextFromRequest>
  >["tenantContext"];
  readonly session: Awaited<
    ReturnType<typeof requireTenantContextFromRequest>
  >["session"];
}

/**
 * Guard a protected route.
 *
 * Resolves the session and builds the TenantContext, or throws. There is no
 * "optional" variant and no anonymous fallback: a route that calls this is protected,
 * and if it cannot authenticate it fails closed (ADR 0005 §7).
 */
export async function guardProtectedRequest(
  deps: SessionResolverDependencies,
  request: RequestContext,
  options: {
    readonly allowedOrigins?: readonly string[];
    readonly csrfToken?: string;
    readonly requireCsrf?: boolean;
  } = {},
): Promise<ProtectedRequestResult> {
  assertTrustedOrigin(deps.provider, request, options.allowedOrigins ?? []);

  if (options.requireCsrf) {
    assertCsrfToken(deps.provider, request, options.csrfToken);
  }

  const { session, tenantContext } = await requireTenantContextFromRequest(
    deps,
    request.cookies,
    request.correlationId,
  );

  return { session, tenantContext };
}

/**
 * Map an auth failure to the structured error shape from specification §38.
 *
 * Never exposes stack traces, secrets, or internal detail.
 */
export function toStructuredError(
  error: unknown,
  correlationId: string,
): { status: number; body: Record<string, unknown> } {
  if (error instanceof AuthError) {
    return {
      status: error.status,
      body: { error: { code: error.code, message: error.message, requestId: correlationId } },
    };
  }

  // Unknown failure: generic message, full detail only in server logs.
  return {
    status: 500,
    body: {
      error: {
        code: "INTERNAL_ERROR",
        message: "The request could not be completed.",
        requestId: correlationId,
      },
    },
  };
}