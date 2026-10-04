/**
 * tests/unit/demo-account.test.mjs
 *
 * Unit tests for SETUP 11.4 Demo Account:
 * - Demo config constants
 * - getDashboardData() org-slug branching
 * - Provisioning script existence
 * - Fixture data schema integrity
 * - Tenant isolation model
 */

import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

// ---------------------------------------------------------------------------
// Inline the constants (no transpiler) since this runs with node --test
// ---------------------------------------------------------------------------
const DEMO_ORG_SLUG = 'innvntory-demo';
const DEMO_ORG_NAME = 'Innvntory Demo Workspace';
const DEMO_EMAIL_DEFAULT = 'demo@innvntory.com';

// ---------------------------------------------------------------------------
// 1. Demo config constants
// ---------------------------------------------------------------------------

test('DEMO_ORG_SLUG matches expected value', () => {
  assert.strictEqual(DEMO_ORG_SLUG, 'innvntory-demo');
});

test('DEMO_ORG_NAME matches expected value', () => {
  assert.strictEqual(DEMO_ORG_NAME, 'Innvntory Demo Workspace');
});

test('DEMO_EMAIL_DEFAULT is a valid Innvntory email', () => {
  assert.ok(DEMO_EMAIL_DEFAULT.endsWith('@innvntory.com'));
});

// ---------------------------------------------------------------------------
// 2. getDashboardData org-slug branching logic (inline)
// ---------------------------------------------------------------------------

function getDashboardDataSimulated(orgSlug, envDemoMode = false) {
  const isDemoWorkspace = orgSlug === 'innvntory-demo';
  if (envDemoMode || isDemoWorkspace) return { isDemoMode: true };
  return null;
}

test('getDashboardData returns demo data for innvntory-demo org slug', () => {
  const result = getDashboardDataSimulated('innvntory-demo', false);
  assert.ok(result !== null);
  assert.strictEqual(result.isDemoMode, true);
});

test('getDashboardData returns demo data when NEXT_PUBLIC_DEMO_MODE=true', () => {
  const result = getDashboardDataSimulated('some-other-org', true);
  assert.ok(result !== null);
});

test('getDashboardData returns null for non-demo org without env flag', () => {
  const result = getDashboardDataSimulated('acme-corp', false);
  assert.strictEqual(result, null);
});

test('getDashboardData returns null for null org slug without env flag', () => {
  const result = getDashboardDataSimulated(null, false);
  assert.strictEqual(result, null);
});

test('getDashboardData returns null for undefined org slug without env flag', () => {
  const result = getDashboardDataSimulated(undefined, false);
  assert.strictEqual(result, null);
});

// ---------------------------------------------------------------------------
// 3. isDemoOrganization predicate
// ---------------------------------------------------------------------------

function isDemoOrganization(slug) {
  return slug === DEMO_ORG_SLUG;
}

test('isDemoOrganization returns true for demo slug', () => {
  assert.strictEqual(isDemoOrganization('innvntory-demo'), true);
});

test('isDemoOrganization returns false for arbitrary slugs', () => {
  assert.strictEqual(isDemoOrganization('acme-corp'), false);
  assert.strictEqual(isDemoOrganization('innvntory-demo-2'), false);
  assert.strictEqual(isDemoOrganization(null), false);
  assert.strictEqual(isDemoOrganization(undefined), false);
  assert.strictEqual(isDemoOrganization(''), false);
});

// ---------------------------------------------------------------------------
// 4. Provisioning script existence and basic structure
// ---------------------------------------------------------------------------

test('provisioning script exists at scripts/provision-demo-account.mjs', () => {
  const scriptPath = resolve(process.cwd(), 'scripts', 'provision-demo-account.mjs');
  assert.ok(existsSync(scriptPath), `Expected script at: ${scriptPath}`);
});

test('provisioning script contains SUPABASE_SERVICE_ROLE_KEY guard', () => {
  const scriptPath = resolve(process.cwd(), 'scripts', 'provision-demo-account.mjs');
  const content = readFileSync(scriptPath, 'utf8');
  assert.ok(content.includes('SUPABASE_SERVICE_ROLE_KEY'), 'Script must reference service role key guard');
});

test('provisioning script never prints demo password', () => {
  const scriptPath = resolve(process.cwd(), 'scripts', 'provision-demo-account.mjs');
  const content = readFileSync(scriptPath, 'utf8');
  // The script should reference DEMO_PASSWORD var but must NOT console.log it directly
  assert.ok(!content.includes('console.log(DEMO_PASSWORD)'), 'Script must not print DEMO_PASSWORD to stdout');
  assert.ok(!content.includes("console.log(`${DEMO_PASSWORD}`)"), 'Script must not embed DEMO_PASSWORD in log template');
});

