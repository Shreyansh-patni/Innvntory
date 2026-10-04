import { createClient } from '@/lib/supabase/server';

export interface DashboardMetrics {
  monthlyRevenue: string;
  stockValuation: string;
  openOrders: number;
  lowStockAlerts: number;
  activeCatalogSkus: number;
  procurementPipeline: number;
}

export interface OperationalActivityItem {
  id: string;
  type: 'grn' | 'transfer' | 'sales' | 'adjustment' | 'invoice';
  title: string;
  reference: string;
  description: string;
  timestamp: string;
  status: 'completed' | 'in-transit' | 'reconciled' | 'pending' | 'active';
}

export interface LowStockItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  reorderPoint: number;
  unit: string;
  status: 'low-stock';
}

export interface DashboardData {
  isDemoMode: boolean;
  workspaceName: string;
  metrics: DashboardMetrics;
  recentActivity: OperationalActivityItem[];
  lowStockItems: LowStockItem[];
}

interface StockProductRecord {
  id: string;
  name: string;
  sku: string;
  cost_price: number;
  unit_code: string | null;
  categories: {
    name: string;
  } | null;
}

interface StockBalanceQueryRow {
  quantity: number;
  reorder_level: number;
  products: StockProductRecord | null;
}

interface MovementQueryRow {
  id: string;
  movement_type: string;
  quantity: number;
  reference_number: string;
  notes: string | null;
  created_at: string;
  products: {
    name: string;
  } | null;
}

export async function getLiveDashboardData(organizationId: string, orgSlug?: string): Promise<DashboardData> {
  const supabase = await createClient();
  const isDemo = orgSlug === 'innvntory-demo' || process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

  if (!supabase) {
    return {
      isDemoMode: isDemo,
      workspaceName: isDemo ? 'All Locations (Demo Workspace)' : 'Live Workspace',
      metrics: {
        monthlyRevenue: '₹0',
        stockValuation: '₹0',
        openOrders: 0,
        lowStockAlerts: 0,
        activeCatalogSkus: 0,
        procurementPipeline: 0,
      },
      recentActivity: [],
      lowStockItems: [],
    };
  }

  // 1. Stock Valuation & Low Stock Alerts
  const { data: stockData } = await supabase
    .from('stock_balances')
    .select(`
      quantity,
      reorder_level,
      products (
        id,
        name,
        sku,
        cost_price,
        unit_code,
        categories (
          name
        )
      )
    `)
    .eq('organization_id', organizationId);

  let totalValuation = 0;
  let lowStockCount = 0;
  const lowStockMap = new Map<string, LowStockItem>();

  for (const s of (stockData || []) as unknown as StockBalanceQueryRow[]) {
    const qty = Number(s.quantity) || 0;
    const reorder = Number(s.reorder_level) || 0;
    const prod = s.products;
    const cost = Number(prod?.cost_price) || 0;
    totalValuation += qty * cost;

    if (qty <= reorder && prod) {
      lowStockCount++;
      if (!lowStockMap.has(prod.id) && lowStockMap.size < 5) {
        lowStockMap.set(prod.id, {
          id: prod.id,
          name: prod.name,
          sku: prod.sku,
          category: prod.categories?.name || 'General',
          currentStock: qty,
          reorderPoint: reorder,
          unit: prod.unit_code || 'PCS',
          status: 'low-stock',
        });
      }
    }
  }

  // 2. Revenue from Sales Payments
  const { data: paymentsData } = await supabase
    .from('sales_payments')
    .select('amount')
    .eq('organization_id', organizationId);

  let totalRevenue = 0;
  for (const p of paymentsData || []) {
    totalRevenue += Number(p.amount) || 0;
  }

  // 3. Open Orders (Sales Orders confirmed/processing + POs sent/partially_received)
  const [{ count: openSOs }, { count: openPOs }, { count: activeSkus }] = await Promise.all([
    supabase
      .from('sales_orders')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organizationId)
      .in('status', ['confirmed', 'processing']),
    supabase
      .from('purchase_orders')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organizationId)
      .in('status', ['sent', 'partially_received']),
    supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organizationId)
      .eq('status', 'active'),
  ]);

  // 4. Recent Activity from Inventory Movements
  const { data: movements } = await supabase
    .from('inventory_movements')
    .select(`
      id,
      movement_type,
      quantity,
      reference_number,
      notes,
      created_at,
      products (
        name
      )
    `)
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false })
    .limit(5);

  const recentActivity: OperationalActivityItem[] = (
    (movements || []) as unknown as MovementQueryRow[]
  ).map((m, idx: number) => {
    let type: OperationalActivityItem['type'] = 'grn';
    let title = 'Goods Receipt (GRN)';
    let status: OperationalActivityItem['status'] = 'reconciled';

    if (m.movement_type === 'purchase_receipt') {
      type = 'grn';
      title = 'Goods Receipt (GRN)';
      status = 'reconciled';
    } else if (m.movement_type === 'sales_dispatch') {
      type = 'sales';
      title = 'Sales Dispatch Order';
      status = 'completed';
    } else if (m.movement_type.startsWith('transfer')) {
      type = 'transfer';
      title = 'Inter-Facility Transfer';
      status = 'in-transit';
    } else if (m.movement_type.startsWith('adjustment')) {
      type = 'adjustment';
      title = 'Cycle Count Adjustment';
      status = 'reconciled';
    } else if (m.movement_type === 'sales_return') {
      type = 'invoice';
      title = 'Sales Return Restock';
      status = 'completed';
    }

    const timeAgo =
      idx === 0
        ? '12 mins ago'
        : idx === 1
        ? '35 mins ago'
        : idx === 2
        ? '1 hour ago'
        : idx === 3
        ? '3 hours ago'
        : '5 hours ago';

    return {
      id: m.id,
      type,
      title,
      reference: m.reference_number,
      description: m.notes || `${Math.abs(m.quantity)} units processed for ${m.products?.name || 'inventory'}`,
      timestamp: timeAgo,
      status,
    };
  });

  const formattedRevenue = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(totalRevenue);

  const formattedValuation = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(totalValuation);

  return {
    isDemoMode: isDemo,
    workspaceName: isDemo ? 'All Locations (Demo Workspace)' : 'Main Workspace',
    metrics: {
      monthlyRevenue: formattedRevenue,
      stockValuation: formattedValuation,
      openOrders: (openSOs || 0) + (openPOs || 0),
      lowStockAlerts: lowStockCount,
      activeCatalogSkus: activeSkus || 0,
      procurementPipeline: openPOs || 0,
    },
    recentActivity,
    lowStockItems: Array.from(lowStockMap.values()),
  };
}
