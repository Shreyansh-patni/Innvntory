import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { PageToolbar } from "@/components/shared/page-toolbar";
import { DataPlaceholderTable } from "@/components/shared/data-placeholder-table";

export const metadata: Metadata = {
  title: "Stock Transfers — Innvntory",
  description: "Inter-facility transfer orders, dispatch tracking, and receiving.",
};

export default function TransfersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Inter-Warehouse Transfers"
        description="Initiate, track in-transit items, and safely reconcile transfers between fulfillment hubs."
        breadcrumbs={[{ label: "Inventory" }, { label: "Transfers" }]}
        badge="Movements"
        actions={
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-md bg-text-primary px-3 py-1.5 text-xs font-medium text-background hover:bg-text-primary/90 transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            New Transfer Request
          </button>
        }
      />

      <PageToolbar searchPlaceholder="Search transfer ID, source, destination…" />

      <DataPlaceholderTable
        moduleName="Transfer"
        columns={[
          { header: "Transfer #", width: "15%" },
          { header: "Source Facility", width: "20%" },
          { header: "Destination Facility", width: "20%" },
          { header: "Item Count", width: "15%", align: "center" },
          { header: "Dispatch Date", width: "15%" },
          { header: "Status", width: "15%", align: "right" },
        ]}
      />
    </div>
  );
}
