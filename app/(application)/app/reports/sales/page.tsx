import { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { BarChart3 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sales Reports & Analytics — Innvntory',
  description: 'Analyze sales velocity, channel performance, margin breakdown, and customer lifetime value.',
};

export default function SalesReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Sales Reports"
        description="Comprehensive analytics on revenue trends, customer segments, top product categories, and gross margins."
        breadcrumbs={[
          { label: 'Application', href: '/app/dashboard' },
          { label: 'Reports', href: '/app/reports/sales' },
          { label: 'Sales Reports' },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#18191A]">
          <p className="text-xs font-mono uppercase tracking-wider text-neutral-500">Sales Volume (MTD)</p>
          <p className="text-2xl font-display font-medium text-neutral-900 dark:text-neutral-100 mt-2">—</p>
          <p className="text-xs text-neutral-500 mt-1">Awaiting order data</p>
        </div>
        <div className="p-5 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#18191A]">
          <p className="text-xs font-mono uppercase tracking-wider text-neutral-500">Average Order Value</p>
          <p className="text-2xl font-display font-medium text-neutral-900 dark:text-neutral-100 mt-2">—</p>
          <p className="text-xs text-neutral-500 mt-1">Awaiting order data</p>
        </div>
        <div className="p-5 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#18191A]">
          <p className="text-xs font-mono uppercase tracking-wider text-neutral-500">Gross Margin %</p>
          <p className="text-2xl font-display font-medium text-neutral-900 dark:text-neutral-100 mt-2">—</p>
          <p className="text-xs text-neutral-500 mt-1">Awaiting cost data</p>
        </div>
      </div>

      <div className="rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#18191A] p-8">
        <EmptyState
          icon={BarChart3}
          title="Sales report engine inactive"
          description="Analytics computations will run continuously once sales orders, invoices, and payment receipts are recorded in the system."
        />
      </div>
    </div>
  );
}
