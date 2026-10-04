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

export interface DashboardDemoData {
  isDemoMode: true;
  workspaceName: string;
  metrics: DashboardMetrics;
  recentActivity: OperationalActivityItem[];
  lowStockItems: LowStockItem[];
}

export const demoDashboardData: DashboardDemoData = {
  isDemoMode: true,
  workspaceName: "All Locations (Demo Workspace)",
  metrics: {
    monthlyRevenue: "₹8,42,650",
    stockValuation: "₹24,75,300",
    openOrders: 28,
    lowStockAlerts: 7,
    activeCatalogSkus: 142,
    procurementPipeline: 6,
  },
  recentActivity: [
    {
      id: "act-001",
      type: "grn",
      title: "Goods Receipt (GRN)",
      reference: "PO-1042",
      description: "48 units received at Central Hub from Arvind Mills",
      timestamp: "12 mins ago",
      status: "reconciled",
    },
    {
      id: "act-002",
      type: "transfer",
      title: "Inter-Facility Transfer",
      reference: "TR-0419",
      description: "24 units in transit (WH-01 Mumbai → WH-02 Pune)",
      timestamp: "35 mins ago",
      status: "in-transit",
    },
    {
      id: "act-003",
      type: "sales",
      title: "Sales Dispatch Order",
      reference: "SO-2087",
      description: "12 items allocated & picked for Retail Order #892",
      timestamp: "1 hour ago",
      status: "completed",
    },
    {
      id: "act-004",
      type: "adjustment",
      title: "Cycle Count Adjustment",
      reference: "ADJ-092",
      description: "+6 units reconciled after warehouse cycle count",
      timestamp: "3 hours ago",
      status: "reconciled",
    },
    {
      id: "act-005",
      type: "invoice",
      title: "GST Invoice Payment Received",
      reference: "INV-3048",
      description: "₹18,450 cleared via NEFT from Nexus Retailers",
      timestamp: "5 hours ago",
      status: "completed",
    },
  ],
  lowStockItems: [
    {
      id: "ls-001",
      name: "Classic Cotton T-Shirt (Navy / L)",
      sku: "CCT-1001",
      category: "Apparel",
      currentStock: 8,
      reorderPoint: 20,
      unit: "PCS",
      status: "low-stock",
    },
    {
      id: "ls-002",
      name: "Slim Fit Denim Jeans (32W / 32L)",
      sku: "SFD-2048",
      category: "Apparel",
      currentStock: 5,
      reorderPoint: 15,
      unit: "PCS",
      status: "low-stock",
    },
    {
      id: "ls-003",
      name: "Oxford Casual Button-Down Shirt",
      sku: "OCS-3021",
      category: "Apparel",
      currentStock: 11,
      reorderPoint: 25,
      unit: "PCS",
      status: "low-stock",
    },
    {
      id: "ls-004",
      name: "Leather Casual Reversible Belt",
      sku: "LCB-4102",
      category: "Accessories",
      currentStock: 4,
      reorderPoint: 12,
      unit: "PCS",
      status: "low-stock",
    },
    {
      id: "ls-005",
      name: "Canvas Low-Top Sneakers (Size 9)",
      sku: "CVS-5018",
      category: "Footwear",
      currentStock: 9,
      reorderPoint: 18,
      unit: "PAIR",
      status: "low-stock",
    },
  ],
};

/**
 * Evaluates whether Demo Mode is enabled via environment variable.
 */
export function isDemoModeEnabled(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_MODE === "true";
}

/**
 * Returns typed demo dashboard data when:
 *   a) NEXT_PUBLIC_DEMO_MODE=true (env-based fixture mode for all users), OR
 *   b) The authenticated user belongs to the Demo Workspace organization.
 *
 * NOTE: This returns fixture data for not-yet-implemented domains (inventory, sales, etc).
 * Real catalog data (products, categories) is fetched directly from Supabase via RLS.
 * Do NOT use this function to handle Supabase errors — errors must surface truthfully.
 *
 * @param orgSlug - The authenticated user's organization slug (from UserContext).
 */
export function getDashboardData(orgSlug?: string | null): DashboardDemoData | null {
  const envDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
  const isDemoWorkspace = orgSlug === "innvntory-demo";

  if (envDemoMode || isDemoWorkspace) {
    return demoDashboardData;
  }
  return null;
}
