# INNVNTORY DATABASE SCHEMA & TENANCY OVERVIEW

**Status:** ESTABLISHED & MIGRATION-FIRST (SETUP 09)
**Platform:** PostgreSQL via Supabase
**Primary Target:** Multi-tenant SaaS with Strict Row Level Security (RLS)

---

## 1. Relational Entity Architecture

```
                       auth.users (Supabase Auth)
                            |
                            | (user_id)
                            v
                      public.memberships <----------------------+
                            |                                  |
            +---------------+---------------+                  | (membership_id)
            | (organization_id)             |                  |
            v                               v                  v
public.organizations               public.audit_logs   public.membership_roles
  (Tenant Root)                   (Immutable Ledger)           |
        |                                                      | (role_id)
        +----------------------------+                         v
        | (organization_id)          |                   public.roles
        v                            v                         |
public.roles (Custom)       public.audit_logs                  | (role_id)
                                                               v
                                                    public.role_permissions
                                                               |
                                                               | (permission_id)
                                                               v
                                                    public.permissions
                                                    (Granular Catalog)
```

---

## 2. Implemented Core Tables

| Table | Primary Key | Tenant Scoped (`organization_id`) | RLS Enabled | Description |
| :--- | :--- | :--- | :--- | :--- |
| `public.organizations` | UUID (`id`) | Self (Root Tenant) | **Yes** | Workspace tenant container (legal name, GSTIN, currency, timezone). |
| `public.memberships` | UUID (`id`) | **Yes** | **Yes** | Connects `auth.users` to organizations with status (`active`, `invited`, `suspended`, `deactivated`). |
| `public.roles` | UUID (`id`) | **Yes** (or `NULL` for System Templates) | **Yes** | System roles (`owner`, `admin`, `inventory_manager`, etc.) + tenant custom roles. |
| `public.permissions` | UUID (`id`) | No (Global Catalog) | **Yes** | Granular permissions catalog (`resource.action`). |
| `public.role_permissions`| UUID (`id`) | Inherited via `role_id` | **Yes** | Maps permissions to system & custom roles. |
| `public.membership_roles`| UUID (`id`) | Inherited via `membership_id` | **Yes** | Assigns roles to tenant members. |
| `public.audit_logs` | UUID (`id`) | **Yes** | **Yes** | Cryptographic/timestamped immutable audit ledger. Updates/deletions blocked. |

---

## 3. Multi-Tenant Isolation & RLS Security

### Isolation Principle
Every tenant-owned record in Innvntory belongs directly to an `organization_id`. Database queries performed by an authenticated user are evaluated against the `public.is_org_member(organization_id)` and `public.has_org_permission(organization_id, permission_key)` security functions.

### Security Functions (`SECURITY DEFINER` + `SET search_path = public`):
1. `public.is_org_member(lookup_org_id UUID)`:
   Validates if `auth.uid()` has an active membership record in `lookup_org_id`.
2. `public.has_org_permission(lookup_org_id UUID, required_permission TEXT)`:
   Traverses `memberships` → `membership_roles` → `roles` → `role_permissions` → `permissions` to verify whether the actor has the required permission (or is an Organization Owner).

---

## 4. Planned Future Domain Attachments (Deferred)

All future business tables will inherit tenant isolation by referencing `public.organizations(id)`:

```
public.organizations (Root Tenant)
   |
   +---> [FUTURE] public.products (Catalog Domain)
   +---> [FUTURE] public.categories (Tax & HSN Classification)
   +---> [FUTURE] public.warehouses (Multi-Location Storage)
   +---> [FUTURE] public.stock_balances (Quantity On-Hand & Reserved)
   +---> [FUTURE] public.stock_movements (Double-entry Stock Journal)
   +---> [FUTURE] public.suppliers (Procurement Directory)
   +---> [FUTURE] public.purchase_orders (Procurement POs)
   +---> [FUTURE] public.goods_receipts (Inbound GRNs)
   +---> [FUTURE] public.customers (Customer Ledger)
   +---> [FUTURE] public.sales_orders (Fulfillment Pipeline)
   +---> [FUTURE] public.invoices (GST Tax Invoices)
   +---> [FUTURE] public.payments (Disbursements & Receipts)
```
