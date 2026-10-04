# DATABASE & MULTI-TENANT ARCHITECTURE

**Status:** FOUNDATION ESTABLISHED (SETUP 09)
**Selected Backend Platform:** Supabase (PostgreSQL 15+)
**Migration Directory:** `supabase/migrations/`

---

## 1. Core Principles & Philosophy
- **Tenant Isolation by Design:** Every tenant-owned record contains `organization_id UUID NOT NULL REFERENCES public.organizations(id)`.
- **Row Level Security (RLS):** All public tables have RLS enabled with explicit policies. Organization A can never query Organization B's data under any condition.
- **Identity via Supabase Auth:** `auth.users` is the authoritative identity provider. The application maintains `public.memberships` to map users into organizations.
- **Referential Integrity:** Enforced via foreign key constraints (`ON DELETE CASCADE` or `ON DELETE SET NULL`), unique compound constraints, and check expressions.
- **Timestamps & Auditability:** All temporal timestamps use UTC `timestamptz`. Mutations update `updated_at` via the `public.set_updated_at()` trigger function.
- **Immutable Audit Trail:** `public.audit_logs` records operational and administrative actions; update and delete operations on audit records are blocked at the RLS policy level.

---

## 2. Core Relational Schema

### 1. `public.organizations`
Workspace entity representing the business account and billing tenant.
- `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
- `name TEXT NOT NULL`
- `slug TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9-]+$')`
- `legal_name TEXT`, `gstin TEXT`, `country TEXT DEFAULT 'IN'`, `timezone TEXT`, `currency TEXT DEFAULT 'INR'`
- `created_at TIMESTAMPTZ`, `updated_at TIMESTAMPTZ`

### 2. `public.memberships`
Binds an authenticated user (`auth.users`) to an organization.
- `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
- `organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE`
- `user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE`
- `status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'invited', 'suspended', 'deactivated'))`
- `invited_email TEXT`
- `CONSTRAINT unique_org_user_membership UNIQUE (organization_id, user_id)`

### 3. `public.roles` & `public.permissions`
Fine-grained Role-Based Access Control (RBAC).
- `public.roles`: System global templates (`organization_id IS NULL`, e.g. `owner`, `admin`, `inventory_manager`, `sales_operator`, `purchase_manager`, `accountant`, `viewer`) and organization-custom roles (`organization_id = tenant_id`).
- `public.permissions`: Normalized `resource.action` catalog (e.g. `products.create`, `stock.adjust`, `orders.update`, `invoices.create`, `audit_logs.read`).
- `public.role_permissions`: Mapping of permissions to roles.
- `public.membership_roles`: Mapping of roles to organization memberships.

### 4. `public.audit_logs`
- `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
- `organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE`
- `actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL`
- `action TEXT NOT NULL`, `entity_type TEXT NOT NULL`, `entity_id UUID`, `details JSONB NOT NULL DEFAULT '{}'::jsonb`
- `ip_address TEXT`, `user_agent TEXT`, `created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`

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

---

## 5. Deferred Database Work (Next Phases)
- Product Catalog Domain (`products`, `variants`, `categories`, `units_of_measure`)
- Multi-Location Inventory Domain (`warehouses`, `stock_balances`, `stock_transfers`, `stock_adjustments`, `stock_movements`)
- Inbound Purchasing Domain (`suppliers`, `purchase_orders`, `goods_receipts`, `purchase_returns`, `purchase_payments`)
- Outbound Sales Domain (`customers`, `sales_orders`, `invoices`, `sales_returns`, `sales_payments`)
- Realtime subscription replication and background webhooks
