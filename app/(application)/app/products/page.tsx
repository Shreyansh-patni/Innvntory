import type { Metadata } from "next";
import { Plus, Download } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { PageToolbar } from "@/components/shared/page-toolbar";
import { DataPlaceholderTable } from "@/components/shared/data-placeholder-table";

export const metadata: Metadata = {
  title: "Products — Innvntory",
  description: "Product master catalog, variants, and SKU management.",
};

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Products & Catalog"
        description="Manage master catalog items, multi-attribute variants, barcodes, and pricing."
        breadcrumbs={[{ label: "Business" }, { label: "Products" }]}
        badge="Catalog"
        actions={
          <>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-primary hover:bg-surface-muted transition-colors cursor-pointer"
            >
              <Download className="h-3.5 w-3.5 text-text-muted" />
              Export
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-md bg-text-primary px-3 py-1.5 text-xs font-medium text-background hover:bg-text-primary/90 transition-colors cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Product
            </button>
          </>
        }
      />

      <PageToolbar searchPlaceholder="Search SKUs, product names, barcodes…" />

      <DataPlaceholderTable
        moduleName="Product"
        columns={[
          { header: "SKU / Barcode", width: "20%" },
          { header: "Product Name", width: "30%" },
          { header: "Category", width: "15%" },
          { header: "Variants", width: "10%" },
          { header: "Stock On Hand", width: "15%", align: "right" },
          { header: "Status", width: "10%", align: "right" },
        ]}
      />
    </div>
  );
}
