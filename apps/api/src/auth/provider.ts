/**
 * Auth provider port and adapter boundary.
 *
 * ADR 0005 §2. This file is the ONLY place a vendor SDK may ever appear.
 *
 * Application code depends on these interfaces, never on a vendor. The dependency
 * arrow points inward: `provider.ts` knows nothing about any SDK, and no service,
 * data-access module, or route imports one.
 *
 * Provider selection is DEFERRED (ADR 0005 §8). No vendor adapter exists yet.
 */

import type { AuthenticatedSession } from "./types.js";

/**
 * What the application needs from an authentication provider.
 *
 * Note what is ABSENT: nothing for roles, permissions, or authorization. This port
 * cannot express "grant this user admin", which is the point — authorization is not
 * authentication's job (ADR 0005 §1).
 */
export interface AuthProvider {
  /** Human-readable provider name, for diagnostics only. */
  readonly name: string;

  /**
   * Resolve a raw session credential (typically a cookie value) to a session.
   *
   * Returns `null` for "no session". It must NOT throw for an unauthenticated
   * caller — absence is a normal result.
   */
  resolveSession(sessionCredential: string): Promise<AuthenticatedSession | null>;

  /**
   * Invalidate a session server-side.
   *
   * Idempotent: revoking an already-revoked session succeeds.
   */
  revokeSession(sessionId: string): Promise<void>;

  /**
   * Read the session credential from a request's cookies.
   *
   * Provider-owned because the cookie name and format are provider concerns.
   */
  readSessionCredential(cookies: Readonly<Record<string, string | undefined>>):
    | string
    | undefined;

  /**
   * Whether CSRF defence is the provider's responsibility.
   *
   * `false` means Innvntory MUST enforce origin/header validation itself
   * (ADR 0005 §9 — CSRF is Innvntown for cookie-session endpoints).
   */
  readonly providerOwnsCsrfDefence: boolean;
}

/**
 * The unconfigured adapter — the CURRENT production behaviour.
 *
 * It returns no session for any input, so every protected route fails closed with
 * UNAUTHENTICATED. This is deliberate and is NOT a placeholder to be shipped:
 * production authentication is unavailable until a provider is selected.
 */
export const unconfiguredAuthProvider: AuthProvider = {
  name: "unconfigured",
  resolveSession: async () => null,
  revokeSession: async () => {
    // Nothing to revoke: no sessions can exist.
  },
  readSessionCredential: () => undefined,
  // No provider owns CSRF defence, so Innvntory must.
  providerOwnsCsrfDefence: false,
};