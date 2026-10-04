import { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { getInventoryReportData, StockReportBalanceRow } from '@/lib/reports/reports';
import { getUserContext } from '@/lib/auth/session';
import { Boxes, Building2, AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Inventory Reports & Valuation — Innvntory',
  description: 'Asset valuation, stock distribution across facilities, and buffer health.',
};

export default async function InventoryReportsPage() {
  const userContext = await getUserContext();
  const orgId = userContext?.organization?.id || '00000000-0000-0000-0000-000000000000';
  const data = await getInventoryReportData(orgId);

  const valuation = data?.totalValuation || 0;
  const retailVal = data?.totalRetailValue || 0;
  const units = data?.totalUnits || 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory Valuation & Stock Reports"
        description="Comprehensive asset evaluation, warehouse stock distribution, and turn metrics."
        breadcrumbs={[
          { label: 'Application', href: '/app/dashboard' },
          { label: 'Reports', href: '/app/reports/inventory' },
          { label: 'Inventory Reports' },
        ]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl border border-border-subtle bg-surface">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-text-muted">Total Stock Valuation (Cost)</span>
            <Boxes className="h-4 w-4 text-text-muted" />
          </div>
          <p className="text-2xl font-heading font-bold text-text-primary mt-2">
            ₹{valuation.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </p>
          <p className="text-xs text-text-secondary mt-1">{units} total units on hand</p>
        </div>

        <div className="p-5 rounded-xl border border-border-subtle bg-surface">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-text-muted">Estimated Retail Value</span>
            <Boxes className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-heading font-bold text-emerald-600 dark:text-emerald-400 mt-2">
            ₹{retailVal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </p>
          <p className="text-xs text-text-secondary mt-1">At standard MSRP rates</p>
        </div>

        <div className="p-5 rounded-xl border border-border-subtle bg-surface">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-text-muted">Warehouse Locations</span>
            <Building2 className="h-4 w-4 text-sky-600" />
          </div>
          <p className="text-2xl font-heading font-bold text-text-primary mt-2">
            {data?.warehouseCount || 0}
          </p>
          <p className="text-xs text-text-secondary mt-1">Active fulfillment nodes</p>
        </div>

        <div className="p-5 rounded-xl border border-border-subtle bg-surface">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-text-muted">Low Stock Buffer Alerts</span>
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          </div>
          <p className="text-2xl font-heading font-bold text-amber-600 dark:text-amber-400 mt-2">
            {data?.lowStockAlertCount || 0}
          </p>
          <p className="text-xs text-text-secondary mt-1">SKU locations below safety level</p>
        </div>
      </div>

      <div className="rounded-xl border border-border-subtle bg-surface p-6">
        <h3 className="text-sm font-heading font-bold text-text-primary mb-4">Stock Breakdown by Location & Item</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border-subtle bg-surface-muted/50 text-text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary">Product / SKU</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary">Facility</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary text-right">Physical Units</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary text-right">Safety Threshold</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary text-right">Total Valuation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {(data?.stock || []).slice(0, 15).map((s: StockReportBalanceRow, idx: number) => {
                const qty = Number(s.quantity);
                const cost = Number(s.products?.cost_price || 0);
                return (
                  <tr key={idx} className="hover:bg-surface-muted/40 transition-colors">
                    <td className="px-4 py-3 font-medium text-text-primary">
                      {s.products?.name} <span className="text-text-muted font-mono text-[11px]">({s.products?.sku})</span>
                    </td>
                    <td className="px-4 py-3 text-text-secondary">{s.warehouses?.name}</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-text-primary">{qty}</td>
                    <td className="px-4 py-3 text-right font-mono text-text-muted">{s.reorder_level}</td>
                    <td className="px-4 py-3 text-right font-mono font-medium text-text-primary">
                      ₹{(qty * cost).toLocaleString('en-IN')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
