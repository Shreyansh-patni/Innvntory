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

export const metadata: Metadata = { title: "Suppliers" };

export default function SuppliersPage() {
  return (
    <>
      <PageHeader
        eyebrow="Trade"
        title="Suppliers"
        description="Purchase orders, goods receipt and what you owe each supplier."
        actions={
          <>
            <button type="button" className="btn btn-secondary" disabled>
              Export
            </button>
            <button type="button" className="btn btn-primary" disabled>
              New purchase order
            </button>
          </>
        }
      />

      <div className="mt-7">
        <Section
          title="Suppliers"
          description="Supplier accounts with credit limits and payment terms."
        >
          <Toolbar>
            <SearchField placeholder="Search suppliers" />
            <button type="button" className="btn btn-ghost" disabled>
              Filter
            </button>
          </Toolbar>

          <TableShell>
            <thead>
              <tr>
                <Th>Supplier</Th>
                <Th>GSTIN</Th>
                <Th>Terms</Th>
                <Th>Credit limit</Th>
                <Th>Outstanding</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody />
          </TableShell>

          <EmptyState
            title="No suppliers yet"
            body="Add a supplier to raise purchase orders, receive stock and track what is owed."
            primaryAction={{ label: "Add supplier", disabled: true }}
            secondaryAction={{ label: "New purchase order", disabled: true }}
          />
        </Section>
      </div>

      <div className="mt-5">
        <Section
          title="Purchase orders"
          description="From draft through approved, dispatched and received."
        >
          <EmptyState
            title="No purchase orders"
            body="Raising a purchase order reserves nothing until the goods are received and stock is updated."
            primaryAction={{ label: "New purchase order", disabled: true }}
          />
        </Section>
      </div>
    </>
  );
}