import { createClient } from '@/lib/supabase/server';

export interface SupplierRow {
  id: string;
  name: string;
  contact_person: string | null;
  email: string | null;
  phone: string | null;
  gstin: string | null;
  city: string | null;
  state: string | null;
  payment_terms: string | null;
  status: string;
  created_at: string;
}

export interface GetSuppliersParams {
  organizationId: string;
  search?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

export async function getSuppliers({
  organizationId,
  search = '',
  status = 'all',
  page = 1,
  pageSize = 25,
}: GetSuppliersParams) {
  const supabase = await createClient();
  if (!supabase) {
    return { suppliers: [] as SupplierRow[], totalCount: 0, page, totalPages: 0 };
  }

  let query = supabase
    .from('suppliers')
    .select('*', { count: 'exact' })
    .eq('organization_id', organizationId);

  if (status && status !== 'all') {
    query = query.eq('status', status);
  }

  if (search) {
    query = query.or(`name.ilike.%${search}%,contact_person.ilike.%${search}%,email.ilike.%${search}%,gstin.ilike.%${search}%,city.ilike.%${search}%`);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  query = query.order('name', { ascending: true }).range(from, to);

  const { data, count, error } = await query;
  if (error) {
    console.error('Error fetching suppliers:', error);
    return { suppliers: [] as SupplierRow[], totalCount: 0, page, totalPages: 0 };
  }

  const totalCount = count || 0;
  return {
    suppliers: (data || []) as SupplierRow[],
    totalCount,
    page,
    totalPages: Math.ceil(totalCount / pageSize),
  };
}
