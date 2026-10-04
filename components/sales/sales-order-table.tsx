'use client';

import { StatusBadge } from '@/components/shared/status-badge';

export function SalesOrderTable({ orders }: { orders: any[] }) {
  return (
    <div className="rounded-xl border border-border-subtle bg-surface overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-border-subtle bg-surface-muted/50 text-text-muted">
            <tr>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary">SO Number</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary">Customer</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary">Fulfillment Facility</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary">Order Date</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary text-right">Taxable</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary text-right">GST</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary text-right">Total Value</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-surface-muted/40 transition-colors">
                <td className="px-4 py-3 font-mono font-medium text-text-primary">{o.order_number}</td>
                <td className="px-4 py-3 font-medium text-text-primary">
                  {o.customers?.name}
                  {o.customers?.company_name && (
                    <div className="text-[11px] text-text-muted font-normal">{o.customers.company_name}</div>
                  )}
                </td>
                <td className="px-4 py-3 text-text-secondary">{o.warehouses?.name}</td>
                <td className="px-4 py-3 font-mono text-[11px] text-text-muted">{o.order_date}</td>
                <td className="px-4 py-3 text-right font-mono text-text-secondary">₹{Number(o.subtotal).toLocaleString('en-IN')}</td>
                <td className="px-4 py-3 text-right font-mono text-text-muted">₹{Number(o.tax_amount).toLocaleString('en-IN')}</td>
                <td className="px-4 py-3 text-right font-mono font-bold text-text-primary">₹{Number(o.total_amount).toLocaleString('en-IN')}</td>
                <td className="px-4 py-3 text-center">
                  <StatusBadge status={o.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
