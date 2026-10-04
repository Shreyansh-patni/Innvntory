import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { PageToolbar } from "@/components/shared/page-toolbar";
import { DataPlaceholderTable } from "@/components/shared/data-placeholder-table";

export const metadata: Metadata = {
  title: "Warehouses — Innvntory",
  description: "Facility locations, bin assignments, and warehouse management.",
};

export default function WarehousesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Warehouse Facilities"
        description="Configure physical warehouse locations, fulfillment zones, and storage bins."
        breadcrumbs={[{ label: "Inventory" }, { label: "Warehouses" }]}
        badge="Locations"
        actions={
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-md bg-text-primary px-3 py-1.5 text-xs font-medium text-background hover:bg-text-primary/90 transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Warehouse
          </button>
        }
      />

      <PageToolbar searchPlaceholder="Search warehouse name, city, code…" />

      <DataPlaceholderTable
        moduleName="Warehouse"
        columns={[
          { header: "Warehouse Name", width: "25%" },
          { header: "Code / Tag", width: "15%" },
          { header: "Location / State", width: "25%" },
          { header: "Bin Capacity", width: "15%", align: "center" },
          { header: "Managed SKUs", width: "10%", align: "right" },
          { header: "Status", width: "10%", align: "right" },
        ]}
      />
    </div>
  );
}
