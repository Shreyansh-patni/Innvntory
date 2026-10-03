# Innvntory — API Guide (Planning)

**Status:** Phase 0 — **principles only. No API exists. No endpoint is implemented.
No server runs.**

> The **authoritative** API requirements are `Innvntory.md.txt` §36 (architecture),
> §37 (requirements), and §38 (error handling). This document organises those
> requirements into working principles. It does not extend, relax, or reinterpret
> them, and it does not invent an endpoint that the specification does not name.

---

## 1. Fixed by the specification

### 1.1 Convention

Specification §36 gives the convention explicitly:

```text
GET    /api/v1/products
POST   /api/v1/products
GET    /api/v1/products/:id
PATCH  /api/v1/products/:id
DELETE /api/v1/products/:id
```

```text
GET  /api/v1/inventory
POST /api/v1/inventory/adjustments
POST /api/v1/inventory/transfers
```

```text
GET  /api/v1/sales
POST /api/v1/sales
GET  /api/v1/sales/:id
```

Established properties: a `/api/v1/` prefix, plural resource nouns, `:id` path
parameters, and HTTP verbs carrying the semantics.

### 1.2 Required capabilities

Specification §37 — every API must support:

```text
Authentication · Authorization · Validation · Pagination · Filtering
Sorting · Search · Rate limiting · Idempotency · Structured errors · Request IDs
```

### 1.3 Error structure

Specification §38 fixes the response shape:

```json
{
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "The requested product was not found.",
    "requestId": "req_123456"
  }
}
```

**Never expose** (spec §38): stack traces, secrets, database details, internal
infrastructure information.

Note that `code` is a **stable machine-readable identifier** in UPPER_SNAKE_CASE,
distinct from `message`, which is human-readable. Clients branch on `code`; users
read `message`. `PRODUCT_NOT_FOUND` is the specification's own example.

### 1.4 API-first

Specification §4.9: core functionality must be accessible through well-designed
APIs. The API is not a secondary interface bolted onto the UI — it is the product
surface, and the UI is one consumer of it.

---

## 2. The single-implementation rule

**The most important principle in this document.**

Business rules are implemented **once**, in the business service layer. Every
consumer calls that layer:

```text
        ┌──────────────┐
        │  Web UI      │──┐
        ├──────────────┤  │
        │  Command     │──┤
        │  interface   │──┤     ┌─────────────────────────┐
        ├──────────────┤  ├──▶  │  Business services      │
        │  AI tools    │──┤     │  (authoritative rules)  │
        └──────────────┘  │     └─────────────────────────┘
        ┌──────────────┐  │                 │
        │  Public API  │──┘                 ▼
        └──────────────┘              PostgreSQL
```

Consequences, each traceable to the specification:

- **The AI layer is not a privileged back door.** `AGENTS.md` §6 and spec §28
  require AI to reach business data only through authorized business services. The
  AI tool interface *is* this layer, called with the invoking user's identity.
- **Authorization cannot live in the UI.** It is enforced in the service layer
  (spec §4.10, §54), so no consumer can bypass it.
- **Validation happens once**, at the boundary, for every consumer.
- **Tenant context is established server-side** (spec §31, §35).

This is also why the backend architecture decision
(`docs/ARCHITECTURE.md` §3) cannot be deferred indefinitely: it determines how this
layer is deployed and scaled.

---

## 3. Typed contracts

- Types are the primary validation and documentation mechanism (spec §4.9, §4.10).
- Type safety is a named production-readiness requirement (spec §83).
- Request and response schemas are explicit. A contract is not inferred from
  implementation.
- Types are generated from or checked against a single source of truth, so the
  contract cannot drift between server and client. Mechanism `TBD`.
- Money, quantity, and tax values are not bare `number` in any contract. See
  `docs/CODE-STYLE.md` §1.
- Enum-like domains use closed unions, matching the values the specification fixes:
  - Stock movement types (spec §14) — 16 values
  - Payment methods (spec §22) — 7 values
  - Roles (spec §32) — 8 roles
  - Permission strings (spec §32) — e.g. `products.read`, `inventory.adjust`
  - Transfer lifecycle (spec §16) — 6 states
  - Invoice lifecycle (spec §21) — 4 primary + 4 alternate states
  - Subscription lifecycle (spec §49) — 5 states

```text
TBD — requires architectural decision: contract definition mechanism and
validation approach (OpenAPI generation, schema-first, or type-derived)
```

---

## 4. Authentication

Required (spec §37, §50): every API request is authenticated, except where the
resource is explicitly public.

