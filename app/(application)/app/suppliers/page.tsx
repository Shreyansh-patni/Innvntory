import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { PageToolbar } from "@/components/shared/page-toolbar";
import { DataPlaceholderTable } from "@/components/shared/data-placeholder-table";

export const metadata: Metadata = {
  title: "Suppliers — Innvntory",
  description: "Vendor directory, lead times, and procurement terms.",
};

export default function SuppliersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Suppliers & Vendors"
        description="Maintain authorized vendor profiles, payment terms, and delivery performance metrics."
        breadcrumbs={[{ label: "Business" }, { label: "Suppliers" }]}
        badge="Vendors"
        actions={
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-md bg-text-primary px-3 py-1.5 text-xs font-medium text-background hover:bg-text-primary/90 transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Supplier
          </button>
        }
      />

      <PageToolbar searchPlaceholder="Search vendor name, contact, GSTIN…" />

      <DataPlaceholderTable
        moduleName="Supplier"
        columns={[
          { header: "Vendor Name", width: "25%" },
          { header: "GSTIN / State", width: "20%" },
          { header: "Payment Terms", width: "15%" },
          { header: "Active POs", width: "15%", align: "center" },
          { header: "Payables", width: "15%", align: "right" },
          { header: "Status", width: "10%", align: "right" },
        ]}
      />
    </div>
  );
}
