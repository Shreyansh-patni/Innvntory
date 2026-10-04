'use client';

import { StatusBadge } from '@/components/shared/status-badge';

export function PurchasePaymentTable({ payments }: { payments: any[] }) {
  return (
    <div className="rounded-xl border border-border-subtle bg-surface overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-border-subtle bg-surface-muted/50 text-text-muted">
            <tr>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary">Payment No</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary">Supplier</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary">PO Reference</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary">Mode</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary">Payment Date</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary text-right">Amount Disbursed</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {payments.map((p) => (
              <tr key={p.id} className="hover:bg-surface-muted/40 transition-colors">
                <td className="px-4 py-3 font-mono font-medium text-text-primary">{p.payment_number}</td>
                <td className="px-4 py-3 font-medium text-text-primary">{p.suppliers?.name}</td>
                <td className="px-4 py-3 font-mono text-[11px] text-text-secondary">{p.purchase_orders?.po_number || '—'}</td>
                <td className="px-4 py-3">
                  <span className="font-mono uppercase text-[10px] rounded bg-surface-muted px-2 py-0.5 text-text-secondary">
                    {p.payment_method}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-[11px] text-text-muted">
                  {new Date(p.payment_date).toLocaleDateString('en-IN')}
                </td>
                <td className="px-4 py-3 text-right font-mono font-bold text-text-primary">
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
