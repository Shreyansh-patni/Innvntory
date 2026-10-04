import { createClient } from '@/lib/supabase/server';

export async function getSalesOrders({
  organizationId,
  search = '',
  status = 'all',
  page = 1,
  pageSize = 25,
}: {
  organizationId: string;
  search?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  const supabase = await createClient();
  if (!supabase) return { items: [], totalCount: 0, page, totalPages: 0 };

  let query = supabase
    .from('sales_orders')
    .select(`
      id,
      order_number,
      status,
      subtotal,
      tax_amount,
      total_amount,
      order_date,
      created_at,
      customers (id, name, company_name),
      warehouses (id, name, code)
    `, { count: 'exact' })
    .eq('organization_id', organizationId);

  if (status && status !== 'all') {
    query = query.eq('status', status);
  }

  if (search) {
    query = query.ilike('order_number', `%${search}%`);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  query = query.order('order_date', { ascending: false }).range(from, to);

  const { data, count, error } = await query;
  if (error) {
    console.error('Error fetching sales orders:', error);
    return { items: [], totalCount: 0, page, totalPages: 0 };
  }

  const totalCount = count || 0;
  return {
    items: data || [],
    totalCount,
    page,
    totalPages: Math.ceil(totalCount / pageSize),
  };
}

export async function getInvoices({
  organizationId,
  search = '',
  status = 'all',
  page = 1,
  pageSize = 25,
}: {
  organizationId: string;
  search?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  const supabase = await createClient();
  if (!supabase) return { items: [], totalCount: 0, page, totalPages: 0 };

  let query = supabase
    .from('invoices')
    .select(`
      id,
      invoice_number,
      status,
      subtotal,
      tax_amount,
      total_amount,
      paid_amount,
      issue_date,
      due_date,
      created_at,
      customers (id, name, company_name)
    `, { count: 'exact' })
    .eq('organization_id', organizationId);

  if (status && status !== 'all') {
    query = query.eq('status', status);
  }

  if (search) {
    query = query.ilike('invoice_number', `%${search}%`);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  query = query.order('issue_date', { ascending: false }).range(from, to);

  const { data, count, error } = await query;
  if (error) {
    console.error('Error fetching invoices:', error);
    return { items: [], totalCount: 0, page, totalPages: 0 };
  }

  const totalCount = count || 0;
  return {
    items: data || [],
    totalCount,
    page,
    totalPages: Math.ceil(totalCount / pageSize),
  };
}

export async function getSalesPayments({
  organizationId,
  page = 1,
  pageSize = 25,
}: {
  organizationId: string;
  page?: number;
  pageSize?: number;
}) {
  const supabase = await createClient();
  if (!supabase) return { items: [], totalCount: 0, page, totalPages: 0 };

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, count, error } = await supabase
    .from('sales_payments')
    .select(`
      id,
      payment_number,
      amount,
      payment_method,
      status,
      payment_date,
      reference_number,
      customers (id, name, company_name),
      invoices (invoice_number)
    `, { count: 'exact' })
    .eq('organization_id', organizationId)
    .order('payment_date', { ascending: false })
    .range(from, to);

  if (error) {
    console.error('Error fetching sales payments:', error);
    return { items: [], totalCount: 0, page, totalPages: 0 };
  }

  const totalCount = count || 0;
  return {
    items: data || [],
    totalCount,
    page,
    totalPages: Math.ceil(totalCount / pageSize),
  };
}

export async function getSalesReturns({
  organizationId,
  page = 1,
  pageSize = 25,
}: {
  organizationId: string;
  page?: number;
  pageSize?: number;
}) {
  const supabase = await createClient();
  if (!supabase) return { items: [], totalCount: 0, page, totalPages: 0 };

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, count, error } = await supabase
    .from('sales_returns')
    .select(`
      id,
      return_number,
      quantity,
      refund_amount,
      reason,
      status,
      created_at,
      customers (id, name, company_name),
      products (name, sku),
      warehouses (name, code)
    `, { count: 'exact' })
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    console.error('Error fetching sales returns:', error);
    return { items: [], totalCount: 0, page, totalPages: 0 };
  }

  const totalCount = count || 0;
  return {
    items: data || [],
    totalCount,
    page,
    totalPages: Math.ceil(totalCount / pageSize),
  };
}
