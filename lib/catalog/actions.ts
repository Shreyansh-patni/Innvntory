'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getUserContext } from '@/lib/auth/session';
import { categorySchema, productSchema } from '@/lib/catalog/validation';

export type CatalogActionResult = {
  success?: boolean;
  error?: string;
  message?: string;
  id?: string;
};

function normalizeCatalogError(error: Error | { message?: string; code?: string } | null): string {
  if (!error?.message) return 'An unexpected error occurred. Please try again.';
  const msg = error.message.toLowerCase();

  if (msg.includes('unique_org_product_sku') || msg.includes('duplicate key') && msg.includes('sku')) {
    return 'A product with this SKU already exists in your organization.';
  }
  if (msg.includes('unique_org_product_barcode') || msg.includes('duplicate key') && msg.includes('barcode')) {
    return 'A product with this Barcode already exists in your organization.';
  }
  if (msg.includes('unique_org_category_name') || msg.includes('duplicate key') && msg.includes('name')) {
    return 'A category with this name already exists in your organization.';
  }
  if (msg.includes('violates foreign key constraint') || msg.includes('on delete restrict')) {
    return 'Cannot remove this item because it is referenced by existing catalog products.';
  }

  return 'Unable to save catalog changes. Please review your input and try again.';
}

/**
 * Server Action: Create Product
 */
export async function createProductAction(
  _prevState: CatalogActionResult | null,
  formData: FormData
): Promise<CatalogActionResult> {
  const userContext = await getUserContext();
  if (!userContext?.organization?.id) {
    return { error: 'Authentication required. Please sign in to your workspace.' };
  }

  const raw = {
    name: formData.get('name'),
    description: formData.get('description'),
    sku: formData.get('sku'),
    barcode: formData.get('barcode'),
    category_id: formData.get('category_id'),
    unit_code: formData.get('unit_code') || 'PCS',
    cost_price: formData.get('cost_price') || 0,
    selling_price: formData.get('selling_price') || 0,
    status: formData.get('status') || 'active',
  };

  const parsed = productSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || 'Invalid product input data.' };
  }

  const supabase = await createClient();
  if (!supabase) {
    return { error: 'Database service unavailable.' };
  }

  const orgId = userContext.organization.id;

  const { data, error } = await supabase
    .from('products')
    .insert({
      organization_id: orgId,
      name: parsed.data.name,
      description: parsed.data.description || null,
      sku: parsed.data.sku,
      barcode: parsed.data.barcode || null,
      category_id: parsed.data.category_id || null,
      unit_code: parsed.data.unit_code,
      cost_price: parsed.data.cost_price,
      selling_price: parsed.data.selling_price,
      status: parsed.data.status,
      created_by: userContext.user.id,
      updated_by: userContext.user.id,
    })
    .select('id')
    .single();

  if (error || !data) {
    return { error: normalizeCatalogError(error) };
  }

  // Record audit log
  await supabase.from('audit_logs').insert({
    organization_id: orgId,
    actor_id: userContext.user.id,
    action: 'product.created',
    entity_type: 'product',
    entity_id: data.id,
    details: {
      name: parsed.data.name,
      sku: parsed.data.sku,
      selling_price: parsed.data.selling_price,
    },
  });

  revalidatePath('/app/products');
  redirect('/app/products');
}

/**
 * Server Action: Update Product
 */
export async function updateProductAction(
  productId: string,
  _prevState: CatalogActionResult | null,
  formData: FormData
): Promise<CatalogActionResult> {
  const userContext = await getUserContext();
  if (!userContext?.organization?.id) {
    return { error: 'Authentication required. Please sign in.' };
  }

  const raw = {
    name: formData.get('name'),
    description: formData.get('description'),
    sku: formData.get('sku'),
    barcode: formData.get('barcode'),
    category_id: formData.get('category_id'),
    unit_code: formData.get('unit_code') || 'PCS',
    cost_price: formData.get('cost_price') || 0,
    selling_price: formData.get('selling_price') || 0,
    status: formData.get('status') || 'active',
  };

  const parsed = productSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || 'Invalid product input data.' };
  }

  const supabase = await createClient();
  if (!supabase) {
    return { error: 'Database service unavailable.' };
  }

  const orgId = userContext.organization.id;

  const { error } = await supabase
    .from('products')
    .update({
      name: parsed.data.name,
      description: parsed.data.description || null,
      sku: parsed.data.sku,
      barcode: parsed.data.barcode || null,
      category_id: parsed.data.category_id || null,
      unit_code: parsed.data.unit_code,
      cost_price: parsed.data.cost_price,
      selling_price: parsed.data.selling_price,
      status: parsed.data.status,
      updated_by: userContext.user.id,
    })
    .eq('id', productId)
    .eq('organization_id', orgId);

  if (error) {
    return { error: normalizeCatalogError(error) };
  }

  // Record audit log
  await supabase.from('audit_logs').insert({
    organization_id: orgId,
    actor_id: userContext.user.id,
    action: 'product.updated',
    entity_type: 'product',
    entity_id: productId,
    details: {
      name: parsed.data.name,
      sku: parsed.data.sku,
      selling_price: parsed.data.selling_price,
      status: parsed.data.status,
    },
  });

  revalidatePath('/app/products');
  revalidatePath(`/app/products/${productId}`);
  return { success: true, message: 'Product updated successfully.' };
}

