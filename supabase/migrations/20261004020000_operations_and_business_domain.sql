-- ==============================================================================
-- INNVNTORY — MIGRATION: OPERATIONS, BUSINESS, INVENTORY, PURCHASES & SALES
-- Sahaya Technologies Pvt. Ltd.
-- ==============================================================================

-- 1. Warehouses (Locations)
CREATE TABLE IF NOT EXISTS public.warehouses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT false,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT warehouses_org_code_key UNIQUE (organization_id, code)
);

CREATE INDEX IF NOT EXISTS idx_warehouses_org ON public.warehouses(organization_id);

ALTER TABLE public.warehouses ENABLE ROW LEVEL SECURITY;

CREATE POLICY warehouses_tenant_isolation ON public.warehouses
    FOR ALL
    USING (public.is_org_member(organization_id))
    WITH CHECK (public.is_org_member(organization_id));

-- 2. Stock Balances (Per Product per Warehouse)
CREATE TABLE IF NOT EXISTS public.stock_balances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    warehouse_id UUID NOT NULL REFERENCES public.warehouses(id) ON DELETE CASCADE,
    quantity NUMERIC(12, 2) NOT NULL DEFAULT 0,
    reorder_level NUMERIC(12, 2) NOT NULL DEFAULT 10,
    reserved_quantity NUMERIC(12, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT stock_balances_org_prod_wh_key UNIQUE (organization_id, product_id, warehouse_id)
);

CREATE INDEX IF NOT EXISTS idx_stock_balances_org_prod ON public.stock_balances(organization_id, product_id);
CREATE INDEX IF NOT EXISTS idx_stock_balances_org_wh ON public.stock_balances(organization_id, warehouse_id);

ALTER TABLE public.stock_balances ENABLE ROW LEVEL SECURITY;

CREATE POLICY stock_balances_tenant_isolation ON public.stock_balances
    FOR ALL
    USING (public.is_org_member(organization_id))
    WITH CHECK (public.is_org_member(organization_id));

-- 3. Inventory Transfers
CREATE TABLE IF NOT EXISTS public.inventory_transfers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    transfer_number TEXT NOT NULL,
    source_warehouse_id UUID NOT NULL REFERENCES public.warehouses(id) ON DELETE RESTRICT,
    destination_warehouse_id UUID NOT NULL REFERENCES public.warehouses(id) ON DELETE RESTRICT,
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'in_transit', 'completed', 'cancelled')),
    total_items INTEGER NOT NULL DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT transfers_org_number_key UNIQUE (organization_id, transfer_number)
);

CREATE INDEX IF NOT EXISTS idx_inventory_transfers_org ON public.inventory_transfers(organization_id);

ALTER TABLE public.inventory_transfers ENABLE ROW LEVEL SECURITY;

CREATE POLICY inventory_transfers_tenant_isolation ON public.inventory_transfers
    FOR ALL
    USING (public.is_org_member(organization_id))
    WITH CHECK (public.is_org_member(organization_id));

-- 4. Inventory Adjustments
CREATE TABLE IF NOT EXISTS public.inventory_adjustments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    adjustment_number TEXT NOT NULL,
    warehouse_id UUID NOT NULL REFERENCES public.warehouses(id) ON DELETE RESTRICT,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    adjustment_type TEXT NOT NULL CHECK (adjustment_type IN ('increase', 'decrease')),
    quantity NUMERIC(12, 2) NOT NULL,
    reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'pending')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT adjustments_org_number_key UNIQUE (organization_id, adjustment_number)
);

CREATE INDEX IF NOT EXISTS idx_inventory_adjustments_org ON public.inventory_adjustments(organization_id);

ALTER TABLE public.inventory_adjustments ENABLE ROW LEVEL SECURITY;

CREATE POLICY inventory_adjustments_tenant_isolation ON public.inventory_adjustments
    FOR ALL
    USING (public.is_org_member(organization_id))
    WITH CHECK (public.is_org_member(organization_id));

