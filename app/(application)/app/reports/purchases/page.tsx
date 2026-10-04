import { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { getPurchasesReportData, PurchaseReportOrderRow } from '@/lib/reports/reports';
import { getUserContext } from '@/lib/auth/session';
import { Truck, CheckCircle2, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Purchases Reports & Analytics — Innvntory',
  description: 'Analyze procurement commitments, supplier payments, and receipt fulfillments.',
};

export default async function PurchasesReportsPage() {
  const userContext = await getUserContext();
  const orgId = userContext?.organization?.id || '00000000-0000-0000-0000-000000000000';
  const data = await getPurchasesReportData(orgId);

  const committed = data?.totalCommitted || 0;
  const paid = data?.totalPaid || 0;
  const payables = data?.outstandingPayables || 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Purchases Reports"
        description="Supplier spend analysis, receipt reconciliation, and outstanding trade payables."
        breadcrumbs={[
          { label: 'Application', href: '/app/dashboard' },
          { label: 'Reports', href: '/app/reports/purchases' },
          { label: 'Purchases Reports' },
        ]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl border border-border-subtle bg-surface">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-text-muted">Total Committed Spend</span>
            <Truck className="h-4 w-4 text-text-muted" />
          </div>
          <p className="text-2xl font-heading font-bold text-text-primary mt-2">
            ₹{committed.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </p>
          <p className="text-xs text-text-secondary mt-1">{data?.totalPurchaseOrders || 0} Purchase Orders Issued</p>
        </div>

        <div className="p-5 rounded-xl border border-border-subtle bg-surface">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-text-muted">Vendor Disbursals</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-heading font-bold text-emerald-600 dark:text-emerald-400 mt-2">
            ₹{paid.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </p>
          <p className="text-xs text-text-secondary mt-1">{data?.payments?.length || 0} Inward Settlements Cleared</p>
        </div>

        <div className="p-5 rounded-xl border border-border-subtle bg-surface">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-text-muted">Trade Payables</span>
            <AlertCircle className="h-4 w-4 text-amber-600" />
          </div>
          <p className="text-2xl font-heading font-bold text-text-primary mt-2">
            ₹{payables.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </p>
          <p className="text-xs text-text-secondary mt-1">Pending vendor invoices</p>
        </div>
      </div>

      <div className="rounded-xl border border-border-subtle bg-surface p-6">
        <h3 className="text-sm font-heading font-bold text-text-primary mb-4">Historical Procurement Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border-subtle bg-surface-muted/50 text-text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary">PO Reference</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary">Order Date</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary text-right">Taxable Subtotal</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary text-right">GST Total</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary text-right">Total Committed</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary text-center">Fulfillment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {(data?.purchaseOrders || []).slice(0, 15).map((p: PurchaseReportOrderRow) => (
                <tr key={p.id} className="hover:bg-surface-muted/40 transition-colors">
                  <td className="px-4 py-3 font-mono font-medium text-text-primary">{p.po_number}</td>
                  <td className="px-4 py-3 font-mono text-[11px] text-text-muted">{p.order_date}</td>
                  <td className="px-4 py-3 text-right font-mono text-text-secondary">₹{Number(p.subtotal).toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-right font-mono text-text-muted">₹{Number(p.tax_amount).toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-text-primary">₹{Number(p.total_amount).toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-center capitalize text-text-secondary">{p.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
