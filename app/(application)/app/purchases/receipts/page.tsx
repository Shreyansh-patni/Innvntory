import { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { PageToolbar } from '@/components/shared/page-toolbar';
import { DataPlaceholderTable } from '@/components/shared/data-placeholder-table';

export const metadata: Metadata = {
  title: 'Goods Received Notes (GRN) — Innvntory',
  description: 'Log and verify inbound supplier shipments and warehouse put-away operations.',
};

export default function PurchaseReceiptsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Goods Receipts (GRN)"
        description="Verify received goods against POs, inspect quality, record batch numbers, and confirm stock put-away."
        breadcrumbs={[
          { label: 'Application', href: '/app/dashboard' },
          { label: 'Purchases', href: '/app/purchases/orders' },
          { label: 'Receipts (GRN)' },
        ]}
      />

      <PageToolbar
        searchPlaceholder="Search receipts by GRN #, PO #, or supplier..."
        filterOptions={[
          {
            label: 'Inspection Status',
            options: [
              { label: 'All Receipts', value: 'all' },
              { label: 'Awaiting Inspection', value: 'pending' },
              { label: 'Passed & Put Away', value: 'passed' },
              { label: 'Rejected / Discrepancy', value: 'rejected' },
            ],
          },
        ]}
      />

      <DataPlaceholderTable
        columns={[
          { key: 'grnNumber', label: 'GRN Number' },
          { key: 'poNumber', label: 'PO Reference' },
          { key: 'supplier', label: 'Supplier' },
          { key: 'warehouse', label: 'Received Warehouse' },
          { key: 'receivedDate', label: 'Received Date' },
          { key: 'status', label: 'Inspection Status' },
        ]}
        emptyTitle="No goods receipts logged"
        emptyDescription="When supplier deliveries arrive at your warehouse, create GRNs to increment on-hand inventory levels."
      />
    </div>
  );
}
