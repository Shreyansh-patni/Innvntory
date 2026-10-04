'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Search, Plus, ChevronLeft, ChevronRight, Inbox, Building2 } from 'lucide-react';
import { CustomerRow } from '@/lib/business/customers';
import { StatusBadge } from '@/components/shared/status-badge';

interface CustomerTableProps {
  customers: CustomerRow[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  searchParam?: string;
  statusParam?: string;
}

export function CustomerTable({
  customers,
  totalCount,
  currentPage,
  totalPages,
  searchParam = '',
  statusParam = 'all',
}: CustomerTableProps) {
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
              placeholder="Search by customer name, company, email, GSTIN..."
              className="h-8.5 w-full rounded-md border border-border-subtle bg-surface pl-8.5 pr-3 text-xs text-text-primary placeholder:text-text-muted focus:border-border focus:outline-none"
            />
          </div>

          <select
            value={statusParam}
            onChange={(e) => updateQueryParams({ status: e.target.value, page: '1' })}
            aria-label="Filter by Status"
            className="h-8.5 rounded-md border border-border-subtle bg-surface px-2.5 text-xs text-text-secondary focus:outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </form>

        <Link
          href="/app/customers/new"
          className="inline-flex h-8.5 items-center justify-center gap-1.5 rounded-md bg-text-primary px-3.5 text-xs font-medium text-background hover:bg-text-primary/90 transition-colors shadow-sm"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Customer</span>
        </Link>
      </div>

      <div className="rounded-xl border border-border-subtle bg-surface overflow-hidden shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border-subtle bg-surface-muted/50 text-text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary">Customer / Entity</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary">Contact Information</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary">GSTIN</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary">Location</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary text-right">Credit Limit</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary text-center">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border-subtle">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 px-4 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-muted text-text-muted mb-3 border border-border-subtle/70">
                        <Inbox className="h-5 w-5" />
                      </div>
                      <h4 className="text-sm font-heading font-semibold text-text-primary">No Customers Found</h4>
                      <p className="mt-1 text-xs text-text-secondary max-w-sm">No customers matched your search criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.id} className="hover:bg-surface-muted/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-text-primary">{c.name}</div>
                      {c.company_name && (
                        <div className="text-[11px] text-text-secondary flex items-center gap-1 mt-0.5">
                          <Building2 className="h-3 w-3 text-text-muted" />
                          <span>{c.company_name}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-text-secondary">
                      <div>{c.email || '—'}</div>
                      <div className="text-[11px] text-text-muted font-mono">{c.phone || '—'}</div>
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-text-secondary">{c.gstin || '—'}</td>
                    <td className="px-4 py-3 text-text-secondary">
                      {c.city ? `${c.city}, ${c.state || ''}` : '—'}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-medium text-text-primary">
                      ₹{Number(c.credit_limit).toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <StatusBadge status={c.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border-subtle bg-surface text-xs text-text-secondary">
            <div>
              Showing <span className="font-semibold text-text-primary">{customers.length}</span> of{' '}
              <span className="font-semibold text-text-primary">{totalCount}</span> customers
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
