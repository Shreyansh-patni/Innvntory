/**
 * Structural validation of the RLS migration.
 *
 * Runs WITHOUT a database. It reads the migration SQL and the Drizzle schema and
 * asserts the architectural invariants that ADR 0003 and ADR 0004 require.
 *
 * This is deliberately NOT a substitute for the database-dependent integration
 * tests in `test/tenant-isolation.integration.test.ts`, which need a live
 * PostgreSQL instance. Those skip visibly when DATABASE_URL is absent.
 */

import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { SYSTEM_TABLES, TENANT_OWNED_TABLES } from "./schema.js";

/**
 * Locate the migration SQL.
 *
 * TSC does not copy non-TypeScript assets into the output directory, so the file is
 * not next to the compiled module. Resolve relative to this module first (correct
 * when run from source), then fall back to the package root (correct when run from
 * `dist-test`). Fails loudly rather than silently validating nothing.
 */
function resolveMigrationPath(): string {
  const candidates = [
    fileURLToPath(new URL("./migrations/0000_rls_foundation.sql", import.meta.url)),
    join(process.cwd(), "src", "db", "migrations", "0000_rls_foundation.sql"),
  ];

  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate;
  }

  throw new Error(
    "Could not locate 0000_rls_foundation.sql. Looked in:\n  " +
      candidates.join("\n  "),
  );
}

export async function readMigrationSql(): Promise<string> {
  return readFile(resolveMigrationPath(), "utf8");
}

export async function assertRlsFoundation(): Promise<void> {
  const sql = await readMigrationSql();

  // Every tenant-owned table must have RLS enabled AND forced. FORCE is what stops
  // the table owner from bypassing the policies (ADR 0004 Q7).
  for (const table of TENANT_OWNED_TABLES) {
    assert.match(
      sql,
      new RegExp(`ALTER TABLE ${table}\\s+ENABLE ROW LEVEL SECURITY`),
      `${table}: RLS must be enabled`,
    );
    assert.match(
      sql,
      new RegExp(`ALTER TABLE ${table}\\s+FORCE\\s+ROW LEVEL SECURITY`),
      `${table}: FORCE ROW LEVEL SECURITY must be set (otherwise the owner bypasses policies)`,
    );
    assert.match(
      sql,
      new RegExp(`CREATE POLICY tenant_isolation_${table}`),
      `${table}: a tenant isolation policy must exist`,
    );
  }

  // System-level tables must NOT be given tenant policies or an organization_id.
  for (const table of SYSTEM_TABLES) {
    assert.doesNotMatch(
      sql,
      new RegExp(`CREATE POLICY tenant_isolation_${table}`),
      `${table} is system-level and must not receive a tenant isolation policy`,
    );
  }

  // Transaction-local context only. A session-level SET would leak tenant state
  // across a pooled connection (ADR 0004 Q5).
  assert.doesNotMatch(
    sql,
    /\bSET\s+(?!LOCAL\b)app\.organization_id/i,
    "must never set app.organization_id at session level",
  );
  assert.match(
    sql,
    /current_setting\('app\.organization_id',\s*true\)/,
    "tenant id must be read with the missing-ok form of current_setting so it fails closed",
  );

  // Fail-closed helper: NULLIF + NULLIF-style empty-string handling.
  assert.match(sql, /CREATE OR REPLACE FUNCTION innvntory\.current_organization_id/);

  // Runtime role must exist and must not own the tables.
  assert.match(sql, /CREATE ROLE innvntory_runtime NOLOGIN/);
  assert.doesNotMatch(
    sql,
    /ALTER TABLE\s+\w+\s+OWNER TO\s+innvntory_runtime/i,
    "the runtime role must never own application tables",
  );

  // Audit immutability (specification 33).
  assert.match(sql, /prevent_audit_mutation/);
  assert.match(sql, /BEFORE UPDATE OR DELETE ON audit_logs/);

  // No unparameterised interpolation of anything that looks like an identifier.
  assert.doesNotMatch(
    sql,
    /\$\{[^}]*\}/,
    "migration SQL must not contain template interpolation",
  );
}