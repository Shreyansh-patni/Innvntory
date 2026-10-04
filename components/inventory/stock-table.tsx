'use client';

import { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Search, ChevronLeft, ChevronRight, Inbox, AlertTriangle } from 'lucide-react';
import { StockBalanceRow } from '@/lib/inventory/inventory';

interface StockTableProps {
  items: StockBalanceRow[];
  warehouses: { id: string; name: string }[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  searchParam?: string;
  warehouseParam?: string;
}

export function StockTable({
  items,
  warehouses,
  totalCount,
  currentPage,
  totalPages,
  searchParam = '',
  warehouseParam = 'all',
}: StockTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParam);

  const updateQueryParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '' || value === 'all') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateQueryParams({ search: searchTerm, page: '1' });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-1 items-center gap-2.5">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-text-muted" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search stock by SKU, product name, or warehouse..."
              className="h-8.5 w-full rounded-md border border-border-subtle bg-surface pl-8.5 pr-3 text-xs text-text-primary placeholder:text-text-muted focus:border-border focus:outline-none"
            />
          </div>

          <select
            value={warehouseParam}
            onChange={(e) => updateQueryParams({ warehouse: e.target.value, page: '1' })}
            aria-label="Filter by Warehouse"
            className="h-8.5 rounded-md border border-border-subtle bg-surface px-2.5 text-xs text-text-secondary focus:outline-none cursor-pointer"
          >
            <option value="all">All Locations</option>
            {warehouses.map((w) => (
              <option key={w.id} value={w.id}>{w.name}</option>
            ))}
          </select>
        </form>
      </div>

      <div className="rounded-xl border border-border-subtle bg-surface overflow-hidden shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border-subtle bg-surface-muted/50 text-text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary">Product / SKU</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary">Category</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary">Facility / Warehouse</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary text-right">On Hand</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary text-right">Reserved</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary text-right">Available</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary text-right">Valuation</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary text-center">Health</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border-subtle">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 px-4 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-muted text-text-muted mb-3 border border-border-subtle/70">
                        <Inbox className="h-5 w-5" />
                      </div>
                      <h4 className="text-sm font-heading font-semibold text-text-primary">No Stock Records Found</h4>
                      <p className="mt-1 text-xs text-text-secondary max-w-sm">No stock balances matched your filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                items.map((item) => {
                  const qty = Number(item.quantity);
                  const res = Number(item.reserved_quantity);
                  const avail = Math.max(0, qty - res);
                  const cost = Number(item.products?.cost_price || 0);
                  const valuation = qty * cost;
                  const isLow = qty <= Number(item.reorder_level);

                  return (
                    <tr key={item.id} className="hover:bg-surface-muted/40 transition-colors">
                      <td className="px-4 py-3 font-medium text-text-primary">
                        <div>{item.products?.name}</div>
                        <div className="text-[11px] font-mono text-text-muted">{item.products?.sku}</div>
                      </td>
                      <td className="px-4 py-3 text-text-secondary">
                        {item.products?.categories?.name || 'General'}
                      </td>
                      <td className="px-4 py-3 font-medium text-text-secondary">
                        {item.warehouses?.name} ({item.warehouses?.code})
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-text-primary">
                        {qty} {item.products?.unit_code || 'PCS'}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-text-muted">
                        {res}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-medium text-emerald-600 dark:text-emerald-400">
                        {avail}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-medium text-text-primary">
                        ₹{valuation.toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {isLow ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:text-amber-400 border border-amber-500/20">
                            <AlertTriangle className="h-2.5 w-2.5" />
                            Low Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                            Optimal
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border-subtle bg-surface text-xs text-text-secondary">
            <div>
              Showing <span className="font-semibold text-text-primary">{items.length}</span> of{' '}
              <span className="font-semibold text-text-primary">{totalCount}</span> balances
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => updateQueryParams({ page: String(Math.max(1, currentPage - 1)) })}
                disabled={currentPage <= 1}
                className="inline-flex items-center justify-center h-7 w-7 rounded-md border border-border-subtle bg-surface text-text-secondary hover:bg-surface-muted disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <span className="px-2 text-text-primary font-mono text-[11px]">
                {currentPage} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => updateQueryParams({ page: String(Math.min(totalPages, currentPage + 1)) })}
                disabled={currentPage >= totalPages}
                className="inline-flex items-center justify-center h-7 w-7 rounded-md border border-border-subtle bg-surface text-text-secondary hover:bg-surface-muted disabled:opacity-40 cursor-pointer"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
