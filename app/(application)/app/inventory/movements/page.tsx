import { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { PageToolbar } from '@/components/shared/page-toolbar';
import { DataPlaceholderTable } from '@/components/shared/data-placeholder-table';

export const metadata: Metadata = {
  title: 'Stock Movements — Innvntory',
  description: 'Audited log of all stock increases, decreases, transfers, and reconciliations.',
};

export default function StockMovementsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Stock Movements"
        description="Immutable, double-entry ledger of all historical stock movements across warehouses."
        breadcrumbs={[
          { label: 'Application', href: '/app/dashboard' },
          { label: 'Inventory', href: '/app/inventory/stock' },
          { label: 'Movements' },
        ]}
      />

      <PageToolbar
        searchPlaceholder="Filter movements by reference, SKU, or batch..."
        filterOptions={[
          {
            label: 'Type',
            options: [
              { label: 'All Types', value: 'all' },
              { label: 'Receipt', value: 'receipt' },
              { label: 'Dispatch', value: 'dispatch' },
              { label: 'Transfer', value: 'transfer' },
              { label: 'Adjustment', value: 'adjustment' },
            ],
          },
          {
            label: 'Location',
            options: [
              { label: 'All Locations', value: 'all' },
              { label: 'Central Hub', value: 'central' },
              { label: 'Regional Depot', value: 'regional' },
            ],
          },
        ]}
      />

      <DataPlaceholderTable
        columns={[
          { key: 'timestamp', label: 'Timestamp' },
          { key: 'type', label: 'Type' },
          { key: 'reference', label: 'Reference Document' },
          { key: 'item', label: 'Item & SKU' },
          { key: 'location', label: 'From / To' },
          { key: 'delta', label: 'Quantity Delta' },
          { key: 'reconciled', label: 'Reconciliation' },
        ]}
        emptyTitle="No stock movements recorded"
        emptyDescription="All incoming goods receipts, order dispatches, transfers, and write-offs will append to this ledger automatically."
      />
    </div>
  );
}
