import { createClient } from '@/lib/supabase/server';
import { Database } from '@/types/database.types';

export type ProductRow = Database['public']['Tables']['products']['Row'] & {
  categories?: {
    id: string;
    name: string;
    hsn_code: string | null;
    gst_rate_percent: number;
  } | null;
};

export type GetProductsParams = {
  organizationId: string;
  search?: string;
  categoryId?: string;
  status?: 'active' | 'inactive' | 'archived' | 'all';
  page?: number;
  pageSize?: number;
  sortBy?: 'name' | 'sku' | 'created_at' | 'selling_price';
  sortOrder?: 'asc' | 'desc';
};

export async function getProducts({
  organizationId,
  search,
  categoryId,
  status = 'active',
  page = 1,
  pageSize = 25,
  sortBy = 'created_at',
  sortOrder = 'desc',
}: GetProductsParams) {
  const supabase = await createClient();
  if (!supabase) {
    return {
      products: [] as ProductRow[],
      totalCount: 0,
      page,
      pageSize,
      totalPages: 0,
    };
  }

  let query = supabase
    .from('products')
    .select(
      `
      *,
      categories (
        id,
        name,
        hsn_code,
        gst_rate_percent
      )
    `,
      { count: 'exact' }
    )
    .eq('organization_id', organizationId);

  // Status filtering
  if (status !== 'all') {
    query = query.eq('status', status);
  } else {
    query = query.neq('status', 'archived');
  }

  // Category filtering
  if (categoryId && categoryId !== 'all') {
    query = query.eq('category_id', categoryId);
  }

  // Search filtering across name, SKU, and barcode
  if (search && search.trim() !== '') {
    const term = search.trim();
    query = query.or(`name.ilike.%${term}%,sku.ilike.%${term}%,barcode.ilike.%${term}%`);
  }

  // Sorting
  query = query.order(sortBy, { ascending: sortOrder === 'asc' });

  // Pagination
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, count, error } = await query;

  if (error) {
    console.error('Error fetching products:', error.message);
    return {
      products: [] as ProductRow[],
      totalCount: 0,
      page,
      pageSize,
      totalPages: 0,
    };
  }

  const totalCount = count || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    products: (data || []) as ProductRow[],
    totalCount,
    page,
    pageSize,
    totalPages,
  };
}

export async function getProductById(id: string, organizationId: string) {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('products')
    .select(
      `
      *,
      categories (
        id,
        name,
        hsn_code,
        gst_rate_percent
      )
    `
    )
    .eq('id', id)
    .eq('organization_id', organizationId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching product by ID:', error.message);
    return null;
  }

  return data as ProductRow | null;
}
