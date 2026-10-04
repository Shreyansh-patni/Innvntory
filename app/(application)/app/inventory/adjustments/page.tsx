import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { PageToolbar } from "@/components/shared/page-toolbar";
import { DataPlaceholderTable } from "@/components/shared/data-placeholder-table";

export const metadata: Metadata = {
  title: "Stock Adjustments — Innvntory",
  description: "Cycle counts, shrinkage logging, and stock reconciliation.",
};

export default function AdjustmentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Stock Adjustments"
        description="Document shrinkage, damage, audit variance, and manual count corrections with mandatory reason codes."
        breadcrumbs={[{ label: "Inventory" }, { label: "Adjustments" }]}
        badge="Auditing"
        actions={
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-md bg-text-primary px-3 py-1.5 text-xs font-medium text-background hover:bg-text-primary/90 transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            New Adjustment
          </button>
        }
      />

      <PageToolbar searchPlaceholder="Search adjustment ID, SKU, reason…" />

      <DataPlaceholderTable
        moduleName="Adjustment"
        columns={[
          { header: "Adjustment #", width: "15%" },
          { header: "Warehouse", width: "20%" },
          { header: "SKU / Item", width: "25%" },
          { header: "Quantity Delta", width: "15%", align: "right" },
          { header: "Reason Code", width: "15%" },
          { header: "Approved By", width: "10%", align: "right" },
        ]}
      />
    </div>
  );
}
