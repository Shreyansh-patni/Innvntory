import type { Metadata } from "next";

import {
  EmptyState,
  PageHeader,
  SearchField,
  Section,
  Td,
  Th,
  Toolbar,
  TableShell,
} from "@/components/app/primitives";

export const metadata: Metadata = { title: "Inventory" };

/**
 * Inventory workspace — specification §12/§13.
 *
 * Establishes the table foundation: real column headers matching the specified
 * ledger fields, toolbar with search affordance, and honest empty / loading /
 * error states. No rows are invented.
 */
export default function InventoryPage() {
  return (
    <>
      <PageHeader
        eyebrow="Operate"
        title="Inventory"
        description="Current stock by item and location, with the ledger behind every quantity change."
        actions={
          <>
            <button type="button" className="btn btn-secondary" disabled>
              Adjust stock
            </button>
            <button type="button" className="btn btn-primary" disabled>
              Transfer
            </button>
          </>
        }
      />

      <div className="mt-7">
        <Section
          title="Stock on hand"
          description="Quantities reflect confirmed movements only."
        >
          <Toolbar>
            <SearchField placeholder="Search by product, SKU or barcode" />
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" className="btn btn-ghost" disabled>
                Location
              </button>
              <button type="button" className="btn btn-ghost" disabled>
                Stock status
              </button>
            </div>
          </Toolbar>

          {/* Loading state — shown while the table resolves. */}
          <div
            role="status"
            aria-live="polite"
            className="flex items-center gap-3 border-b border-hairline bg-surface-muted px-5 py-3"
          >
            <span aria-hidden className="status-dot bg-ink-faint" />
            <p className="text-xs text-ink-muted">
              Loading stock levels… this will populate once the application is
              connected.
            </p>
          </div>

          <TableShell>
            <thead>
              <tr>
                <Th>Product</Th>
                <Th>SKU</Th>
                <Th className="text-right">On hand</Th>
                <Th className="text-right">Reserved</Th>
                <Th className="text-right">Reorder point</Th>
                <Th>Location</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {/* No fabricated rows: an empty ledger must look empty. This row is
                  removed automatically once real data is wired in. */}
              <tr className="hidden">
                <Td>—</Td>
                <Td mono>—</Td>
                <Td className="text-right tabular">—</Td>
                <Td>—</Td>
                <Td>—</Td>
                <Td>—</Td>
              </tr>
            </tbody>
          </TableShell>

          <EmptyState
            title="No products in your catalogue yet"
            body="Add your first product, or import a spreadsheet, to start tracking stock. Every quantity will then be traceable to the movement that created it."
            primaryAction={{ label: "Add product", disabled: true }}
            secondaryAction={{ label: "Import from CSV or XLSX", disabled: true }}
          />

          {/* Error state — documented so it is designed, not improvised later. */}
          <div
            role="note"
            className="border-t border-hairline bg-critical-soft px-5 py-4 text-xs text-critical"
          >
            <p className="font-medium">If loading fails</p>
            <p className="mt-1 leading-relaxed">
              You will see the error code, a plain-language message and a request
              identifier here. Stack traces and database details are never shown.
            </p>
          </div>
        </Section>
      </div>

      <div className="mt-5">
        <Section
          title="Movement ledger"
          description="Every quantity change, with type, reference, user and timestamp (specification §13)."
        >
          <TableShell>
            <thead>
              <tr>
                <Th>Movement</Th>
                <Th>Product</Th>
                <Th className="text-right">Quantity</Th>
                <Th>Reference</Th>
                <Th>User</Th>
                <Th>Timestamp</Th>
              </tr>
            </thead>
            <tbody>
              {/* No fabricated movements. */}
              <tr className="hidden">
                <Td>—</Td>
                <Td>—</Td>
                <Td className="text-right tabular">—</Td>
                <Td>—</Td>
                <Td>—</Td>
                <Td>—</Td>
              </tr>
            </tbody>
          </TableShell>
          <EmptyState
            title="No movements recorded"
            body="Purchases, sales, transfers, adjustments, returns and damage will each appear here with the reason they occurred."
          />
        </Section>
      </div>
    </>
  );
}