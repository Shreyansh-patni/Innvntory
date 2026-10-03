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

export const metadata: Metadata = { title: "Customers" };

export default function CustomersPage() {
  return (
    <>
      <PageHeader
        eyebrow="Trade"
        title="Customers"
        description="Customer accounts, credit limits and outstanding balances."
        actions={
          <>
            <button type="button" className="btn btn-secondary" disabled>
              Export
            </button>
            <button type="button" className="btn btn-primary" disabled>
              Add customer
            </button>
          </>
        }
      />

      <div className="mt-7">
        <Section
          title="Customers"
          description="Accounts your organization trades with."
        >
          <Toolbar>
            <SearchField placeholder="Search customers" />
            <button type="button" className="btn btn-ghost" disabled>
              Filter
            </button>
          </Toolbar>

          <TableShell>
            <thead>
              <tr>
                <Th>Customer</Th>
                <Th>GSTIN</Th>
                <Th>Terms</Th>
                <Th>Credit limit</Th>
                <Th>Outstanding</Th>
                <Th>Last purchase</Th>
              </tr>
            </thead>
            <tbody />
          </TableShell>

          <EmptyState
            title="No customers yet"
            body="Add a customer to raise invoices, record payments and see account history."
            primaryAction={{ label: "Add customer", disabled: true }}
            secondaryAction={{ label: "Import customers", disabled: true }}
          />
        </Section>
      </div>

      <div className="mt-5">
        <Section
          title="Receivables"
          description="Money owed to you, oldest first."
        >
          <EmptyState
            title="Nothing outstanding"
            body="Issued invoices awaiting payment will appear here with their age."
            primaryAction={{ label: "Record a payment", disabled: true }}
          />
        </Section>
      </div>
    </>
  );
}