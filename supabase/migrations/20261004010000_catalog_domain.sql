-- ==============================================================================
-- SETUP 11 — PRODUCTS & CATALOG DOMAIN
-- Innvntory (Sahaya Technologies Pvt. Ltd.)
-- ==============================================================================

-- 1. CATEGORIES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  hsn_code TEXT,
  gst_rate_percent NUMERIC(5, 2) NOT NULL DEFAULT 18.00 CHECK (gst_rate_percent >= 0 AND gst_rate_percent <= 100),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_org_category_name UNIQUE (organization_id, name)
);

CREATE TRIGGER set_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- 2. UNITS OF MEASUREMENT TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE public.units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_org_unit_code UNIQUE (organization_id, code)
);

-- 3. PRODUCTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  sku TEXT NOT NULL,
  barcode TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE RESTRICT,
  unit_id UUID REFERENCES public.units(id) ON DELETE SET NULL,
  unit_code TEXT NOT NULL DEFAULT 'PCS',
  cost_price NUMERIC(15, 2) NOT NULL DEFAULT 0.00 CHECK (cost_price >= 0),
  selling_price NUMERIC(15, 2) NOT NULL DEFAULT 0.00 CHECK (selling_price >= 0),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_org_product_sku UNIQUE (organization_id, sku),
  CONSTRAINT unique_org_product_barcode UNIQUE (organization_id, barcode)
);

CREATE TRIGGER set_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- 4. INDEXES FOR HIGH-PERFORMANCE CATALOG QUERIES
-- ------------------------------------------------------------------------------
CREATE INDEX idx_categories_org_id ON public.categories(organization_id);
CREATE INDEX idx_categories_status ON public.categories(organization_id, status);
CREATE INDEX idx_units_org_id ON public.units(organization_id);
CREATE INDEX idx_products_org_id ON public.products(organization_id);
CREATE INDEX idx_products_org_sku ON public.products(organization_id, sku);
CREATE INDEX idx_products_org_barcode ON public.products(organization_id, barcode);
CREATE INDEX idx_products_category_id ON public.products(category_id);
CREATE INDEX idx_products_status ON public.products(organization_id, status);
CREATE INDEX idx_products_created_at ON public.products(organization_id, created_at DESC);

-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Categories Policies
CREATE POLICY "Users can view categories in their organization"
  ON public.categories
  FOR SELECT
  TO authenticated
  USING (public.is_org_member(organization_id));

CREATE POLICY "Users with products permission can insert categories"
  ON public.categories
  FOR INSERT
  TO authenticated
  WITH CHECK (
    public.has_org_permission(organization_id, 'products.create')
    OR public.has_org_permission(organization_id, 'products.update')
  );

CREATE POLICY "Users with products permission can update categories"
  ON public.categories
  FOR UPDATE
  TO authenticated
  USING (public.has_org_permission(organization_id, 'products.update'))
  WITH CHECK (public.has_org_permission(organization_id, 'products.update'));

CREATE POLICY "Users with products permission can delete categories"
  ON public.categories
  FOR DELETE
  TO authenticated
  USING (public.has_org_permission(organization_id, 'products.delete'));

-- Units Policies
CREATE POLICY "Users can view system units and organization units"
  ON public.units
  FOR SELECT
  TO authenticated
  USING (
    organization_id IS NULL
    OR public.is_org_member(organization_id)
  );

CREATE POLICY "Users can manage custom units for their organization"
  ON public.units
  FOR ALL
  TO authenticated
  USING (
    organization_id IS NOT NULL
    AND public.has_org_permission(organization_id, 'products.update')
  )
  WITH CHECK (
    organization_id IS NOT NULL
    AND public.has_org_permission(organization_id, 'products.update')
  );

-- Products Policies
CREATE POLICY "Users can view products in their organization"
  ON public.products
  FOR SELECT
  TO authenticated
  USING (public.is_org_member(organization_id));

CREATE POLICY "Users with products.create can insert products"
  ON public.products
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_org_permission(organization_id, 'products.create'));

CREATE POLICY "Users with products.update can update products"
  ON public.products
  FOR UPDATE
  TO authenticated
  USING (public.has_org_permission(organization_id, 'products.update'))
  WITH CHECK (public.has_org_permission(organization_id, 'products.update'));

CREATE POLICY "Users with products.delete can delete/archive products"
  ON public.products
  FOR DELETE
  TO authenticated
  USING (public.has_org_permission(organization_id, 'products.delete'));

-- 6. INITIAL SEED: GLOBAL STANDARD UNITS
-- ------------------------------------------------------------------------------
INSERT INTO public.units (id, organization_id, name, code) VALUES
  ('00000000-0000-0000-0000-000000000101', NULL, 'Pieces', 'PCS'),
  ('00000000-0000-0000-0000-000000000102', NULL, 'Boxes', 'BOX'),
  ('00000000-0000-0000-0000-000000000103', NULL, 'Kilograms', 'KG'),
  ('00000000-0000-0000-0000-000000000104', NULL, 'Grams', 'G'),
  ('00000000-0000-0000-0000-000000000105', NULL, 'Litres', 'LTR'),
  ('00000000-0000-0000-0000-000000000106', NULL, 'Meters', 'MTR'),
  ('00000000-0000-0000-0000-000000000107', NULL, 'Packs', 'PAC'),
  ('00000000-0000-0000-0000-000000000108', NULL, 'Sets', 'SET'),
  ('00000000-0000-0000-0000-000000000109', NULL, 'Units', 'UNT')
ON CONFLICT (organization_id, code) DO NOTHING;
