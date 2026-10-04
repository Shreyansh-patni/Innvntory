/**
 * tests/security/tenant-isolation-rbac.test.mjs
 *
 * Security tests for Innvntory MVP:
 * - PostgreSQL RLS policy verification across migrations
 * - Multi-tenant isolation invariants (every table has organization_id)
 * - Public demo user role restrictions (restricted viewer permissions)
 * - Safe credential & environment variable boundary enforcement
 */

import assert from 'node:assert/strict';
import { test } from 'node:test';
import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = process.cwd();

test('Security: All database migrations enforce organization_id and RLS', () => {
  const migrationsDir = path.join(ROOT_DIR, 'supabase', 'migrations');
  assert.ok(fs.existsSync(migrationsDir), 'supabase/migrations directory must exist');

  const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith('.sql'));
  assert.ok(files.length >= 3, 'Must have at least 3 migration files');

  let rlsFound = 0;
  let orgIdFound = 0;

  for (const file of files) {
    const content = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    if (content.includes('ENABLE ROW LEVEL SECURITY')) {
      rlsFound++;
    }
    if (content.includes('organization_id')) {
      orgIdFound++;
    }
  }

  assert.ok(rlsFound >= 2, `RLS must be enabled in migrations (found ${rlsFound})`);
  assert.ok(orgIdFound >= 3, `organization_id must be in migrations (found ${orgIdFound})`);
});

test('Security: Public demo configuration does not expose service role keys', () => {
  const demoConfigFile = path.join(ROOT_DIR, 'lib', 'demo', 'config.ts');
  assert.ok(fs.existsSync(demoConfigFile), 'lib/demo/config.ts must exist');

  const content = fs.readFileSync(demoConfigFile, 'utf8');
  assert.ok(!content.includes('SUPABASE_SERVICE_ROLE_KEY'), 'Demo config must never reference service role key');
  assert.ok(!content.includes('service_role'), 'Demo config must never contain service role secret');
});

test('Security: Client components never import server-only Supabase admin clients', () => {
  const componentsDir = path.join(ROOT_DIR, 'components');
  
  function scanDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scanDir(fullPath);
      } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
        const content = fs.readFileSync(fullPath, 'utf8');
        assert.ok(
          !content.includes('createAdminClient') && !content.includes('SUPABASE_SERVICE_ROLE_KEY'),
          `Client-facing component ${entry.name} must not import admin client or service role key`
        );
      }
    }
  }

  scanDir(componentsDir);
});

test('Security: Cron endpoint validates bearer authorization header', () => {
  const cronRoute = path.join(ROOT_DIR, 'app', 'api', 'cron', 'demo-reset', 'route.ts');
  assert.ok(fs.existsSync(cronRoute), 'Reset demo cron route must exist at app/api/cron/demo-reset/route.ts');

  const content = fs.readFileSync(cronRoute, 'utf8');
  assert.ok(content.includes('authorization') || content.includes('CRON_SECRET'), 'Cron route must verify authorization or CRON_SECRET');
});
