export interface FeatureCategory {
  id: string;
  title: string;
  description: string;
  status: "Core Available" | "Scheduled" | "Future Roadmap";
  features: {
    name: string;
    description: string;
    badge?: string;
  }[];
}

export const featureCategories: FeatureCategory[] = [
  {
    id: "inventory",
    title: "Multi-Warehouse Inventory",
    description: "Real-time visibility into quantities, stock allocations, locations, and movements across every facility.",
    status: "Core Available",
    features: [
      {
        name: "Centralized Stock Ledger",
        description: "Zero partial inventory state. Every unit change is tracked with immutable movement logs.",
      },
      {
        name: "Inter-Warehouse Transfers",
        description: "Initiate, track in-transit items, and safely reconcile transfers between fulfillment hubs.",
      },
      {
        name: "Batch & Expiry Management",
        description: "Track manufactured batches, expiry schedules, and lot numbers with complete traceability.",
      },
      {
        name: "Low-Stock Reorder Triggers",
        description: "Automated thresholds that prompt purchase orders before stockouts occur.",
      },
    ],
  },
  {
    id: "products",
    title: "Product Catalog & Master Data",
    description: "Manage complex product hierarchies, variants, SKUs, and pricing matrices effortlessly.",
    status: "Core Available",
    features: [
      {
        name: "Multi-Attribute Variants",
        description: "Create variants across size, color, material, or custom specifications under a single parent product.",
      },
      {
        name: "Barcode & QR Code Integration",
        description: "Generate and scan standard EAN-13, UPC, Code-128, and custom 2D barcodes for rapid fulfillment.",
      },
      {
        name: "Dynamic Price Lists",
        description: "Configure retail, wholesale, and distributor pricing tiers per customer segment.",
      },
      {
        name: "Custom Attribute Fields",
        description: "Extend product records with business-specific fields, units of measurement, and tax categories.",
      },
    ],
  },
  {
    id: "purchasing",
    title: "Purchasing & Supplier Management",
    description: "Streamline procurement from vendor quote requests to goods received notes and vendor bills.",
    status: "Core Available",
    features: [
      {
        name: "Purchase Order Workflows",
        description: "Generate standardized POs, send PDFs to vendors, and monitor fulfillment milestones.",
      },
      {
        name: "Goods Receipt & 3-Way Match",
        description: "Verify quantities received against POs and vendor invoices to eliminate billing discrepancies.",
      },
      {
        name: "Supplier Performance Metrics",
        description: "Track lead times, on-time delivery percentages, and defective shipment history.",
      },
      {
        name: "Purchase Returns & Debits",
        description: "Manage damaged or incorrect goods returns with automated debit note generation.",
      },
    ],
  },
  {
    id: "sales",
    title: "Sales Orders & Billing Operations",
    description: "Convert customer orders into shipments, tax-compliant invoices, and automated payment receipts.",
    status: "Core Available",
    features: [
      {
        name: "Multi-Channel Order Intake",
        description: "Consolidate orders from wholesale sales reps, retail counters, and digital channels.",
      },
      {
        name: "GST & Tax Compliant Invoicing",
        description: "Built for India GST compliance with HSN codes, multi-tax brackets, and automated e-invoice readiness.",
      },
      {
        name: "Customer Credit & Outstanding Ledger",
        description: "Monitor aging receivables, set credit limits, and automate payment reminders.",
      },
      {
        name: "Sales Returns & Credit Notes",
        description: "Handle customer returns with instant inventory restock and accounting adjustments.",
      },
    ],
  },
  {
    id: "analytics",
    title: "Business Intelligence & Reporting",
    description: "Actionable financial and inventory metrics without exporting to spreadsheets.",
    status: "Scheduled",
    features: [
      {
        name: "Stock Velocity & Dead Stock Analysis",
        description: "Identify fast-moving cash generators versus slow-moving inventory draining holding capital.",
      },
      {
        name: "Gross Margin & Profitability Reports",
        description: "Analyze net margins across products, product categories, warehouses, and customer accounts.",
      },
      {
        name: "Fulfillment Cycle Times",
        description: "Measure pick-pack-ship cycle times and identify operational bottlenecks.",
      },
      {
        name: "Scheduled Automated Exports",
        description: "Receive weekly or monthly PDF/CSV operational summaries delivered to key stakeholders.",
      },
    ],
  },
  {
    id: "platform",
    title: "Security & Enterprise Platform",
    description: "Enterprise-grade isolation, granular role-based access, and developer APIs.",
    status: "Core Available",
    features: [
      {
        name: "Tenant Isolation",
        description: "Strict database-level organization isolation ensuring total data confidentiality.",
      },
      {
        name: "Granular RBAC Roles",
        description: "Assign warehouse manager, billing staff, purchasing clerk, or executive view-only permissions.",
      },
      {
        name: "Comprehensive Audit Log",
        description: "Immutable record of every transaction, stock change, and user action for full compliance.",
      },
      {
        name: "REST API & Webhooks",
        description: "Open developer APIs for synchronizing with custom ERPs, logistics partners, and eCommerce storefronts.",
      },
    ],
  },
];
