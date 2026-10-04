'use client';

import { StatusBadge } from '@/components/shared/status-badge';
import { InvoiceItem } from '@/types/operations.types';

export function InvoiceTable({ invoices }: { invoices: InvoiceItem[] }) {
  return (
    <div className="rounded-xl border border-border-subtle bg-surface overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-border-subtle bg-surface-muted/50 text-text-muted">
            <tr>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary">Invoice No</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary">Customer</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary">Issue Date</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary">Due Date</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary text-right">Invoice Amount</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary text-right">Paid Amount</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary text-center">Payment Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-surface-muted/40 transition-colors">
                <td className="px-4 py-3 font-mono font-medium text-text-primary">{inv.invoice_number}</td>
                <td className="px-4 py-3 font-medium text-text-primary">{inv.customers?.name}</td>
                <td className="px-4 py-3 font-mono text-[11px] text-text-muted">{inv.issue_date}</td>
                <td className="px-4 py-3 font-mono text-[11px] text-text-muted">{inv.due_date}</td>
                <td className="px-4 py-3 text-right font-mono font-bold text-text-primary">₹{Number(inv.total_amount).toLocaleString('en-IN')}</td>
                <td className="px-4 py-3 text-right font-mono font-medium text-emerald-600 dark:text-emerald-400">₹{Number(inv.paid_amount).toLocaleString('en-IN')}</td>
                <td className="px-4 py-3 text-center">
                  <StatusBadge status={inv.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
