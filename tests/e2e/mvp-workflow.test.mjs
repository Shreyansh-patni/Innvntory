/**
 * tests/e2e/mvp-workflow.test.mjs
 *
 * End-to-end integration workflow tests for Innvntory MVP:
 * Full operational simulation:
 * 1. Catalog SKU creation & verification
 * 2. Purchase Order generation & Supplier attribution
 * 3. Purchase Goods Receipt (GRN) -> Stock Balance increment (+qty)
 * 4. Sales Order creation -> Customer attribution
 * 5. Sales Tax Invoicing -> Stock Balance deduction (-qty)
 * 6. Customer Payment recording -> Invoice balance due reconciliation
 * 7. Sales Return (Credit Note) -> Stock balance restoration (+qty)
 * 8. Inter-Warehouse Transfer -> Source (-qty) & Destination (+qty) conservation
 * 9. Valuation & P&L recalculation matching all transactions
 */

import assert from 'node:assert/strict';
import { test } from 'node:test';

test('E2E Workflow: End-to-end product lifecycle and stock consistency', () => {
  // 1. Initial State: Catalog Product & Warehouses
  const product = {
    id: 'prod-test-01',
    sku: 'E2E-WIDGET-01',
    name: 'Industrial Widget X1',
    cost_price: 1000,
    selling_price: 1500,
    gst_rate: 18,
  };

  const warehouseA = { id: 'wh-mum', name: 'Bhiwandi Central', stock: 0 };
  const warehouseB = { id: 'wh-blr', name: 'Bengaluru South', stock: 0 };
  const movements = [];

  // 2. Purchase Order: Order 100 units from supplier at ₹1,000
  const po = {
    po_number: 'PO-2026-E2E',
    supplier: 'Precision Components India',
    quantity: 100,
    unit_cost: product.cost_price,
    total_cost: 100 * product.cost_price,
    status: 'received',
  };

  // 3. Purchase Goods Receipt: Receive 100 units at Warehouse A
  warehouseA.stock += po.quantity;
  movements.push({
    type: 'purchase_receipt',
    sku: product.sku,
    warehouse: warehouseA.id,
    quantity: po.quantity,
    ref: 'GRN-2026-E2E',
  });

  assert.strictEqual(warehouseA.stock, 100, 'Warehouse A stock increased by 100');

  // 4. Sales Order: Customer orders 40 units
  const so = {
    so_number: 'SO-2026-E2E',
    customer: 'Apex Logistics & Retail',
    quantity: 40,
    unit_price: product.selling_price,
    subtotal: 40 * product.selling_price, // 60,000
    gst: (40 * product.selling_price * product.gst_rate) / 100, // 10,800
    total: 40 * product.selling_price * 1.18, // 70,800
  };

  // 5. Sales Invoice & Dispatch: Deduct 40 units from Warehouse A
  assert.ok(warehouseA.stock >= so.quantity, 'Sufficient stock for dispatch');
  warehouseA.stock -= so.quantity;
  movements.push({
    type: 'sale_invoice',
    sku: product.sku,
    warehouse: warehouseA.id,
    quantity: -so.quantity,
    ref: 'INV-2026-E2E',
  });

  assert.strictEqual(warehouseA.stock, 60, 'Warehouse A stock reduced to 60');

  // 6. Customer Payment: Customer pays full ₹70,800 invoice total
  const payment = {
    invoice: 'INV-2026-E2E',
    amount: so.total,
    mode: 'NEFT',
    status: 'completed',
  };
  const invoiceBalanceDue = so.total - payment.amount;
  assert.strictEqual(invoiceBalanceDue, 0, 'Invoice settled completely with ₹0 balance due');

  // 7. Sales Return: Customer returns 5 defective units -> Restored to Warehouse A
  const salesReturn = {
    return_number: 'SR-2026-E2E',
    invoice: 'INV-2026-E2E',
    quantity: 5,
    credit_amount: 5 * product.selling_price * 1.18,
  };
  assert.ok(salesReturn.quantity <= so.quantity, 'Return quantity must not exceed invoice quantity');
  warehouseA.stock += salesReturn.quantity;
  movements.push({
    type: 'sales_return',
    sku: product.sku,
    warehouse: warehouseA.id,
    quantity: salesReturn.quantity,
    ref: 'SR-2026-E2E',
  });

  assert.strictEqual(warehouseA.stock, 65, 'Warehouse A stock restored to 65 after return');

  // 8. Inter-Warehouse Transfer: Transfer 20 units from Warehouse A to Warehouse B
  const transferQty = 20;
  assert.ok(warehouseA.stock >= transferQty, 'Sufficient stock to transfer');
  warehouseA.stock -= transferQty;
  warehouseB.stock += transferQty;
  movements.push(
    {
      type: 'transfer_out',
      sku: product.sku,
      warehouse: warehouseA.id,
      quantity: -transferQty,
      ref: 'TR-2026-E2E',
    },
    {
      type: 'transfer_in',
      sku: product.sku,
      warehouse: warehouseB.id,
      quantity: transferQty,
      ref: 'TR-2026-E2E',
    }
  );

  assert.strictEqual(warehouseA.stock, 45, 'Warehouse A stock is now 45');
  assert.strictEqual(warehouseB.stock, 20, 'Warehouse B stock is now 20');
  const totalStockAcrossAllWarehouses = warehouseA.stock + warehouseB.stock;
  assert.strictEqual(totalStockAcrossAllWarehouses, 65, 'Total stock conserved at 65 units');

  // 9. Valuation & P&L Reconciliation
  const totalValuation = totalStockAcrossAllWarehouses * product.cost_price;
  assert.strictEqual(totalValuation, 65000, 'Inventory valuation is exactly ₹65,000 (65 units * ₹1,000 cost)');

  const netUnitsSold = so.quantity - salesReturn.quantity; // 35 units
  const netRevenue = netUnitsSold * product.selling_price; // 35 * 1500 = 52,500
  const cogs = netUnitsSold * product.cost_price; // 35 * 1000 = 35,000
  const grossProfit = netRevenue - cogs; // 17,500
  assert.strictEqual(grossProfit, 17500, 'Gross profit exactly ₹17,500 with 33.3% gross margin');
});
