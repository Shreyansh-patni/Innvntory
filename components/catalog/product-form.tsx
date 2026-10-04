'use client';

import { useActionState, useTransition } from 'react';
import Link from 'next/link';
import { Loader2, ArrowLeft, Trash2, CheckCircle2 } from 'lucide-react';
import { createProductAction, updateProductAction, archiveProductAction, CatalogActionResult } from '@/lib/catalog/actions';
import { CategoryRow } from '@/lib/catalog/categories';
import { ProductRow } from '@/lib/catalog/products';

interface ProductFormProps {
  initialData?: ProductRow | null;
  categories: CategoryRow[];
  isEditing?: boolean;
}

export function ProductForm({ initialData, categories, isEditing = false }: ProductFormProps) {
  const [archivePending, startArchiveTransition] = useTransition();

  const updateActionWithId = initialData
    ? updateProductAction.bind(null, initialData.id)
    : createProductAction;

  const [state, formAction, isPending] = useActionState<CatalogActionResult | null, FormData>(
    updateActionWithId,
    null
  );

  const handleArchive = () => {
    if (!initialData?.id) return;
    if (window.confirm('Are you sure you want to archive this product? Archived products will be hidden from the active catalog.')) {
      startArchiveTransition(async () => {
        await archiveProductAction(initialData.id);
      });
    }
  };

  return (
    <form action={formAction} className="space-y-8 max-w-4xl">
      {/* Top action bar */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-border-subtle">
        <Link
          href="/app/products"
          className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Products</span>
        </Link>

        <div className="flex items-center gap-2.5">
          {isEditing && initialData && (
            <button
              type="button"
              onClick={handleArchive}
              disabled={archivePending || isPending}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-500/10 rounded-md border border-red-500/20 transition-colors cursor-pointer disabled:opacity-50"
            >
              {archivePending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
              <span>Archive</span>
            </button>
          )}

          <button
            type="submit"
            disabled={isPending || archivePending}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-medium rounded-md bg-text-primary text-background hover:bg-text-primary/90 transition-colors cursor-pointer disabled:opacity-50 shadow-sm"
          >
            {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            <span>{isEditing ? 'Save Changes' : 'Create Product'}</span>
          </button>
        </div>
      </div>

      {/* Success / Error Messages */}
      {state?.error && (
        <div className="p-3.5 rounded-md bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs leading-relaxed">
          {state.error}
        </div>
      )}

      {state?.success && state.message && (
        <div className="p-3.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{state.message}</span>
        </div>
      )}

      {/* General Information Section */}
      <div className="rounded-xl border border-border-subtle bg-surface p-6 space-y-5">
        <h3 className="text-sm font-semibold text-text-primary border-b border-border-subtle pb-3">
          General Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-text-primary mb-1.5">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              defaultValue={initialData?.name || ''}
              placeholder="e.g., Heavy-Duty Ball Bearing 6204-2RS"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs sm:text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-text-primary"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-text-primary mb-1.5">
              Description
            </label>
            <textarea
              name="description"
              rows={3}
              defaultValue={initialData?.description || ''}
              placeholder="Technical specifications, dimensions, material composition, or notes..."
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs sm:text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-text-primary resize-y"
            />
          </div>
        </div>
      </div>

      {/* Identification & Categorization Section */}
      <div className="rounded-xl border border-border-subtle bg-surface p-6 space-y-5">
        <h3 className="text-sm font-semibold text-text-primary border-b border-border-subtle pb-3">
          Identification & Tax Category
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1.5">
              SKU (Stock Keeping Unit) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="sku"
              required
              defaultValue={initialData?.sku || ''}
              placeholder="e.g., BRG-6204-2RS"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs sm:text-sm font-mono text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-text-primary"
            />
            <span className="text-[11px] text-text-muted mt-1 block">Unique identifier within organization.</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1.5">
              Barcode / EAN / UPC
            </label>
            <input
              type="text"
              name="barcode"
              defaultValue={initialData?.barcode || ''}
              placeholder="e.g., 8901234567890"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs sm:text-sm font-mono text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-text-primary"
            />
            <span className="text-[11px] text-text-muted mt-1 block">Optional barcode for scanner lookup.</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1.5">
              Category
            </label>
            <select
              name="category_id"
              defaultValue={initialData?.category_id || ''}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs sm:text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-text-primary"
            >
              <option value="">— Uncategorized —</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} {cat.hsn_code ? `(HSN: ${cat.hsn_code})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1.5">
              Unit of Measurement (UOM)
            </label>
            <select
              name="unit_code"
              defaultValue={initialData?.unit_code || 'PCS'}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs sm:text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-text-primary"
            >
              <option value="PCS">Pieces (PCS)</option>
              <option value="BOX">Boxes (BOX)</option>
              <option value="KG">Kilograms (KG)</option>
              <option value="G">Grams (G)</option>
              <option value="LTR">Litres (LTR)</option>
              <option value="MTR">Meters (MTR)</option>
              <option value="PAC">Packs (PAC)</option>
              <option value="SET">Sets (SET)</option>
              <option value="UNT">Units (UNT)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Pricing & Lifecycle Section */}
      <div className="rounded-xl border border-border-subtle bg-surface p-6 space-y-5">
        <h3 className="text-sm font-semibold text-text-primary border-b border-border-subtle pb-3">
          Pricing & Lifecycle
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1.5">
              Cost Price (₹)
            </label>
            <input
              type="number"
              name="cost_price"
              step="0.01"
              min="0"
              defaultValue={initialData?.cost_price !== undefined ? initialData.cost_price : 0}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs sm:text-sm font-mono text-text-primary focus:outline-none focus:ring-1 focus:ring-text-primary"
            />
            <span className="text-[11px] text-text-muted mt-1 block">Default supplier procurement cost.</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1.5">
              Selling Price (₹)
            </label>
            <input
              type="number"
              name="selling_price"
              step="0.01"
              min="0"
              defaultValue={initialData?.selling_price !== undefined ? initialData.selling_price : 0}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs sm:text-sm font-mono text-text-primary focus:outline-none focus:ring-1 focus:ring-text-primary"
            />
            <span className="text-[11px] text-text-muted mt-1 block">Base sales catalog rate.</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1.5">
              Catalog Status
            </label>
            <select
              name="status"
              defaultValue={initialData?.status || 'active'}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs sm:text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-text-primary"
            >
              <option value="active">Active (Available for sales & purchase)</option>
              <option value="inactive">Inactive (Temporarily suspended)</option>
              <option value="archived">Archived (Hidden from catalog)</option>
            </select>
          </div>
        </div>
      </div>
    </form>
  );
}
