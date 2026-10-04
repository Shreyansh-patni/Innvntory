'use client';

import { StatusBadge } from '@/components/shared/status-badge';
import { PlusCircle, MinusCircle } from 'lucide-react';

export function AdjustmentTable({ adjustments }: { adjustments: any[] }) {
  return (
    <div className="rounded-xl border border-border-subtle bg-surface overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-border-subtle bg-surface-muted/50 text-text-muted">
            <tr>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary">Adjustment No</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary">Product / SKU</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary">Facility</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary text-right">Adjustment</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary">Reason</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {adjustments.map((a) => {
              const isInc = a.adjustment_type === 'increase';
              return (
                <tr key={a.id} className="hover:bg-surface-muted/40 transition-colors">
                  <td className="px-4 py-3 font-mono font-medium text-text-primary">{a.adjustment_number}</td>
                  <td className="px-4 py-3 font-medium text-text-primary">
                    <div>{a.products?.name}</div>
                    <div className="text-[11px] font-mono text-text-muted">{a.products?.sku}</div>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{a.warehouses?.name}</td>
                  <td className="px-4 py-3 text-right font-mono font-bold">
                    <span className={isInc ? 'text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1' : 'text-rose-600 dark:text-rose-400 inline-flex items-center gap-1'}>
                      {isInc ? <PlusCircle className="h-3.5 w-3.5" /> : <MinusCircle className="h-3.5 w-3.5" />}
                      {isInc ? `+${a.quantity}` : `-${a.quantity}`}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{a.reason}</td>
                  <td className="px-4 py-3 text-center">
                    <StatusBadge status={a.status} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
