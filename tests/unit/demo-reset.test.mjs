/**
 * tests/unit/demo-reset.test.mjs
 *
 * Unit tests for SETUP 11.5A Demo 2-Hour Reset:
 * - Vercel cron configuration
 * - Demo reset engine constants & scope
 * - Reset script existence and service role guard
 * - Reset API route existence and authorization check
 * - Tenant isolation and demo-only reset boundaries
 */

import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

// ---------------------------------------------------------------------------
// 1. Vercel Cron Configuration
// ---------------------------------------------------------------------------

test('vercel.json exists and defines 2-hour cron schedule', () => {
  const vercelJsonPath = resolve(process.cwd(), 'vercel.json');
  assert.ok(existsSync(vercelJsonPath), 'Expected vercel.json to exist');
  const vercelConfig = JSON.parse(readFileSync(vercelJsonPath, 'utf8'));
  assert.ok(Array.isArray(vercelConfig.crons), 'Expected crons array in vercel.json');

  const demoResetCron = vercelConfig.crons.find((c) => c.path === '/api/cron/demo-reset');
  assert.ok(demoResetCron, 'Expected cron entry for /api/cron/demo-reset');
  assert.strictEqual(demoResetCron.schedule, '0 */2 * * *', 'Cron schedule must be every 2 hours');
});

// ---------------------------------------------------------------------------
// 2. Demo Reset Engine Scope & Constants
// ---------------------------------------------------------------------------

test('lib/demo/reset.ts exists and enforces demo-only scope', () => {
  const resetPath = resolve(process.cwd(), 'lib', 'demo', 'reset.ts');
  assert.ok(existsSync(resetPath), 'Expected lib/demo/reset.ts to exist');
  const content = readFileSync(resetPath, 'utf8');

  assert.ok(content.includes('DEMO_ORG_SLUG'), 'Reset engine must reference DEMO_ORG_SLUG');
  assert.ok(content.includes('CANONICAL_CATEGORIES'), 'Reset engine must export CANONICAL_CATEGORIES');
  assert.ok(content.includes('CANONICAL_PRODUCTS'), 'Reset engine must export CANONICAL_PRODUCTS');
  assert.ok(!content.includes('DROP TABLE'), 'Reset engine must never drop tables');
});

// ---------------------------------------------------------------------------
// 3. Reset Script & package.json Script
// ---------------------------------------------------------------------------

test('scripts/reset-demo-workspace.mjs exists with service role guard', () => {
  const scriptPath = resolve(process.cwd(), 'scripts', 'reset-demo-workspace.mjs');
  assert.ok(existsSync(scriptPath), 'Expected scripts/reset-demo-workspace.mjs');
  const content = readFileSync(scriptPath, 'utf8');

  assert.ok(content.includes('SUPABASE_SERVICE_ROLE_KEY'), 'Reset script must require service role key');
  assert.ok(content.includes('innvntory-demo'), 'Reset script must target innvntory-demo org');
  assert.ok(!content.includes('console.log(SERVICE_ROLE_KEY)'), 'Must not log service role key');
});

test('package.json includes demo:reset script', () => {
  const pkgPath = resolve(process.cwd(), 'package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  assert.ok(pkg.scripts?.['demo:reset'], 'package.json must contain demo:reset script');
  assert.ok(pkg.scripts['demo:reset'].includes('reset-demo-workspace'), 'demo:reset must invoke reset script');
});

// ---------------------------------------------------------------------------
// 4. Reset Route Handler
// ---------------------------------------------------------------------------

test('app/api/cron/demo-reset/route.ts exists and checks authorization', () => {
  const routePath = resolve(process.cwd(), 'app', 'api', 'cron', 'demo-reset', 'route.ts');
  assert.ok(existsSync(routePath), 'Expected app/api/cron/demo-reset/route.ts');
  const content = readFileSync(routePath, 'utf8');

  assert.ok(content.includes('CRON_SECRET'), 'Route must check CRON_SECRET / DEMO_RESET_SECRET');
  assert.ok(content.includes('resetDemoWorkspace'), 'Route must invoke resetDemoWorkspace');
  assert.ok(content.includes('401'), 'Route must return 401 when unauthorized');
});
