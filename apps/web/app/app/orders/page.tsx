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

export const metadata: Metadata = { title: "Orders" };

export default function OrdersPage() {
  return (
    <>
      <PageHeader
        eyebrow="Trade"
        title="Orders"
        description="Sales orders, invoices and payments, from draft through to settled."
        actions={
          <>
            <button type="button" className="btn btn-secondary" disabled>
              Export
            </button>
            <button type="button" className="btn btn-primary" disabled>
              New sale
            </button>
          </>
        }
      />

      <div className="mt-7">
        <Section
          title="Sales orders"
          description="Draft, issued and settled orders for your organization."
        >
          <Toolbar>
            <SearchField placeholder="Search orders" />
            <button type="button" className="btn btn-ghost" disabled>
              Filter
            </button>
          </Toolbar>

          <TableShell>
            <thead>
              <tr>
                <Th>Order</Th>
                <Th>Customer</Th>
                <Th>Date</Th>
                <Th>Items</Th>
                <Th>Total</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody />
          </TableShell>

          <EmptyState
            title="No orders yet"
            body="Create a sale, and it will flow through invoice, payment and stock deduction as one atomic operation."
            primaryAction={{ label: "New sale", disabled: true }}
            secondaryAction={{ label: "Create customer", disabled: true }}
          />
        </Section>
      </div>

      <div className="mt-5">
        <Section
          title="Awaiting payment"
          description="Issued invoices that are not yet settled in full."
        >
          <EmptyState
            title="Nothing awaiting payment"
            body="Partially paid and overdue invoices will be listed here with their outstanding balance."
            primaryAction={{ label: "Record a payment", disabled: true }}
          />
        </Section>
      </div>
    </>
  );
}