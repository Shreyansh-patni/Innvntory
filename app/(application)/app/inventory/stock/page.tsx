import type { Metadata } from "next";
import { ArrowLeftRight } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { PageToolbar } from "@/components/shared/page-toolbar";
import { DataPlaceholderTable } from "@/components/shared/data-placeholder-table";

export const metadata: Metadata = {
  title: "Stock Ledger — Innvntory",
  description: "Real-time multi-warehouse stock levels and reserved quantities.",
};

export default function StockPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Stock Ledger"
        description="Monitor on-hand quantities, allocated orders, in-transit units, and available buffer per warehouse."
        breadcrumbs={[{ label: "Inventory" }, { label: "Stock" }]}
        badge="Real-time Inventory"
        actions={
          <LinkButton
            href="/app/inventory/transfers"
            className="inline-flex items-center gap-1.5 rounded-md bg-text-primary px-3 py-1.5 text-xs font-medium text-background hover:bg-text-primary/90 transition-colors"
          >
            <ArrowLeftRight className="h-3.5 w-3.5" />
            Transfer Stock
          </LinkButton>
        }
      />

      <PageToolbar searchPlaceholder="Search by SKU, product name, warehouse…" />

      <DataPlaceholderTable
        moduleName="Stock"
        columns={[
          { header: "SKU / Variant", width: "20%" },
          { header: "Product Name", width: "25%" },
          { header: "Warehouse Facility", width: "15%" },
          { header: "On Hand", width: "10%", align: "right" },
          { header: "Allocated", width: "10%", align: "right" },
          { header: "Available", width: "10%", align: "right" },
          { header: "Stock Status", width: "10%", align: "right" },
        ]}
      />
    </div>
  );
}

function LinkButton({ href, className, children }: { href: string; className: string; children: React.ReactNode }) {
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}
