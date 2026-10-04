'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Search, Plus, ChevronLeft, ChevronRight, Inbox, Edit3 } from 'lucide-react';
import { ProductRow } from '@/lib/catalog/products';
import { CategoryRow } from '@/lib/catalog/categories';
import { StatusBadge } from '@/components/shared/status-badge';

interface ProductTableProps {
  products: ProductRow[];
  categories: CategoryRow[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  searchParam?: string;
  categoryParam?: string;
  statusParam?: string;
}

export function ProductTable({
  products,
  categories,
  totalCount,
  currentPage,
  totalPages,
  searchParam = '',
  categoryParam = 'all',
  statusParam = 'active',
}: ProductTableProps) {
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
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-1 items-center gap-2.5">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-text-muted" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, SKU, or barcode…"
              className="h-8.5 w-full rounded-md border border-border-subtle bg-surface pl-8.5 pr-3 text-xs text-text-primary placeholder:text-text-muted focus:border-border focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={categoryParam}
              onChange={(e) => updateQueryParams({ category: e.target.value, page: '1' })}
              aria-label="Filter by Category"
              className="h-8.5 rounded-md border border-border-subtle bg-surface px-2.5 text-xs text-text-secondary focus:outline-none cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              value={statusParam}
              onChange={(e) => updateQueryParams({ status: e.target.value, page: '1' })}
              aria-label="Filter by Status"
              className="h-8.5 rounded-md border border-border-subtle bg-surface px-2.5 text-xs text-text-secondary focus:outline-none cursor-pointer"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="all">All Statuses</option>
            </select>
          </div>
        </form>

        <Link
          href="/app/products/new"
          className="inline-flex h-8.5 items-center justify-center gap-1.5 rounded-md bg-text-primary px-3.5 text-xs font-medium text-background hover:bg-text-primary/90 transition-colors shadow-sm"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Product</span>
        </Link>
      </div>

      {/* Table Container */}
      <div className="rounded-xl border border-border-subtle bg-surface overflow-hidden shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border-subtle bg-surface-muted/50 text-text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary">Product Name</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary">SKU</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary">Barcode</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary">Category</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary text-right">Selling Price</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary text-right">Cost Price</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary text-center">Status</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border-subtle">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 px-4 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-muted text-text-muted mb-3 border border-border-subtle/70">
                        <Inbox className="h-5 w-5" />
                      </div>
                      <h4 className="text-sm font-heading font-semibold text-text-primary">
                        No Products Found
                      </h4>
                      <p className="mt-1 text-xs text-text-secondary max-w-sm leading-relaxed">
                        {searchTerm || categoryParam !== 'all'
                          ? 'No products matched your search filters. Try clearing criteria.'
                          : 'Your organization catalog is empty. Create your first product to begin tracking items.'}
                      </p>
                      <div className="mt-4">
                        <Link
                          href="/app/products/new"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-text-primary text-background text-xs font-medium hover:bg-text-primary/90 transition-colors"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>Create First Product</span>
                        </Link>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((p) => {
                  const categoryName = p.categories?.name || 'Uncategorized';

                  return (
                    <tr key={p.id} className="hover:bg-surface-muted/40 transition-colors">
                      <td className="px-4 py-3 font-medium text-text-primary">
                        <Link href={`/app/products/${p.id}`} className="hover:underline">
                          {p.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px] text-text-secondary">{p.sku}</td>
                      <td className="px-4 py-3 font-mono text-[11px] text-text-muted">{p.barcode || '—'}</td>
                      <td className="px-4 py-3 text-text-secondary">{categoryName}</td>
                      <td className="px-4 py-3 text-right font-mono font-medium text-text-primary">
                        ₹{Number(p.selling_price).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-text-muted">
                        ₹{Number(p.cost_price).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <StatusBadge status={p.status} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/app/products/${p.id}`}
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-text-secondary hover:text-text-primary transition-colors p-1"
                          aria-label={`Edit ${p.name}`}
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">Edit</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border-subtle bg-surface text-xs text-text-secondary">
            <div>
              Showing <span className="font-semibold text-text-primary">{products.length}</span> of{' '}
              <span className="font-semibold text-text-primary">{totalCount}</span> products
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => updateQueryParams({ page: String(Math.max(1, currentPage - 1)) })}
                disabled={currentPage <= 1}
                className="inline-flex items-center justify-center h-7 w-7 rounded-md border border-border-subtle bg-surface text-text-secondary hover:bg-surface-muted hover:text-text-primary disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                aria-label="Previous Page"
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
                className="inline-flex items-center justify-center h-7 w-7 rounded-md border border-border-subtle bg-surface text-text-secondary hover:bg-surface-muted hover:text-text-primary disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                aria-label="Next Page"
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
