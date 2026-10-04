import { createClient } from '@/lib/supabase/server';

export interface CustomerRow {
  id: string;
  name: string;
  company_name: string | null;
  email: string | null;
  phone: string | null;
  gstin: string | null;
  city: string | null;
  state: string | null;
  credit_limit: number;
  outstanding_balance: number;
  status: string;
  created_at: string;
}

export interface GetCustomersParams {
  organizationId: string;
  search?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

export async function getCustomers({
  organizationId,
  search = '',
  status = 'all',
  page = 1,
  pageSize = 25,
}: GetCustomersParams) {
  const supabase = await createClient();
  if (!supabase) {
    return { customers: [] as CustomerRow[], totalCount: 0, page, totalPages: 0 };
  }

  let query = supabase
    .from('customers')
    .select('*', { count: 'exact' })
    .eq('organization_id', organizationId);

  if (status && status !== 'all') {
    query = query.eq('status', status);
  }

  if (search) {
    query = query.or(`name.ilike.%${search}%,company_name.ilike.%${search}%,email.ilike.%${search}%,gstin.ilike.%${search}%,city.ilike.%${search}%`);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  query = query.order('name', { ascending: true }).range(from, to);

  const { data, count, error } = await query;
  if (error) {
    console.error('Error fetching customers:', error);
    return { customers: [] as CustomerRow[], totalCount: 0, page, totalPages: 0 };
  }

  const totalCount = count || 0;
  return {
    customers: (data || []) as CustomerRow[],
    totalCount,
    page,
    totalPages: Math.ceil(totalCount / pageSize),
  };
}