-- 5. Inventory Movements (Immutable Movement Ledger)
CREATE TABLE IF NOT EXISTS public.inventory_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    warehouse_id UUID NOT NULL REFERENCES public.warehouses(id) ON DELETE RESTRICT,
    movement_type TEXT NOT NULL CHECK (movement_type IN ('purchase_receipt', 'sales_dispatch', 'transfer_in', 'transfer_out', 'adjustment_positive', 'adjustment_negative', 'sales_return', 'purchase_return')),
    quantity NUMERIC(12, 2) NOT NULL,
    unit_cost NUMERIC(15, 2) NOT NULL DEFAULT 0,
    reference_number TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_inventory_movements_org_prod ON public.inventory_movements(organization_id, product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_org_wh ON public.inventory_movements(organization_id, warehouse_id);

ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;

CREATE POLICY inventory_movements_tenant_isolation ON public.inventory_movements
    FOR ALL
    USING (public.is_org_member(organization_id))
    WITH CHECK (public.is_org_member(organization_id));

-- 6. Customers
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    company_name TEXT,
    email TEXT,
    phone TEXT,
    gstin TEXT,
    city TEXT,
    state TEXT,
    credit_limit NUMERIC(15, 2) NOT NULL DEFAULT 0,
    outstanding_balance NUMERIC(15, 2) NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_customers_org ON public.customers(organization_id);

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY customers_tenant_isolation ON public.customers
    FOR ALL
    USING (public.is_org_member(organization_id))
    WITH CHECK (public.is_org_member(organization_id));

-- 7. Suppliers
CREATE TABLE IF NOT EXISTS public.suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    contact_person TEXT,
    email TEXT,
    phone TEXT,
    gstin TEXT,
    city TEXT,
    state TEXT,
    payment_terms TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_suppliers_org ON public.suppliers(organization_id);

ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;

CREATE POLICY suppliers_tenant_isolation ON public.suppliers
    FOR ALL
    USING (public.is_org_member(organization_id))
    WITH CHECK (public.is_org_member(organization_id));

-- 8. Purchase Orders
CREATE TABLE IF NOT EXISTS public.purchase_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    po_number TEXT NOT NULL,
    supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE RESTRICT,
    warehouse_id UUID NOT NULL REFERENCES public.warehouses(id) ON DELETE RESTRICT,
    status TEXT NOT NULL DEFAULT 'received' CHECK (status IN ('draft', 'sent', 'partially_received', 'received', 'cancelled')),
    subtotal NUMERIC(15, 2) NOT NULL DEFAULT 0,
    tax_amount NUMERIC(15, 2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(15, 2) NOT NULL DEFAULT 0,
    order_date DATE NOT NULL DEFAULT CURRENT_DATE,
    expected_delivery DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT po_org_number_key UNIQUE (organization_id, po_number)
);

CREATE INDEX IF NOT EXISTS idx_purchase_orders_org ON public.purchase_orders(organization_id);

ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY purchase_orders_tenant_isolation ON public.purchase_orders
    FOR ALL
    USING (public.is_org_member(organization_id))
    WITH CHECK (public.is_org_member(organization_id));

-- 9. Purchase Order Items
CREATE TABLE IF NOT EXISTS public.purchase_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    purchase_order_id UUID NOT NULL REFERENCES public.purchase_orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    quantity NUMERIC(12, 2) NOT NULL,
    unit_price NUMERIC(15, 2) NOT NULL,
    tax_rate NUMERIC(5, 2) NOT NULL DEFAULT 18.00,
    tax_amount NUMERIC(15, 2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(15, 2) NOT NULL,
    received_quantity NUMERIC(12, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_po_items_org_po ON public.purchase_order_items(organization_id, purchase_order_id);

ALTER TABLE public.purchase_order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY purchase_order_items_tenant_isolation ON public.purchase_order_items
    FOR ALL
    USING (public.is_org_member(organization_id))
    WITH CHECK (public.is_org_member(organization_id));

-- 10. Purchase Receipts
CREATE TABLE IF NOT EXISTS public.purchase_receipts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    receipt_number TEXT NOT NULL,
    purchase_order_id UUID NOT NULL REFERENCES public.purchase_orders(id) ON DELETE RESTRICT,
    supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE RESTRICT,
    warehouse_id UUID NOT NULL REFERENCES public.warehouses(id) ON DELETE RESTRICT,
    status TEXT NOT NULL DEFAULT 'verified' CHECK (status IN ('received', 'verified')),
    receipt_date TIMESTAMPTZ NOT NULL DEFAULT now(),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT receipts_org_number_key UNIQUE (organization_id, receipt_number)
);

CREATE INDEX IF NOT EXISTS idx_purchase_receipts_org ON public.purchase_receipts(organization_id);

ALTER TABLE public.purchase_receipts ENABLE ROW LEVEL SECURITY;

CREATE POLICY purchase_receipts_tenant_isolation ON public.purchase_receipts
    FOR ALL
    USING (public.is_org_member(organization_id))
    WITH CHECK (public.is_org_member(organization_id));

-- 11. Purchase Returns
CREATE TABLE IF NOT EXISTS public.purchase_returns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    return_number TEXT NOT NULL,
    purchase_order_id UUID REFERENCES public.purchase_orders(id) ON DELETE SET NULL,
    supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE RESTRICT,
    warehouse_id UUID NOT NULL REFERENCES public.warehouses(id) ON DELETE RESTRICT,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    quantity NUMERIC(12, 2) NOT NULL,
    reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'pending')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT purch_returns_org_number_key UNIQUE (organization_id, return_number)
);

