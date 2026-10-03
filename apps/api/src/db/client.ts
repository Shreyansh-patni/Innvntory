/**
 * Database access. `apps/api` is the ONLY package permitted to hold database
 * credentials (ADR 0001 D1/D5, ADR 0002 constraint 6, ADR 0004 Q4).
 */

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema.js";

export type Database = ReturnType<typeof createDatabase>;

function requireDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. The backend service cannot open a database " +
        "connection without it. See .env.example.",
    );
  }
  return url;
}

/**
 * Create the database client.
 *
 * Pooling: the `postgres` client is configured for transaction-compatible usage.
 * Nothing in this codebase may depend on session-persistent PostgreSQL state —
 * tenant context is always set with SET LOCAL inside an explicit transaction
 * (ADR 0004 Q5). Production sits behind a transaction-mode pooler such as
 * PgBouncer.
 */
export function createDatabase() {
  const client = postgres(requireDatabaseUrl(), {
    max: Number(process.env.DATABASE_POOL_MAX ?? 10),
    // Fail fast rather than hanging when the database is unreachable.
    connect_timeout: Number(process.env.DATABASE_CONNECT_TIMEOUT ?? 10),
    // Prepared statements are disabled by default under transaction pooling in
    // some deployments; keeping this explicit documents the intent.
    prepare: false,
  });

  return drizzle(client, { schema });
}

export { schema };