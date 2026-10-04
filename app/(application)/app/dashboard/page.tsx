import type { Metadata } from "next";
import Link from "next/link";
import { Building2, Settings, ArrowRight, BookOpen, Layers, Terminal } from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard — Innvntory Application",
  description: "Innvntory application workspace shell preview.",
};

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface-muted px-3 py-0.5 text-xs font-mono text-text-secondary mb-3">
          Authenticated Shell Preview
        </div>
        <h1 className="text-2xl font-heading font-bold text-text-primary">
          Welcome to Innvntory
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Your business workspace is ready. Start by configuring your organization and reviewing setup guides.
        </p>
      </div>

      {/* Structural getting-started cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-border-subtle bg-surface p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-muted text-text-primary">
                <Building2 className="h-5 w-5" />
              </div>
              <h2 className="text-base font-heading font-semibold text-text-primary">
                Organization Setup
              </h2>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              Configure your company name, multi-GSTN credentials, address details, and default fiscal preferences.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-border-subtle/60">
            <Link
              href="/app/settings/organization"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-primary hover:underline"
            >
              Configure Organization
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        <div className="rounded-xl border border-border-subtle bg-surface p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-muted text-text-primary">
                <Layers className="h-5 w-5" />
              </div>
              <h2 className="text-base font-heading font-semibold text-text-primary">
                Catalog & Warehouses
              </h2>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              Set up your primary warehouse facilities, bin locations, product categories, and unit classifications.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-border-subtle/60">
            <Link
              href="/app/inventory/warehouses"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-primary hover:underline"
            >
              Manage Warehouses
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        <div className="rounded-xl border border-border-subtle bg-surface p-6 flex flex-col justify-between sm:col-span-2 lg:col-span-1">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-muted text-text-primary">
                <BookOpen className="h-5 w-5" />
              </div>
              <h2 className="text-base font-heading font-semibold text-text-primary">
                Documentation & Guides
              </h2>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              Read comprehensive operational manuals for multi-warehouse routing, Goods Receipts, and GST invoicing.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-border-subtle/60">
            <Link
              href="/docs"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-primary hover:underline"
            >
              Read Documentation
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Structural status banner */}
      <div className="rounded-xl border border-border-subtle bg-background-subtle/50 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-heading font-semibold text-text-primary">
            Phase Status: SETUP 06 Shell Preview
          </h3>
          <p className="text-xs text-text-muted mt-1">
            Visual navigation and shell architecture active. Business logic and live database records will be connected in future setup phases.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-4 py-2 text-xs font-medium text-text-primary hover:bg-surface-muted transition-colors flex-shrink-0"
        >
          Return to Public Website
        </Link>
      </div>
    </div>
  );
}
