import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { PageToolbar } from "@/components/shared/page-toolbar";
import { DataPlaceholderTable } from "@/components/shared/data-placeholder-table";

export const metadata: Metadata = {
  title: "Categories — Innvntory",
  description: "Product categories, HSN codes, and tax mapping.",
};

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Product Categories"
        description="Organize product hierarchies, default tax brackets, and HSN/SAC codes."
        breadcrumbs={[{ label: "Business" }, { label: "Categories" }]}
        badge="Tax & Classification"
        actions={
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-md bg-text-primary px-3 py-1.5 text-xs font-medium text-background hover:bg-text-primary/90 transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Category
          </button>
        }
      />

      <PageToolbar searchPlaceholder="Search category name, HSN code…" />

      <DataPlaceholderTable
        moduleName="Category"
        columns={[
          { header: "Category Name", width: "30%" },
          { header: "HSN / SAC Code", width: "20%" },
          { header: "Default Tax Rate", width: "15%" },
          { header: "Linked Products", width: "15%", align: "center" },
          { header: "Status", width: "20%", align: "right" },
        ]}
      />
    </div>
  );
}
