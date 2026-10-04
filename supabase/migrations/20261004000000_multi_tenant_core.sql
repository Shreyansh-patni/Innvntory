-- ==============================================================================
-- SETUP 09 — SUPABASE DATABASE FOUNDATION & MULTI-TENANT CORE
-- Innvntory (Sahaya Technologies Pvt. Ltd.)
-- ==============================================================================

-- 1. EXTENSIONS & UTILITY FUNCTIONS
-- ------------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Reusable timestamp trigger function
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. CORE MULTI-TENANT ENTITIES
-- ------------------------------------------------------------------------------

-- Organizations (Tenants)
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9-]+$'),
  legal_name TEXT,
  gstin TEXT,
  country TEXT NOT NULL DEFAULT 'IN',
  timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
  currency TEXT NOT NULL DEFAULT 'INR',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Updated_at trigger for organizations
CREATE TRIGGER set_organizations_updated_at
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- Memberships (Auth User <-> Organization Link)
CREATE TABLE public.memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'invited', 'suspended', 'deactivated')),
  invited_email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_org_user_membership UNIQUE (organization_id, user_id)
);

CREATE TRIGGER set_memberships_updated_at
  BEFORE UPDATE ON public.memberships
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- Roles (System Templates + Tenant Custom Roles)
CREATE TABLE public.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_system BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_org_role_key UNIQUE (organization_id, key)
);

CREATE TRIGGER set_roles_updated_at
  BEFORE UPDATE ON public.roles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- Permissions Catalog (Resource + Action)
CREATE TABLE public.permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  resource TEXT NOT NULL,
  action TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Role Permissions Mapping
CREATE TABLE public.role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_role_permission UNIQUE (role_id, permission_id)
);

-- Membership Roles Mapping
CREATE TABLE public.membership_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  membership_id UUID NOT NULL REFERENCES public.memberships(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_membership_role UNIQUE (membership_id, role_id)
);

-- Audit Logs (Foundational Immutable Event Ledger)
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. INDEXES FOR PERFORMANCE & LOOKUP OPTIMIZATION
-- ------------------------------------------------------------------------------
CREATE INDEX idx_organizations_slug ON public.organizations(slug);
CREATE INDEX idx_memberships_org_id ON public.memberships(organization_id);
CREATE INDEX idx_memberships_user_id ON public.memberships(user_id);
CREATE INDEX idx_memberships_status ON public.memberships(status);
CREATE INDEX idx_roles_org_id ON public.roles(organization_id);
CREATE INDEX idx_roles_key ON public.roles(key);
CREATE INDEX idx_permissions_resource ON public.permissions(resource);
CREATE INDEX idx_role_permissions_role_id ON public.role_permissions(role_id);
CREATE INDEX idx_role_permissions_perm_id ON public.role_permissions(permission_id);
CREATE INDEX idx_membership_roles_mem_id ON public.membership_roles(membership_id);
CREATE INDEX idx_membership_roles_role_id ON public.membership_roles(role_id);
CREATE INDEX idx_audit_logs_org_created ON public.audit_logs(organization_id, created_at DESC);
CREATE INDEX idx_audit_logs_entity ON public.audit_logs(organization_id, entity_type, entity_id);

-- 4. SECURITY DEFINER HELPER FUNCTIONS FOR RLS
-- ------------------------------------------------------------------------------

-- Check if current authenticated user is an active member of organization
CREATE OR REPLACE FUNCTION public.is_org_member(lookup_org_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.memberships
    WHERE organization_id = lookup_org_id
      AND user_id = auth.uid()
      AND status = 'active'
  );
$$;

-- Check if current authenticated user has a specific permission in organization
CREATE OR REPLACE FUNCTION public.has_org_permission(lookup_org_id UUID, required_permission TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.memberships m
    JOIN public.membership_roles mr ON mr.membership_id = m.id
    JOIN public.roles r ON r.id = mr.role_id
    JOIN public.role_permissions rp ON rp.role_id = r.id
    JOIN public.permissions p ON p.id = rp.permission_id
    WHERE m.organization_id = lookup_org_id
      AND m.user_id = auth.uid()
      AND m.status = 'active'
      AND (
        p.key = required_permission
        OR r.key = 'owner' -- Owners implicitly have all permissions
      )
  );
$$;

-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------

-- Enable RLS on all tables
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Organizations Policies
CREATE POLICY "Users can view organizations they belong to"
  ON public.organizations
  FOR SELECT
  TO authenticated
  USING (public.is_org_member(id));

CREATE POLICY "Authenticated users can create an organization"
  ON public.organizations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Organization managers can update their organization"
  ON public.organizations
  FOR UPDATE
  TO authenticated
  USING (public.has_org_permission(id, 'organization.update'))
  WITH CHECK (public.has_org_permission(id, 'organization.update'));

