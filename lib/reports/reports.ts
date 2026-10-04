import { createClient } from '@/lib/supabase/server';

export async function getSalesReportData(organizationId: string) {
  const supabase = await createClient();
  if (!supabase) return null;

  const [ordersRes, paymentsRes, returnsRes] = await Promise.all([
    supabase
      .from('sales_orders')
      .select('id, order_number, status, subtotal, tax_amount, total_amount, order_date')
      .eq('organization_id', organizationId),
    supabase
      .from('sales_payments')
      .select('amount, payment_method, status, payment_date')
      .eq('organization_id', organizationId),
    supabase
      .from('sales_returns')
      .select('quantity, refund_amount, reason')
      .eq('organization_id', organizationId),
  ]);

  const orders = ordersRes.data || [];
  const payments = paymentsRes.data || [];
  const returns = returnsRes.data || [];

  const totalGrossSales = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((acc, o) => acc + Number(o.total_amount), 0);

  const totalCollected = payments.reduce((acc, p) => acc + Number(p.amount), 0);
  const totalRefunded = returns.reduce((acc, r) => acc + Number(r.refund_amount), 0);

  return {
    totalOrders: orders.length,
    completedOrders: orders.filter((o) => o.status === 'completed').length,
    totalGrossSales,
    totalCollected,
    totalRefunded,
    netRevenue: totalGrossSales - totalRefunded,
    orders,
    payments,
    returns,
  };
}

export async function getPurchasesReportData(organizationId: string) {
  const supabase = await createClient();
  if (!supabase) return null;

  const [poRes, paymentsRes, returnsRes] = await Promise.all([
    supabase
      .from('purchase_orders')
      .select('id, po_number, status, subtotal, tax_amount, total_amount, order_date')
      .eq('organization_id', organizationId),
    supabase
      .from('purchase_payments')
      .select('amount, payment_method, status, payment_date')
      .eq('organization_id', organizationId),
    supabase
      .from('purchase_returns')
      .select('quantity, reason')
      .eq('organization_id', organizationId),
  ]);

  const pos = poRes.data || [];
  const payments = paymentsRes.data || [];
  const returns = returnsRes.data || [];

  const totalCommitted = pos
    .filter((p) => p.status !== 'cancelled')
    .reduce((acc, p) => acc + Number(p.total_amount), 0);

  const totalPaid = payments.reduce((acc, p) => acc + Number(p.amount), 0);

  return {
    totalPurchaseOrders: pos.length,
    receivedOrders: pos.filter((p) => p.status === 'received').length,
    totalCommitted,
    totalPaid,
    outstandingPayables: Math.max(0, totalCommitted - totalPaid),
    purchaseOrders: pos,
    payments,
    returns,
  };
}

export async function getInventoryReportData(organizationId: string) {
  const supabase = await createClient();
  if (!supabase) return null;

  const [stockRes, whRes, movRes] = await Promise.all([
    supabase
      .from('stock_balances')
      .select(`
        quantity,
        reorder_level,
        reserved_quantity,
        products (cost_price, selling_price, name, sku, categories(name)),
        warehouses (name, code)
      `)
      .eq('organization_id', organizationId),
    supabase.from('warehouses').select('*').eq('organization_id', organizationId),
    supabase.from('inventory_movements').select('*').eq('organization_id', organizationId),
  ]);

  const stock = stockRes.data || [];
  const warehouses = whRes.data || [];
  const movements = movRes.data || [];

  let totalValuation = 0;
  let totalRetailValue = 0;
  let totalUnits = 0;
  let lowStockAlertCount = 0;

  for (const s of stock) {
    const qty = Number(s.quantity) || 0;
    const prod: any = s.products;
    const cost = Number(prod?.cost_price) || 0;
    const retail = Number(prod?.selling_price) || 0;
    totalValuation += qty * cost;
    totalRetailValue += qty * retail;
    totalUnits += qty;
    if (qty <= Number(s.reorder_level)) lowStockAlertCount++;
  }

  return {
    warehouseCount: warehouses.length,
    totalValuation,
    totalRetailValue,
    totalUnits,
    lowStockAlertCount,
    movementCount: movements.length,
    stock,
    warehouses,
  };
}

export async function getFinancialReportData(organizationId: string) {
  const supabase = await createClient();
  if (!supabase) return null;

  const [salesData, purchaseData, invData] = await Promise.all([
    getSalesReportData(organizationId),
    getPurchasesReportData(organizationId),
    getInventoryReportData(organizationId),
  ]);

  const grossSales = salesData?.totalGrossSales || 0;
  const purchasesCommitted = purchaseData?.totalCommitted || 0;
  const collections = salesData?.totalCollected || 0;
  const paymentsMade = purchaseData?.totalPaid || 0;
  const inventoryAsset = invData?.totalValuation || 0;

  return {
    grossSales,
    purchasesCommitted,
    collections,
    paymentsMade,
    inventoryAsset,
    netOperatingCash: collections - paymentsMade,
    grossMargin: grossSales > 0 ? ((grossSales - purchasesCommitted) / grossSales) * 100 : 0,
  };
}
