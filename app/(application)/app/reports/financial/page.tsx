import { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { IndianRupee } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Financial & Tax Reports — Innvntory',
  description: 'GST summary reports (GSTR-1, GSTR-3B preparation), accounts receivable aging, and COGS statements.',
};

export default function FinancialReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Financial & GST Reports"
        description="Accounting ledger summaries, cost-of-goods-sold (COGS), debtor/creditor aging, and GST reconciliation."
        breadcrumbs={[
          { label: 'Application', href: '/app/dashboard' },
          { label: 'Reports', href: '/app/reports/sales' },
          { label: 'Financial' },
        ]}
      />

      <div className="rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#18191A] p-8">
        <EmptyState
          icon={IndianRupee}
          title="Financial reconciliation awaiting transaction data"
          description="GST liability summaries, input tax credit schedules, and trial balances will be compiled as invoices and disbursements are logged."
        />
      </div>
    </div>
  );
}
