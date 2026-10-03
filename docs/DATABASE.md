# Innvntory — Database Planning

**Status:** Phase 0 — planning only.

> **No tables, columns, indexes, constraints, or migrations have been created.**
> No database exists, is provisioned, or is connected to anything. No ORM or
> migration tool is installed.

This document records what the product specification fixes about the data layer and
organises the future work. It deliberately contains **no invented fields**.

---

## 1. Fixed by the specification

**Database engine: PostgreSQL** (spec §61).

**Stated priorities** (spec §34) — in the specification's own order:

```text
Data integrity · Referential integrity · Transactions · Indexing
Auditability · Tenant isolation · Migration safety
```

**Tenant rule** (spec §35): every tenant-owned record contains `organization_id`,
and both application-level authorization and database-level safeguards are to be
considered. The specification gives the example shape:

```text
products
├── id
├── organization_id
├── name
├── sku
└── created_at
```

**Reliability requirements that constrain schema design:**

- Inventory updates must be **atomic**; a failed critical operation must not leave
  partial state (spec §55).
- Concurrent sales of the last unit must not produce negative inventory unless
  negative inventory is explicitly allowed (spec §58).
- Audit logs must be **immutable** (spec §33).
- Every important operation records who / what / when / where / before / after /
  reference (spec §66).

---

## 2. Core entity groups

Reproduced from spec §34. **This is the complete list the specification gives.**
No entity has been added, renamed, split, or merged.

### 2.1 Tenancy, identity and access

```text
organizations
users
memberships
roles
permissions
```

### 2.2 Product catalogue

```text
products
product_variants
categories
brands
units
```

Product fields specified in spec §10: Product ID, SKU, Barcode, Product Name,
Description, Category, Subcategory, Brand, Unit, HSN/SAC, Tax Rate, Purchase
Price, Selling Price, MRP, Minimum Stock, Maximum Stock, Reorder Level, Supplier,
Images, Status, Created At, Updated At.

Product types (spec §10): Simple, Variant, Composite, Service, Digital Product,
Raw Material, Finished Good.

Variant attributes (spec §11): Size, Color, Weight, Material, Model, Storage,
Configuration. Each variant has its own SKU, Barcode, Price, Inventory, Cost.

### 2.3 Inventory

```text
warehouses
warehouse_stock
stock_movements
stock_transfers
```

Stock movement types, fixed and enumerated (spec §14):

```text
OPENING · PURCHASE · SALE · PURCHASE_RETURN · SALES_RETURN
TRANSFER_IN · TRANSFER_OUT · ADJUSTMENT_IN · ADJUSTMENT_OUT
DAMAGE · EXPIRED · PRODUCTION · CONSUMPTION · RESERVATION · RELEASE
```

Every movement must contain (spec §13): Transaction ID, Product ID, Warehouse ID,
Quantity, Movement Type, Reference, User, Timestamp.

**The stock ledger is the heart of the data model.** Specification §13 requires
every stock change to be traceable, and §58 fixes the arithmetic test case:

```text
Purchase 100 · Sell 30 · Return 5 · Transfer 20  →  Expected 55
```

Warehouse fields (spec §15): Address, Contact, Manager, Stock, Capacity, Status.
Transfer lifecycle (spec §16): Draft → Requested → Approved → Dispatched →
Received → Completed.

Reorder fields (spec §24): Minimum Stock, Reorder Point, Reorder Quantity, Maximum
Stock.

### 2.4 Trading parties

```text
customers
suppliers
```

Customer profile (spec §20): Customer ID, Name, Phone, Email, Address, GSTIN,
Credit Limit, Payment Terms, Total Purchases, Outstanding Balance, Last Purchase.

Supplier profile (spec §18): Supplier ID, Name, Business Name, GSTIN, Phone, Email,
Address, Payment Terms, Credit Limit, Outstanding Balance, Status.

### 2.5 Sales and billing

```text
sales_orders
sales_order_items
invoices
invoice_items
```

Invoice lifecycle (spec §21): Draft → Issued → Partially Paid → Paid, with
alternate states Cancelled, Refunded, Overdue.

Invoice capability (spec §21): GST, discounts, taxes, multiple items, multiple
payment methods, partial payments, credit sales, returns, refunds.

Returns (spec §23): sales return flow and purchase return flow, both involving
inspection/restock or supplier credit.

### 2.6 Purchasing

```text
purchase_orders
purchase_order_items
purchase_receipts
```

Purchasing workflow (spec §17): Supplier → Purchase Order → Goods Received →
Purchase Invoice → Payment.

### 2.7 Money

```text
payments
refunds
```

Payment methods, fixed (spec §22):

```text
Cash · UPI · Card · Bank Transfer · Cheque · Wallet · Other
```

