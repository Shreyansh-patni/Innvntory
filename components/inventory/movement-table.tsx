'use client';

export function MovementTable({ movements }: { movements: any[] }) {
  return (
    <div className="rounded-xl border border-border-subtle bg-surface overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-border-subtle bg-surface-muted/50 text-text-muted">
            <tr>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary">Reference</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary">Movement Type</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary">Product / SKU</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary">Facility</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary text-right">Quantity</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary text-right">Unit Valuation</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {movements.map((m) => {
              const qty = Number(m.quantity);
              const isPos = qty > 0;
              return (
                <tr key={m.id} className="hover:bg-surface-muted/40 transition-colors">
                  <td className="px-4 py-3 font-mono font-medium text-text-primary">{m.reference_number}</td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-[11px] rounded bg-surface-muted px-2 py-0.5 text-text-secondary">
                      {m.movement_type}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-text-primary">
                    <div>{m.products?.name}</div>
                    <div className="text-[11px] font-mono text-text-muted">{m.products?.sku}</div>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{m.warehouses?.name}</td>
                  <td className="px-4 py-3 text-right font-mono font-bold">
                    <span className={isPos ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                      {isPos ? `+${qty}` : `${qty}`}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-text-secondary">
                    ₹{Number(m.unit_cost).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-text-muted">
                    {new Date(m.created_at).toLocaleString('en-IN')}
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
