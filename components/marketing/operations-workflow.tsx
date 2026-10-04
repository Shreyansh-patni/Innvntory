const workflowSteps = [
  {
    step: "01",
    title: "Catalog Master Record",
    description:
      "Define multi-variant SKUs, barcodes, tax codes, and pricing rules once in your central catalog.",
  },
  {
    step: "02",
    title: "Smart Procurement",
    description:
      "Generate purchase orders automatically when stock hits reorder thresholds. Verify delivered items with 3-way match.",
  },
  {
    step: "03",
    title: "Multi-Facility Allocation",
    description:
      "Track physical quantities, reserved orders, and transit transfers across multiple warehouses with absolute precision.",
  },
  {
    step: "04",
    title: "Sales & Invoicing",
    description:
      "Fulfill orders, dispatch shipments, issue tax-compliant invoices, and synchronize receivables with real-time audit logs.",
  },
];

export function OperationsWorkflow() {
  return (
    <section className="py-20 border-t border-border-subtle bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
            Operational Lifecycle
          </h2>
          <p className="text-3xl font-heading font-bold text-text-primary tracking-tight sm:text-4xl">
            A unified pipeline from procurement to settlement.
          </p>
          <p className="mt-4 text-base text-text-secondary">
            Eliminate silos between purchasing, warehouse staff, sales reps, and finance teams.
          </p>
        </div>

        {/* 4-Step Linear Flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {workflowSteps.map((item) => (
            <div
              key={item.step}
              className="relative rounded-xl border border-border-subtle bg-surface p-6 flex flex-col justify-between"
            >
              <div>
                <span className="font-mono text-2xl font-bold text-text-muted/60 block mb-4">
                  {item.step}
                </span>
                <h3 className="text-base font-heading font-bold text-text-primary mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {item.description}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border-subtle/50 flex items-center text-xs font-medium text-text-muted">
                Synchronized Ledger
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