-- Memberships Policies
CREATE POLICY "Users can view memberships within their organizations"
  ON public.memberships
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR public.is_org_member(organization_id)
  );

CREATE POLICY "Admins can create memberships in their organization"
  ON public.memberships
  FOR INSERT
  TO authenticated
  WITH CHECK (
    public.has_org_permission(organization_id, 'users.manage')
    OR NOT EXISTS (
      -- Allows creator of new organization to create initial membership
      SELECT 1 FROM public.memberships WHERE organization_id = memberships.organization_id
    )
  );

CREATE POLICY "Admins can update memberships in their organization"
  ON public.memberships
  FOR UPDATE
  TO authenticated
  USING (public.has_org_permission(organization_id, 'users.manage'))
  WITH CHECK (public.has_org_permission(organization_id, 'users.manage'));

CREATE POLICY "Admins can delete memberships in their organization"
  ON public.memberships
  FOR DELETE
  TO authenticated
  USING (public.has_org_permission(organization_id, 'users.manage'));

-- Roles Policies
CREATE POLICY "Users can view system roles and organization roles"
  ON public.roles
  FOR SELECT
  TO authenticated
  USING (
    organization_id IS NULL
    OR public.is_org_member(organization_id)
  );

CREATE POLICY "Admins can manage custom roles for their organization"
  ON public.roles
  FOR ALL
  TO authenticated
  USING (
    organization_id IS NOT NULL
    AND public.has_org_permission(organization_id, 'users.manage')
  )
  WITH CHECK (
    organization_id IS NOT NULL
    AND public.has_org_permission(organization_id, 'users.manage')
  );

-- Permissions Policies
CREATE POLICY "Authenticated users can view permissions catalog"
  ON public.permissions
  FOR SELECT
  TO authenticated
  USING (true);

-- Role Permissions Policies
CREATE POLICY "Users can view role permissions"
  ON public.role_permissions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.roles r
      WHERE r.id = role_permissions.role_id
        AND (r.organization_id IS NULL OR public.is_org_member(r.organization_id))
    )
  );

CREATE POLICY "Admins can manage role permissions for custom organization roles"
  ON public.role_permissions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.roles r
      WHERE r.id = role_permissions.role_id
        AND r.organization_id IS NOT NULL
        AND public.has_org_permission(r.organization_id, 'users.manage')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.roles r
      WHERE r.id = role_permissions.role_id
        AND r.organization_id IS NOT NULL
        AND public.has_org_permission(r.organization_id, 'users.manage')
    )
  );

-- Membership Roles Policies
CREATE POLICY "Users can view membership roles within their organizations"
  ON public.membership_roles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.memberships m
      WHERE m.id = membership_roles.membership_id
        AND (m.user_id = auth.uid() OR public.is_org_member(m.organization_id))
    )
  );

CREATE POLICY "Admins can manage membership roles in their organization"
  ON public.membership_roles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.memberships m
      WHERE m.id = membership_roles.membership_id
        AND public.has_org_permission(m.organization_id, 'users.manage')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.memberships m
      WHERE m.id = membership_roles.membership_id
        AND public.has_org_permission(m.organization_id, 'users.manage')
    )
  );

-- Audit Logs Policies
CREATE POLICY "Users can view audit logs if they have permission"
  ON public.audit_logs
  FOR SELECT
  TO authenticated
  USING (public.has_org_permission(organization_id, 'audit_logs.read'));

CREATE POLICY "Members can insert audit logs into their organization"
  ON public.audit_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_org_member(organization_id));

-- Note: No UPDATE or DELETE policies on audit_logs (Strict immutability)

-- 6. INITIAL SEED: PERMISSIONS CATALOG & SYSTEM ROLES
-- ------------------------------------------------------------------------------

