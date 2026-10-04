'use client';

import { StatusBadge } from '@/components/shared/status-badge';
import { ArrowRightLeft } from 'lucide-react';

export function TransferTable({ transfers }: { transfers: any[] }) {
  return (
    <div className="rounded-xl border border-border-subtle bg-surface overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-border-subtle bg-surface-muted/50 text-text-muted">
            <tr>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary">Transfer No</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary">Source Facility</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary">Destination Facility</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary text-right">Items</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary text-center">Status</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {transfers.map((t) => (
              <tr key={t.id} className="hover:bg-surface-muted/40 transition-colors">
                <td className="px-4 py-3 font-mono font-medium text-text-primary flex items-center gap-1.5">
                  <ArrowRightLeft className="h-3.5 w-3.5 text-text-muted" />
                  <span>{t.transfer_number}</span>
                </td>
                <td className="px-4 py-3 text-text-secondary">{t.source_warehouse?.name || '—'}</td>
                <td className="px-4 py-3 text-text-secondary">{t.destination_warehouse?.name || '—'}</td>
                <td className="px-4 py-3 text-right font-mono font-medium text-text-primary">{t.total_items} units</td>
                <td className="px-4 py-3 text-center">
                  <StatusBadge status={t.status} />
                </td>
                <td className="px-4 py-3 font-mono text-[11px] text-text-muted">
                  {new Date(t.created_at).toLocaleDateString('en-IN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
