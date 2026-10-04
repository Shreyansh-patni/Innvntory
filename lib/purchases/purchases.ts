import { createClient } from '@/lib/supabase/server';

export async function getPurchaseOrders({
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
    .from('purchase_orders')
    .select(`
      id,
      po_number,
      status,
      subtotal,
      tax_amount,
      total_amount,
      order_date,
      expected_delivery,
      created_at,
      suppliers (id, name, contact_person),
      warehouses (id, name, code)
    `, { count: 'exact' })
    .eq('organization_id', organizationId);

  if (status && status !== 'all') {
    query = query.eq('status', status);
  }

  if (search) {
    query = query.ilike('po_number', `%${search}%`);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  query = query.order('order_date', { ascending: false }).range(from, to);

  const { data, count, error } = await query;
  if (error) {
    console.error('Error fetching purchase orders:', error);
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

export async function getPurchaseReceipts({
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
    .from('purchase_receipts')
    .select(`
      id,
      receipt_number,
      status,
      receipt_date,
      notes,
      created_at,
      suppliers (id, name),
      warehouses (id, name, code),
      purchase_orders (po_number)
    `, { count: 'exact' })
    .eq('organization_id', organizationId)
    .order('receipt_date', { ascending: false })
    .range(from, to);

  if (error) {
    console.error('Error fetching purchase receipts:', error);
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

export async function getPurchasePayments({
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
    .from('purchase_payments')
    .select(`
      id,
      payment_number,
      amount,
      payment_method,
      status,
      payment_date,
      reference_number,
      suppliers (id, name),
      purchase_orders (po_number)
    `, { count: 'exact' })
    .eq('organization_id', organizationId)
    .order('payment_date', { ascending: false })
    .range(from, to);

  if (error) {
    console.error('Error fetching purchase payments:', error);
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

export async function getPurchaseReturns({
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
    .from('purchase_returns')
    .select(`
      id,
      return_number,
      quantity,
      reason,
      status,
      created_at,
      suppliers (id, name),
      products (name, sku),
      warehouses (name, code)
    `, { count: 'exact' })
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    console.error('Error fetching purchase returns:', error);
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
