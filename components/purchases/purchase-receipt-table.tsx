'use client';

import { StatusBadge } from '@/components/shared/status-badge';
import { PurchaseReceiptItem } from '@/types/operations.types';

export function PurchaseReceiptTable({ receipts }: { receipts: PurchaseReceiptItem[] }) {
  return (
    <div className="rounded-xl border border-border-subtle bg-surface overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-border-subtle bg-surface-muted/50 text-text-muted">
            <tr>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary">GRN / Receipt No</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary">Purchase Order</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary">Supplier</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary">Warehouse Receiving</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary">Receipt Date</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary">Inspection Notes</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {receipts.map((r) => (
              <tr key={r.id} className="hover:bg-surface-muted/40 transition-colors">
                <td className="px-4 py-3 font-mono font-medium text-text-primary">{r.receipt_number}</td>
                <td className="px-4 py-3 font-mono text-[11px] text-text-secondary">{r.purchase_orders?.po_number || '—'}</td>
                <td className="px-4 py-3 font-medium text-text-primary">{r.suppliers?.name}</td>
                <td className="px-4 py-3 text-text-secondary">{r.warehouses?.name}</td>
                <td className="px-4 py-3 font-mono text-[11px] text-text-muted">
                  {new Date(r.receipt_date).toLocaleDateString('en-IN')}
                </td>
                <td className="px-4 py-3 text-text-secondary">{r.notes || '—'}</td>
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
