import type { Metadata } from "next";

import {
  EmptyState,
  PageHeader,
  SearchField,
  Section,
  TableShell,
  Th,
  Toolbar,
} from "@/components/app/primitives";

export const metadata: Metadata = { title: "Products" };

export default function ProductsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Operate"
        title="Products"
        description="Your catalogue: SKUs, barcodes, pricing, tax details and stock thresholds."
        actions={
          <>
            <button type="button" className="btn btn-secondary" disabled>
              Import
            </button>
            <button type="button" className="btn btn-primary" disabled>
              Add product
            </button>
          </>
        }
      />

      <div className="mt-7">
        <Section
          title="Catalogue"
          description="Products visible to your organization."
        >
          <Toolbar>
            <SearchField placeholder="Search products" />
            <button type="button" className="btn btn-ghost" disabled>
              Filter
            </button>
          </Toolbar>

          <TableShell>
            <thead>
              <tr>
                <Th>Product</Th>
                <Th>SKU</Th>
                <Th>Barcode</Th>
                <Th>Category</Th>
                <Th>Unit</Th>
                <Th>Purchase</Th>
                <Th>Selling</Th>
                <Th>MRP</Th>
              </tr>
            </thead>
            <tbody />
          </TableShell>

          <EmptyState
            title="No products yet"
            body="Add your first product or import a spreadsheet. Categories, units and tax details can be set up alongside."
            primaryAction={{ label: "Add product", disabled: true }}
            secondaryAction={{ label: "Import CSV or XLSX", disabled: true }}
          />
        </Section>
      </div>

      <div className="mt-5">
        <Section
          title="Categories"
          description="Group products for browsing and reporting."
        >
          <EmptyState
            title="No categories defined"
            body="Categories keep your catalogue navigable and make reporting by group possible."
            primaryAction={{ label: "Add category", disabled: true }}
          />
        </Section>
      </div>
    </>
  );
}