# Innvntory

**AI-native inventory and business operations platform — Sahaya Technologies.**

Innvntory is a cloud-first SaaS for businesses that manage physical inventory. The
product covers products, inventory and stock movements, warehouses, purchasing,
sales, customers, suppliers, orders, payments, billing, reports and business
operations. Its stated long-term direction is to move from inventory management
into business operations, then business intelligence, and finally an AI-powered
business operating system. The guiding principle from the product specification is
to make complex business operations feel simple.

---

## Current development status

**Phase 0 — Foundation. Documentation and contracts only.**

There is currently:

- no application code,
- no installed dependency stack,
- no database or schema,
- no API,
- no authentication,
- no UI components or pages.

No production URL, pricing, customer list, metric, or credential exists for this
project, and none is stated here. Anything of that kind is `TBD` until the product
specification or an explicit instruction establishes it.

Nothing in this repository has been validated by `lint`, `typecheck`, `tests` or
`build`, because those commands do not exist yet. Do not claim otherwise.

---

## Repository structure

```text
Innvntory/
├── AGENTS.md                 # Instruction contract for coding agents
├── README.md                 # This file
├── .gitignore                # Ignore rules
├── .env.example              # Environment variable contract (no real values)
├── Innvntory.md.txt          # Authoritative product specification (88 sections, v1.0)
├── DESIGN-cursor.md          # Supplied design-system reference direction
├── Design Refrence/          # Supplied public-website visual + code references
├── docs/
│   ├── PRD.md
│   ├── ARCHITECTURE.md
│   ├── DESIGN-SYSTEM.md
│   ├── CODE-STYLE.md
│   ├── DEPENDENCIES.md
│   ├── DEVELOPMENT.md
│   ├── KNOWN-ISSUES.md
│   ├── ROADMAP.md
│   ├── ROUTES.md
│   ├── SECURITY.md
│   ├── SITEMAP.md
│   ├── COMPONENTS.md
│   ├── API-GUIDE.md
│   ├── DATABASE.md
│   ├── AI-DECISIONS.md
│   ├── UI-LIBRARIES.md
│   ├── DESIGN-REFERENCES.md
│   └── decisions/            # Architectural decision records (none yet)
└── skills/
    └── SKILLS-REGISTRY.md    # Skill inventory and selection status
```

`Innvntory.md.txt`, `DESIGN-cursor.md` and `Design Refrence/` are supplied
source-of-truth and reference material. They must not be modified, renamed, moved,
converted or deleted.

---

## Source-of-truth documents

| Document | Role |
|---|---|
| `Innvntory.md.txt` | Authoritative product specification. Wins over all other documents on product questions. |
| `DESIGN-cursor.md` | Supplied design-system reference direction. Reference only — not Innvntory branding. |
| `Design Refrence/` | Supplied visual and code references for the public website. Reference only. |
| `AGENTS.md` | Instruction contract and conflict-resolution order. |
| `docs/decisions/` | Architectural decisions, once made. None exist yet. |

When sources conflict, follow the hierarchy in `AGENTS.md` §2.

---

## Development principles

- Inspect before modifying.
- Prefer small, controlled, verifiable vertical slices.
- Never silently invent product requirements. Mark unknowns `TBD`.
- Reuse existing components; avoid unnecessary dependencies.
- Validate changes and report real results.
- Never claim completion without verification, and never fabricate test results.
- Preserve the supplied reference files.
- Keep the complexity in the architecture and the simplicity in the interface.

---

## Setup

Setup instructions are intentionally not written yet. **No dependency has been
selected or installed**, so there is nothing concrete to instruct.

One architectural decision is now made: a Next.js frontend plus a **dedicated backend
service**, structured as a modular monolith with its own worker process — see
[ADR 0001](docs/decisions/0001-backend-architecture.md) (`Accepted`). That fixes the
system shape, but deliberately does **not** name a server framework, ORM, queue, or
hosting provider, so no setup steps follow from it yet.

The following remain unresolved and must be decided before setup can be documented:

- Frontend framework and rendering strategy — *TBD — now the blocking decision*
- Backend server framework and runtime — *TBD — requires architectural decision*
- Repository and workspace layout details, contracts sync mechanism — *TBD*
- Database access layer / ORM — *TBD — requires architectural decision*
- Test stack — *TBD — requires architectural decision*
- Environment, hosting and deployment target — *TBD — requires architectural decision*

Full open-questions list: `docs/KNOWN-ISSUES.md`.

`.env.example` documents the environment variable contract shape only. It contains
no real credentials and none should ever be committed.

See `docs/KNOWN-ISSUES.md` for the full open-questions list.
