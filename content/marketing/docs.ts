export interface DocCategory {
  id: string;
  title: string;
  description: string;
  topics: {
    title: string;
    description: string;
    href: string;
    badge?: string;
  }[];
}

export const docCategories: DocCategory[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    description: "Learn the fundamentals of setting up your organization and first warehouse.",
    topics: [
      {
        title: "Workspace Initialization",
        description: "Configure your company profile, currency, timezone, and tax settings.",
        href: "/docs/getting-started",
      },
      {
        title: "Catalog Import & Setup",
        description: "Import products, categories, units of measure, and opening inventory.",
        href: "/docs/getting-started",
      },
      {
        title: "Team & Role Provisioning",
        description: "Invite warehouse staff, managers, and accountants with tailored permissions.",
        href: "/docs/getting-started",
      },
    ],
  },
  {
    id: "inventory",
    title: "Inventory & Warehousing",
    description: "Manage stock levels, locations, transfers, and adjustments across all facilities.",
    topics: [
      {
        title: "Multi-Warehouse Routing",
        description: "Configure primary shipping locations, safety stocks, and replenishment rules.",
        href: "/docs/inventory",
      },
      {
        title: "Inter-Warehouse Transfers",
        description: "Creating dispatch notes, tracking shipments in transit, and receiving.",
        href: "/docs/inventory",
      },
      {
        title: "Stock Audits & Adjustments",
        description: "Perform cycle counts and document shrinkage, damage, or audit variances.",
        href: "/docs/inventory",
      },
    ],
  },
  {
    id: "purchasing",
    title: "Purchasing & Procurement",
    description: "Issue purchase orders, track supplier deliveries, and verify goods receipts.",
    topics: [
      {
        title: "Purchase Order Workflows",
        description: "Creating, approving, and dispatching POs to registered vendors.",
        href: "/docs/purchasing",
      },
      {
        title: "Goods Receipts (GRN)",
        description: "Scanning and verifying delivered stock quantities against purchase orders.",
        href: "/docs/purchasing",
      },
      {
        title: "Supplier Returns & Debit Notes",
        description: "Returning defective materials and tracking vendor credit memos.",
        href: "/docs/purchasing",
      },
    ],
  },
  {
    id: "sales",
    title: "Sales & Invoicing",
    description: "Process customer orders, generate GST tax invoices, and track payments.",
    topics: [
      {
        title: "Order Fulfillment",
        description: "Converting confirmed sales orders into pick lists, pack slips, and shipments.",
        href: "/docs/sales",
      },
      {
        title: "Tax Invoicing & Receipts",
        description: "Generating compliant tax invoices with HSN breakdown and payment records.",
        href: "/docs/sales",
      },
      {
        title: "Customer Credit & Aging",
        description: "Managing payment terms, credit limits, and outstanding balances.",
        href: "/docs/sales",
      },
    ],
  },
  {
    id: "reports",
    title: "Reports & Analytics",
    description: "Analyze stock turnover, gross margin profitability, and operations performance.",
    topics: [
      {
        title: "Inventory Valuation Reports",
        description: "FIFO and weighted-average valuation across all warehouses.",
        href: "/docs/reports",
      },
      {
        title: "Sales Velocity & Trends",
        description: "Identify fast-moving products and seasonal demand spikes.",
        href: "/docs/reports",
      },
    ],
  },
  {
    id: "api",
    title: "API & Integrations",
    description: "Developer guides for REST endpoints, webhooks, and third-party tools.",
    topics: [
      {
        title: "REST API Overview",
        description: "Authentication tokens, pagination, rate limits, and JSON structures.",
        href: "/docs/api",
        badge: "v1",
      },
      {
        title: "Webhook Subscriptions",
        description: "Receive instant notifications for stock changes, order creations, and receipts.",
        href: "/docs/api",
      },
    ],
  },
];
