#!/usr/bin/env node
/**
 * scripts/reset-demo-workspace.mjs
 *
 * INNVNTORY — MANUAL DEMO WORKSPACE RESET SCRIPT
 * Sahaya Technologies Pvt. Ltd.
 *
 * PURPOSE:
 *   Manually triggers the comprehensive 2-hour demo reset logic from an administrative terminal
 *   for testing, verification, or ad-hoc baseline restoration.
 *
 * USAGE:
 *   npm run demo:reset
 *   -- or directly --
 *   node scripts/reset-demo-workspace.mjs
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createClient } from '@supabase/supabase-js';
import { resetDemoWorkspace } from '../lib/demo/reset-engine.mjs';

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

if (!SUPABASE_URL || SUPABASE_URL === 'TBD') {
  console.error('[ABORT] NEXT_PUBLIC_SUPABASE_URL is not set.');
  process.exit(1);
}
if (!SERVICE_ROLE_KEY || SERVICE_ROLE_KEY === 'TBD') {
  console.error('[ABORT] SUPABASE_SERVICE_ROLE_KEY is not set. This script requires admin credentials.');
  process.exit(1);
}

const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const DEMO_ORG_SLUG = 'innvntory-demo';

console.log(`[RESET] Initiating comprehensive demo workspace reset for '${DEMO_ORG_SLUG}'...`);

const result = await resetDemoWorkspace(adminClient);

if (!result.success) {
  console.error(`\n[RESET ERROR] ${result.error}`);
  process.exit(1);
}

console.log('\n' + '─'.repeat(60));
console.log('RESET COMPLETE — CANONICAL DEMO DATASET RESTORED');
console.log('─'.repeat(60));
console.log(`  Organization:         ${result.organizationSlug} (${result.organizationId})`);
console.log(`  Warehouses:           ${result.counts.warehouses}`);
console.log(`  Categories:           ${result.counts.categories}`);
console.log(`  Products:             ${result.counts.products}`);
console.log(`  Stock Balances:       ${result.counts.stockBalances}`);
console.log(`  Customers:            ${result.counts.customers}`);
console.log(`  Suppliers:            ${result.counts.suppliers}`);
console.log(`  Purchase Orders:      ${result.counts.purchaseOrders}`);
console.log(`  PO Line Items:        ${result.counts.purchaseOrderItems}`);
console.log(`  Purchase Receipts:    ${result.counts.purchaseReceipts}`);
console.log(`  Purchase Payments:    ${result.counts.purchasePayments}`);
console.log(`  Purchase Returns:     ${result.counts.purchaseReturns}`);
console.log(`  Sales Orders:         ${result.counts.salesOrders}`);
console.log(`  SO Line Items:        ${result.counts.salesOrderItems}`);
console.log(`  Invoices:             ${result.counts.invoices}`);
console.log(`  Sales Payments:       ${result.counts.salesPayments}`);
console.log(`  Sales Returns:        ${result.counts.salesReturns}`);
console.log(`  Transfers:            ${result.counts.inventoryTransfers}`);
console.log(`  Adjustments:          ${result.counts.inventoryAdjustments}`);
console.log(`  Inventory Movements:  ${result.counts.inventoryMovements}`);
console.log(`  Duration:             ${result.durationMs}ms`);
console.log('─'.repeat(60) + '\n');
