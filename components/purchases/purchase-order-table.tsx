'use client';

import { StatusBadge } from '@/components/shared/status-badge';
import { PurchaseOrderItem } from '@/types/operations.types';

export function PurchaseOrderTable({ orders }: { orders: PurchaseOrderItem[] }) {
  return (
    <div className="rounded-xl border border-border-subtle bg-surface overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-border-subtle bg-surface-muted/50 text-text-muted">
            <tr>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary">PO Number</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary">Vendor / Supplier</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary">Receiving Warehouse</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary">Order Date</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary">Est. Delivery</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary text-right">Taxable</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary text-right">Total Committed</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {orders.map((po) => (
              <tr key={po.id} className="hover:bg-surface-muted/40 transition-colors">
                <td className="px-4 py-3 font-mono font-medium text-text-primary">{po.po_number}</td>
                <td className="px-4 py-3 font-medium text-text-primary">{po.suppliers?.name}</td>
                <td className="px-4 py-3 text-text-secondary">{po.warehouses?.name}</td>
                <td className="px-4 py-3 font-mono text-[11px] text-text-muted">{po.order_date}</td>
                <td className="px-4 py-3 font-mono text-[11px] text-text-muted">{po.expected_delivery || '—'}</td>
                <td className="px-4 py-3 text-right font-mono text-text-secondary">₹{Number(po.subtotal).toLocaleString('en-IN')}</td>
                <td className="px-4 py-3 text-right font-mono font-bold text-text-primary">₹{Number(po.total_amount).toLocaleString('en-IN')}</td>
                <td className="px-4 py-3 text-center">
                  <StatusBadge status={po.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
