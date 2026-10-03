-- =============================================================================
-- Innvntory — RLS foundation, runtime role separation, and RBAC seed data.
--
-- ADR 0003 (Option C — hybrid) + ADR 0004 (Q4/Q5/Q6/Q7).
--
-- Run by the MIGRATION role, which owns the tables (ADR 0004 Q7).
-- The RUNTIME role created here does NOT own these tables and therefore does
-- not bypass the policies below (a table owner bypasses RLS unless
-- FORCE ROW LEVEL SECURITY is set — ADR 0003 I5, test P7).
--
-- Transaction-pooling safe by construction (ADR 0004 Q5):
--   the tenant is read from a TRANSACTION-LOCAL setting, never a session
--   setting, so a pooled connection cannot retain tenant state.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Runtime role
-- -----------------------------------------------------------------------------
-- Deliberately NOT the owner. NOLOGIN: the password is supplied by the
-- environment at provisioning time and never stored in the repository.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'innvntory_runtime') THEN
    CREATE ROLE innvntory_runtime NOLOGIN;
  END IF;
END
$$;

-- Tenant tables are tenant-owned; system tables are not. Grant accordingly and
-- implicitly, so a future table cannot silently become readable.

GRANT USAGE ON SCHEMA public TO innvntory_runtime;

GRANT SELECT, INSERT, UPDATE, DELETE ON
  organizations,
  users,
  organization_memberships,
  audit_logs
TO innvntory_runtime;

GRANT SELECT ON
  roles,
  permissions,
  role_permissions
TO innvntory_runtime;

REVOKE ALL ON SCHEMA public FROM PUBLIC;

-- -----------------------------------------------------------------------------
-- 2. Helper: read the transaction-local organization id
-- -----------------------------------------------------------------------------
-- current_setting(..., true) returns NULL rather than raising when the setting is
-- absent. A NULL here means "no tenant context", and every policy below therefore
-- FAILS CLOSED: the predicate is never true, so zero rows are returned.
--
-- This is the mechanism that makes a missing context safe rather than
-- dangerous (ADR 0003 I6, ADR 0004 requirement 5 and Q2).

CREATE SCHEMA IF NOT EXISTS innvntory;

CREATE OR REPLACE FUNCTION innvntory.current_organization_id()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT NULLIF(
    current_setting('app.organization_id', true),
    ''
  )::uuid
$$;

COMMENT ON FUNCTION innvntory.current_organization_id() IS
  'Transaction-local tenant id set by the application via SET LOCAL. NULL means no tenant context, which makes all tenant policies fail closed.';

-- -----------------------------------------------------------------------------
-- 3. Enable + FORCE row level security on every tenant-owned table
-- -----------------------------------------------------------------------------
-- FORCE is required: without it the table owner bypasses the policies and
-- enforcement is silently inert (ADR 0004 Q7, ADR 0003 I5, test P7).

ALTER TABLE organizations            ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations            FORCE  ROW LEVEL SECURITY;
ALTER TABLE users                     ENABLE ROW LEVEL SECURITY;
ALTER TABLE users                     FORCE  ROW LEVEL SECURITY;
ALTER TABLE organization_memberships  ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_memberships  FORCE  ROW LEVEL SECURITY;
ALTER TABLE audit_logs                ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs                FORCE  ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- 4. Policies
-- -----------------------------------------------------------------------------
-- Deny by default. Every policy requires an exact match against the
-- transaction-local organization id.

DROP POLICY IF EXISTS tenant_isolation_organizations ON organizations;
CREATE POLICY tenant_isolation_organizations ON organizations
  USING      (id = innvntory.current_organization_id())
  WITH CHECK (id = innvntory.current_organization_id());

-- `users` has NO organization_id (ADR 0004 Q6). Isolation is expressed through
-- membership: a user is visible only if they belong to the active organization.
DROP POLICY IF EXISTS tenant_isolation_users ON users;
CREATE POLICY tenant_isolation_users ON users
  USING (
    EXISTS (
      SELECT 1
      FROM organization_memberships m
      WHERE m.user_id = users.id
        AND m.organization_id = innvntory.current_organization_id()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM organization_memberships m
      WHERE m.user_id = users.id
        AND m.organization_id = innvntory.current_organization_id()
    )
  );

DROP POLICY IF EXISTS tenant_isolation_organization_memberships ON organization_memberships;
CREATE POLICY tenant_isolation_organization_memberships ON organization_memberships
  USING      (organization_id = innvntory.current_organization_id())
  WITH CHECK (organization_id = innvntory.current_organization_id());

-- audit_logs are append-only (specification 33). No UPDATE or DELETE policy is
-- created, so those operations match no policy and affect zero rows.
DROP POLICY IF EXISTS tenant_isolation_audit_logs ON audit_logs;
CREATE POLICY tenant_isolation_audit_logs ON audit_logs
  USING      (organization_id = innvntory.current_organization_id())
  WITH CHECK (organization_id = innvntory.current_organization_id());

