import { Building2, Settings, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-heading font-bold text-text-primary tracking-tight">
          Welcome to Innvntory
        </h1>
        <p className="mt-1 text-sm font-secondary text-text-secondary">
          Your business workspace is ready.
        </p>
      </div>

      {/* Getting started cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border-subtle bg-background p-6 space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-surface-muted">
              <Building2 className="h-4.5 w-4.5 text-text-secondary" />
            </div>
            <h2 className="text-base font-heading font-semibold text-text-primary">
              Connect Workspace
            </h2>
          </div>
          <p className="text-sm font-secondary text-text-muted leading-relaxed">
            Configure your organization and connect your first warehouse to begin managing operations.
          </p>
          <div className="flex items-center gap-1 text-xs font-secondary font-medium text-text-secondary">
            <span>Get started</span>
            <ArrowRight className="h-3 w-3" />
          </div>
        </div>

        <div className="rounded-lg border border-border-subtle bg-background p-6 space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-surface-muted">
              <Settings className="h-4.5 w-4.5 text-text-secondary" />
            </div>
            <h2 className="text-base font-heading font-semibold text-text-primary">
              Configure Operations
            </h2>
          </div>
          <p className="text-sm font-secondary text-text-muted leading-relaxed">
            Set up your product categories, tax rules, and operational preferences for your business.
          </p>
          <div className="flex items-center gap-1 text-xs font-secondary font-medium text-text-secondary">
            <span>Open settings</span>
            <ArrowRight className="h-3 w-3" />
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="rounded-lg border border-border-subtle bg-surface-muted/50 p-4">
        <p className="text-xs font-secondary text-text-muted">
          Innvntory v0.1.0 · Application foundation · No data connected
        </p>
      </div>
    </div>
  );
}
