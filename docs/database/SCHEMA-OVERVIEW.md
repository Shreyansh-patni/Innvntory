# INNVNTORY DATABASE SCHEMA & TENANCY OVERVIEW

**Status:** EXPANDED WITH CATALOG DOMAIN (SETUP 11)
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
public.categories              public.products                 | (role_id)
  (Tax & Classification)         (Master Catalog)              v
        ^                            |                   public.role_permissions
        | (category_id)              |                         |
        +----------------------------+                         | (permission_id)
                                     |                         v
                                     v                   public.permissions
                               public.units              (Granular Catalog)
                             (Units of Measure)
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
| `public.categories` | UUID (`id`) | **Yes** | **Yes** | Product classification, HSN/SAC codes, and GST rates. |
| `public.units` | UUID (`id`) | **Yes** (or `NULL` for System Standards) | **Yes** | Units of measurement (`PCS`, `BOX`, `KG`, `LTR`, etc.). |
| `public.products` | UUID (`id`) | **Yes** | **Yes** | Master catalog items with unique SKU and barcode per organization. |

---

## 3. Planned Future Domain Attachments (Deferred)

All future operational tables will reference `public.products` and `public.organizations`:

```
public.products (Master Catalog)
   |
   +---> [FUTURE] public.stock_balances (Multi-warehouse stock levels)
   +---> [FUTURE] public.stock_movements (Double-entry movement ledger)
   +---> [FUTURE] public.purchase_order_items (Procurement items)
   +---> [FUTURE] public.goods_receipt_items (GRN put-away items)
   +---> [FUTURE] public.sales_order_items (Sales fulfillment items)
   +---> [FUTURE] public.invoice_items (GST invoice line items)
```
