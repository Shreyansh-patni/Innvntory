# DATABASE & MULTI-TENANT ARCHITECTURE

**Status:** EXPANDED WITH CATALOG DOMAIN (SETUP 11)
**Selected Backend Platform:** Supabase (PostgreSQL 15+)
**Migration Directory:** `supabase/migrations/`

---

## 1. Core Principles & Philosophy
- **Tenant Isolation by Design:** Every tenant-owned record contains `organization_id UUID NOT NULL REFERENCES public.organizations(id)`.
- **Row Level Security (RLS):** All public tables have RLS enabled with explicit policies. Organization A can never query Organization B's data under any condition.
- **Identity via Supabase Auth:** `auth.users` is the authoritative identity provider. The application maintains `public.memberships` to map users into organizations.
- **Referential Integrity:** Enforced via foreign key constraints (`ON DELETE CASCADE` or `ON DELETE RESTRICT`), unique compound constraints, and check expressions.
- **Monetary Precision:** All prices and monetary amounts use `numeric(15, 2)` (never floating point).
- **Timestamps & Auditability:** All temporal timestamps use UTC `timestamptz`. Mutations update `updated_at` via the `public.set_updated_at()` trigger function.
- **Immutable Audit Trail:** `public.audit_logs` records operational and administrative actions; update and delete operations on audit records are blocked at the RLS policy level.

---

## 2. Relational Schema Domains

### Domain 1: Identity, Memberships & Permissions
- `public.organizations`: Tenant workspace entity.
- `public.memberships`: Links `auth.users` to `organizations`.
- `public.roles` & `public.permissions`: RBAC roles and permissions catalog.
- `public.role_permissions` & `public.membership_roles`: Role mapping.
- `public.audit_logs`: Immutable audit ledger.

### Domain 2: Catalog & Master Products (Implemented SETUP 11)
- `public.categories`: Tax & catalog categories (`id`, `organization_id`, `name`, `description`, `hsn_code`, `gst_rate_percent`, `status`). Unique on `(organization_id, name)`.
- `public.units`: Units of measure (`id`, `organization_id`, `name`, `code`). Seeded with standard global units (`PCS`, `BOX`, `KG`, etc.).
- `public.products`: Master catalog items (`id`, `organization_id`, `name`, `description`, `sku`, `barcode`, `category_id`, `unit_code`, `cost_price`, `selling_price`, `status`, `created_by`, `updated_by`). Unique on `(organization_id, sku)` and `(organization_id, barcode)`.

---

## 3. Row Level Security (RLS) Implementation

### Helper Security Functions
```sql
-- Checks if current user is an active member of organization
public.is_org_member(lookup_org_id UUID) -> BOOLEAN

-- Checks if current user has a specific granular permission (or owner role)
public.has_org_permission(lookup_org_id UUID, required_permission TEXT) -> BOOLEAN
```

Both helper functions execute with `SECURITY DEFINER` and `SET search_path = public` to avoid search-path hijacking or recursive RLS evaluation.

---

## 4. Migration Strategy
All database modifications are versioned in `supabase/migrations/` using timestamped SQL files:
- `20261004000000_multi_tenant_core.sql`: Core organizations, memberships, roles, permissions, audit logs, indexes, and RLS policies.
- `20261004010000_catalog_domain.sql`: Categories, units of measure, products, SKU/barcode uniqueness, RLS, and global unit seeds.

---

## 5. Deferred Database Work (Next Phases)
- Multi-Location Inventory Domain (`warehouses`, `stock_balances`, `stock_transfers`, `stock_adjustments`, `stock_movements`)
- Inbound Purchasing Domain (`suppliers`, `purchase_orders`, `goods_receipts`, `purchase_returns`, `purchase_payments`)
- Outbound Sales Domain (`customers`, `sales_orders`, `invoices`, `sales_returns`, `sales_payments`)
