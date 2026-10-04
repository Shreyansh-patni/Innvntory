# Innvntory — Component Inventory (Planning)
## shadcn/ui Level 1 primitives (installed)

shadcn/ui is the default UI foundation (`AGENTS.md` §4, `docs/UI-LIBRARIES.md`).
Installed and adapted to Innvntory tokens rather than used at default styling.

| Primitive | File | Notes |
|---|---|---|
| Button | `components/ui/button.tsx` | Black primary CTA per DESIGN-SYSTEM.md. Defaults to `type="button"` so it cannot submit a form by accident |
| Input + Field | `components/ui/input.tsx` | `Field` supplies a real `<label>`, hint, and `role="alert"` error. Placeholders are never labels |
| Badge | `components/ui/badge.tsx` | Status never conveyed by colour alone |
| Table | `components/ui/badge.tsx` | Used by `app/primitives.tsx` via `TableShell`/`Th`/`Td` |
| Dialog | `components/ui/dialog.tsx` | Radix — supplies focus trap, Escape handling, `aria-modal` |
| DropdownMenu | `components/ui/dropdown-menu.tsx` | Radix — supplies menu roles and keyboard navigation |

New application composites in this pass:

| Component | Purpose |
|---|---|
| `app/auth-form.tsx` | Shared `/login` + `/signup` form. Inert submit; never fakes success |
| `app/organization-switcher.tsx` | Active-organization control, disabled until a session exists |

Innvntory composites (`components/app/primitives.tsx`) build on these: KPI cards,
empty states, the AI stage track, status pills.

**No Level 2 library installed** (Watermelon UI, Aceternity, Magic UI, Motion
Primitives, HeroUI). None was needed for the current shell.



**Status:** Phase 0 — **planning only. No component exists. No UI library is
installed.**

> This is an **inventory of what Innvntory will need**, derived from
> `Innvntory.md.txt`, organised for planning. It is not an implementation plan, not
> a component spec, and not a library list.
>
> No component below has been built, styled, tested, or reviewed. Nothing here may
> be treated as designed — see `docs/DESIGN-SYSTEM.md`, where even the design
> *tokens* are still `TBD — requires brand decision`.

---

## 1. Foundation

**Status:** not installed.

- **shadcn/ui** — the designated default UI foundation (`AGENTS.md` §4,
  `docs/UI-LIBRARIES.md` §2). Components are copied into project source and themed
  to the Innvntory design system.
- **Tailwind CSS** — named in spec §61; not decided, not installed.
- **Icon set** — spec §41 requires icons to be defined. No set selected. `TBD`.
- **Type family** — `TBD — requires brand decision`.

Rule for every component listed below: build from the foundation, adapt it to the
design system, and define the full state set (§6). Do not import a component raw.

---

## 2. Layout

| Component | Purpose | Source |
|---|---|---|
| App shell | Authenticated frame: navigation, header, content region | spec §42 |
| Public layout | Marketing frame: header, content, footer | `Design Refrence/` |
| Page header | Title, primary action, contextual actions | spec §39 |
| Container / grid | 12-column layout basis | `docs/DESIGN-SYSTEM.md` §6 |
| Sidebar | Primary application navigation | spec §42 |
| Split / detail pane | List-and-detail working layout | spec §39 |
| Section | Content grouping within a page | spec §39 |
| Drawer / sheet | Secondary surface | — |
| Modal / dialog | Focused task requiring interruption | spec §71 — use sparingly |
| Tabs | In-page view switching | spec §41 |
| Breadcrumb | Location within a hierarchy | `docs/SITEMAP.md` §6 |
| Responsive frame | Mobile adaptation of the shell | spec §4.6, §44 |

**Note:** specification §71 explicitly warns against unnecessary popups and
excessive confirmation dialogs. Modal usage must be justified per instance.

---

## 3. Navigation

| Component | Purpose | Source |
|---|---|---|
| Top nav | Public site primary navigation | reference exports |
| Nav link | Individual navigation link | reference exports |
| Sidebar nav group | Collapsible module group | spec §42 |
| Sidebar item | Single destination | spec §42 |
| Active indicator | Current location | spec §42 |
| Mobile nav | Small-screen navigation | spec §44 |
| Org switcher | Change organization | spec §43 |
| Warehouse switcher | Change active warehouse | spec §43 |
| Footer | Multi-column link groups, legal, newsletter block | reference exports |
| Pagination | Page through large datasets | spec §37, §59 |
| Breadcrumb | Hierarchical location | — |

