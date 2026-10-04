import Link from "next/link";
import { ArrowRight, Layers, ShieldCheck, Zap, Warehouse, Boxes, RefreshCw, ArrowUpRight, CheckCircle2 } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Centered Editorial Header */}
        <div className="mx-auto max-w-3xl text-center">
          {/* Subtle Category Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface-muted px-3.5 py-1 text-xs font-medium text-text-secondary mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-text-primary"></span>
            Business Operating System
          </div>

          {/* Display Headline */}
          <h1 className="text-4xl font-heading font-bold tracking-tight text-text-primary sm:text-5xl lg:text-6xl leading-[1.1]">
            Make complex business operations feel simple.
          </h1>

          {/* Concise Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-text-secondary leading-relaxed font-sans">
            A high-precision inventory and business management SaaS for growing enterprises.
            Unify catalogs, multi-warehouse stock movements, purchasing, sales, and analytics with zero partial state.
          </p>

          {/* Primary & Secondary Actions */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-md bg-text-primary px-6 py-3 text-base font-medium text-background hover:bg-text-primary/90 transition-colors"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/app/dashboard"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-md border border-border bg-surface px-6 py-3 text-base font-medium text-text-primary hover:bg-surface-muted transition-colors"
            >
              Preview App Shell
              <ArrowUpRight className="h-4 w-4 text-text-muted" />
            </Link>
          </div>

          {/* Trust points */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-text-muted">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Strict Multi-Tenant Isolation
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-text-primary" />
              Sub-100ms Operations Latency
            </span>
            <span className="flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-text-primary" />
              GST & Multi-Tax Ready
            </span>
          </div>
        </div>

        {/* Structural UI Abstraction Preview (Aoutive Card Style) */}
        <div className="mt-16 sm:mt-20">
          <div className="relative rounded-2xl border border-border-subtle bg-surface p-2 sm:p-4 shadow-sm">
            {/* Mock App Shell Window Frame */}
            <div className="rounded-xl border border-border-subtle bg-background overflow-hidden">
              {/* Top status bar */}
              <div className="flex items-center justify-between border-b border-border-subtle px-4 py-3 bg-surface-muted/40">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-border"></div>
                  <div className="h-2.5 w-2.5 rounded-full bg-border"></div>
                  <div className="h-2.5 w-2.5 rounded-full bg-border"></div>
                  <span className="ml-2 text-xs font-mono text-text-muted">
                    innvntory.workspace / central-hub
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-text-secondary">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Ledger Sync: Active</span>
                </div>
              </div>

              {/* Structural Metric Cards */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-border-subtle/70">
                {/* Metric Card 1 */}
                <div className="rounded-lg border border-border-subtle bg-surface p-4">
                  <div className="flex items-center justify-between text-xs text-text-muted mb-2">
                    <span className="font-medium uppercase tracking-wider">Stock Health</span>
                    <Warehouse className="h-4 w-4 text-text-muted" />
                  </div>
                  <div className="text-2xl font-bold font-heading text-text-primary">99.98%</div>
                  <p className="text-xs text-text-secondary mt-1">Reconciliation accuracy across 4 facilities</p>
                </div>

                {/* Metric Card 2 */}
                <div className="rounded-lg border border-border-subtle bg-surface p-4">
                  <div className="flex items-center justify-between text-xs text-text-muted mb-2">
                    <span className="font-medium uppercase tracking-wider">Active SKUs</span>
                    <Boxes className="h-4 w-4 text-text-muted" />
                  </div>
                  <div className="text-2xl font-bold font-heading text-text-primary">12,480</div>
                  <p className="text-xs text-text-secondary mt-1">Managed catalog items with real-time audit</p>
                </div>

                {/* Metric Card 3 */}
                <div className="rounded-lg border border-border-subtle bg-surface p-4">
                  <div className="flex items-center justify-between text-xs text-text-muted mb-2">
                    <span className="font-medium uppercase tracking-wider">PO Pipeline</span>
                    <RefreshCw className="h-4 w-4 text-text-muted" />
                  </div>
                  <div className="text-2xl font-bold font-heading text-text-primary">3-Way Match</div>
                  <p className="text-xs text-text-secondary mt-1">Automated PO to Goods Receipt verification</p>
                </div>
              </div>

              {/* Simulated Event Ledger Stream inside Preview */}
              <div className="p-6 bg-surface-muted/20">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs font-mono font-semibold uppercase tracking-wider text-text-muted">
                    Recent Stock Event Log (Simulated Sample)
                  </div>
                  <div className="text-[11px] font-mono text-text-muted">
                    Zero Partial State Engine
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded-md border border-border-subtle/80 bg-surface p-3 text-xs">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                      <span className="font-mono font-medium text-text-primary">GRN-8942</span>
                      <span className="text-text-secondary">Goods Receipt Verified (+500 Units)</span>
                    </div>
                    <div className="flex items-center gap-4 text-text-muted font-mono">
                      <span>Warehouse: Bengaluru Hub</span>
                      <span className="rounded bg-surface-muted px-2 py-0.5 text-text-primary font-medium">Reconciled</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-md border border-border-subtle/80 bg-surface p-3 text-xs">
                    <div className="flex items-center gap-3">
                      <RefreshCw className="h-4 w-4 text-text-muted flex-shrink-0" />
                      <span className="font-mono font-medium text-text-primary">TRF-1029</span>
                      <span className="text-text-secondary">Inter-Warehouse Transfer (In Transit)</span>
                    </div>
                    <div className="flex items-center gap-4 text-text-muted font-mono">
                      <span>Mumbai → Pune Hub</span>
                      <span className="rounded bg-surface-muted px-2 py-0.5 text-text-primary font-medium">In Transit</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
