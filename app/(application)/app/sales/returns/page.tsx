import { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { PageToolbar } from '@/components/shared/page-toolbar';
import { DataPlaceholderTable } from '@/components/shared/data-placeholder-table';

export const metadata: Metadata = {
  title: 'Sales Returns & RMA — Innvntory',
  description: 'Manage customer returns, return merchandise authorizations (RMA), and restocking workflows.',
};

export default function SalesReturnsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Sales Returns (RMA)"
        description="Process customer returns, inspect received goods, and issue credit notes or inventory restocking."
        breadcrumbs={[
          { label: 'Application', href: '/app/dashboard' },
          { label: 'Sales', href: '/app/sales/orders' },
          { label: 'Returns' },
        ]}
      />

      <PageToolbar
        searchPlaceholder="Search returns by RMA # or invoice reference..."
        filterOptions={[
          {
            label: 'Disposition',
            options: [
              { label: 'All Dispositions', value: 'all' },
              { label: 'Pending Inspection', value: 'pending' },
              { label: 'Restocked', value: 'restocked' },
              { label: 'Damaged / Scrapped', value: 'scrapped' },
            ],
          },
        ]}
      />

      <DataPlaceholderTable
        columns={[
          { key: 'rmaNumber', label: 'RMA #' },
          { key: 'customer', label: 'Customer' },
          { key: 'originalOrder', label: 'Original SO' },
          { key: 'returnDate', label: 'Return Date' },
          { key: 'disposition', label: 'Disposition' },
          { key: 'creditStatus', label: 'Credit Note' },
        ]}
        emptyTitle="No customer returns logged"
        emptyDescription="When customers initiate product returns or replacements, manage inspection and stock restoration here."
      />
    </div>
  );
}
