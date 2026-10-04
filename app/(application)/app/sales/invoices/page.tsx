import { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { PageToolbar } from '@/components/shared/page-toolbar';
import { DataPlaceholderTable } from '@/components/shared/data-placeholder-table';

export const metadata: Metadata = {
  title: 'Tax Invoices — Innvntory',
  description: 'Manage GST-compliant sales invoices, credit notes, and e-way bill references.',
};

export default function SalesInvoicesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Tax Invoices"
        description="Generate, track, and reconcile GST-compliant invoices for customer orders."
        breadcrumbs={[
          { label: 'Application', href: '/app/dashboard' },
          { label: 'Sales', href: '/app/sales/orders' },
          { label: 'Invoices' },
        ]}
      />

      <PageToolbar
        searchPlaceholder="Search invoices by INV number or customer..."
        filterOptions={[
          {
            label: 'Payment Status',
            options: [
              { label: 'All Invoices', value: 'all' },
              { label: 'Paid', value: 'paid' },
              { label: 'Partially Paid', value: 'partial' },
              { label: 'Unpaid / Due', value: 'unpaid' },
              { label: 'Overdue', value: 'overdue' },
            ],
          },
        ]}
      />

      <DataPlaceholderTable
        columns={[
          { key: 'invoiceNumber', label: 'Invoice #' },
          { key: 'customer', label: 'Billed To' },
          { key: 'issueDate', label: 'Issue Date' },
          { key: 'dueDate', label: 'Due Date' },
          { key: 'amount', label: 'Taxable Amount' },
          { key: 'gst', label: 'GST Total' },
          { key: 'status', label: 'Status' },
        ]}
        emptyTitle="No invoices generated"
        emptyDescription="Invoices created from fulfilled sales orders or direct billing will be listed here with automated GST calculations."
      />
    </div>
  );
}