Payment records (spec §22): Payment ID, Invoice ID, Customer/Supplier, Amount,
Method, Reference, Date, Status.

### 2.8 Platform

```text
notifications
audit_logs
```

### 2.9 Subscriptions

```text
subscriptions
plans
usage_records
```

Subscription architecture (spec §49) additionally names `subscription_items`,
`entitlements`, and `billing_events`.

Subscription lifecycle (spec §49): Trial → Active → Past Due → Grace Period →
Cancelled.

Plan names (spec §47): Free, Starter, Growth, Business, Enterprise. **Plan contents
and pricing are TBD** — spec §47 defers pricing until willingness to pay is
validated.

Usage limits to be enforceable (spec §48): maximum users, maximum products,
maximum locations, monthly transactions, storage, API requests. The billing system
must enforce entitlements **centrally**.

### 2.10 AI-related records

The specification lists **no** AI tables. This is deliberate: spec §28 introduces
AI only after the transactional system is reliable, and requires recommendations to
be traceable to business data.

Conceptually, AI activity will need to record at least: the invoking user and
organization, the question/request, tools invoked, whether an action was proposed
or executed, human confirmation, and references to the underlying business records
— because `AGENTS.md` §6 requires every AI-initiated read and write to be
attributable.

```text
TBD — architectural decision required
  · Whether AI records are dedicated tables, entries in audit_logs, or both
  · Conversation/session persistence, and its retention policy
  · Prompt and tool-call logging boundaries (privacy vs debuggability)
  · Evaluation and feedback storage
```

This is recorded as an open area, not a schema.

---

## 3. Design constraints the schema must satisfy

| Constraint | Source | Schema implication |
|---|---|---|
| Tenant isolation | spec §31, §35, §58 | `organization_id` on every tenant-owned table, indexed; isolation mechanism TBD |
| Atomic inventory writes | spec §54, §55 | Multi-row stock changes in one transaction; ledger and quantity never diverge |
| No lost transactions | spec §54 | Referential integrity and explicit transaction boundaries |
| Concurrent sale of last unit | spec §58 | Correct row locking or optimistic concurrency on stock |
| Immutable audit log | spec §33, §66 | Append-only; no update/delete path |
| Referential integrity | spec §34 | Foreign keys on financial and stock relationships |
| Migration safety | spec §34 | Reversible, staged migrations; never destructive on production (spec §62) |
| Traceable stock history | spec §13 | Movement ledger retains reference to originating document |
| Indian tax compliance | spec §10, §74 | HSN/SAC, GSTIN, tax rate as first-class data; validated against official requirements before production |
| Multi-currency readiness | spec §73 | Monetary representation must not assume a single hardcoded currency, though INR is initial |
| Pagination at scale | spec §59 | Every list query paginated; large tables virtualised in the client |
| Scale to 100,000+ orgs | spec §60 | Indexing and partitioning strategy; composite indexes leading on tenant key where appropriate |
| Idempotency | spec §56 | Payments, webhooks, orders, stock movements need dedupe storage — mechanism TBD |
| Soft delete vs audit | spec §33 | Interaction between deletion and immutability is unresolved — TBD |

---

## 4. Open decisions

```text
TBD — architectural decision required
  · Schema-per-tenant vs shared-schema-with-row-level-security vs hybrid
  · ORM / query builder / raw SQL policy
  · Migration tool and review process
  · Money representation (integer minor units vs decimal) and currency column
  · Timezone, fiscal year, and financial period handling for an India-first market
  · Numeric precision for quantities — fractional stock (spec §10 lists "Unit" as
    a product attribute) implies it may be required; not yet decided
  · Deletion strategy per entity
  · Indexing, partitioning, and read-replica strategy
  · Idempotency-key storage design
  · Audit log retention and archival
  · Data residency (unaddressed in the specification)
```

---

## 5. Deliberately not done

- No `CREATE TABLE`, no schema file, no migration directory.
- No field invented beyond what spec §10–§34, §49 state.
- No seed data or demo data. (Spec §69 describes optional demo data as a product
  feature for a later phase.)
- No ORM chosen or installed.
- No database provisioned, local or remote.
- No connection string. `.env.example` carries the variable name only.

---

## 6. Sequenced next step

When the backend architecture decision (see `docs/ARCHITECTURE.md` §3 and §15) is
made, the smallest useful next slice is a **reviewed entity-relationship proposal
for the tenancy and product-catalogue groups only** — `organizations`, `users`,
`memberships`, `roles`, `permissions`, `products`, `product_variants`,
`categories`, `brands`, `units` — with the isolation mechanism decided first,
because it constrains every table that follows.

Inventory and ledger tables come after that, and require the concurrency strategy
from spec §58 to be settled first.

No work may start on this without an explicit instruction.
