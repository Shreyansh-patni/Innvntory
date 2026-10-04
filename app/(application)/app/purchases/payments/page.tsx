import { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { PageToolbar } from '@/components/shared/page-toolbar';
import { DataPlaceholderTable } from '@/components/shared/data-placeholder-table';

export const metadata: Metadata = {
  title: 'Supplier Payments — Innvntory',
  description: 'Manage accounts payable, supplier bill disbursements, and advance payments.',
};

export default function PurchasePaymentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Supplier Payments"
        description="Track disbursements to suppliers, match against purchase invoices, and monitor accounts payable."
        breadcrumbs={[
          { label: 'Application', href: '/app/dashboard' },
          { label: 'Purchases', href: '/app/purchases/orders' },
          { label: 'Payments' },
        ]}
      />

      <PageToolbar
        searchPlaceholder="Search payments by supplier, voucher number, or bank ref..."
        filterOptions={[
          {
            label: 'Payment Method',
            options: [
              { label: 'All Methods', value: 'all' },
              { label: 'Bank Transfer (NEFT/RTGS)', value: 'neft' },
              { label: 'Cheque', value: 'cheque' },
              { label: 'UPI / Direct', value: 'upi' },
            ],
          },
        ]}
      />

      <DataPlaceholderTable
        columns={[
          { key: 'voucherNo', label: 'Voucher #' },
          { key: 'supplier', label: 'Supplier' },
          { key: 'amount', label: 'Amount Paid' },
          { key: 'paymentDate', label: 'Disbursement Date' },
          { key: 'method', label: 'Payment Mode' },
          { key: 'status', label: 'Reconciliation' },
        ]}
        emptyTitle="No supplier payments logged"
        emptyDescription="Record outward payments against supplier bills to maintain clear accounts payable schedules."
      />
    </div>
  );
}
