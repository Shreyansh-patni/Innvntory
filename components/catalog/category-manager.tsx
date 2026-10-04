'use client';

import { useState, useActionState } from 'react';
import { Plus, Edit3, Loader2, CheckCircle2, Inbox } from 'lucide-react';
import { CategoryRow } from '@/lib/catalog/categories';
import { createCategoryAction, updateCategoryAction, CatalogActionResult } from '@/lib/catalog/actions';
import { StatusBadge } from '@/components/shared/status-badge';

interface CategoryManagerProps {
  categories: CategoryRow[];
}

export function CategoryManager({ categories }: CategoryManagerProps) {
  const [editingCategory, setEditingCategory] = useState<CategoryRow | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const actionToUse = editingCategory
    ? updateCategoryAction.bind(null, editingCategory.id)
    : createCategoryAction;

  const [state, formAction, isPending] = useActionState<CatalogActionResult | null, FormData>(
    actionToUse,
    null
  );

  const handleCloseForm = () => {
    setEditingCategory(null);
    setIsCreating(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & New Category Button */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-text-secondary">
            Organize products, configure default GST tax slabs, and specify statutory HSN codes.
          </p>
        </div>
        {!isCreating && !editingCategory && (
          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className="inline-flex h-8.5 items-center justify-center gap-1.5 rounded-md bg-text-primary px-3.5 text-xs font-medium text-background hover:bg-text-primary/90 transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Category</span>
          </button>
        )}
      </div>

      {/* Inline Create / Edit Category Form */}
      {(isCreating || editingCategory) && (
        <div className="rounded-xl border border-border-subtle bg-surface p-6 space-y-4 shadow-sm animate-in fade-in duration-100">
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <h3 className="text-sm font-semibold text-text-primary">
              {editingCategory ? `Edit Category: ${editingCategory.name}` : 'New Category'}
            </h3>
            <button
              type="button"
              onClick={handleCloseForm}
              className="text-xs text-text-muted hover:text-text-primary transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>

          {state?.error && (
            <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs">
              {state.error}
            </div>
          )}

          {state?.success && state.message && (
            <div className="p-3 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{state.message}</span>
            </div>
          )}

          <form action={formAction} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1.5">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={editingCategory?.name || ''}
                  placeholder="e.g., Industrial Fasteners"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs sm:text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-text-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1.5">
                  HSN / SAC Code
                </label>
                <input
                  type="text"
                  name="hsn_code"
                  defaultValue={editingCategory?.hsn_code || ''}
                  placeholder="e.g., 7318"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs sm:text-sm font-mono text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-text-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1.5">
                  Default GST Rate (%)
                </label>
                <select
                  name="gst_rate_percent"
                  defaultValue={editingCategory?.gst_rate_percent !== undefined ? editingCategory.gst_rate_percent : 18}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs sm:text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-text-primary"
                >
                  <option value="0">0% (Nil / Exempted)</option>
                  <option value="5">5% (Essential Goods)</option>
                  <option value="12">12% (Standard Lower)</option>
                  <option value="18">18% (Standard Higher)</option>
                  <option value="28">28% (Luxury / De-merit)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1.5">
                  Status
                </label>
                <select
                  name="status"
                  defaultValue={editingCategory?.status || 'active'}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs sm:text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-text-primary"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-text-primary mb-1.5">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  defaultValue={editingCategory?.description || ''}
                  placeholder="Category scope and application notes..."
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs sm:text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-text-primary"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={handleCloseForm}
                className="px-3 py-1.5 text-xs text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-md bg-text-primary text-background hover:bg-text-primary/90 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                <span>{editingCategory ? 'Update Category' : 'Create Category'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Table */}
      <div className="rounded-xl border border-border-subtle bg-surface overflow-hidden shadow-none">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-border-subtle bg-surface-muted/50 text-text-muted">
            <tr>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary">Category Name</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary">HSN / SAC Code</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary text-right">Default GST Rate</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary text-center">Status</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-14 px-4 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-muted text-text-muted mb-3 border border-border-subtle/70">
                      <Inbox className="h-5 w-5" />
                    </div>
                    <h4 className="text-sm font-heading font-semibold text-text-primary">
                      No Categories Configured
                    </h4>
                    <p className="mt-1 text-xs text-text-secondary max-w-sm leading-relaxed">
                      Categories help organize your catalog and assign standard GST rates to items.
                    </p>
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={() => setIsCreating(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-text-primary text-background text-xs font-medium hover:bg-text-primary/90 transition-colors cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Create First Category</span>
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-surface-muted/40 transition-colors">
                  <td className="px-4 py-3 font-medium text-text-primary">
                    <div>
                      <span>{cat.name}</span>
                      {cat.description && (
                        <p className="text-[11px] text-text-muted font-normal mt-0.5">{cat.description}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-text-secondary">
                    {cat.hsn_code || '—'}
                  </td>
                  <td className="px-4 py-3 font-mono text-right text-text-primary">
                    {cat.gst_rate_percent}%
                  </td>
                  <td className="px-4 py-3 text-center">
                    <StatusBadge status={cat.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCategory(cat);
                        setIsCreating(false);
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-text-secondary hover:text-text-primary transition-colors cursor-pointer p-1"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      <span>Edit</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
