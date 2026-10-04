/**
 * Demo Account Configuration
 *
 * SECURITY MODEL:
 * The demo email and password are intentionally public — they authenticate
 * only into an isolated Demo Workspace organization that contains no real
 * customer or business data.
 *
 * NEVER expose any other secrets (service role key, JWT secret, etc.) here.
 * These variables are safe to be NEXT_PUBLIC_ because they are the
 * credentials displayed on the public login page for demonstration purposes.
 */

/** Public demo email, sourced from environment for runtime flexibility. */
export const DEMO_EMAIL =
  process.env.NEXT_PUBLIC_DEMO_EMAIL ?? "demo@innvntory.sahaya.tech";

/**
 * Public demo password.
 * Displayed on the login page. Only grants access to the isolated Demo Workspace.
 */
export const DEMO_PASSWORD = process.env.NEXT_PUBLIC_DEMO_PASSWORD ?? "";

/** Slug of the dedicated Demo Workspace organization. */
export const DEMO_ORG_SLUG = "innvntory-demo";

/** Display name of the Demo Workspace organization. */
export const DEMO_ORG_NAME = "Innvntory Demo Workspace";

/**
 * Returns true if the given organization slug identifies the Demo Workspace.
 * Used to render the "Demo Workspace" indicator in the authenticated UI.
 */
export function isDemoOrganization(slug: string | undefined | null): boolean {
  return slug === DEMO_ORG_SLUG;
}

/**
 * Returns true if NEXT_PUBLIC_DEMO_MODE is explicitly set to "true".
 * Used to enable the dashboard fixture mode for future-domain metrics.
 */
export function isDemoModeEnabled(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_MODE === "true";
}
