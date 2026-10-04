import { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { PageToolbar } from '@/components/shared/page-toolbar';
import { DataPlaceholderTable } from '@/components/shared/data-placeholder-table';

export const metadata: Metadata = {
  title: 'Purchase Returns (Debit Notes) — Innvntory',
  description: 'Manage returns to suppliers, damaged goods claims, and debit note accounting.',
};

export default function PurchaseReturnsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Purchase Returns"
        description="Initiate returns of defective or non-conforming items back to suppliers and issue debit notes."
        breadcrumbs={[
          { label: 'Application', href: '/app/dashboard' },
          { label: 'Purchases', href: '/app/purchases/orders' },
          { label: 'Returns' },
        ]}
      />

      <PageToolbar
        searchPlaceholder="Search returns by debit note # or supplier..."
        filterOptions={[
          {
            label: 'Status',
            options: [
              { label: 'All Returns', value: 'all' },
              { label: 'Awaiting Pickup', value: 'pickup' },
              { label: 'Dispatched to Supplier', value: 'dispatched' },
              { label: 'Settled / Credit Received', value: 'settled' },
            ],
          },
        ]}
      />

      <DataPlaceholderTable
        columns={[
          { key: 'returnNumber', label: 'Return #' },
          { key: 'supplier', label: 'Supplier' },
          { key: 'poReference', label: 'PO Reference' },
          { key: 'reason', label: 'Return Reason' },
          { key: 'debitAmount', label: 'Debit Amount' },
          { key: 'status', label: 'Status' },
        ]}
        emptyTitle="No purchase returns recorded"
        emptyDescription="Manage supplier return authorisations and decrement stock upon physical return dispatch."
      />
    </div>
  );
}