**Anti-pattern to avoid:** hidden actions (spec §71). Navigation must make available
actions discoverable, not concealed.

---

## 4. Forms

| Component | Purpose | Source |
|---|---|---|
| Text input | Single-line entry | spec §41 |
| Textarea | Multi-line entry | spec §41 |
| Number input | Quantity, amount, price, tax rate | spec §10 |
| Select | Single choice from a set | spec §41 |
| Multi-select | Multiple values | — |
| Combobox | Search-and-select, e.g. product picker | spec §43 |
| Date / date-time | Document and transaction dates | spec §13, §22 |
| Checkbox | Boolean | spec §41 |
| Radio group | Small exclusive set | spec §41 |
| Switch | Immediate toggle | spec §41 |
| Form field wrapper | Label, control, hint, error — the accessibility unit | spec §72 |
| Validation message | Field-level error, associated and perceivable | spec §38, §72 |
| Filter bar | List filtering | spec §39 |
| Search input | Scoped search | spec §29, §39 |
| Inline edit | Edit in place, where appropriate | spec §39 |
| Import wizard | CSV / XLSX import | spec §67 |
| Export control | CSV / XLSX / PDF export | spec §67 |
| Bulk action bar | Multi-select operations | spec §71 |

**Requirements carried by every form component** (spec §72,
`docs/CODE-STYLE.md` §3): an associated `<label>`, a perceivable error state, full
keyboard operability, a visible focus state, and a programmatic name for
icon-only controls. Placeholder text is never a label.

---

## 5. Data display

| Component | Purpose | Source |
|---|---|---|
| Metric tile | A single headline number with context | spec §9 |
| Stat group | Related metrics, e.g. the dashboard widget set | spec §9 |
| Description list | Label/value pairs on a detail view | spec §10, §18, §20 |
| Key-value row | Inline label/value | spec §13 |
| Badge / status pill | Compact state label | spec §41 |
| Tag list | Labels on a record | spec §41 |
| Avatar / initials | User identification | spec §32 |
| Timeline | Chronological events, e.g. stock history | spec §13, §66 |
| Progress / meter | Ratio toward a limit | spec §48 |
| Empty state | **Useful** — explanation plus a next action | spec §70 |
| Loading state | Skeleton or spinner, appropriate to context | spec §39 |

**Money and quantity display is not optional styling.** Specification §73 requires
INR and requires the monetary system to be able to support other currencies later.
Number formatting, alignment, and currency presentation are correctness concerns.
`TBD — requires architectural decision` for the representation
(`docs/DATABASE.md` §4).

---

## 6. Required state set

Specification §41 requires, where applicable:

```text
Default · Hover · Focus · Active · Disabled · Loading · Error · Success
```

Plus (`docs/DESIGN-SYSTEM.md` §13): **empty**, **loading**, **error**, and
**permission-denied**.

A component shipped without a real empty state is incomplete. Specification §70 is
explicit that "No data." is unacceptable and that the state should offer a next
action — for example, both *Add Product* and *Import Products*.

---

## 7. Tables

The highest-density surface in the product. Specification §39 requires clear tables
and powerful filtering; §59 requires pagination and virtualisation and forbids
loading thousands of records into the browser.

| Component | Purpose | Source |
|---|---|---|
| Data table | Primary record list | spec §39 |
| Table toolbar | Search, filters, view options, bulk actions | spec §39, §71 |
| Sortable header | Column sorting | spec §37 |
| Filterable column | Per-column filtering | spec §37 |
| Column resizing | User-controlled density | spec §39 |
| Column visibility | Show/hide columns | spec §39 |
| Selectable row | Row selection for bulk action | spec §71 |
| Editable cell | Inline editing | spec §39 |
| Row expansion | Detail without navigation | spec §39 |
| Row actions | Per-row menu | spec §71 |
| Sticky header | Header persists on scroll | spec §59 |
| Virtualised body | Large-list performance | spec §59 |
| Paginated footer | Page controls and result count | spec §37, §59 |
| Cell states | Loading, error, optimistic, pending | spec §39 |

**Table-specific correctness requirements:**

- Money and quantity cells use aligned figures so columns scan vertically.
- Financial and quantity data is **never silently truncated** on small screens
  (`docs/DESIGN-SYSTEM.md` §9).
- Sort, filter, and pagination state must be reflectable in the URL, so a view is
  shareable and restorable. `TBD` — depends on the routing decision.
- Semantic `<table>` markup, not a grid of `<div>`s (`docs/CODE-STYLE.md` §3).

