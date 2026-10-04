import {
  Boxes,
  Truck,
  ShoppingCart,
  BarChart3,
  ShieldCheck,
  Code2,
} from "lucide-react";

const capabilities = [
  {
    icon: Boxes,
    title: "Multi-Warehouse Inventory",
    description:
      "Real-time tracking of physical stock, reserved units, bin allocations, and inter-warehouse transfer workflows with zero partial state.",
  },
  {
    icon: Truck,
    title: "Procurement & Purchase Orders",
    description:
      "Standardized vendor purchase orders, automated Goods Received Notes (GRN), and 3-way matching to eliminate billing discrepancies.",
  },
  {
    icon: ShoppingCart,
    title: "Sales & Tax Invoicing",
    description:
      "Streamlined order processing, shipment tracking, GST-compliant tax invoices, credit management, and customer aging receivables.",
  },
  {
    icon: BarChart3,
    title: "Operational Intelligence",
    description:
      "Deep inventory turnover metrics, stock velocity, gross margin profitability, and automated PDF reports delivered to leadership.",
  },
  {
    icon: ShieldCheck,
    title: "Strict Multi-Tenant Security",
    description:
      "Organization-level data isolation, granular role-based permissions, and immutable audit logging for complete enterprise compliance.",
  },
  {
    icon: Code2,
    title: "Developer & API-First Architecture",
    description:
      "Open RESTful endpoints (`/api/v1/...`) and event webhooks for bi-directional synchronization with ERPs, eCommerce, and logistics APIs.",
  },
];

export function CapabilitiesSection() {
  return (
    <section className="py-20 border-t border-border-subtle bg-background-subtle/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
            Core Platform Capabilities
          </h2>
          <p className="text-3xl font-heading font-bold text-text-primary tracking-tight sm:text-4xl">
            Engineered for high-volume inventory operations.
          </p>
          <p className="mt-4 text-base text-text-secondary">
            Everything your operations team needs to eliminate stockouts, prevent discrepancies, and scale fulfillment.
          </p>
        </div>

        {/* 6-Card Grid with 1px hairline borders */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="group relative rounded-xl border border-border-subtle bg-surface p-6 sm:p-8 hover:border-border transition-all"
              >
                <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-surface-muted text-text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-heading font-bold text-text-primary tracking-tight mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
