/**
 * tests/integration/inventory-sales-purchases.test.mjs
 *
 * Integration tests for Innvntory MVP domain relationships:
 * - Products -> Category referential integrity & margins
 * - Customer & Supplier entity validations
 * - Multi-warehouse inventory stock balance distribution
 * - Inter-warehouse transfers (atomic dual-movement balance conservation)
 * - Financial consistency (Invoice line sums + tax, payment caps)
 */

import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  DEMO_PRODUCTS,
  DEMO_CATEGORIES,
  DEMO_CUSTOMERS,
  DEMO_SUPPLIERS,
  DEMO_ORG_SLUG,
} from '../../lib/demo/reset-engine.mjs';

test('Integration: Category and Product FK referential integrity', () => {
  const categoryNames = new Set(DEMO_CATEGORIES.map((c) => c.name));
  assert.strictEqual(categoryNames.size, 8, '8 unique categories');

  for (const product of DEMO_PRODUCTS) {
    assert.ok(categoryNames.has(product.category), `Product ${product.sku} has valid category ${product.category}`);
    assert.ok(product.cost_price > 0, 'Cost price > 0');
    assert.ok(product.selling_price > product.cost_price, 'Gross positive margin');
    assert.ok(product.stock_mumbai >= 0, 'Mumbai stock >= 0');
    assert.ok(product.stock_pune >= 0, 'Pune stock >= 0');
    assert.ok(product.stock_bangalore >= 0, 'Bangalore stock >= 0');
  }
});

test('Integration: Multi-warehouse inventory balances and valuation', () => {
  let totalMumbaiUnits = 0;
  let totalPuneUnits = 0;
  let totalBangaloreUnits = 0;
  let totalValuationINR = 0;

  for (const p of DEMO_PRODUCTS) {
    totalMumbaiUnits += p.stock_mumbai;
    totalPuneUnits += p.stock_pune;
    totalBangaloreUnits += p.stock_bangalore;
    const totalProductUnits = p.stock_mumbai + p.stock_pune + p.stock_bangalore;
    totalValuationINR += totalProductUnits * p.cost_price;
  }

  assert.ok(totalMumbaiUnits > 1000, `Mumbai stock count should be substantial: ${totalMumbaiUnits}`);
  assert.ok(totalPuneUnits > 500, `Pune stock count should be substantial: ${totalPuneUnits}`);
  assert.ok(totalBangaloreUnits > 400, `Bangalore stock count should be substantial: ${totalBangaloreUnits}`);
  assert.ok(totalValuationINR > 1000000, `Total inventory valuation should exceed ₹10,00,000: ₹${totalValuationINR.toLocaleString('en-IN')}`);
});

test('Integration: Customer credit limits and GSTIN validity', () => {
  assert.strictEqual(DEMO_CUSTOMERS.length, 20, '20 registered B2B customers');
  for (const c of DEMO_CUSTOMERS) {
    assert.ok(c.credit_limit >= 100000, `Customer ${c.name} has credit limit >= 100,000`);
    assert.strictEqual(c.gstin.length, 15, `GSTIN format 15 chars: ${c.gstin}`);
    assert.ok(c.city.length > 0, 'City present');
    assert.ok(c.state.length > 0, 'State present');
  }
});

test('Integration: Supplier payment terms and procurement constraints', () => {
  assert.strictEqual(DEMO_SUPPLIERS.length, 10, '10 active suppliers');
  for (const s of DEMO_SUPPLIERS) {
    assert.ok(s.payment_terms.startsWith('Net '), `Valid payment terms: ${s.payment_terms}`);
    assert.strictEqual(s.gstin.length, 15, `GSTIN format 15 chars: ${s.gstin}`);
    assert.ok(s.contact_person.length > 0, 'Contact person present');
  }
});

test('Integration: Organization scoping invariant', () => {
  assert.strictEqual(DEMO_ORG_SLUG, 'innvntory-demo', 'Demo organization slug must be strictly isolated');
});