- Launch methods are Email + Password and Google only (spec §30).
- Session management with secure cookies; CSRF protection where cookie-based
  authentication is used (spec §50).
- Unauthenticated requests receive a structured error, never a redirect to an HTML
  login page.

```text
TBD — requires architectural decision
  · Auth provider and session transport for the API
  · Token vs cookie session strategy
  · Session lifetime and revocation
```

See `docs/SECURITY.md` §2, §9.

---

## 5. Authorization

Required (spec §37): authorization on every endpoint, enforced server-side.

- Granular permissions as named strings (spec §32).
- Deny by default.
- A user with no permission receives a structured error — never a partial result, a
  silent empty list, or a UI-only block.
- Authorization is evaluated per request against the **authenticated user**, so the
  AI layer inherits exactly the same evaluation and no additional privilege.

Error distinction, recommended and `TBD` for exact codes: an unauthenticated request
and an authenticated-but-forbidden request must be distinguishable, because they
mean different things operationally and to the user.

```text
TBD — requires architectural decision: RBAC storage and enforcement point
```

See `docs/SECURITY.md` §3.

---

## 6. Tenant context

Required (spec §31, §35): every tenant-owned record is scoped by `organization_id`,
and **no organization may access another organization's data** (spec §31, §58).

- Tenant context is derived server-side from the authenticated session or an
  organization claim — **never** accepted from an arbitrary client-supplied
  parameter.
- Every query path is tenant-scoped: list, get, write, aggregate, search, export,
  and background job.
- A request for a record outside the tenant's scope returns a not-found-style
  response, and is **audited as a security event** rather than treated as an
  ordinary 404.

```text
TBD — requires architectural decision
  · Tenant resolution mechanism (subdomain, path prefix, header, session claim)
  · Database isolation mechanism (see docs/DATABASE.md §4)
  · Cross-organization operations and their audit
```

**A cross-tenant leak is a security incident, not a bug.** It must be detectable and
alertable. This is named as a critical test scenario in spec §58.

---

## 7. Validation

Required (spec §37, §50): input validation on every request.

- Validate at the boundary, before any business logic executes.
- All input is untrusted, including values that originated in our own UI.
- Reject unknown fields where the contract is closed, so a client cannot smuggle
  data into a record.
- Domain validation belongs in the business layer, not the transport layer —
  `products.sku` being unique is a business rule; `products.sku` being a string is
  a schema rule.
- File uploads validate type, size, and content (spec §67).

```text
TBD — requires architectural decision: validation library and error mapping
```

---

## 8. Error handling

Required (spec §38). The response shape is fixed — see §1.3.

Principles:

- **Stable machine-readable `code`**, human-readable `message`, and a `requestId`
  that correlates to logs.
- **Never** expose stack traces, secrets, database details, or internal
  infrastructure (spec §38).
- An unexpected error is logged in full server-side and reported to the user as a
  generic message plus the `requestId`.
- **No silent failures** (spec §54). Every operation either succeeds with a result,
  or fails with a structured error.
- Validation errors identify the offending fields so the client can present them per
  field (spec §72 — errors must be perceivable and associated).

**HTTP status semantics are not fixed by the specification.** The mapping from
error class to status code is `TBD — requires architectural decision`, and must be
decided before implementation rather than improvised per endpoint.

---

## 9. Pagination, filtering, sorting, search

Required (spec §37). Performance requirements in spec §59:

- Every list endpoint is paginated. **Never return an unbounded result set.**
- **Never load thousands of records into the browser** (spec §59).
- Large tables are virtualised client-side (spec §59).
- Filtering and sorting are server-side, so limits hold regardless of client
  behaviour.

```text
TBD — requires architectural decision
  · Pagination style (offset vs cursor) and parameter names
  · Maximum page size
  · Sortable-field allowlist per resource
  · Filter parameter grammar
```

A sort or filter field must be an **allowlist**, never interpolated into a query.
Parameterised queries only (`docs/CODE-STYLE.md` §9).

---

## 10. Idempotency

Required (spec §56). Critical operations that must support idempotency:

```text
Payments · Webhooks · Orders · Inventory movements · External integrations
```

Specification §56 is unambiguous: **"Sending the same request twice should not
create two payments."** Spec §58 makes it a named critical test scenario — receiving
the same payment webhook twice must not duplicate the payment.

Requirements:

- The client supplies an idempotency key (spec §56 gives the form
  `payment_abc123`).
- A repeated request with the same key returns the **original result**, not a new
  resource and not a conflict.
- The key's scope is tenant-scoped. One tenant's key must never collide with
  another's.