---

## 8. Command interface

Specification §29 and §43 define a global command menu on `⌘ / Ctrl + K`.

| Component | Purpose | Source |
|---|---|---|
| Command menu | Global launcher and search | spec §43 |
| Command input | Query field | spec §43 |
| Command group | Grouped results | spec §43 |
| Command item | Single action | spec §43 |
| Command separator | Group boundary | spec §43 |
| Command shortcut hint | Displayed key combination | spec §43 |
| Command empty state | No results — with a next action | spec §70 |

Commands specified in spec §43:

```text
Search products · Create product · Create invoice · Create customer
Create supplier · Open reports · Navigate pages
Switch warehouse · Switch organization
```

Global search scope (spec §29): products, customers, suppliers, orders, invoices,
purchases, transactions.

**Requirement:** every command must be permission-checked. A command a user cannot
perform is either hidden or shown as explicitly unavailable — never offered and then
rejected.

---

## 9. AI interface

**No AI system exists. Nothing below is implemented. AI capability is Phase 7, and
is prohibited at the current stage** (`AGENTS.md` §6, §10).

Recorded now only so the planning surface is complete and the accessibility
requirement is not forgotten. Design direction: `docs/DESIGN-SYSTEM.md` §12.
Architecture and safety: `docs/AI-DECISIONS.md`.

| Component | Purpose |
|---|---|
| AI assistant surface | Natural-language business interaction (spec §28) |
| Prompt input | User request entry |
| AI activity indicator | Visible system activity — reading, reasoning, proposing |
| Tool activity list | Which business operations were invoked, visibly |
| Proposal card | A proposed action or recommendation, distinct from a record |
| Provenance / citation | The business records a figure derives from (spec §28) |
| Confirmation prompt | Explicit confirmation for consequential actions |
| Insight card | A surfaced insight or anomaly (spec §80 V3) |
| Forecast display | A prediction, always labelled as a prediction |
| AI refusal state | A decline or uncertainty, designed not hidden |

**Non-negotiable properties:**

- AI activity is **visible**, not ambient.
- A proposal is **visually distinct** from an executed fact — this is a correctness
  requirement, not styling.
- Figures are **traceable** to business data (spec §28).
- Payments, stock adjustments, invoices, and deletes require **explicit
  confirmation** (`AGENTS.md` §6).
- Every AI surface is keyboard-operable and screen-reader legible, on the same terms
  as any other (spec §72).
- No AI surface may be the **only** way to perform a task (spec §4.1).

---

## 10. Feedback states

| Component | Purpose | Source |
|---|---|---|
| Toast / notification | Transient, non-blocking feedback | spec §41 |
| Alert banner | Persistent, page-level or section-level message | spec §39 |
| Inline validation | Field-level error | spec §38 |
| Confirm dialog | Destructive or consequential confirmation | spec §71 |
| Progress indicator | Long-running operation | spec §67 |
| Skeleton | Content-shaped loading placeholder | spec §39 |
| Spinner | Indeterminate short wait | spec §39 |
| Error state | Failure with a recovery path | spec §38, §39 |
| Permission denied | No access, stated clearly | spec §32 |
| Offline / connectivity | Unavailable network | spec §45 |
| Optimistic indicator | Pending server confirmation | — |
| Structured API error | Code, message, request ID | spec §38 |

**Error display requirement** (spec §38): show the error `code`, a human-readable
`message`, and the `requestId`. **Never** expose stack traces, secrets, database
details, or internal infrastructure.

---

## 11. Business components

Domain-specific composites. Listed to show scope; **not designed**.

| Component | Purpose | Source |
|---|---|---|
| Product card / row | Product identity, SKU, stock, pricing | spec §10 |
| Variant selector | Size, colour, weight, material, model, storage, configuration | spec §11 |
| Stock level indicator | Current quantity against reorder thresholds | spec §24 |
| Low-stock badge | Below reorder point | spec §24 |
| Movement entry | Ledger row — type, quantity, reference, user, timestamp | spec §13, §14 |
| Warehouse selector | Location context | spec §15 |
| Transfer tracker | Draft → Requested → Approved → Dispatched → Received → Completed | spec §16 |
| Invoice builder / preview | Line items, tax, discount, totals | spec §21 |
| Invoice status | Draft, Issued, Partially Paid, Paid, Cancelled, Refunded, Overdue | spec §21 |
| Payment recorder | Method, reference, amount, partial payment | spec §22 |
| Customer / supplier card | Contact, terms, credit limit, balance | spec §18, §20 |
| Outstanding balance display | Receivables and payables | spec §9 |
| Order line editor | Line-item entry with quantity and price | spec §19 |
| Activity / audit trail | Who, what, when, before, after | spec §66 |
| Role and permission editor | Granular permission assignment | spec §32 |
| Organization switcher | Tenant context | spec §43 |
| Usage and limits panel | Entitlement consumption | spec §48 |
| Barcode scanner surface | Mobile camera scanning — future | spec §44 |
| Demo data prompt | Optional sample data on onboarding | spec §69 |

