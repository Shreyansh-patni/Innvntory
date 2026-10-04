import { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { Layers } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Inventory Valuation & Velocity Reports — Innvntory',
  description: 'Audited stock valuation (FIFO/Weighted Average), dead-stock analysis, and inventory turnover ratios.',
};

export default function InventoryReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory Valuation & Stock Aging"
        description="Monitor real-time inventory valuation, stock turnover frequency, dead stock risks, and carrying costs."
        breadcrumbs={[
          { label: 'Application', href: '/app/dashboard' },
          { label: 'Reports', href: '/app/reports/sales' },
          { label: 'Inventory' },
        ]}
      />

      <div className="rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#18191A] p-8">
        <EmptyState
          icon={Layers}
          title="Valuation engine awaiting inventory records"
          description="Continuous inventory valuation reports by location and SKU will display here once items are stocked and costed."
        />
      </div>
    </div>
  );
}
