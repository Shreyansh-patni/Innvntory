/**
 * tests/unit/demo-dataset.test.mjs
 *
 * Unit tests for SETUP 11.6 Complete Demo Data Foundation:
 * - Canonical dataset counts and schema structure
 * - Products, Categories, Warehouses, Customers, Suppliers
 * - Relational integrity rules (FK mappings, GST rates, stock levels)
 * - Reset engine guarantees
 */

import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  DEMO_WAREHOUSES,
  DEMO_CATEGORIES,
  DEMO_PRODUCTS,
  DEMO_CUSTOMERS,
  DEMO_SUPPLIERS,
  DEMO_ORG_SLUG,
} from '../../lib/demo/reset-engine.mjs';

test('canonical warehouses meet count and structure requirements', () => {
  assert.strictEqual(DEMO_WAREHOUSES.length, 3, 'Must have 3 warehouses');
  const defaultCount = DEMO_WAREHOUSES.filter((w) => w.is_default).length;
  assert.strictEqual(defaultCount, 1, 'Exactly one warehouse must be default');

  const codes = new Set(DEMO_WAREHOUSES.map((w) => w.code));
  assert.strictEqual(codes.size, 3, 'Warehouse codes must be unique');
});

test('canonical categories meet count and GST requirements', () => {
  assert.strictEqual(DEMO_CATEGORIES.length, 8, 'Must have 8 categories');
  for (const c of DEMO_CATEGORIES) {
    assert.ok(c.name.length > 0, 'Category name must not be empty');
    assert.ok(c.hsn_code.length >= 4, 'Category HSN code must be valid');
    assert.ok(c.gst_rate_percent === 12 || c.gst_rate_percent === 18, 'GST rate must be 12% or 18%');
  }
});

test('canonical products meet target 50 count and data validation', () => {
  assert.strictEqual(DEMO_PRODUCTS.length, 50, 'Target is 50 products');
  const skus = new Set();
  const barcodes = new Set();
  const categoryNames = new Set(DEMO_CATEGORIES.map((c) => c.name));

  for (const p of DEMO_PRODUCTS) {
    assert.ok(p.name.length > 0, 'Product name required');
    assert.ok(p.sku.length > 0, 'Product SKU required');
    assert.ok(!skus.has(p.sku), `Duplicate SKU: ${p.sku}`);
    skus.add(p.sku);

    assert.ok(p.barcode.length >= 8, 'Barcode required');
    assert.ok(!barcodes.has(p.barcode), `Duplicate barcode: ${p.barcode}`);
    barcodes.add(p.barcode);

    assert.ok(categoryNames.has(p.category), `Product ${p.name} references invalid category ${p.category}`);
    assert.ok(p.cost_price > 0, 'Cost price must be positive');
    assert.ok(p.selling_price > p.cost_price, 'Selling price must exceed cost price');
    assert.ok(p.stock_mumbai >= 0, 'Mumbai stock must be non-negative');
    assert.ok(p.stock_pune >= 0, 'Pune stock must be non-negative');
    assert.ok(p.stock_bangalore >= 0, 'Bangalore stock must be non-negative');
  }
});

test('canonical customers meet target 20 count with valid GSTINs and locations', () => {
  assert.strictEqual(DEMO_CUSTOMERS.length, 20, 'Target is 20 customers');
  const emails = new Set();
  for (const c of DEMO_CUSTOMERS) {
    assert.ok(c.name.length > 0, 'Customer name required');
    assert.ok(!emails.has(c.email), `Duplicate customer email: ${c.email}`);
    emails.add(c.email);
    assert.ok(c.gstin.length === 15, `Valid 15-character GSTIN required: ${c.gstin}`);
    assert.ok(c.credit_limit >= 100000, 'Credit limit must be at least ₹1,00,000');
  }
});

test('canonical suppliers meet target 10 count with payment terms and contacts', () => {
  assert.strictEqual(DEMO_SUPPLIERS.length, 10, 'Target is 10 suppliers');
  for (const s of DEMO_SUPPLIERS) {
    assert.ok(s.name.length > 0, 'Supplier name required');
    assert.ok(s.contact_person.length > 0, 'Contact person required');
    assert.ok(s.payment_terms.includes('Net'), 'Valid payment terms required');
    assert.ok(s.gstin.length === 15, `Valid 15-character GSTIN required: ${s.gstin}`);
  }
});

test('organization slug is strictly isolated to innvntory-demo', () => {
  assert.strictEqual(DEMO_ORG_SLUG, 'innvntory-demo');
});