-- -----------------------------------------------------------------------------
-- 5. Audit log immutability
-- -----------------------------------------------------------------------------
-- Belt and braces: even a policy bug cannot rewrite history.

CREATE OR REPLACE FUNCTION innvntory.prevent_audit_mutation()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'audit_logs is append-only; % is not permitted', TG_OP;
END;
$$;

DROP TRIGGER IF EXISTS audit_logs_no_update ON audit_logs;
CREATE TRIGGER audit_logs_no_update
  BEFORE UPDATE OR DELETE ON audit_logs
  FOR EACH ROW EXECUTE FUNCTION innvntory.prevent_audit_mutation();

-- -----------------------------------------------------------------------------
-- 6. Platform RBAC catalogue seed (system-level definitions, ADR 0004 Q6)
-- -----------------------------------------------------------------------------

INSERT INTO permissions (id, key, description) VALUES
  ('products.read',    'products.read',    'View products'),
  ('products.create',  'products.create',  'Create products'),
  ('products.update',  'products.update',  'Update products'),
  ('products.delete',  'products.delete',  'Delete products'),
  ('inventory.read',   'inventory.read',   'View inventory and stock'),
  ('inventory.adjust', 'inventory.adjust', 'Adjust stock levels'),
  ('inventory.transfer','inventory.transfer','Transfer stock between locations'),
  ('sales.read',       'sales.read',       'View sales'),
  ('sales.create',     'sales.create',     'Create sales and invoices'),
  ('sales.cancel',     'sales.cancel',     'Cancel sales'),
  ('purchases.read',      'purchases.read',      'View purchases'),
  ('purchases.create',    'purchases.create',    'Create purchase orders'),
  ('purchases.approve',   'purchases.approve',   'Approve purchase orders')
ON CONFLICT (id) DO NOTHING;

INSERT INTO roles (id, label, description, is_system) VALUES
  ('owner',             'Owner',             'Full access within the organization',            true),
  ('admin',             'Admin',             'Administrative access without deletion rights', true),
  ('manager',           'Manager',           'Operational management access',                 true),
  ('inventory_manager', 'Inventory Manager', 'Stock, warehouses and purchasing visibility',  true),
  ('sales_staff',       'Sales Staff',       'Sales creation and product visibility',         true),
  ('purchase_staff',    'Purchase Staff',    'Purchase order creation',                      true),
  ('accountant',        'Accountant',        'Reporting and transaction visibility',          true),
  ('viewer',            'Viewer',            'Read-only access',                              true)
ON CONFLICT (id) DO NOTHING;

-- Owner receives every permission defined above.
INSERT INTO role_permissions (role_id, permission_id)
SELECT 'owner', id FROM permissions
ON CONFLICT DO NOTHING;

-- Viewer is strictly read-only.
INSERT INTO role_permissions (role_id, permission_id)
SELECT 'viewer', p.id
FROM permissions p
WHERE p.key IN ('products.read', 'inventory.read', 'sales.read', 'purchases.read')
ON CONFLICT DO NOTHING;

-- Inventory Manager.
INSERT INTO role_permissions (role_id, permission_id)
SELECT 'inventory_manager', p.id
FROM permissions p
WHERE p.key IN (
  'products.read', 'products.create', 'products.update',
  'inventory.read', 'inventory.adjust', 'inventory.transfer',
  'purchases.read'
)
ON CONFLICT DO NOTHING;

-- Sales Staff.
INSERT INTO role_permissions (role_id, permission_id)
SELECT 'sales_staff', p.id
FROM permissions p
WHERE p.key IN ('products.read', 'sales.read', 'sales.create')
ON CONFLICT DO NOTHING;

-- Purchase Staff.
INSERT INTO role_permissions (role_id, permission_id)
SELECT 'purchase_staff', p.id
FROM permissions p
WHERE p.key IN ('products.read', 'inventory.read', 'purchases.read', 'purchases.create')
ON CONFLICT DO NOTHING;

-- Accountant.
INSERT INTO role_permissions (role_id, permission_id)
SELECT 'accountant', p.id
FROM permissions p
WHERE p.key IN ('products.read', 'inventory.read', 'sales.read', 'purchases.read')
ON CONFLICT DO NOTHING;

-- Manager.
INSERT INTO role_permissions (role_id, permission_id)
SELECT 'manager', p.id
FROM permissions p
WHERE p.key IN (
  'products.read', 'products.create', 'products.update',
  'inventory.read', 'inventory.adjust', 'inventory.transfer',
  'sales.read', 'sales.create',
  'purchases.read', 'purchases.create', 'purchases.approve'
)
ON CONFLICT DO NOTHING;

-- Admin: everything except products.delete.
INSERT INTO role_permissions (role_id, permission_id)
SELECT 'admin', p.id
FROM permissions p
WHERE p.key <> 'products.delete'
ON CONFLICT DO NOTHING;