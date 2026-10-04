'use client';

import { Building2, CheckCircle2 } from 'lucide-react';
import { StatusBadge } from '@/components/shared/status-badge';

export function WarehouseTable({ warehouses }: { warehouses: any[] }) {
  return (
    <div className="rounded-xl border border-border-subtle bg-surface overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-border-subtle bg-surface-muted/50 text-text-muted">
            <tr>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary">Facility Name</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary">Code</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary">Location</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary text-center">Default Hub</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {warehouses.map((w) => (
              <tr key={w.id} className="hover:bg-surface-muted/40 transition-colors">
                <td className="px-4 py-3 font-medium text-text-primary flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-text-muted" />
                  <span>{w.name}</span>
                </td>
                <td className="px-4 py-3 font-mono text-xs font-semibold text-text-secondary">{w.code}</td>
                <td className="px-4 py-3 text-text-secondary">{w.city}, {w.state}</td>
                <td className="px-4 py-3 text-center">
                  {w.is_default ? (
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Primary
                    </span>
                  ) : (
                    <span className="text-text-muted text-[11px]">Regional</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <StatusBadge status={w.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