**Barcode scanning is a future capability** (spec §44) and has no design. It is
listed to mark the boundary, not to imply work.

---

## 12. Charts

Specification §41 requires charts to be defined as part of the design system.
Specification §26, §27, and §9 name the required visualisations.

**No chart library is selected and no chart visual specification exists.** Both are
`TBD`, and chart work belongs to Phase 6 (Analytics) — see `docs/ROADMAP.md`.

Required visualisations, from the specification:

| Visualisation | Source |
|---|---|
| Sales trend | spec §9, §27 |
| Inventory trend | spec §27 |
| Customer trend | spec §27 |
| Supplier trend | spec §27 |
| Product performance | spec §27 |
| Profitability / gross profit | spec §9, §27 |
| Cash flow | spec §27 |
| Low-stock and out-of-stock overview | spec §9, §24 |
| Top products | spec §9 |
| Purchase trends | spec §26 |
| Sales by product / customer / employee / location / payment method | spec §26 |
| Stock movement and valuation | spec §26 |
| Receivables and payables | spec §9, §26 |

Accessibility requirement that applies to all of them: a chart must not be the only
way to read its data (spec §72, `docs/DESIGN-SYSTEM.md` §10). A tabular equivalent
or accessible summary is required, and this is `TBD`.

---

## 13. Marketing components

Public website only. Never used in the application. See
`docs/DESIGN-SYSTEM.md` §11 for the density distinction.

| Component | Purpose | Reference available |
|---|---|---|
| Site header | Logo, primary nav, CTA | ✅ all exports |
| Hero band | Headline, subhead, primary actions | ✅ `Home-page.html` |
| Logo / trust strip | Partner or customer logos | ✅ — **must not be populated** (no customers exist) |
| Feature section | Capability explanation | ✅ |
| Feature card | Individual capability | ✅ |
| Workflow / pipeline visualisation | Multi-step process diagram | ✅ |
| Use-case grid | Grouped applications | ✅ |
| Metrics band | Headline numbers | ✅ — **must not be populated** (no metrics exist) |
| Pricing tier card | Plan presentation | ✅ — **must not be populated** (pricing `TBD`, spec §47) |
| FAQ accordion | Question/answer list | ✅ |
| Article card | Listing entry | ⚠️ reference export defective (`docs/KNOWN-ISSUES.md` §4.1) |
| Article detail | Long-form content | ✅ |
| Contact form | Enquiry submission | ✅ |
| Contact detail block | Email, phone, address | ⚠️ **no Innvntory contact details exist** |
| CTA band | Pre-footer conversion | ✅ |
| Footer | Link groups, legal, newsletter | ✅ |
| Not-found | 404 message and recovery | ✅ |

### Hard prohibitions on marketing components

These are placeholders in the reference material, and the prohibition is
`docs/DESIGN-REFERENCES.md` §2.3:

```text
✗ Customer names, logos, or "trusted by" strips
✗ Testimonials or quotes
✗ Metrics — user counts, uptime, integrations, workflow volumes
✗ Pricing figures
✗ Third-party copy, headlines, or taglines
✗ Third-party brand colours or wordmark
✗ Third-party contact details
✗ Third-party copyright lines
```

Filling any of these with invented values would be fabricating business claims
about a real company. Specification §83 lists pricing, terms, privacy policy, and
refund policy as **outstanding business items** — they are not yet written.

---

## 14. Planning summary

```text
Components designed ........... 0
Components implemented ........ 0
Components specified .......... 0
Component libraries installed . 0
Design tokens defined ......... 0   (TBD — requires brand decision)
```

The categories above define the **scope** of Innvntory's interface: roughly a
marketing site, a dense multi-tenant operating application, a global command
interface, and a future AI layer. Defining any of it in detail requires the brand
identity (`docs/KNOWN-ISSUES.md` §3.1) and the framework decision
(`docs/KNOWN-ISSUES.md` §1.2).

**No component work is authorised at the current stage.**
