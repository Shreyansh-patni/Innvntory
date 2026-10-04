export interface WarehouseItem {
  id: string;
  name: string;
  code: string;
  city: string;
  state: string;
  is_default: boolean;
  status: string;
}

export interface TransferItem {
  id: string;
  transfer_number: string;
  status: string;
  total_items: number;
  notes: string | null;
  created_at: string;
  source_warehouse: { name: string; code: string } | null;
  destination_warehouse: { name: string; code: string } | null;
}

export interface AdjustmentItem {
  id: string;
  adjustment_number: string;
  adjustment_type: string;
  quantity: number;
  reason: string;
  status: string;
  created_at: string;
  products: { name: string; sku: string } | null;
  warehouses: { name: string; code: string } | null;
}

export interface MovementItem {
  id: string;
  movement_type: string;
  quantity: number;
  unit_cost: number;
  reference_number: string;
  notes: string | null;
  created_at: string;
  products: { name: string; sku: string } | null;
  warehouses: { name: string; code: string } | null;
}

export interface SalesOrderItem {
  id: string;
  order_number: string;
  status: string;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  order_date: string;
  customers: { id: string; name: string; company_name: string | null } | null;
  warehouses: { id: string; name: string; code: string } | null;
}

export interface InvoiceItem {
  id: string;
  invoice_number: string;
  status: string;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  paid_amount: number;
  issue_date: string;
  due_date: string;
  customers: { id: string; name: string; company_name: string | null } | null;
}

export interface SalesPaymentItem {
  id: string;
  payment_number: string;
  amount: number;
  payment_method: string;
  status: string;
  payment_date: string;
  reference_number: string | null;
  customers: { id: string; name: string; company_name: string | null } | null;
  invoices: { invoice_number: string } | null;
}

export interface SalesReturnItem {
  id: string;
  return_number: string;
  quantity: number;
  refund_amount: number;
  reason: string;
  status: string;
  created_at: string;
  customers: { id: string; name: string; company_name: string | null } | null;
  products: { name: string; sku: string } | null;
  warehouses: { name: string; code: string } | null;
}

export interface PurchaseOrderItem {
  id: string;
  po_number: string;
  status: string;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  order_date: string;
  expected_delivery: string | null;
  suppliers: { id: string; name: string; contact_person: string | null } | null;
  warehouses: { id: string; name: string; code: string } | null;
}

export interface PurchaseReceiptItem {
  id: string;
  receipt_number: string;
  status: string;
  receipt_date: string;
  notes: string | null;
  suppliers: { id: string; name: string } | null;
  warehouses: { id: string; name: string; code: string } | null;
  purchase_orders: { po_number: string } | null;
}

export interface PurchasePaymentItem {
  id: string;
  payment_number: string;
  amount: number;
  payment_method: string;
  status: string;
  payment_date: string;
  reference_number: string | null;
  suppliers: { id: string; name: string } | null;
  purchase_orders: { po_number: string } | null;
}

export interface PurchaseReturnItem {
  id: string;
  return_number: string;
  quantity: number;
  reason: string;
  status: string;
  suppliers: { id: string; name: string } | null;
  products: { name: string; sku: string } | null;
  warehouses: { name: string; code: string } | null;
}
