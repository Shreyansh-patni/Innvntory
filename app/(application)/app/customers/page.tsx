import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { PageToolbar } from "@/components/shared/page-toolbar";
import { DataPlaceholderTable } from "@/components/shared/data-placeholder-table";

export const metadata: Metadata = {
  title: "Customers — Innvntory",
  description: "Customer accounts, credit limits, and contact directory.",
};

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description="Manage customer accounts, tax registrations (GSTIN), credit limits, and outstanding balances."
        breadcrumbs={[{ label: "Business" }, { label: "Customers" }]}
        badge="Directory"
        actions={
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-md bg-text-primary px-3 py-1.5 text-xs font-medium text-background hover:bg-text-primary/90 transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Customer
          </button>
        }
      />

      <PageToolbar searchPlaceholder="Search customer name, GSTIN, phone…" />

      <DataPlaceholderTable
        moduleName="Customer"
        columns={[
          { header: "Customer Name", width: "25%" },
          { header: "GSTIN / State", width: "20%" },
          { header: "Contact Person", width: "20%" },
          { header: "Credit Limit", width: "15%", align: "right" },
          { header: "Outstanding", width: "10%", align: "right" },
          { header: "Status", width: "10%", align: "right" },
        ]}
      />
    </div>
  );
}
