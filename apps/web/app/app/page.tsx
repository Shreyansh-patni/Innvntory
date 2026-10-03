import Link from "next/link";

import {
  EmptyState,
  KpiCard,
  PageHeader,
  Section,
  StatusPill,
} from "@/components/app/primitives";

/**
 * Dashboard — the future "Business Command Center" (specification §9).
 *
 * Establishes the information architecture only. Nothing here is fabricated: every
 * metric reports "not connected yet" rather than showing an invented number.
 */
export default function DashboardPage() {
  return (
    <>
      <PageHeader
        eyebrow="Business command center"
        title="Dashboard"
        description="The daily operating picture: revenue, stock position, outstanding money, and what needs attention."
        actions={
          <>
            <button type="button" className="btn btn-secondary" disabled>
              Export
            </button>
            <button type="button" className="btn btn-primary" disabled>
              New sale
            </button>
          </>
        }
      />

      {/* ---------------------------------------------------------------- */}
      {/* Business Brief — the contextual summary area                       */}
      {/* ---------------------------------------------------------------- */}
      <section className="mt-7">
        <div className="card overflow-hidden">
          <div className="flex flex-col justify-between gap-4 border-b border-hairline px-5 py-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-sm font-medium tracking-tight">Business brief</h2>
              <p className="mt-1 text-xs text-ink-muted">
                A plain-language read on today, assembled from your own records.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 text-xs text-ink-muted">
              <span aria-hidden className="status-dot bg-ink-faint" />
              Awaiting connected data
            </span>
          </div>

          <div className="px-5 py-6">
            <p className="max-w-2xl text-sm leading-relaxed text-ink-secondary">
              Your brief will summarise revenue today, stock that has fallen below its
              reorder point, invoices awaiting payment, and anything unusual in the
              last 24 hours.
            </p>
            <p className="mt-4 max-w-2xl text-xs leading-relaxed text-ink-muted">
              Every figure will be traceable to the record it came from. This assistant
              reads and analyses your data through authorized business services — it
              does not hold a separate copy of your numbers, and it takes no action
              without your confirmation.
            </p>
            <Link href="/app/ai" className="btn btn-secondary mt-5">
              Open the assistant
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* KPI row — specification §9 metric set                             */}
      {/* ---------------------------------------------------------------- */}
      <section aria-labelledby="kpi-heading" className="mt-7">
        <h2 id="kpi-heading" className="sr-only">
          Key metrics
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard label="Revenue today" value="—" unavailable />
          <KpiCard label="Orders today" value="—" unavailable />
          <KpiCard label="Inventory value" value="—" unavailable />
          <KpiCard label="Low-stock products" value="—" unavailable />
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard label="Receivables" value="—" unavailable />
          <KpiCard label="Payables" value="—" unavailable />
          <KpiCard label="Gross profit" value="—" unavailable />
          <KpiCard label="Purchase value" value="—" unavailable />
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Stock position + attention                                        */}
      {/* ---------------------------------------------------------------- */}
      <div className="mt-7 grid gap-5 lg:grid-cols-5">
        <Section
          title="Stock position"
          description="Where quantities stand across your locations."
          className="lg:col-span-3"
        >
          <EmptyState
            title="No stock movements recorded"
            body="Once your catalogue and opening stock are loaded, this area shows current quantity by item and location, with the ledger behind every change."
            primaryAction={{ label: "Add opening stock", disabled: true }}
            secondaryAction={{ label: "Import products", disabled: true }}
          />
        </Section>

        <Section
          title="Needs attention"
          description="Low stock, overdue invoices and failed operations."
          className="lg:col-span-2"
        >
          <ul className="divide-y divide-hairline-soft">
            {[
              { label: "Items below reorder point", tone: "caution" as const },
              { label: "Invoices past due", tone: "critical" as const },
              { label: "Purchase orders awaiting receipt", tone: "neutral" as const },
              { label: "Failed payment attempts", tone: "critical" as const },
            ].map((row) => (
              <li key={row.label} className="flex items-center justify-between px-5 py-3.5">
                <StatusPill tone={row.tone} label={row.label} />
                <span className="tabular text-sm text-ink-faint">—</span>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Recent activity                                                   */}
      {/* ---------------------------------------------------------------- */}
      <div className="mt-5">
        <Section
          title="Recent activity"
          description="Sales, purchases, adjustments and payments, newest first."
        >
          <EmptyState
            title="Nothing has happened yet"
            body="Every sale, purchase, stock adjustment and payment will appear here with who did it and when."
            primaryAction={{ label: "Record a sale", disabled: true }}
          />
        </Section>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Connection state                                                  */}
      {/* ---------------------------------------------------------------- */}
      <div className="mt-5">
        <Section
          title="Connection status"
          description="What is wired up, stated plainly."
        >
          <ul className="divide-y divide-hairline-soft">
            {[
              { label: "Frontend application shell", ok: true, note: "Rendered" },
              { label: "Backend service (ADR 0001)", ok: true, note: "Foundation" },
              { label: "Database schema + RLS (ADR 0003/0004)", ok: false, note: "No database configured" },
              { label: "Authentication", ok: false, note: "Not yet specified" },
              { label: "AI assistant (Phase 7)", ok: false, note: "Not implemented" },
            ].map((row) => (
              <li
                key={row.label}
                className="flex items-center justify-between gap-4 px-5 py-3.5"
              >
                <StatusPill
                  tone={row.ok ? "positive" : "neutral"}
                  label={row.label}
                />
                <span className="text-xs text-ink-faint">{row.note}</span>
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </>
  );
}