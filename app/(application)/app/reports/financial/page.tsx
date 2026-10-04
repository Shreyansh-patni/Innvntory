import { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { getFinancialReportData } from '@/lib/reports/reports';
import { getUserContext } from '@/lib/auth/session';
import { Landmark, TrendingUp, ArrowDownLeft, ArrowUpRight, Scale } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Financial Reports & P&L Summary — Innvntory',
  description: 'Operating cash flow, gross margins, and inventory asset valuation.',
};

export default async function FinancialReportsPage() {
  const userContext = await getUserContext();
  const orgId = userContext?.organization?.id || '00000000-0000-0000-0000-000000000000';
  const data = await getFinancialReportData(orgId);

  const grossSales = data?.grossSales || 0;
  const purchases = data?.purchasesCommitted || 0;
  const collections = data?.collections || 0;
  const disbursements = data?.paymentsMade || 0;
  const netCash = data?.netOperatingCash || 0;
  const margin = data?.grossMargin || 0;
  const invAsset = data?.inventoryAsset || 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Financial Reports & P&L Statement"
        description="Consolidated overview of revenue, procurement spend, operating cash, and inventory asset valuation."
        breadcrumbs={[
          { label: 'Application', href: '/app/dashboard' },
          { label: 'Reports', href: '/app/reports/financial' },
          { label: 'Financial Reports' },
        ]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl border border-border-subtle bg-surface">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-text-muted">Net Operating Cash</span>
            <Landmark className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-heading font-bold text-emerald-600 dark:text-emerald-400 mt-2">
            ₹{netCash.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </p>
          <p className="text-xs text-text-secondary mt-1">Customer collections minus vendor disbursements</p>
        </div>

        <div className="p-5 rounded-xl border border-border-subtle bg-surface">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-text-muted">Gross Margin Ratio</span>
            <TrendingUp className="h-4 w-4 text-sky-600" />
          </div>
          <p className="text-2xl font-heading font-bold text-text-primary mt-2">
            {margin.toFixed(1)}%
          </p>
          <p className="text-xs text-text-secondary mt-1">Gross profit over booked sales</p>
        </div>

        <div className="p-5 rounded-xl border border-border-subtle bg-surface">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-text-muted">Inventory Asset Value</span>
            <Scale className="h-4 w-4 text-purple-600" />
          </div>
          <p className="text-2xl font-heading font-bold text-text-primary mt-2">
            ₹{invAsset.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </p>
          <p className="text-xs text-text-secondary mt-1">FIFO weighted cost asset valuation</p>
        </div>
      </div>

      <div className="rounded-xl border border-border-subtle bg-surface p-6">
        <h3 className="text-sm font-heading font-bold text-text-primary mb-4">Financial Reconciliation Summary</h3>
        <div className="divide-y divide-border-subtle text-xs">
          <div className="py-3 flex items-center justify-between">
            <span className="text-text-secondary">Gross Booked Revenue</span>
            <span className="font-mono font-bold text-text-primary">₹{grossSales.toLocaleString('en-IN')}</span>
          </div>
          <div className="py-3 flex items-center justify-between">
            <span className="text-text-secondary">Procurement Spend Committed</span>
            <span className="font-mono font-bold text-text-primary">₹{purchases.toLocaleString('en-IN')}</span>
          </div>
          <div className="py-3 flex items-center justify-between">
            <span className="text-text-secondary">Total Inward Customer Collections</span>
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">₹{collections.toLocaleString('en-IN')}</span>
          </div>
          <div className="py-3 flex items-center justify-between">
            <span className="text-text-secondary">Total Outward Supplier Disbursements</span>
            <span className="font-mono font-bold text-rose-600 dark:text-rose-400">₹{disbursements.toLocaleString('en-IN')}</span>
          </div>
          <div className="py-3 flex items-center justify-between">
            <span className="font-semibold text-text-primary">Net Operating Cash Balance</span>
            <span className="font-mono font-bold text-text-primary">₹{netCash.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
