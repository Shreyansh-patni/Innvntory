/**
 * Backend entrypoint placeholder.
 *
 * The service boots through `src/server.ts`. This file exists so the package has a
 * resolvable main entry, and re-exports the pieces an embedding host would need.
 */

export { createDatabase, schema } from "./db/client.js";
export type { Database } from "./db/client.js";
export { setTenantContext, withTenant, withoutTenant } from "./db/tenant-transaction.js";
export { TENANT_OWNED_TABLES, SYSTEM_TABLES } from "./db/schema.js";
export * from "./platform/auth/resolve-session.js";