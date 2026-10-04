import { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { getSalesReportData } from '@/lib/reports/reports';
import { getUserContext } from '@/lib/auth/session';
import { ShoppingCart, TrendingUp, RotateCcw, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sales Reports & Analytics — Innvntory',
  description: 'Analyze sales velocity, revenue trends, collected payments, and return volumes.',
};

export default async function SalesReportsPage() {
  const userContext = await getUserContext();
  const orgId = userContext?.organization?.id || '00000000-0000-0000-0000-000000000000';
  const data = await getSalesReportData(orgId);

  const grossSales = data?.totalGrossSales || 0;
  const collected = data?.totalCollected || 0;
  const aov = data && data.totalOrders > 0 ? grossSales / data.totalOrders : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sales Reports"
        description="Comprehensive analytics on revenue trends, customer billing, and gross margin totals."
        breadcrumbs={[
          { label: 'Application', href: '/app/dashboard' },
          { label: 'Reports', href: '/app/reports/sales' },
          { label: 'Sales Reports' },
        ]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl border border-border-subtle bg-surface">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-text-muted">Total Gross Bookings</span>
            <ShoppingCart className="h-4 w-4 text-text-muted" />
          </div>
          <p className="text-2xl font-heading font-bold text-text-primary mt-2">
            ₹{grossSales.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </p>
          <p className="text-xs text-text-secondary mt-1">{data?.totalOrders || 0} Total Orders Placed</p>
        </div>

        <div className="p-5 rounded-xl border border-border-subtle bg-surface">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-text-muted">Cleared Collections</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-heading font-bold text-emerald-600 dark:text-emerald-400 mt-2">
            ₹{collected.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </p>
          <p className="text-xs text-text-secondary mt-1">{data?.payments?.length || 0} Payments Received</p>
        </div>

        <div className="p-5 rounded-xl border border-border-subtle bg-surface">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-text-muted">Average Order Value</span>
            <TrendingUp className="h-4 w-4 text-sky-600" />
          </div>
          <p className="text-2xl font-heading font-bold text-text-primary mt-2">
            ₹{aov.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </p>
          <p className="text-xs text-text-secondary mt-1">Per commercial order</p>
        </div>

        <div className="p-5 rounded-xl border border-border-subtle bg-surface">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-text-muted">Refunds & Returns</span>
            <RotateCcw className="h-4 w-4 text-rose-600" />
          </div>
          <p className="text-2xl font-heading font-bold text-rose-600 dark:text-rose-400 mt-2">
            ₹{(data?.totalRefunded || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </p>
          <p className="text-xs text-text-secondary mt-1">{data?.returns?.length || 0} RMA Returns processed</p>
        </div>
      </div>

      <div className="rounded-xl border border-border-subtle bg-surface p-6">
        <h3 className="text-sm font-heading font-bold text-text-primary mb-4">Historical Orders Overview</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border-subtle bg-surface-muted/50 text-text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary">Order Reference</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary">Date</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary text-right">Taxable Subtotal</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary text-right">GST Total</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary text-right">Net Value</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {(data?.orders || []).slice(0, 15).map((o: any) => (
                <tr key={o.id} className="hover:bg-surface-muted/40 transition-colors">
                  <td className="px-4 py-3 font-mono font-medium text-text-primary">{o.order_number}</td>
                  <td className="px-4 py-3 font-mono text-[11px] text-text-muted">{o.order_date}</td>
                  <td className="px-4 py-3 text-right font-mono text-text-secondary">₹{Number(o.subtotal).toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-right font-mono text-text-muted">₹{Number(o.tax_amount).toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-text-primary">₹{Number(o.total_amount).toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-center capitalize text-text-secondary">{o.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