CREATE INDEX IF NOT EXISTS idx_purchase_returns_org ON public.purchase_returns(organization_id);

ALTER TABLE public.purchase_returns ENABLE ROW LEVEL SECURITY;

CREATE POLICY purchase_returns_tenant_isolation ON public.purchase_returns
    FOR ALL
    USING (public.is_org_member(organization_id))
    WITH CHECK (public.is_org_member(organization_id));

-- 12. Purchase Payments
CREATE TABLE IF NOT EXISTS public.purchase_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    payment_number TEXT NOT NULL,
    purchase_order_id UUID REFERENCES public.purchase_orders(id) ON DELETE SET NULL,
    supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE RESTRICT,
    amount NUMERIC(15, 2) NOT NULL,
    payment_method TEXT NOT NULL DEFAULT 'neft' CHECK (payment_method IN ('bank_transfer', 'upi', 'cheque', 'neft')),
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'pending')),
    payment_date TIMESTAMPTZ NOT NULL DEFAULT now(),
    reference_number TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT purch_payments_org_number_key UNIQUE (organization_id, payment_number)
);

CREATE INDEX IF NOT EXISTS idx_purchase_payments_org ON public.purchase_payments(organization_id);

ALTER TABLE public.purchase_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY purchase_payments_tenant_isolation ON public.purchase_payments
    FOR ALL
    USING (public.is_org_member(organization_id))
    WITH CHECK (public.is_org_member(organization_id));

-- 13. Sales Orders
CREATE TABLE IF NOT EXISTS public.sales_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    order_number TEXT NOT NULL,
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
    warehouse_id UUID NOT NULL REFERENCES public.warehouses(id) ON DELETE RESTRICT,
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('draft', 'confirmed', 'processing', 'completed', 'cancelled')),
    subtotal NUMERIC(15, 2) NOT NULL DEFAULT 0,
    tax_amount NUMERIC(15, 2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(15, 2) NOT NULL DEFAULT 0,
    order_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT so_org_number_key UNIQUE (organization_id, order_number)
);

CREATE INDEX IF NOT EXISTS idx_sales_orders_org ON public.sales_orders(organization_id);

