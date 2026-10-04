import type { Metadata } from "next";
import Link from "next/link";
import {
  Boxes,
  Package,
  Truck,
  ShoppingCart,
  ArrowRight,
  TrendingUp,
  Clock,
  ShieldCheck,
  Plus,
  ArrowLeftRight,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { MetricCard } from "@/components/shared/metric-card";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";

export const metadata: Metadata = {
  title: "Dashboard — Innvntory Operations OS",
  description: "Operations dashboard and live inventory health overview.",
};

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* 1. Page Header */}
      <PageHeader
        title="Operations Dashboard"
        description="Real-time overview of inventory valuation, multi-warehouse movements, and procurement pipelines."
        badge="V0 Foundation"
        actions={
          <>
            <Link
              href="/app/inventory/transfers"
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3.5 py-1.5 text-xs font-medium text-text-primary hover:bg-surface-muted transition-colors"
            >
              <ArrowLeftRight className="h-3.5 w-3.5 text-text-muted" />
              Transfer Stock
            </Link>
            <Link
              href="/app/purchases/orders"
              className="inline-flex items-center gap-1.5 rounded-md bg-text-primary px-3.5 py-1.5 text-xs font-medium text-background hover:bg-text-primary/90 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              New Purchase Order
            </Link>
          </>
        }
      />

      {/* 2. KPI Metric Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Stock Valuation"
          value="—"
          subtitle="FIFO / Weighted-Average valuation"
          statusBadge="Awaiting Data"
          icon={Boxes}
        />
        <MetricCard
          title="Active Catalog SKUs"
          value="—"
          subtitle="Total product & variant count"
          statusBadge="Awaiting Data"
          icon={Package}
        />
        <MetricCard
          title="Procurement Pipeline"
          value="—"
          subtitle="Active POs awaiting Goods Receipt"
          statusBadge="Awaiting Data"
          icon={Truck}
        />
        <MetricCard
          title="Low-Stock Alerts"
          value="—"
          subtitle="Items below safety threshold"
          statusBadge="All Healthy"
          icon={TrendingUp}
        />
      </div>

      {/* 3. Operational Overview & Activity Panels (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Stock Movement Ledger Feed */}
        <div className="lg:col-span-7 rounded-xl border border-border-subtle bg-surface p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border-subtle/70 pb-4 mb-5">
              <div>
                <h2 className="text-base font-heading font-bold text-text-primary">
                  Live Stock Movement Ledger
                </h2>
                <p className="text-xs text-text-secondary mt-0.5">
                  Immutable event stream of stock receipts, picks, and inter-facility transfers.
                </p>
              </div>
              <StatusBadge status="active" label="Event Engine Ready" />
            </div>

            <EmptyState
              icon={Clock}
              title="No Stock Movements Recorded"
              description="Audit transactions will stream here in real time once stock receipts (GRN), dispatches, or adjustments execute."
              action={{
                label: "View Stock Ledger",
                href: "/app/inventory/stock",
              }}
              compact
            />
          </div>

          <div className="mt-5 pt-3.5 border-t border-border-subtle/60 flex items-center justify-between text-[11px] text-text-muted">
            <span>Audit Trail: 100% Immutable</span>
            <Link href="/app/inventory/movements" className="text-text-primary font-medium hover:underline">
              Browse Movement History →
            </Link>
          </div>
        </div>

        {/* Right: Low-Stock Reorder Queue */}
        <div className="lg:col-span-5 rounded-xl border border-border-subtle bg-surface p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border-subtle/70 pb-4 mb-5">
              <div>
                <h2 className="text-base font-heading font-bold text-text-primary">
                  Reorder Queue & Alerts
                </h2>
                <p className="text-xs text-text-secondary mt-0.5">
                  Automated reorder triggers by warehouse facility.
                </p>
              </div>
              <StatusBadge status="reconciled" label="Buffers Normal" />
            </div>

            <EmptyState
              icon={Boxes}
              title="All Inventory Levels Normal"
              description="Zero SKUs currently fall below warehouse minimum safety buffers. Reorder suggestions will populate automatically when thresholds trigger."
              compact
            />
          </div>

          <div className="mt-5 pt-3.5 border-t border-border-subtle/60 flex items-center justify-between text-[11px] text-text-muted">
            <span>Automated PO Triggers</span>
            <Link href="/app/inventory/stock" className="text-text-primary font-medium hover:underline">
              Configure Reorder Points →
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Quick Operational Navigation Modules */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3.5">
          Core Operations Modules
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/app/products"
            className="group rounded-xl border border-border-subtle bg-surface p-5 hover:border-border transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-muted text-text-primary">
                <Package className="h-4.5 w-4.5" />
              </div>
              <ArrowRight className="h-4 w-4 text-text-muted group-hover:translate-x-1 group-hover:text-text-primary transition-all" />
            </div>
            <h3 className="text-sm font-heading font-bold text-text-primary">
              Product Master Catalog
            </h3>
            <p className="text-xs text-text-secondary mt-1">
              Manage SKUs, multi-attribute variants, barcodes, and dynamic price lists.
            </p>
          </Link>

          <Link
            href="/app/inventory/stock"
            className="group rounded-xl border border-border-subtle bg-surface p-5 hover:border-border transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-muted text-text-primary">
                <Boxes className="h-4.5 w-4.5" />
              </div>
              <ArrowRight className="h-4 w-4 text-text-muted group-hover:translate-x-1 group-hover:text-text-primary transition-all" />
            </div>
            <h3 className="text-sm font-heading font-bold text-text-primary">
              Multi-Warehouse Stock
            </h3>
            <p className="text-xs text-text-secondary mt-1">
              Real-time quantities, reserved units, bin tracking, and facility transfers.
            </p>
          </Link>

          <Link
            href="/app/purchases/orders"
            className="group rounded-xl border border-border-subtle bg-surface p-5 hover:border-border transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-muted text-text-primary">
                <Truck className="h-4.5 w-4.5" />
              </div>
              <ArrowRight className="h-4 w-4 text-text-muted group-hover:translate-x-1 group-hover:text-text-primary transition-all" />
            </div>
            <h3 className="text-sm font-heading font-bold text-text-primary">
              Purchasing & POs
            </h3>
            <p className="text-xs text-text-secondary mt-1">
              Issue vendor purchase orders, receive Goods Receipts (GRN), and 3-way match.
            </p>
          </Link>

          <Link
            href="/app/sales/orders"
            className="group rounded-xl border border-border-subtle bg-surface p-5 hover:border-border transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-muted text-text-primary">
                <ShoppingCart className="h-4.5 w-4.5" />
              </div>
              <ArrowRight className="h-4 w-4 text-text-muted group-hover:translate-x-1 group-hover:text-text-primary transition-all" />
            </div>
            <h3 className="text-sm font-heading font-bold text-text-primary">
              Sales & Invoicing
            </h3>
            <p className="text-xs text-text-secondary mt-1">
              Process customer orders, dispatch shipments, and issue GST tax invoices.
            </p>
          </Link>
        </div>
      </div>

      {/* 5. System Status Banner */}
      <div className="rounded-xl border border-border-subtle bg-background-subtle/50 p-4.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-text-secondary">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-emerald-600 flex-shrink-0" />
          <div>
            <span className="font-semibold text-text-primary">Tenant Security Active: </span>
            <span>Organization boundaries isolated at PostgreSQL row level. Zero data leakage across workspaces.</span>
          </div>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-text-muted">
          <span>Engine: Next.js + Tailwind</span>
        </div>
      </div>
    </div>
  );
}