/**
 * Server Action: Archive / Soft Delete Product
 */
export async function archiveProductAction(productId: string): Promise<CatalogActionResult> {
  const userContext = await getUserContext();
  if (!userContext?.organization?.id) {
    return { error: 'Authentication required.' };
  }

  const supabase = await createClient();
  if (!supabase) return { error: 'Database unavailable.' };

  const orgId = userContext.organization.id;

  const { error } = await supabase
    .from('products')
    .update({ status: 'archived', updated_by: userContext.user.id })
    .eq('id', productId)
    .eq('organization_id', orgId);

  if (error) {
    return { error: normalizeCatalogError(error) };
  }

  await supabase.from('audit_logs').insert({
    organization_id: orgId,
    actor_id: userContext.user.id,
    action: 'product.archived',
    entity_type: 'product',
    entity_id: productId,
    details: { status: 'archived' },
  });

  revalidatePath('/app/products');
  redirect('/app/products');
}

/**
 * Server Action: Create Category
 */
export async function createCategoryAction(
  _prevState: CatalogActionResult | null,
  formData: FormData
): Promise<CatalogActionResult> {
  const userContext = await getUserContext();
  if (!userContext?.organization?.id) {
    return { error: 'Authentication required.' };
  }

  const raw = {
    name: formData.get('name'),
    description: formData.get('description'),
    hsn_code: formData.get('hsn_code'),
    gst_rate_percent: formData.get('gst_rate_percent') || 18,
    status: formData.get('status') || 'active',
  };

  const parsed = categorySchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || 'Invalid category input data.' };
  }

  const supabase = await createClient();
  if (!supabase) return { error: 'Database unavailable.' };

  const orgId = userContext.organization.id;

  const { data, error } = await supabase
    .from('categories')
    .insert({
      organization_id: orgId,
      name: parsed.data.name,
      description: parsed.data.description || null,
      hsn_code: parsed.data.hsn_code || null,
      gst_rate_percent: parsed.data.gst_rate_percent,
      status: parsed.data.status,
    })
    .select('id')
    .single();

  if (error || !data) {
    return { error: normalizeCatalogError(error) };
  }

  await supabase.from('audit_logs').insert({
    organization_id: orgId,
    actor_id: userContext.user.id,
    action: 'category.created',
    entity_type: 'category',
    entity_id: data.id,
    details: { name: parsed.data.name, hsn_code: parsed.data.hsn_code },
  });

  revalidatePath('/app/categories');
  revalidatePath('/app/products');
  return { success: true, message: 'Category created successfully.' };
}

/**
 * Server Action: Update Category
 */
export async function updateCategoryAction(
  categoryId: string,
  _prevState: CatalogActionResult | null,
  formData: FormData
): Promise<CatalogActionResult> {
  const userContext = await getUserContext();
  if (!userContext?.organization?.id) {
    return { error: 'Authentication required.' };
  }

  const raw = {
    name: formData.get('name'),
    description: formData.get('description'),
    hsn_code: formData.get('hsn_code'),
    gst_rate_percent: formData.get('gst_rate_percent') || 18,
    status: formData.get('status') || 'active',
  };

  const parsed = categorySchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || 'Invalid category input data.' };
  }

  const supabase = await createClient();
  if (!supabase) return { error: 'Database unavailable.' };

  const orgId = userContext.organization.id;

  const { error } = await supabase
    .from('categories')
    .update({
      name: parsed.data.name,
      description: parsed.data.description || null,
      hsn_code: parsed.data.hsn_code || null,
      gst_rate_percent: parsed.data.gst_rate_percent,
      status: parsed.data.status,
    })
    .eq('id', categoryId)
    .eq('organization_id', orgId);

  if (error) {
    return { error: normalizeCatalogError(error) };
  }

  await supabase.from('audit_logs').insert({
    organization_id: orgId,
    actor_id: userContext.user.id,
    action: 'category.updated',
    entity_type: 'category',
    entity_id: categoryId,
    details: { name: parsed.data.name },
  });

  revalidatePath('/app/categories');
  revalidatePath('/app/products');
  return { success: true, message: 'Category updated successfully.' };
}
