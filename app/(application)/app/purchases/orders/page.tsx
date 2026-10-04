import { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { PageToolbar } from '@/components/shared/page-toolbar';
import { DataPlaceholderTable } from '@/components/shared/data-placeholder-table';

export const metadata: Metadata = {
  title: 'Purchase Orders — Innvntory',
  description: 'Manage procurement orders, supplier replenishment requests, and delivery timelines.',
};

export default function PurchaseOrdersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Purchase Orders"
        description="Issue and track purchase orders with suppliers to replenish warehouse stock."
        breadcrumbs={[
          { label: 'Application', href: '/app/dashboard' },
          { label: 'Purchases', href: '/app/purchases/orders' },
          { label: 'Purchase Orders' },
        ]}
      />

      <PageToolbar
        searchPlaceholder="Search POs by order number, supplier, or SKU..."
        filterOptions={[
          {
            label: 'Status',
            options: [
              { label: 'All Orders', value: 'all' },
              { label: 'Draft', value: 'draft' },
              { label: 'Sent to Supplier', value: 'sent' },
              { label: 'Partially Received', value: 'partial' },
              { label: 'Fully Received', value: 'received' },
              { label: 'Cancelled', value: 'cancelled' },
            ],
          },
        ]}
      />

      <DataPlaceholderTable
        columns={[
          { key: 'poNumber', label: 'PO Number' },
          { key: 'supplier', label: 'Supplier' },
          { key: 'destination', label: 'Destination Warehouse' },
          { key: 'orderDate', label: 'Order Date' },
          { key: 'expectedDate', label: 'Expected Date' },
          { key: 'status', label: 'PO Status' },
          { key: 'total', label: 'Total Value' },
        ]}
        emptyTitle="No purchase orders created"
        emptyDescription="Create purchase orders manually or generate them automatically based on minimum reorder level thresholds."
      />
    </div>
  );
}
