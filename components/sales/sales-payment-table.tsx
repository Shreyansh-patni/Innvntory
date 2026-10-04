'use client';

import { StatusBadge } from '@/components/shared/status-badge';
import { SalesPaymentItem } from '@/types/operations.types';

export function SalesPaymentTable({ payments }: { payments: SalesPaymentItem[] }) {
  return (
    <div className="rounded-xl border border-border-subtle bg-surface overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-border-subtle bg-surface-muted/50 text-text-muted">
            <tr>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary">Payment No</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary">Customer</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary">Invoice Reference</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary">Mode</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary">UTR / Reference</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary text-right">Amount Cleared</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {payments.map((p) => (
              <tr key={p.id} className="hover:bg-surface-muted/40 transition-colors">
                <td className="px-4 py-3 font-mono font-medium text-text-primary">{p.payment_number}</td>
                <td className="px-4 py-3 font-medium text-text-primary">{p.customers?.name}</td>
                <td className="px-4 py-3 font-mono text-[11px] text-text-secondary">{p.invoices?.invoice_number || '—'}</td>
                <td className="px-4 py-3">
                  <span className="font-mono uppercase text-[10px] rounded bg-surface-muted px-2 py-0.5 text-text-secondary">
                    {p.payment_method}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-[11px] text-text-muted">{p.reference_number || '—'}</td>
                <td className="px-4 py-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  ₹{Number(p.amount).toLocaleString('en-IN')}
                </td>
                <td className="px-4 py-3 text-center">
                  <StatusBadge status={p.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