-- Seed initial granular permissions
INSERT INTO public.permissions (key, resource, action, description) VALUES
  ('organization.read', 'organization', 'read', 'View organization profile and settings'),
  ('organization.update', 'organization', 'update', 'Update organization details and configuration'),
  ('users.manage', 'users', 'manage', 'Invite, update, and manage team members and role assignments'),
  ('products.read', 'products', 'read', 'View catalog products, variants, and categories'),
  ('products.create', 'products', 'create', 'Create new products and variants in catalog'),
  ('products.update', 'products', 'update', 'Modify product details, pricing, and classifications'),
  ('products.delete', 'products', 'delete', 'Archive or delete products from catalog'),
  ('stock.read', 'stock', 'read', 'View stock balances and inventory locations'),
  ('stock.adjust', 'stock', 'adjust', 'Perform physical count audits and stock adjustments'),
  ('stock.transfer', 'stock', 'transfer', 'Initiate and receive inter-warehouse transfers'),
  ('orders.read', 'orders', 'read', 'View sales orders, pick lists, and fulfillment status'),
  ('orders.create', 'orders', 'create', 'Create and confirm new sales orders'),
  ('orders.update', 'orders', 'update', 'Modify and process order fulfillments'),
  ('invoices.read', 'invoices', 'read', 'View tax invoices, payments, and credit notes'),
  ('invoices.create', 'invoices', 'create', 'Generate GST invoices and record customer payments'),
  ('purchases.read', 'purchases', 'read', 'View purchase orders and goods receipts'),
  ('purchases.create', 'purchases', 'create', 'Issue purchase orders and receive shipments'),
  ('reports.read', 'reports', 'read', 'View business analytics, valuation, and financial reports'),
  ('billing.manage', 'billing', 'manage', 'Manage SaaS subscription, payment methods, and plan tiers'),
  ('audit_logs.read', 'audit_logs', 'read', 'Inspect security and operational audit trails')
ON CONFLICT (key) DO NOTHING;

-- Seed system roles (organization_id IS NULL)
INSERT INTO public.roles (id, organization_id, key, name, description, is_system) VALUES
  ('00000000-0000-0000-0000-000000000001', NULL, 'owner', 'Organization Owner', 'Full operational and administrative authority across all domains', true),
  ('00000000-0000-0000-0000-000000000002', NULL, 'admin', 'Administrator', 'Team and settings management, full operational access', true),
  ('00000000-0000-0000-0000-000000000003', NULL, 'inventory_manager', 'Inventory Manager', 'Catalog, stock movements, transfers, and warehouse audit authority', true),
  ('00000000-0000-0000-0000-000000000004', NULL, 'sales_operator', 'Sales Operator', 'Sales orders, customer directory, dispatch, and invoicing', true),
  ('00000000-0000-0000-0000-000000000005', NULL, 'purchase_manager', 'Purchase Manager', 'Supplier management, purchase orders, and goods receipts (GRN)', true),
  ('00000000-0000-0000-0000-000000000006', NULL, 'accountant', 'Accountant', 'Financial reports, GST invoice records, and payment tracking', true),
  ('00000000-0000-0000-0000-000000000007', NULL, 'viewer', 'Read-Only Viewer', 'Read-only access across inventory, orders, and reports', true)
ON CONFLICT (organization_id, key) DO NOTHING;

-- Map permissions to standard system roles
-- Admin Role Permissions
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT '00000000-0000-0000-0000-000000000002', p.id
FROM public.permissions p
WHERE p.key IN (
  'organization.read', 'organization.update', 'users.manage',
  'products.read', 'products.create', 'products.update', 'products.delete',
  'stock.read', 'stock.adjust', 'stock.transfer',
  'orders.read', 'orders.create', 'orders.update',
  'invoices.read', 'invoices.create',
  'purchases.read', 'purchases.create',
  'reports.read', 'audit_logs.read'
)
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Inventory Manager Role Permissions
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT '00000000-0000-0000-0000-000000000003', p.id
FROM public.permissions p
WHERE p.key IN (
  'organization.read',
  'products.read', 'products.create', 'products.update',
  'stock.read', 'stock.adjust', 'stock.transfer',
  'purchases.read', 'purchases.create',
  'reports.read'
)
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Sales Operator Role Permissions
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT '00000000-0000-0000-0000-000000000004', p.id
FROM public.permissions p
WHERE p.key IN (
  'organization.read',
  'products.read',
  'stock.read',
  'orders.read', 'orders.create', 'orders.update',
  'invoices.read', 'invoices.create'
)
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Purchase Manager Role Permissions
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT '00000000-0000-0000-0000-000000000005', p.id
FROM public.permissions p
WHERE p.key IN (
  'organization.read',
  'products.read',
  'stock.read',
  'purchases.read', 'purchases.create'
)
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Accountant Role Permissions
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT '00000000-0000-0000-0000-000000000006', p.id
FROM public.permissions p
WHERE p.key IN (
  'organization.read',
  'invoices.read', 'invoices.create',
  'orders.read', 'purchases.read',
  'reports.read'
)
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Viewer Role Permissions
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT '00000000-0000-0000-0000-000000000007', p.id
FROM public.permissions p
WHERE p.key IN (
  'organization.read',
  'products.read',
  'stock.read',
  'orders.read',
  'invoices.read',
  'purchases.read',
  'reports.read'
)
ON CONFLICT (role_id, permission_id) DO NOTHING;
