import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { assertRlsFoundation, readMigrationSql } from "../src/db/check-migrations.js";
import { SYSTEM_TABLES, TENANT_OWNED_TABLES } from "../src/db/schema.js";

describe("RLS migration structure (no database required)", () => {
  it("satisfies every architectural invariant", async () => {
    await assertRlsFoundation();
  });

  it("declares the tenant-owned and system-level split", () => {
    assert.deepEqual([...TENANT_OWNED_TABLES].sort(), [
      "audit_logs",
      "organization_memberships",
      "organizations",
      "users",
    ]);
    assert.deepEqual([...SYSTEM_TABLES].sort(), [
      "permissions",
      "role_permissions",
      "roles",
    ]);
    // No overlap: a table cannot be both tenant-owned and system-level.
    for (const t of TENANT_OWNED_TABLES) {
      assert.ok(!(SYSTEM_TABLES as readonly string[]).includes(t));
    }
  });

  it("never uses session-level tenant state", async () => {
    const sql = await readMigrationSql();
    assert.doesNotMatch(sql, /^\s*SET\s+app\.organization_id/im);
  });

  it("grants the runtime role no tenant-table ownership", async () => {
    const sql = await readMigrationSql();
    assert.doesNotMatch(sql, /OWNER TO\s+innvntory_runtime/i);
  });
});