/**
 * Migration runner.
 *
 * Runs the SQL in `src/db/migrations` in filename order using the MIGRATION role
 * (ADR 0004 Q7). Migrations are not exposed as application runtime functionality:
 * this script is run by an operator or by CI, never by a request handler.
 *
 * Requires DATABASE_URL pointing at a connection whose role OWNS the tables.
 */

import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import postgres from "postgres";

const MIGRATIONS_DIR = fileURLToPath(new URL("./migrations", import.meta.url));

async function main(): Promise<void> {
  const url = process.env.DATABASE_MIGRATION_URL ?? process.env.DATABASE_URL;
  if (!url) {
    console.error(
      "DATABASE_MIGRATION_URL (or DATABASE_URL) is required to run migrations.\n" +
        "No credentials are stored in this repository — see .env.example.",
    );
    process.exit(1);
  }

  const sql = postgres(url, { max: 1 });

  try {
    const files = (await readdir(MIGRATIONS_DIR))
      .filter((f) => f.endsWith(".sql"))
      .sort();

    if (files.length === 0) {
      console.log("No migrations found.");
      return;
    }

    for (const file of files) {
      const sqlText = await readFile(join(MIGRATIONS_DIR, file), "utf8");
      console.log(`Applying ${file} …`);
      await sql.unsafe(sqlText);
      console.log(`  applied ${file}`);
    }

    console.log("Migrations complete.");
  } finally {
    await sql.end();
  }
}

main().catch((error: unknown) => {
  console.error("Migration failed:", error instanceof Error ? error.message : error);
  process.exit(1);
});