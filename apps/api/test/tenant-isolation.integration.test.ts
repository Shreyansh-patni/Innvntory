/**
 * Tenant isolation integration tests — these REQUIRE a live PostgreSQL instance.
 *
 * HONESTY: when DATABASE_URL is absent these tests SKIP. They are not stubbed and
 * they do not report a false pass. Until PostgreSQL is available locally, tenant
 * isolation is therefore **unverified at runtime** — see docs/ADR 0004 §Testing
 * implications.
 *
 * Run with a database:
 *   docker run -d --name innvntory-pg -e POSTGRES_PASSWORD=postgres \
 *     -e POSTGRES_DB=innvntory -p 5432:5432 postgres:17-alpine
 *   pnpm --filter @innvntory/api db:migrate
 *   DATABASE_URL=postgres://postgres:postgres@localhost:5432/innvntory \
 *     pnpm --filter @innvntory/api test
 */

import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";

import postgres from "postgres";

import { fromAuthenticatedSession, ROLES } from "@innvntory/shared";

const databaseUrl = process.env.DATABASE_URL;
const hasDatabase = Boolean(databaseUrl);

/** Tables this suite creates and removes. Isolated from any real data. */
const PREFIX = "iso_test";

let sql: ReturnType<typeof postgres>;

describe(
  "tenant isolation (requires PostgreSQL)",
  { skip: hasDatabase ? false : "DATABASE_URL not set - no live database available" },
  () => {
    before(async () => {
      sql = postgres(databaseUrl as string, { max: 1 });

      await sql.unsafe(`
        CREATE SCHEMA IF NOT EXISTS innvntory;

        CREATE TABLE IF NOT EXISTS ${PREFIX}_items (
          id serial PRIMARY KEY,
          organization_id uuid NOT NULL,
          label text NOT NULL
        );

        ALTER TABLE ${PREFIX}_items ENABLE ROW LEVEL SECURITY;
        ALTER TABLE ${PREFIX}_items FORCE  ROW LEVEL SECURITY;

        DROP POLICY IF EXISTS iso_${PREFIX}_items ON ${PREFIX}_items;
        CREATE POLICY iso_${PREFIX}_items ON ${PREFIX}_items
          USING      (organization_id = innvntory.current_organization_id())
          WITH CHECK (organization_id = innvntory.current_organization_id());
      `);

      await sql.unsafe(`
        TRUNCATE ${PREFIX}_items;
        INSERT INTO ${PREFIX}_items (organization_id, label) VALUES
          ('11111111-1111-1111-1111-111111111111', 'alpha-only'),
          ('22222222-2222-2222-2222-222222222222', 'beta-only');
      `);
    });

    after(async () => {
      if (!sql) return;
      await sql.unsafe(`DROP TABLE IF EXISTS ${PREFIX}_items;`);
      await sql.end();
    });

    /**
     * Run `fn` in a transaction with tenant context established, exactly as the
     * application does (ADR 0004 Q5).
     */
    async function inTenant<T>(organizationId: string, fn: () => Promise<T>): Promise<T> {
      return sql.begin(async (tx) => {
        await tx.unsafe(
          `select set_config('app.organization_id', $1, true)`,
          [organizationId],
        );
        return fn();
      }) as Promise<T>;
    }

    it("P3: a query with NO organization filter returns only the active tenant's rows", async () => {
      const rows = await inTenant("11111111-1111-1111-1111-111111111111", () =>
        sql.unsafe(`SELECT label FROM ${PREFIX}_items`),
      );
      const labels = rows.map((r) => r.label as string);
      assert.deepEqual(labels, ["alpha-only"]);
      assert.ok(!labels.includes("beta-only"), "RLS must hide the other tenant");
    });

    it("P4: tenant context does not leak across transactions on one connection", async () => {
      // Same pooled client, sequential transactions, different tenants.
      const alpha = await inTenant("11111111-1111-1111-1111-111111111111", () =>
        sql.unsafe(`SELECT label FROM ${PREFIX}_items`),
      );
      const beta = await inTenant("22222222-2222-2222-2222-222222222222", () =>
        sql.unsafe(`SELECT label FROM ${PREFIX}_items`),
      );
      assert.deepEqual(alpha.map((r) => r.label), ["alpha-only"]);
      assert.deepEqual(beta.map((r) => r.label), ["beta-only"]);
    });

    it("fails CLOSED when no tenant context is set", async () => {
      const rows = await sql.unsafe(`SELECT label FROM ${PREFIX}_items`);
      assert.equal(rows.length, 0, "no tenant context must yield zero rows, never all rows");
    });

    it("rejects a cross-tenant write at the database", async () => {
      await assert.rejects(() =>
        inTenant("11111111-1111-1111-1111-111111111111", () =>
          sql.unsafe(
            `INSERT INTO ${PREFIX}_items (organization_id, label)
             VALUES ('22222222-2222-2222-2222-222222222222', 'illegal')`,
          ),
        ),
      );
    });

    it("context is cleared once the transaction ends", async () => {
      await inTenant("11111111-1111-1111-1111-111111111111", () =>
        sql.unsafe(`SELECT 1`),
      );
      const rows = await sql.unsafe(`SELECT label FROM ${PREFIX}_items`);
      assert.equal(rows.length, 0);
    });
  },
);

describe("tenant context integration with shared package", () => {
  it("builds a context usable against the database helper", () => {
    const ctx = fromAuthenticatedSession({
      organizationId: "11111111-1111-1111-1111-111111111111",
      actorId: "user_1",
      roleId: "owner",
      permissions: ROLES.owner.permissions,
      correlationId: "corr_integration",
    });
    assert.equal(ctx.actorType, "user");
  });
});