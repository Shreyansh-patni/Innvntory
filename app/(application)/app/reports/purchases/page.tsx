import { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { ShoppingBag } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Purchase & Spend Reports — Innvntory',
  description: 'Track procurement expenditure, supplier lead-time reliability, and price variance.',
};

export default function PurchaseReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Purchase & Spend Reports"
        description="Analyze vendor performance, purchase order fulfillment cycles, and procurement spend by supplier."
        breadcrumbs={[
          { label: 'Application', href: '/app/dashboard' },
          { label: 'Reports', href: '/app/reports/sales' },
          { label: 'Purchases' },
        ]}
      />

      <div className="rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#18191A] p-8">
        <EmptyState
          icon={ShoppingBag}
          title="Procurement analytics inactive"
          description="Spend reports and supplier performance ratings will become active as purchase orders and goods receipts are processed."
        />
      </div>
    </div>
  );
}