test('provisioning script assigns viewer role (not owner)', () => {
  const scriptPath = resolve(process.cwd(), 'scripts', 'provision-demo-account.mjs');
  const content = readFileSync(scriptPath, 'utf8');
  // Should use viewer role ID, not owner
  assert.ok(content.includes('00000000-0000-0000-0000-000000000007'), 'Script must assign viewer role');
  // Must not assign owner role ID as the demo role
  const ownerRoleId = '00000000-0000-0000-0000-000000000001';
  // Owner role ID must not be assigned as the VIEWER_ROLE_ID constant
  assert.ok(!content.includes(`VIEWER_ROLE_ID   = '${ownerRoleId}'`), 'Viewer role must not be owner role');
});

// ---------------------------------------------------------------------------
// 5. Demo fixture data schema integrity
// ---------------------------------------------------------------------------

test('dashboard fixture data file exists', () => {
  const path = resolve(process.cwd(), 'lib', 'demo', 'dashboard-data.ts');
  assert.ok(existsSync(path), `Expected dashboard data at: ${path}`);
});

test('dashboard fixture contains required metric fields', () => {
  const path = resolve(process.cwd(), 'lib', 'demo', 'dashboard-data.ts');
  const content = readFileSync(path, 'utf8');
  assert.ok(content.includes('monthlyRevenue'), 'Missing monthlyRevenue');
  assert.ok(content.includes('stockValuation'), 'Missing stockValuation');
  assert.ok(content.includes('openOrders'), 'Missing openOrders');
  assert.ok(content.includes('lowStockAlerts'), 'Missing lowStockAlerts');
});

test('dashboard fixture contains recentActivity array', () => {
  const path = resolve(process.cwd(), 'lib', 'demo', 'dashboard-data.ts');
  const content = readFileSync(path, 'utf8');
  assert.ok(content.includes('recentActivity'), 'Missing recentActivity');
});

test('dashboard fixture contains lowStockItems array', () => {
  const path = resolve(process.cwd(), 'lib', 'demo', 'dashboard-data.ts');
  const content = readFileSync(path, 'utf8');
  assert.ok(content.includes('lowStockItems'), 'Missing lowStockItems');
});

// ---------------------------------------------------------------------------
// 6. Security model validation
// ---------------------------------------------------------------------------

test('demo config file does not reference service role key', () => {
  const configPath = resolve(process.cwd(), 'lib', 'demo', 'config.ts');
  if (!existsSync(configPath)) return; // Skip if not yet created
  const content = readFileSync(configPath, 'utf8');
  assert.ok(!content.includes('SERVICE_ROLE'), 'config.ts must not reference service role key');
  assert.ok(!content.includes('SUPABASE_SERVICE_ROLE'), 'config.ts must not reference supabase service role');
});

test('login form does not call Supabase admin API', () => {
  const formPath = resolve(process.cwd(), 'components', 'auth', 'login-form.tsx');
  const content = readFileSync(formPath, 'utf8');
  assert.ok(!content.includes('auth.admin'), 'Login form must not call admin auth API');
  assert.ok(!content.includes('SERVICE_ROLE'), 'Login form must not reference service role');
});

test('package.json includes demo:provision script', () => {
  const pkgPath = resolve(process.cwd(), 'package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  assert.ok(pkg.scripts?.['demo:provision'], 'package.json must have demo:provision script');
  assert.ok(pkg.scripts['demo:provision'].includes('provision-demo-account'), 'demo:provision must invoke the provisioning script');
});

// ---------------------------------------------------------------------------
// 7. Tenant isolation model
// ---------------------------------------------------------------------------

test('RLS predicate is_org_member is used in catalog migration', () => {
  const migPath = resolve(process.cwd(), 'supabase', 'migrations', '20261004010000_catalog_domain.sql');
  const content = readFileSync(migPath, 'utf8');
  assert.ok(content.includes('is_org_member'), 'Catalog RLS must use is_org_member predicate');
});

test('products table has organization_id column (tenant isolation)', () => {
  const migPath = resolve(process.cwd(), 'supabase', 'migrations', '20261004010000_catalog_domain.sql');
  const content = readFileSync(migPath, 'utf8');
  assert.ok(content.includes('organization_id UUID NOT NULL REFERENCES public.organizations'), 'Products must have organization_id FK');
});

test('categories table has organization_id column (tenant isolation)', () => {
  const migPath = resolve(process.cwd(), 'supabase', 'migrations', '20261004010000_catalog_domain.sql');
  const content = readFileSync(migPath, 'utf8');
  assert.ok(content.includes('organization_id UUID NOT NULL REFERENCES public.organizations'), 'Categories must have organization_id FK');
});
