import { ShieldAlert, Database, Scale, Cpu } from "lucide-react";

const principles = [
  {
    icon: Database,
    title: "Zero Partial State",
    description:
      "Inventory updates are ACID-compliant and event-backed. No dangling reservations, orphan PO lines, or ghost stock drift.",
  },
  {
    icon: ShieldAlert,
    title: "Immutable Event Ledger",
    description:
      "Every adjustment, transfer, pick, and return creates a permanent audit record. Full accountability for every unit of merchandise.",
  },
  {
    icon: Scale,
    title: "India-First Localization",
    description:
      "Deeply engineered for Indian trade: GST e-invoicing compatibility, HSN code lookups, state-specific tax rules, and local currency formatting.",
  },
  {
    icon: Cpu,
    title: "High-Performance Architecture",
    description:
      "Built with Next.js App Router, PostgreSQL, and Server Components for instant page transitions and sub-100ms API response times.",
  },
];

export function WhyInnvntory() {
  return (
    <section className="py-20 border-t border-border-subtle bg-background-subtle/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
            Why Innvntory
          </h2>
          <p className="text-3xl font-heading font-bold text-text-primary tracking-tight sm:text-4xl">
            Architected for reliability where spreadsheets fail.
          </p>
          <p className="mt-4 text-base text-text-secondary">
            Built on core principles of data integrity, operational speed, and enterprise security.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {principles.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex gap-4 p-6 rounded-xl border border-border-subtle bg-surface"
              >
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-muted text-text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-heading font-bold text-text-primary mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
