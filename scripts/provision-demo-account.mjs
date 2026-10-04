#!/usr/bin/env node
/**
 * scripts/provision-demo-account.mjs
 *
 * INNVNTORY — DEMO ACCOUNT PROVISIONING SCRIPT
 * Sahaya Technologies Pvt. Ltd.
 *
 * PURPOSE:
 *   Create or repair the isolated Demo Workspace, demo auth user, membership,
 *   role assignment, and seed the full canonical business demo dataset.
 *
 * IDEMPOTENT:
 *   Safe to rerun. Will not create duplicate records.
 *   Will repair missing demo data.
 *
 * USAGE:
 *   npm run demo:provision
 *   -- or directly --
 *   node scripts/provision-demo-account.mjs
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createClient } from '@supabase/supabase-js';
import { resetDemoWorkspace } from '../lib/demo/reset-engine.mjs';

const DEMO_ORG_SLUG = 'innvntory-demo';
const DEMO_ORG_NAME = 'Innvntory Demo Workspace';
const VIEWER_ROLE_ID = '00000000-0000-0000-0000-000000000007';

function loadEnv() {
  try {
    const raw = readFileSync(resolve(process.cwd(), '.env.local'), 'utf8');
    for (const line of raw.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx < 0) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
    // Rely on shell env
  }
}
loadEnv();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DEMO_EMAIL = process.env.NEXT_PUBLIC_DEMO_EMAIL || 'demo@innvntory.sahaya.tech';
const DEMO_PASSWORD = process.env.NEXT_PUBLIC_DEMO_PASSWORD;

if (!SUPABASE_URL || SUPABASE_URL === 'TBD') {
  console.error('[ABORT] NEXT_PUBLIC_SUPABASE_URL is not set. Configure .env.local first.');
  process.exit(1);
}
if (!SERVICE_ROLE_KEY || SERVICE_ROLE_KEY === 'TBD') {
  console.error('[ABORT] SUPABASE_SERVICE_ROLE_KEY is not set. This script requires admin credentials.');
  process.exit(1);
}
if (!DEMO_PASSWORD) {
  console.error('[ABORT] NEXT_PUBLIC_DEMO_PASSWORD is not set. Set it in .env.local before provisioning.');
  process.exit(1);
}

const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function log(msg) { console.log(`[PROVISION] ${msg}`); }
function ok(label, val) { console.log(`  ✓ ${label}: ${val}`); }
function warn(label, msg) { console.warn(`  ⚠ ${label}: ${msg}`); }

// 1. Provision Demo Auth User
log('Step 1 — Demo Auth User');
let demoUserId;
const { data: existingUsers, error: listErr } = await adminClient.auth.admin.listUsers({ perPage: 1000 });
if (listErr) {
  console.error('[ABORT] Failed to list users:', listErr.message);
  process.exit(1);
}

const existingUser = existingUsers?.users?.find(u => u.email === DEMO_EMAIL);

if (existingUser) {
  demoUserId = existingUser.id;
  ok('Auth user found', demoUserId);
  const { error: updateErr } = await adminClient.auth.admin.updateUserById(demoUserId, {
    password: DEMO_PASSWORD,
    email_confirm: true,
    user_metadata: {
      full_name: 'Demo User',
      is_demo_account: true,
    },
  });
  if (updateErr) warn('Auth user update', updateErr.message);
  else ok('Auth user synced (password, email confirmed, metadata)', 'yes');
} else {
  const { data: created, error: createErr } = await adminClient.auth.admin.createUser({
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
    email_confirm: true,
    user_metadata: {
      full_name: 'Demo User',
      is_demo_account: true,
    },
  });
  if (createErr || !created?.user) {
    console.error('[ABORT] Failed to create demo user:', createErr?.message);
    process.exit(1);
  }
  demoUserId = created.user.id;
  ok('Auth user created', demoUserId);
}

// 2. Provision Demo Organization
log('Step 2 — Demo Organization');
let demoOrgId;
const { data: existingOrg, error: orgFindErr } = await adminClient
  .from('organizations')
  .select('id, name, slug')
  .eq('slug', DEMO_ORG_SLUG)
  .maybeSingle();

if (orgFindErr) {
  console.error('[ABORT] Failed to query organizations:', orgFindErr.message);
  process.exit(1);
}

if (existingOrg) {
  demoOrgId = existingOrg.id;
  ok('Organization found', `${existingOrg.name} (${demoOrgId})`);
} else {
  const { data: newOrg, error: orgCreateErr } = await adminClient
    .from('organizations')
    .insert({
      name: DEMO_ORG_NAME,
      slug: DEMO_ORG_SLUG,
      country: 'IN',
      timezone: 'Asia/Kolkata',
      currency: 'INR',
    })
    .select('id')
    .single();

  if (orgCreateErr || !newOrg) {
    console.error('[ABORT] Failed to create organization:', orgCreateErr?.message);
    process.exit(1);
  }
  demoOrgId = newOrg.id;
  ok('Organization created', `${DEMO_ORG_NAME} (${demoOrgId})`);
}

// 3. Provision Membership
log('Step 3 — Membership');
let demoMembershipId;
const { data: existingMembership, error: memFindErr } = await adminClient
  .from('memberships')
  .select('id, status')
  .eq('organization_id', demoOrgId)
  .eq('user_id', demoUserId)
  .maybeSingle();

if (memFindErr) {
  console.error('[ABORT] Failed to query memberships:', memFindErr.message);
  process.exit(1);
}

if (existingMembership) {
  demoMembershipId = existingMembership.id;
  ok('Membership found', `${demoMembershipId} (${existingMembership.status})`);
  if (existingMembership.status !== 'active') {
    await adminClient.from('memberships').update({ status: 'active' }).eq('id', demoMembershipId);
    ok('Membership activated', 'active');
  }
} else {
  const { data: newMem, error: memCreateErr } = await adminClient
    .from('memberships')
    .insert({
      organization_id: demoOrgId,
      user_id: demoUserId,
      status: 'active',
    })
    .select('id')
    .single();

  if (memCreateErr || !newMem) {
    console.error('[ABORT] Failed to create membership:', memCreateErr?.message);
    process.exit(1);
  }
  demoMembershipId = newMem.id;
  ok('Membership created', demoMembershipId);
}

// 4. Assign Viewer Role
log('Step 4 — Role Assignment (viewer)');
const { data: existingRole } = await adminClient
  .from('membership_roles')
  .select('id')
  .eq('membership_id', demoMembershipId)
  .eq('role_id', VIEWER_ROLE_ID)
  .maybeSingle();

if (existingRole) {
  ok('Viewer role', 'already assigned');
} else {
  const { error: roleAssignErr } = await adminClient
    .from('membership_roles')
    .insert({ membership_id: demoMembershipId, role_id: VIEWER_ROLE_ID });

  if (roleAssignErr) warn('Role assignment', roleAssignErr.message);
  else ok('Viewer role assigned', VIEWER_ROLE_ID);
}

// 5. Seed Complete Demo Dataset via Canonical Engine
log('Step 5 — Complete Business Dataset Seeding');
const resetResult = await resetDemoWorkspace(adminClient);

if (!resetResult.success) {
  console.error(`[ABORT] Dataset seeding failed: ${resetResult.error}`);
  process.exit(1);
}

console.log('\n' + '─'.repeat(60));
log('PROVISIONING COMPLETE — FULL BUSINESS DATASET ACTIVE');
console.log('─'.repeat(60));
console.log(`  Organization:         ${DEMO_ORG_NAME} (${DEMO_ORG_SLUG})`);
console.log(`  Org ID:               ${demoOrgId}`);
console.log(`  Auth User ID:         ${demoUserId}`);
console.log(`  Demo Email:           ${DEMO_EMAIL}`);
console.log(`  Membership ID:        ${demoMembershipId}`);
console.log(`  Role:                 viewer (${VIEWER_ROLE_ID})`);
console.log(`  Warehouses:           ${resetResult.counts.warehouses}`);
console.log(`  Categories:           ${resetResult.counts.categories}`);
console.log(`  Products:             ${resetResult.counts.products}`);
console.log(`  Stock Balances:       ${resetResult.counts.stockBalances}`);
console.log(`  Customers:            ${resetResult.counts.customers}`);
console.log(`  Suppliers:            ${resetResult.counts.suppliers}`);
console.log(`  Purchase Orders:      ${resetResult.counts.purchaseOrders}`);
console.log(`  PO Line Items:        ${resetResult.counts.purchaseOrderItems}`);
console.log(`  Purchase Receipts:    ${resetResult.counts.purchaseReceipts}`);
console.log(`  Purchase Payments:    ${resetResult.counts.purchasePayments}`);
console.log(`  Purchase Returns:     ${resetResult.counts.purchaseReturns}`);
console.log(`  Sales Orders:         ${resetResult.counts.salesOrders}`);
console.log(`  SO Line Items:        ${resetResult.counts.salesOrderItems}`);
console.log(`  Invoices:             ${resetResult.counts.invoices}`);
console.log(`  Sales Payments:       ${resetResult.counts.salesPayments}`);
console.log(`  Sales Returns:        ${resetResult.counts.salesReturns}`);
console.log(`  Transfers:            ${resetResult.counts.inventoryTransfers}`);
console.log(`  Adjustments:          ${resetResult.counts.inventoryAdjustments}`);
console.log(`  Inventory Movements:  ${resetResult.counts.inventoryMovements}`);
console.log('─'.repeat(60) + '\n');