ALTER TABLE public.sales_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY sales_orders_tenant_isolation ON public.sales_orders
    FOR ALL
    USING (public.is_org_member(organization_id))
    WITH CHECK (public.is_org_member(organization_id));

-- 14. Sales Order Items
CREATE TABLE IF NOT EXISTS public.sales_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    sales_order_id UUID NOT NULL REFERENCES public.sales_orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    quantity NUMERIC(12, 2) NOT NULL,
    unit_price NUMERIC(15, 2) NOT NULL,
    tax_rate NUMERIC(5, 2) NOT NULL DEFAULT 18.00,
    tax_amount NUMERIC(15, 2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(15, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_so_items_org_so ON public.sales_order_items(organization_id, sales_order_id);

ALTER TABLE public.sales_order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY sales_order_items_tenant_isolation ON public.sales_order_items
    FOR ALL
    USING (public.is_org_member(organization_id))
    WITH CHECK (public.is_org_member(organization_id));

-- 15. Invoices (GST Invoices)
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    invoice_number TEXT NOT NULL,
    sales_order_id UUID REFERENCES public.sales_orders(id) ON DELETE SET NULL,
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
    status TEXT NOT NULL DEFAULT 'paid' CHECK (status IN ('issued', 'paid', 'partially_paid', 'overdue', 'cancelled')),
    subtotal NUMERIC(15, 2) NOT NULL DEFAULT 0,
    tax_amount NUMERIC(15, 2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(15, 2) NOT NULL DEFAULT 0,
    paid_amount NUMERIC(15, 2) NOT NULL DEFAULT 0,
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL DEFAULT CURRENT_DATE + INTERVAL '30 days',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT invoices_org_number_key UNIQUE (organization_id, invoice_number)
);

CREATE INDEX IF NOT EXISTS idx_invoices_org ON public.invoices(organization_id);

ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY invoices_tenant_isolation ON public.invoices
    FOR ALL
    USING (public.is_org_member(organization_id))
    WITH CHECK (public.is_org_member(organization_id));

-- 16. Sales Payments
CREATE TABLE IF NOT EXISTS public.sales_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    payment_number TEXT NOT NULL,
    invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL,
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
    amount NUMERIC(15, 2) NOT NULL,
    payment_method TEXT NOT NULL DEFAULT 'neft' CHECK (payment_method IN ('bank_transfer', 'upi', 'credit_card', 'cheque', 'neft')),
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'pending')),
    payment_date TIMESTAMPTZ NOT NULL DEFAULT now(),
    reference_number TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT sales_payments_org_number_key UNIQUE (organization_id, payment_number)
);

CREATE INDEX IF NOT EXISTS idx_sales_payments_org ON public.sales_payments(organization_id);

ALTER TABLE public.sales_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY sales_payments_tenant_isolation ON public.sales_payments
    FOR ALL
    USING (public.is_org_member(organization_id))
    WITH CHECK (public.is_org_member(organization_id));

-- 17. Sales Returns
CREATE TABLE IF NOT EXISTS public.sales_returns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    return_number TEXT NOT NULL,
    sales_order_id UUID REFERENCES public.sales_orders(id) ON DELETE SET NULL,
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
    warehouse_id UUID NOT NULL REFERENCES public.warehouses(id) ON DELETE RESTRICT,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    quantity NUMERIC(12, 2) NOT NULL,
    refund_amount NUMERIC(15, 2) NOT NULL DEFAULT 0,
    reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'pending')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT sales_returns_org_number_key UNIQUE (organization_id, return_number)
);

CREATE INDEX IF NOT EXISTS idx_sales_returns_org ON public.sales_returns(organization_id);

ALTER TABLE public.sales_returns ENABLE ROW LEVEL SECURITY;

CREATE POLICY sales_returns_tenant_isolation ON public.sales_returns
    FOR ALL
    USING (public.is_org_member(organization_id))
    WITH CHECK (public.is_org_member(organization_id));
