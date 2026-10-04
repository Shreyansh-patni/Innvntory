import { createClient } from '@/lib/supabase/server';

export interface StockBalanceRow {
  id: string;
  quantity: number;
  reorder_level: number;
  reserved_quantity: number;
  products: {
    id: string;
    name: string;
    sku: string;
    barcode: string;
    cost_price: number;
    selling_price: number;
    unit_code: string | null;
    categories: {
      name: string;
    } | null;
  } | null;
  warehouses: {
    id: string;
    name: string;
    code: string;
    city: string;
  } | null;
}

export async function getStockBalances({
  organizationId,
  search = '',
  warehouseId = 'all',
  page = 1,
  pageSize = 25,
}: {
  organizationId: string;
  search?: string;
  warehouseId?: string;
  page?: number;
  pageSize?: number;
}) {
  const supabase = await createClient();
  if (!supabase) return { items: [] as StockBalanceRow[], totalCount: 0, page, totalPages: 0 };

  let query = supabase
    .from('stock_balances')
    .select(`
      id,
      quantity,
      reorder_level,
      reserved_quantity,
      products (
        id,
        name,
        sku,
        barcode,
        cost_price,
        selling_price,
        unit_code,
        categories (
          name
        )
      ),
      warehouses (
        id,
        name,
        code,
        city
      )
    `, { count: 'exact' })
    .eq('organization_id', organizationId);

  if (warehouseId && warehouseId !== 'all') {
    query = query.eq('warehouse_id', warehouseId);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  query = query.order('created_at', { ascending: false }).range(from, to);

  const { data, count, error } = await query;
  if (error) {
    console.error('Error fetching stock balances:', error);
    return { items: [] as StockBalanceRow[], totalCount: 0, page, totalPages: 0 };
  }

  let filtered = (data || []) as unknown as StockBalanceRow[];
  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(
      (item) =>
        item.products?.name.toLowerCase().includes(s) ||
        item.products?.sku.toLowerCase().includes(s) ||
        item.products?.barcode?.toLowerCase().includes(s) ||
        item.warehouses?.name.toLowerCase().includes(s)
    );
  }

  const totalCount = count || filtered.length;
  return {
    items: filtered,
    totalCount,
    page,
    totalPages: Math.ceil(totalCount / pageSize),
  };
}

export async function getWarehouses(organizationId: string) {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('warehouses')
    .select('*')
    .eq('organization_id', organizationId)
    .order('is_default', { ascending: false });

  if (error) {
    console.error('Error fetching warehouses:', error);
    return [];
  }
  return data || [];
}

export async function getInventoryTransfers({
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
    .from('inventory_transfers')
    .select(`
      id,
      transfer_number,
      status,
      total_items,
      notes,
      created_at,
      source_warehouse:warehouses!source_warehouse_id (name, code),
      destination_warehouse:warehouses!destination_warehouse_id (name, code)
    `, { count: 'exact' })
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    console.error('Error fetching transfers:', error);
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

export async function getInventoryAdjustments({
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
    .from('inventory_adjustments')
    .select(`
      id,
      adjustment_number,
      adjustment_type,
      quantity,
      reason,
      status,
      created_at,
      products (name, sku),
      warehouses (name, code)
    `, { count: 'exact' })
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    console.error('Error fetching adjustments:', error);
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

export async function getInventoryMovements({
  organizationId,
  search = '',
  movementType = 'all',
  page = 1,
  pageSize = 25,
}: {
  organizationId: string;
  search?: string;
  movementType?: string;
  page?: number;
  pageSize?: number;
}) {
  const supabase = await createClient();
  if (!supabase) return { items: [], totalCount: 0, page, totalPages: 0 };

  let query = supabase
    .from('inventory_movements')
    .select(`
      id,
      movement_type,
      quantity,
      unit_cost,
      reference_number,
      notes,
      created_at,
      products (name, sku),
      warehouses (name, code)
    `, { count: 'exact' })
    .eq('organization_id', organizationId);

  if (movementType && movementType !== 'all') {
    query = query.eq('movement_type', movementType);
  }

  if (search) {
    query = query.or(`reference_number.ilike.%${search}%,notes.ilike.%${search}%`);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  query = query.order('created_at', { ascending: false }).range(from, to);

  const { data, count, error } = await query;
  if (error) {
    console.error('Error fetching movements:', error);
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
