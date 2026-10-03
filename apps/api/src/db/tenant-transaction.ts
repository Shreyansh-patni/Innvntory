/**
 * The tenant-scoped transaction boundary.
 *
 * THIS IS THE MOST IMPORTANT FILE IN THE BACKEND.
 *
 * ADR 0004 Q5 requires that tenant RLS context be established with
 * transaction-local configuration INSIDE the same transaction as the protected
 * query. Session-level `SET` would persist on a pooled connection and leak one
 * tenant's context into another tenant's request — a cross-tenant breach that
 * passes ordinary testing.
 *
 * Because `SET LOCAL` is transaction-scoped, every tenant-scoped read is
 * transactional. That is a deliberate cost, and it aligns with specification
 * §54 and §55 rather than conflicting with them.
 *
 * Usage:
 *   await withTenant(db, ctx, async (tx) => { ... })
 */

import { requireTenantContext, type TenantContext } from "@innvntory/shared";
import { sql } from "drizzle-orm";

import type { Database } from "./client.js";

/** The transaction handle Drizzle gives a `db.transaction()` callback. */
export type TenantTransaction = Parameters<
  Parameters<Database["transaction"]>[0]
>[0];

/** Anything able to execute a raw parameterised statement. */
interface SqlExecutor {
  execute(query: ReturnType<typeof sql>): Promise<unknown>;
}

/**
 * Set the transaction-local tenant context.
 *
 * `set_config(..., true)` is the parameterised form of `SET LOCAL`; the third
 * argument makes it transaction-scoped, which is what makes the design safe under
 * connection pooling (ADR 0004 Q5).
 *
 * Values are bound as parameters. There is no string interpolation of untrusted
 * input into SQL anywhere in this file (ADR 0004 Q4 raw-SQL boundary).
 */
export async function setTenantContext(
  tx: SqlExecutor,
  ctx: TenantContext,
): Promise<void> {
  await tx.execute(
    sql`select set_config('app.organization_id', ${ctx.organizationId}, true)`,
  );
}

/**
 * Run `fn` inside a transaction that has tenant context established.
 *
 * Fails closed: with no tenant context this throws BEFORE opening a transaction.
 * It never runs the callback unscoped.
 */
export async function withTenant<T>(
  db: Database,
  ctx: TenantContext,
  fn: (tx: TenantTransaction) => Promise<T>,
): Promise<T> {
  // Rejects operator contexts and missing contexts before any DB work happens.
  requireTenantContext(ctx, "withTenant");

  return db.transaction(async (tx) => {
    await setTenantContext(tx as unknown as SqlExecutor, ctx);
    return fn(tx);
  });
}

/**
 * Run `fn` in a transaction WITHOUT tenant context.
 *
 * ONLY for system-level operations that legitimately have no tenant: migrations,
 * operator paths, and platform reads. Never for tenant data (ADR 0004 Q2).
 */
export async function withoutTenant<T>(
  db: Database,
  fn: (tx: TenantTransaction) => Promise<T>,
): Promise<T> {
  return db.transaction((tx) => fn(tx));
}