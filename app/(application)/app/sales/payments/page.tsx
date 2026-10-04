import { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { PageToolbar } from '@/components/shared/page-toolbar';
import { DataPlaceholderTable } from '@/components/shared/data-placeholder-table';

export const metadata: Metadata = {
  title: 'Customer Payments — Innvntory',
  description: 'Record customer payments, bank transfers, UPI receipts, and credit allocations.',
};

export default function SalesPaymentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Customer Payments"
        description="Record incoming payments, settle outstanding invoices, and reconcile accounts receivable."
        breadcrumbs={[
          { label: 'Application', href: '/app/dashboard' },
          { label: 'Sales', href: '/app/sales/orders' },
          { label: 'Payments' },
        ]}
      />

      <PageToolbar
        searchPlaceholder="Search payments by transaction ID or customer..."
        filterOptions={[
          {
            label: 'Method',
            options: [
              { label: 'All Methods', value: 'all' },
              { label: 'Bank Transfer (NEFT/RTGS)', value: 'neft' },
              { label: 'UPI / QR', value: 'upi' },
              { label: 'Cheque', value: 'cheque' },
              { label: 'Cash', value: 'cash' },
            ],
          },
        ]}
      />

      <DataPlaceholderTable
        columns={[
          { key: 'paymentId', label: 'Payment ID' },
          { key: 'customer', label: 'Customer' },
          { key: 'amount', label: 'Amount' },
          { key: 'method', label: 'Payment Method' },
          { key: 'date', label: 'Received Date' },
          { key: 'allocatedInvoices', label: 'Settled Invoices' },
          { key: 'reconciliation', label: 'Bank Status' },
        ]}
        emptyTitle="No customer payments recorded"
        emptyDescription="Log customer payments against open invoices to maintain accurate debtor ledgers and cash flow projections."
      />
    </div>
  );
}
