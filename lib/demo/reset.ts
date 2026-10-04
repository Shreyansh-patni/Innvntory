/**
 * lib/demo/reset.ts
 *
 * INNVNTORY — COMPREHENSIVE DEMO WORKSPACE RESET ENGINE
 * Sahaya Technologies Pvt. Ltd.
 *
 * PURPOSE:
 *   Deterministically resets the isolated "Innvntory Demo Workspace" (slug: innvntory-demo)
 *   to its canonical complete baseline.
 *
 * SAFETY GUARDS:
 *   1. Scoped strictly to organization slug 'innvntory-demo'.
 *   2. Fails closed if the demo organization cannot be verified.
 *   3. Never touches non-demo organizations, customers, or external records.
 *   4. Preserves the demo auth user, organization row, membership, and role.
 *   5. Idempotent and deterministic — multiple executions result in the exact same state.
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { DEMO_ORG_SLUG } from './config';
import {
  DEMO_WAREHOUSES,
  DEMO_CATEGORIES,
  DEMO_PRODUCTS,
  DEMO_CUSTOMERS,
  DEMO_SUPPLIERS,
  UNIT_PCS,
  UNIT_BOX,
  UNIT_SET,
} from './dataset';

export interface ResetResult {
  success: boolean;
  organizationId?: string;
  organizationSlug: string;
  counts: {
    warehouses: number;
    categories: number;
    products: number;
    stockBalances: number;
    customers: number;
    suppliers: number;
    purchaseOrders: number;
    purchaseOrderItems: number;
    purchaseReceipts: number;
    purchasePayments: number;
    purchaseReturns: number;
    salesOrders: number;
    salesOrderItems: number;
    invoices: number;
    salesPayments: number;
    salesReturns: number;
    inventoryTransfers: number;
    inventoryAdjustments: number;
    inventoryMovements: number;
  };
  durationMs: number;
  error?: string;
}

export async function resetDemoWorkspace(
  supabaseAdmin: SupabaseClient
): Promise<ResetResult> {
  const startTime = Date.now();

  const counts = {
    warehouses: 0,
    categories: 0,
    products: 0,
    stockBalances: 0,
    customers: 0,
    suppliers: 0,
    purchaseOrders: 0,
    purchaseOrderItems: 0,
    purchaseReceipts: 0,
    purchasePayments: 0,
    purchaseReturns: 0,
    salesOrders: 0,
    salesOrderItems: 0,
    invoices: 0,
    salesPayments: 0,
    salesReturns: 0,
    inventoryTransfers: 0,
    inventoryAdjustments: 0,
    inventoryMovements: 0,
  };

  try {
    // 1. Verify demo organization
    const { data: demoOrg, error: orgErr } = await supabaseAdmin
      .from('organizations')
      .select('id, name, slug')
      .eq('slug', DEMO_ORG_SLUG)
      .maybeSingle();

    if (orgErr || !demoOrg) {
      throw new Error(
        `Demo organization '${DEMO_ORG_SLUG}' not found or unreachable: ${orgErr?.message ?? 'missing'}`
      );
    }

    const orgId = demoOrg.id;

    // 2. Prune existing demo records in reverse dependency order
    const tablesToClean = [
      'inventory_movements',
      'inventory_adjustments',
      'inventory_transfers',
      'sales_returns',
      'sales_payments',
      'invoices',
      'sales_order_items',
      'sales_orders',
      'purchase_returns',
      'purchase_payments',
      'purchase_receipts',
      'purchase_order_items',
      'purchase_orders',
      'stock_balances',
      'products',
      'categories',
      'suppliers',
      'customers',
      'warehouses',
    ];

    for (const table of tablesToClean) {
      const { error: delErr } = await supabaseAdmin
        .from(table)
        .delete()
        .eq('organization_id', orgId);

      if (delErr) {
        console.warn(`[DEMO_RESET] Warning deleting from ${table}: ${delErr.message}`);
      }
    }

    // 3. Insert Warehouses
    const warehouseRows = DEMO_WAREHOUSES.map((w) => ({
      organization_id: orgId,
      code: w.code,
      name: w.name,
      city: w.city,
      state: w.state,
      is_default: w.is_default,
      status: 'active',
    }));

    const { data: insertedWarehouses, error: whErr } = await supabaseAdmin
      .from('warehouses')
      .insert(warehouseRows)
      .select('id, code, name');

    if (whErr || !insertedWarehouses) {
      throw new Error(`Failed to insert warehouses: ${whErr?.message}`);
    }
    counts.warehouses = insertedWarehouses.length;
    const whMap = new Map(insertedWarehouses.map((w) => [w.code, w.id]));
    const mumWhId = whMap.get('WH-MUM')!;
    const punWhId = whMap.get('WH-PUN')!;
    const blrWhId = whMap.get('WH-BLR')!;

    // 4. Insert Categories
    const categoryRows = DEMO_CATEGORIES.map((c) => ({
      organization_id: orgId,
      name: c.name,
      description: c.description,
      hsn_code: c.hsn_code,
      gst_rate_percent: c.gst_rate_percent,
    }));

    const { data: insertedCategories, error: catErr } = await supabaseAdmin
      .from('categories')
      .insert(categoryRows)
      .select('id, name, gst_rate_percent');

    if (catErr || !insertedCategories) {
      throw new Error(`Failed to insert categories: ${catErr?.message}`);
    }
    counts.categories = insertedCategories.length;
    const catMap = new Map(insertedCategories.map((c) => [c.name, c]));

    // 5. Insert Products (50 Products)
    const productRows = DEMO_PRODUCTS.map((p) => {
      const cat = catMap.get(p.category);
      return {
        organization_id: orgId,
        name: p.name,
        sku: p.sku,
        barcode: p.barcode,
        category_id: cat ? cat.id : null,
        unit_id: p.unit_id,
        cost_price: p.cost_price,
        selling_price: p.selling_price,
        description: p.description,
        status: 'active',
      };
    });

    const { data: insertedProducts, error: prodErr } = await supabaseAdmin
      .from('products')
      .insert(productRows)
      .select('id, sku, name, cost_price, selling_price, category_id');

    if (prodErr || !insertedProducts) {
      throw new Error(`Failed to insert products: ${prodErr?.message}`);
    }
    counts.products = insertedProducts.length;
    const prodMap = new Map(insertedProducts.map((p) => [p.sku, p]));
    const prodList = insertedProducts;

    // 6. Insert Stock Balances (50 Products x 3 Warehouses = 150 records)
    const stockBalanceRows: any[] = [];
    for (const p of DEMO_PRODUCTS) {
      const dbProd = prodMap.get(p.sku);
      if (!dbProd) continue;

      stockBalanceRows.push(
        {
          organization_id: orgId,
          product_id: dbProd.id,
          warehouse_id: mumWhId,
          quantity: p.stock_mumbai,
          reorder_level: p.reorder_level,
          reserved_quantity: Math.floor(p.stock_mumbai * 0.1),
        },
        {
          organization_id: orgId,
          product_id: dbProd.id,
          warehouse_id: punWhId,
          quantity: p.stock_pune,
          reorder_level: Math.floor(p.reorder_level * 0.6),
          reserved_quantity: Math.floor(p.stock_pune * 0.08),
        },
        {
          organization_id: orgId,
          product_id: dbProd.id,
          warehouse_id: blrWhId,
          quantity: p.stock_bangalore,
          reorder_level: Math.floor(p.reorder_level * 0.5),
          reserved_quantity: Math.floor(p.stock_bangalore * 0.05),
        }
      );
    }

    const { error: stockErr } = await supabaseAdmin
      .from('stock_balances')
      .insert(stockBalanceRows);

    if (stockErr) throw new Error(`Failed to insert stock balances: ${stockErr.message}`);
    counts.stockBalances = stockBalanceRows.length;

    // 7. Insert Customers (20)
    const customerRows = DEMO_CUSTOMERS.map((c) => ({
      organization_id: orgId,
      name: c.name,
      company_name: c.company_name,
      email: c.email,
      phone: c.phone,
      gstin: c.gstin,
      city: c.city,
      state: c.state,
      credit_limit: c.credit_limit,
      outstanding_balance: 0,
      status: 'active',
    }));

    const { data: insertedCustomers, error: custErr } = await supabaseAdmin
      .from('customers')
      .insert(customerRows)
      .select('id, name, city');

    if (custErr || !insertedCustomers) {
      throw new Error(`Failed to insert customers: ${custErr?.message}`);
    }
    counts.customers = insertedCustomers.length;

    // 8. Insert Suppliers (10)
    const supplierRows = DEMO_SUPPLIERS.map((s) => ({
      organization_id: orgId,
      name: s.name,
      contact_person: s.contact_person,
      email: s.email,
      phone: s.phone,
      gstin: s.gstin,
      city: s.city,
      state: s.state,
      payment_terms: s.payment_terms,
      status: 'active',
    }));

    const { data: insertedSuppliers, error: suppErr } = await supabaseAdmin
      .from('suppliers')
      .insert(supplierRows)
      .select('id, name');

    if (suppErr || !insertedSuppliers) {
      throw new Error(`Failed to insert suppliers: ${suppErr?.message}`);
    }
    counts.suppliers = insertedSuppliers.length;

    // Base timeline reference: past 90 days
    const now = new Date('2026-10-04T12:00:00Z').getTime();
    const dayMs = 24 * 60 * 60 * 1000;

    // 9. Generate and Insert Purchase Orders (25 POs)
    const poList: any[] = [];
    const poItemRows: any[] = [];
    const whIds = [mumWhId, punWhId, blrWhId];

    for (let i = 1; i <= 25; i++) {
      const poNum = `PO-2026-${String(1000 + i).slice(1)}`;
      const supp = insertedSuppliers[(i - 1) % insertedSuppliers.length];
      const whId = whIds[(i - 1) % whIds.length];
      const daysAgo = 88 - Math.floor((i * 85) / 25);
      const orderDate = new Date(now - daysAgo * dayMs).toISOString().split('T')[0];
      const status = i <= 20 ? 'received' : i <= 23 ? 'partially_received' : 'sent';

      poList.push({
        organization_id: orgId,
        po_number: poNum,
        supplier_id: supp.id,
        warehouse_id: whId,
        status,
        subtotal: 0,
        tax_amount: 0,
        total_amount: 0,
        order_date: orderDate,
        expected_delivery: new Date(now - (daysAgo - 5) * dayMs).toISOString().split('T')[0],
      });
    }

    const { data: insertedPOs, error: poErr } = await supabaseAdmin
      .from('purchase_orders')
      .insert(poList)
      .select('id, po_number, supplier_id, warehouse_id, status, order_date');

    if (poErr || !insertedPOs) throw new Error(`Failed to insert purchase orders: ${poErr?.message}`);
    counts.purchaseOrders = insertedPOs.length;

    // Build PO Items & update PO totals
    const poUpdates: { id: string; subtotal: number; tax_amount: number; total_amount: number }[] = [];
    const receiptRows: any[] = [];
    const purchPaymentRows: any[] = [];
    const purchReturnRows: any[] = [];
    const movementRows: any[] = [];

    insertedPOs.forEach((po, idx) => {
      let subtotal = 0;
      let taxTotal = 0;
      const itemCount = 2 + (idx % 3); // 2 to 4 items per PO

      for (let j = 0; j < itemCount; j++) {
        const prod = prodList[(idx * 2 + j) % prodList.length];
        const qty = 20 + ((idx * 5 + j * 7) % 50);
        const unitCost = Number(prod.cost_price);
        const taxRate = 18.0;
        const lineSubtotal = qty * unitCost;
        const lineTax = (lineSubtotal * taxRate) / 100;
        const lineTotal = lineSubtotal + lineTax;

        subtotal += lineSubtotal;
        taxTotal += lineTax;

        poItemRows.push({
          organization_id: orgId,
          purchase_order_id: po.id,
          product_id: prod.id,
          quantity: qty,
          unit_price: unitCost,
          tax_rate: taxRate,
          tax_amount: lineTax,
          total_amount: lineTotal,
          received_quantity: po.status === 'received' ? qty : po.status === 'partially_received' ? Math.floor(qty * 0.5) : 0,
        });

        // If received, create inventory movement
        if (po.status === 'received' || po.status === 'partially_received') {
          const recQty = po.status === 'received' ? qty : Math.floor(qty * 0.5);
          movementRows.push({
            organization_id: orgId,
            product_id: prod.id,
            warehouse_id: po.warehouse_id,
            movement_type: 'purchase_receipt',
            quantity: recQty,
            unit_cost: unitCost,
            reference_number: po.po_number,
            notes: `Purchase Receipt for ${po.po_number}`,
            created_at: new Date(new Date(po.order_date).getTime() + 3 * dayMs).toISOString(),
          });
        }
      }

      poUpdates.push({
        id: po.id,
        subtotal,
        tax_amount: taxTotal,
        total_amount: subtotal + taxTotal,
      });

      // Receipts for received POs
      if (po.status === 'received' || po.status === 'partially_received') {
        receiptRows.push({
          organization_id: orgId,
          receipt_number: `GRN-2026-${String(1000 + idx + 1).slice(1)}`,
          purchase_order_id: po.id,
          supplier_id: po.supplier_id,
          warehouse_id: po.warehouse_id,
          status: 'verified',
          receipt_date: new Date(new Date(po.order_date).getTime() + 3 * dayMs).toISOString(),
          notes: `Goods received against ${po.po_number}`,
        });
      }

      // Payments for received POs
      if (idx < 20) {
        purchPaymentRows.push({
          organization_id: orgId,
          payment_number: `PPAY-2026-${String(1000 + idx + 1).slice(1)}`,
          purchase_order_id: po.id,
          supplier_id: po.supplier_id,
          amount: subtotal + taxTotal,
          payment_method: 'neft',
          status: 'completed',
          payment_date: new Date(new Date(po.order_date).getTime() + 10 * dayMs).toISOString(),
          reference_number: `NEFT-SUPP-${100000 + idx}`,
        });
      }

      // 4 Supplier returns
      if (idx === 3 || idx === 8 || idx === 14 || idx === 19) {
        const retProd = prodList[(idx * 2) % prodList.length];
        purchReturnRows.push({
          organization_id: orgId,
          return_number: `PRET-2026-00${purchReturnRows.length + 1}`,
          purchase_order_id: po.id,
          supplier_id: po.supplier_id,
          warehouse_id: po.warehouse_id,
          product_id: retProd.id,
          quantity: 4,
          reason: 'Defective batch returned to supplier',
          status: 'completed',
          created_at: new Date(new Date(po.order_date).getTime() + 7 * dayMs).toISOString(),
        });

        movementRows.push({
          organization_id: orgId,
          product_id: retProd.id,
          warehouse_id: po.warehouse_id,
          movement_type: 'purchase_return',
          quantity: -4,
          unit_cost: Number(retProd.cost_price),
          reference_number: `PRET-2026-00${purchReturnRows.length}`,
          notes: 'Returned damaged items to supplier',
          created_at: new Date(new Date(po.order_date).getTime() + 7 * dayMs).toISOString(),
        });
      }
    });

    // Bulk insert PO items
    const { error: poItemErr } = await supabaseAdmin
      .from('purchase_order_items')
      .insert(poItemRows);
    if (poItemErr) throw new Error(`Failed to insert PO items: ${poItemErr.message}`);
    counts.purchaseOrderItems = poItemRows.length;

    // Update PO totals
    for (const u of poUpdates) {
      await supabaseAdmin.from('purchase_orders').update({
        subtotal: u.subtotal,
        tax_amount: u.tax_amount,
        total_amount: u.total_amount,
      }).eq('id', u.id);
    }

    // Insert receipts
    const { error: recErr } = await supabaseAdmin.from('purchase_receipts').insert(receiptRows);
    if (recErr) throw new Error(`Failed to insert receipts: ${recErr.message}`);
    counts.purchaseReceipts = receiptRows.length;

    // Insert purchase payments
    const { error: pPayErr } = await supabaseAdmin.from('purchase_payments').insert(purchPaymentRows);
    if (pPayErr) throw new Error(`Failed to insert purchase payments: ${pPayErr.message}`);
    counts.purchasePayments = purchPaymentRows.length;

    // Insert purchase returns
    const { error: pRetErr } = await supabaseAdmin.from('purchase_returns').insert(purchReturnRows);
    if (pRetErr) throw new Error(`Failed to insert purchase returns: ${pRetErr.message}`);
    counts.purchaseReturns = purchReturnRows.length;

    // 10. Generate and Insert Sales Orders (50 SOs)
    const soList: any[] = [];
    for (let i = 1; i <= 50; i++) {
      const soNum = `SO-2026-${String(2000 + i).slice(1)}`;
      const cust = insertedCustomers[(i - 1) % insertedCustomers.length];
      const whId = whIds[(i - 1) % whIds.length];
      const daysAgo = 89 - Math.floor((i * 88) / 50);
      const orderDate = new Date(now - daysAgo * dayMs).toISOString().split('T')[0];
      const status = i <= 42 ? 'completed' : i <= 46 ? 'processing' : i <= 48 ? 'confirmed' : 'cancelled';

      soList.push({
        organization_id: orgId,
        order_number: soNum,
        customer_id: cust.id,
        warehouse_id: whId,
        status,
        subtotal: 0,
        tax_amount: 0,
        total_amount: 0,
        order_date: orderDate,
      });
    }

    const { data: insertedSOs, error: soErr } = await supabaseAdmin
      .from('sales_orders')
      .insert(soList)
      .select('id, order_number, customer_id, warehouse_id, status, order_date');

    if (soErr || !insertedSOs) throw new Error(`Failed to insert sales orders: ${soErr?.message}`);
    counts.salesOrders = insertedSOs.length;

    // Build SO Items, Invoices, Payments, Returns
    const soItemRows: any[] = [];
    const soUpdates: { id: string; subtotal: number; tax_amount: number; total_amount: number }[] = [];
    const invoiceRows: any[] = [];

    insertedSOs.forEach((so, idx) => {
      let subtotal = 0;
      let taxTotal = 0;
      const itemCount = 2 + (idx % 3); // 2 to 4 items per SO

      for (let j = 0; j < itemCount; j++) {
        const prod = prodList[(idx * 3 + j) % prodList.length];
        const qty = 2 + ((idx * 3 + j * 2) % 15);
        const unitPrice = Number(prod.selling_price);
        const taxRate = 18.0;
        const lineSubtotal = qty * unitPrice;
        const lineTax = (lineSubtotal * taxRate) / 100;
        const lineTotal = lineSubtotal + lineTax;

        subtotal += lineSubtotal;
        taxTotal += lineTax;

        soItemRows.push({
          organization_id: orgId,
          sales_order_id: so.id,
          product_id: prod.id,
          quantity: qty,
          unit_price: unitPrice,
          tax_rate: taxRate,
          tax_amount: lineTax,
          total_amount: lineTotal,
        });

        // If completed or processing, log sales dispatch movement
        if (so.status === 'completed' || so.status === 'processing') {
          movementRows.push({
            organization_id: orgId,
            product_id: prod.id,
            warehouse_id: so.warehouse_id,
            movement_type: 'sales_dispatch',
            quantity: -qty,
            unit_cost: Number(prod.cost_price),
            reference_number: so.order_number,
            notes: `Dispatch for order ${so.order_number}`,
            created_at: new Date(new Date(so.order_date).getTime() + 1 * dayMs).toISOString(),
          });
        }
      }

      soUpdates.push({
        id: so.id,
        subtotal,
        tax_amount: taxTotal,
        total_amount: subtotal + taxTotal,
      });

      // Create corresponding Invoice
      const invNum = `INV-2026-${String(3000 + idx + 1).slice(1)}`;
      const invStatus =
        so.status === 'cancelled'
          ? 'cancelled'
          : idx < 38
          ? 'paid'
          : idx < 44
          ? 'partially_paid'
          : idx < 48
          ? 'issued'
          : 'overdue';

      const totalAmt = subtotal + taxTotal;
      const paidAmt =
        invStatus === 'paid' ? totalAmt : invStatus === 'partially_paid' ? Math.floor(totalAmt * 0.5) : 0;

      invoiceRows.push({
        organization_id: orgId,
        invoice_number: invNum,
        sales_order_id: so.id,
        customer_id: so.customer_id,
        status: invStatus,
        subtotal,
        tax_amount: taxTotal,
        total_amount: totalAmt,
        paid_amount: paidAmt,
        issue_date: so.order_date,
        due_date: new Date(new Date(so.order_date).getTime() + 30 * dayMs).toISOString().split('T')[0],
      });
    });

    // Insert SO Items
    const { error: soItemErr } = await supabaseAdmin.from('sales_order_items').insert(soItemRows);
    if (soItemErr) throw new Error(`Failed to insert sales order items: ${soItemErr.message}`);
    counts.salesOrderItems = soItemRows.length;

    // Update SO totals
    for (const u of soUpdates) {
      await supabaseAdmin.from('sales_orders').update({
        subtotal: u.subtotal,
        tax_amount: u.tax_amount,
        total_amount: u.total_amount,
      }).eq('id', u.id);
    }

    // Insert Invoices
    const { data: insertedInvoices, error: invErr } = await supabaseAdmin
      .from('invoices')
      .insert(invoiceRows)
      .select('id, invoice_number, sales_order_id, customer_id, status, paid_amount, issue_date');

    if (invErr || !insertedInvoices) throw new Error(`Failed to insert invoices: ${invErr?.message}`);
    counts.invoices = insertedInvoices.length;

    // Insert Sales Payments for paid & partially_paid invoices (45 Payments)
    const salesPaymentRows: any[] = [];
    insertedInvoices.forEach((inv, idx) => {
      if (inv.paid_amount > 0) {
        salesPaymentRows.push({
          organization_id: orgId,
          payment_number: `SPAY-2026-${String(4000 + salesPaymentRows.length + 1).slice(1)}`,
          invoice_id: inv.id,
          customer_id: inv.customer_id,
          amount: inv.paid_amount,
          payment_method: idx % 3 === 0 ? 'upi' : idx % 3 === 1 ? 'neft' : 'bank_transfer',
          status: 'completed',
          payment_date: new Date(new Date(inv.issue_date).getTime() + 5 * dayMs).toISOString(),
          reference_number: `UTR-${202600 + idx}`,
        });
      }
    });

    const { error: sPayErr } = await supabaseAdmin.from('sales_payments').insert(salesPaymentRows);
    if (sPayErr) throw new Error(`Failed to insert sales payments: ${sPayErr.message}`);
    counts.salesPayments = salesPaymentRows.length;

    // 5 Sales Returns
    const salesReturnRows: any[] = [];
    for (let r = 1; r <= 5; r++) {
      const so = insertedSOs[r * 5];
      const prod = prodList[r * 3];
      const refundAmt = Number(prod.selling_price) * 1.18 * 2;

      salesReturnRows.push({
        organization_id: orgId,
        return_number: `SRET-2026-00${r}`,
        sales_order_id: so.id,
        customer_id: so.customer_id,
        warehouse_id: so.warehouse_id,
        product_id: prod.id,
        quantity: 2,
        refund_amount: refundAmt,
        reason: r % 2 === 0 ? 'Customer size exchange' : 'Minor transit packaging damage',
        status: 'completed',
        created_at: new Date(new Date(so.order_date).getTime() + 6 * dayMs).toISOString(),
      });

      movementRows.push({
        organization_id: orgId,
        product_id: prod.id,
        warehouse_id: so.warehouse_id,
        movement_type: 'sales_return',
        quantity: 2,
        unit_cost: Number(prod.cost_price),
        reference_number: `SRET-2026-00${r}`,
        notes: 'Restocked from customer return',
        created_at: new Date(new Date(so.order_date).getTime() + 6 * dayMs).toISOString(),
      });
    }

    const { error: sRetErr } = await supabaseAdmin.from('sales_returns').insert(salesReturnRows);
    if (sRetErr) throw new Error(`Failed to insert sales returns: ${sRetErr.message}`);
    counts.salesReturns = salesReturnRows.length;

    // 11. Insert Inventory Transfers (10 Transfers)
    const transferRows: any[] = [];
    for (let t = 1; t <= 10; t++) {
      const srcWh = t % 2 === 0 ? mumWhId : punWhId;
      const dstWh = t % 2 === 0 ? blrWhId : mumWhId;
      const transferNum = `TR-2026-${String(6000 + t).slice(1)}`;
      const status = t <= 8 ? 'completed' : 'in_transit';
      const itemsCount = 15 + t * 5;
      const daysAgo = 70 - t * 6;

      transferRows.push({
        organization_id: orgId,
        transfer_number: transferNum,
        source_warehouse_id: srcWh,
        destination_warehouse_id: dstWh,
        status,
        total_items: itemsCount,
        notes: `Stock rebalance transfer between hubs`,
        created_at: new Date(now - daysAgo * dayMs).toISOString(),
      });

      if (status === 'completed') {
        const prod = prodList[t * 4 % prodList.length];
        movementRows.push(
          {
            organization_id: orgId,
            product_id: prod.id,
            warehouse_id: srcWh,
            movement_type: 'transfer_out',
            quantity: -itemsCount,
            unit_cost: Number(prod.cost_price),
            reference_number: transferNum,
            notes: `Transfer out to destination depot`,
            created_at: new Date(now - daysAgo * dayMs).toISOString(),
          },
          {
            organization_id: orgId,
            product_id: prod.id,
            warehouse_id: dstWh,
            movement_type: 'transfer_in',
            quantity: itemsCount,
            unit_cost: Number(prod.cost_price),
            reference_number: transferNum,
            notes: `Transfer in from source logistics hub`,
            created_at: new Date(now - (daysAgo - 1) * dayMs).toISOString(),
          }
        );
      }
    }

    const { error: trErr } = await supabaseAdmin.from('inventory_transfers').insert(transferRows);
    if (trErr) throw new Error(`Failed to insert transfers: ${trErr.message}`);
    counts.inventoryTransfers = transferRows.length;

    // 12. Insert Inventory Adjustments (12 Adjustments)
    const adjustmentRows: any[] = [];
    for (let a = 1; a <= 12; a++) {
      const adjNum = `ADJ-2026-${String(7000 + a).slice(1)}`;
      const isPos = a % 2 === 1;
      const adjWh = whIds[a % whIds.length];
      const adjProd = prodList[(a * 3) % prodList.length];
      const qty = 3 + (a % 5);
      const daysAgo = 80 - a * 6;

      adjustmentRows.push({
        organization_id: orgId,
        adjustment_number: adjNum,
        warehouse_id: adjWh,
        product_id: adjProd.id,
        adjustment_type: isPos ? 'increase' : 'decrease',
        quantity: qty,
        reason: isPos ? 'Cycle count audit surplus correction' : 'Damaged stock written off during audit',
        status: 'completed',
        created_at: new Date(now - daysAgo * dayMs).toISOString(),
      });

      movementRows.push({
        organization_id: orgId,
        product_id: adjProd.id,
        warehouse_id: adjWh,
        movement_type: isPos ? 'adjustment_positive' : 'adjustment_negative',
        quantity: isPos ? qty : -qty,
        unit_cost: Number(adjProd.cost_price),
        reference_number: adjNum,
        notes: isPos ? 'Cycle count audit adjustment' : 'Damaged stock adjustment',
        created_at: new Date(now - daysAgo * dayMs).toISOString(),
      });
    }

    const { error: adjErr } = await supabaseAdmin.from('inventory_adjustments').insert(adjustmentRows);
    if (adjErr) throw new Error(`Failed to insert adjustments: ${adjErr.message}`);
    counts.inventoryAdjustments = adjustmentRows.length;

    // 13. Insert Inventory Movements Ledger
    const { error: movErr } = await supabaseAdmin.from('inventory_movements').insert(movementRows);
    if (movErr) throw new Error(`Failed to insert inventory movements: ${movErr.message}`);
    counts.inventoryMovements = movementRows.length;

    console.log(
      `[DEMO_RESET_SUCCESS] Demo workspace restored in ${Date.now() - startTime}ms. Products: ${counts.products}, POs: ${counts.purchaseOrders}, SOs: ${counts.salesOrders}, Movements: ${counts.inventoryMovements}`
    );

    return {
      success: true,
      organizationId: orgId,
      organizationSlug: DEMO_ORG_SLUG,
      counts,
      durationMs: Date.now() - startTime,
    };
  } catch (err: any) {
    const errMsg = err?.message ?? String(err);
    console.error(`[DEMO_RESET_FATAL] ${errMsg}`);
    return {
      success: false,
      organizationSlug: DEMO_ORG_SLUG,
      counts,
      durationMs: Date.now() - startTime,
      error: errMsg,
    };
  }
}
