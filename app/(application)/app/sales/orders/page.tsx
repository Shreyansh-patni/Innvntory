import { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { PageToolbar } from '@/components/shared/page-toolbar';
import { DataPlaceholderTable } from '@/components/shared/data-placeholder-table';

export const metadata: Metadata = {
  title: 'Sales Orders — Innvntory',
  description: 'Manage sales orders, order fulfillment, dispatch statuses, and backorders.',
};

export default function SalesOrdersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Sales Orders"
        description="Track customer orders from quotation through fulfillment and delivery."
        breadcrumbs={[
          { label: 'Application', href: '/app/dashboard' },
          { label: 'Sales', href: '/app/sales/orders' },
          { label: 'Orders' },
        ]}
      />

      <PageToolbar
        searchPlaceholder="Search orders by SO number, customer name, or reference..."
        filterOptions={[
          {
            label: 'Status',
            options: [
              { label: 'All Statuses', value: 'all' },
              { label: 'Draft', value: 'draft' },
              { label: 'Confirmed', value: 'confirmed' },
              { label: 'Allocated', value: 'allocated' },
              { label: 'Dispatched', value: 'dispatched' },
              { label: 'Delivered', value: 'delivered' },
              { label: 'Cancelled', value: 'cancelled' },
            ],
          },
        ]}
      />

      <DataPlaceholderTable
        columns={[
          { key: 'orderNumber', label: 'SO Number' },
          { key: 'customer', label: 'Customer' },
          { key: 'date', label: 'Order Date' },
          { key: 'status', label: 'Fulfillment Status' },
          { key: 'total', label: 'Total Value' },
          { key: 'paymentStatus', label: 'Payment' },
          { key: 'actions', label: '', align: 'right' },
        ]}
        emptyTitle="No sales orders placed"
        emptyDescription="Create your first sales order to allocate stock, generate pick lists, and produce commercial invoices."
      />
    </div>
  );
}
