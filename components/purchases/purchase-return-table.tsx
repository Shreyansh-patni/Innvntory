'use client';

import { StatusBadge } from '@/components/shared/status-badge';

export function PurchaseReturnTable({ returns }: { returns: any[] }) {
  return (
    <div className="rounded-xl border border-border-subtle bg-surface overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-border-subtle bg-surface-muted/50 text-text-muted">
            <tr>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary">Debit / Return No</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary">Supplier</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary">Product / SKU</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary">Dispatched Facility</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary text-right">Qty Returned</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary">Return Reason</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {returns.map((r) => (
              <tr key={r.id} className="hover:bg-surface-muted/40 transition-colors">
                <td className="px-4 py-3 font-mono font-medium text-text-primary">{r.return_number}</td>
                <td className="px-4 py-3 font-medium text-text-primary">{r.suppliers?.name}</td>
                <td className="px-4 py-3 font-medium text-text-primary">
                  <div>{r.products?.name}</div>
                  <div className="text-[11px] font-mono text-text-muted">{r.products?.sku}</div>
                </td>
                <td className="px-4 py-3 text-text-secondary">{r.warehouses?.name}</td>
                <td className="px-4 py-3 text-right font-mono font-bold text-rose-600 dark:text-rose-400">{r.quantity}</td>
                <td className="px-4 py-3 text-text-secondary">{r.reason}</td>
                <td className="px-4 py-3 text-center">
                  <StatusBadge status={r.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