- Webhook handlers are idempotent by default, since the sender's retry behaviour is
  not under our control.
- An in-flight request with the same key does not execute twice concurrently.

```text
TBD — requires architectural decision: idempotency key storage, scope, and TTL
```

---

## 11. Auditability

Required (spec §33, §66). Every important operation records:

```text
Who · What · When · Where · Before · After · Reference
```

- Audit records are written by the **business service layer**, not by the
  transport layer, so UI-initiated and AI-initiated operations are recorded
  identically.
- Audit logs are **immutable** (spec §33) — append-only, no update or delete path.
- AI-initiated operations are recorded as such, with the invoking user *and* the
  acting system both identified (`AGENTS.md` §6).
- Every response carries a `requestId` (spec §38) that correlates the client
  experience to the audit trail and logs.

```text
TBD — requires architectural decision: audit retention and archival
```

---

## 12. Reliability

Required (spec §54, §55, §56):

- **Atomicity.** A sale creating an invoice, recording a payment, and deducting
  stock must be atomic. "If a critical operation fails, the system should not leave
  partially completed state" (spec §55).
- **No lost transactions.** (spec §54)
- **No inconsistent inventory.** (spec §54)
- **Concurrency.** Two users selling the last available item must not produce
  negative inventory unless negative inventory is explicitly allowed (spec §58).
  Whether negative inventory is permitted is `TBD — requires architectural
  decision`; the default assumption is that it is not.
- **Idempotency** for every critical operation (§10).
- **Rate limiting** on every endpoint (spec §37, §50).

---

## 13. AI tool boundaries

The AI layer is a **constrained consumer** of the business services — never a
parallel path to the data. Full detail: `docs/AI-DECISIONS.md`.

| Boundary | Rule |
|---|---|
| Access path | Typed business tools over the same service layer as the UI. **Never** unrestricted database access. |
| Authorization | Evaluated as the invoking user. The model holds no privilege of its own. |
| Tenant | Same tenant boundary as any other caller. No exceptions. |
| Read | Logged as an attributable read. |
| Write | **Explicit human confirmation** required for payments, stock adjustments, invoices, and deletes. |
| Traceability | Recommendations must be traceable to underlying business data (spec §28). |
| Audit | Recorded identically to a user action, and distinguishable as AI-initiated. |
| Sequencing | Introduced only after the transactional system is reliable (spec §28). |

**Tool surface design principles:**

- Tools are **narrow and typed**. A tool that can do anything is not a tool.
- A tool is a business operation, not a query builder. No arbitrary filtering, no
  free-form search across tenant data, no raw record access.
- Tool inputs and outputs are the same types the UI uses — one implementation.
- Every tool declares the permissions it requires, and the framework enforces them
  before invocation. The model cannot grant itself a permission.
- A tool's failure is a normal, expected outcome that the assistant reports
  honestly — not something to be retried into a different, riskier path.

```text
TBD — architectural decision required (Phase 7)
  · Tool definition and invocation mechanism
  · Context assembly and tenant enforcement
  · Confirmation UX contract
  · Injection resistance and untrusted-content handling
```

No AI tool, endpoint, or model integration exists.

---

## 14. Endpoint inventory

**Only what the specification names.** Nothing is added.

| Resource | Endpoints given | Source |
|---|---|---|
| Products | `GET, POST /api/v1/products` · `GET, PATCH, DELETE /api/v1/products/:id` | spec §36 |
| Inventory | `GET /api/v1/inventory` | spec §36 |
| Inventory adjustments | `POST /api/v1/inventory/adjustments` | spec §36 |
| Inventory transfers | `POST /api/v1/inventory/transfers` | spec §36 |
| Sales | `GET, POST /api/v1/sales` · `GET /api/v1/sales/:id` | spec §36 |

The specification requires these capabilities (§37) but does **not** enumerate
endpoints for purchases, invoices, payments, customers, suppliers, warehouses,
reports, organizations, users, or search.

```text
TBD — requires architectural decision: complete endpoint surface
```

This document does not invent it. Inventing a full API surface before the backend
architecture and tenancy mechanism are decided would produce a contract that has to
be renegotiated — and a contract is expensive to change once clients depend on it.

---

## 15. Not done in this phase

- No API implemented. No server, framework, or route handler installed.
- No OpenAPI, schema, or contract file generated.
- No endpoint created, tested, or documented as live.
- No authentication, authorization, tenant, or rate-limit middleware written.
- No idempotency store designed or created.
- No audit writer implemented.
- No AI tool defined.

Nothing in this document has been executed, benchmarked, or verified.
