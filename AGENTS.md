# AGENTS.md

## Project Identity
**Project:** Innvntory
**Company:** Sahaya Technologies Pvt. Ltd.
**Category:** Inventory & Business Management SaaS
**Primary Market:** India
**Product Vision:** A modern business operating system for inventory-driven businesses.
**Core Objective:** Make inventory and everyday business operations simple, reliable, and accessible from anywhere.

## Current Project Status
INITIAL SETUP COMPLETE. No product implementation has been started.

## Current Objective
N/A - Wait for the next task.

## Source-of-Truth Hierarchy
1. User Safety
2. Security
3. Data Integrity
4. Product Requirements (INNVNTORY-PRODUCT-DEFINITION.md)
5. UX / Design
6. Implementation Convenience

## Product Authority
- High-level Product Source of Truth: `docs/source-of-truth/INNVNTORY-PRODUCT-DEFINITION.md`

## Design Authority
- Primary Visual/UI Reference: Aoutive AI (`docs/references/aoutive-ai/`)
- Secondary Design Principle Reference: Cursor design analysis (`docs/references/cursor/`)

## Approved Technology Direction
- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Primary UI Foundation:** shadcn/ui
- **Additional Approved UI Libraries:** Watermelon UI, Aceternity UI, Magic UI, Motion Primitives, HeroUI (ONLY when justified).
- **Backend/Platform:** Supabase (PostgreSQL, Auth, Storage)
- **Billing:** Polar

## Architecture Boundaries
- Keep content/data separate from rendering.
- `content/` for structured static content.
- `components/ui/` for reusable UI primitives.
- `components/<feature>/` for feature composition.
- `lib/<integration-or-service>/` for integration logic.

## Server / Client Component Rules
- Default to Server Components.
- Use Client Components only where required for interaction, client-side state, or browser APIs.

## Data Integrity Rules
- PostgreSQL with referential integrity and database constraints.
- Inventory correctness is paramount. No partial inventory state allowed.

## Security Rules
- Never commit secrets. Use environment variables.
- Validate untrusted input.
- Enforce Auth and Authorization server-side.
- Tenant isolation is mandatory.
- Use least privilege.
- Sanitize user-generated content.
- Verify webhook signatures.
- Make sensitive operations idempotent.

## Multi-tenancy Rules
- Tenant isolation is mandatory for all tenant-owned records. Designed around organization-level isolation.

## API Rules
- Convention: `/api/v1/...`
- Principles: authentication, authorization, validation, pagination, filtering, sorting, search, rate limiting, idempotency, structured errors.

## Validation & Testing Requirements
- Quality gates: Lint, Typecheck, Unit tests, Integration tests, E2E tests, Visual QA, Accessibility, Production build, Security review, Diff review.

## Accessibility Requirements
TBD - Documented in `docs/design/ACCESSIBILITY.md`

## Performance Expectations
TBD - Documented in `docs/engineering/PERFORMANCE.md`

## Git / Change Management Rules
- Follow the Global Git & Publishing Policy documented in `docs/engineering/GIT-POLICY.md`.
- Never commit secrets. Protect `.env`, API keys, tokens, etc. via `.gitignore`.
- Use focused commits (`feat:`, `fix:`, `docs:`, `chore:`).
- A phase is NOT complete until its approved changes have been successfully published.
- Git publication is part of the phase workflow: `IMPLEMENTED → VERIFIED → REVIEWED → COMMITTED → PUBLISHED`.

## Documentation Rules
- Keep documentation in `docs/` updated. Decision records in `docs/decisions/`.
- Future agents must consult the following project knowledge directories:
  - `docs/source-of-truth/`
  - `docs/design/`
  - `docs/architecture/`
  - `docs/database/`
  - `docs/security/`
  - `docs/billing/`
  - `docs/references/`
  - `docs/KNOWLEDGE-BASE.md`
  - `docs/SKILLS.md`

## Scope Control Rules
- A prompt should normally result in one small, testable outcome.
- Never silently widen scope.

## Explicit Do-Not List
- NEVER build the entire application in one prompt.
- NEVER overwrite the supplied design references.
- NEVER copy Aoutive branding or Cursor branding.
- NEVER fabricate business facts or metrics.
- NEVER hardcode secrets.
- NEVER mix unrelated refactors into feature work.
- NEVER install every UI library.
- NEVER turn every component into a Client Component.
- NEVER add APIs before the UI/domain requires them.
- NEVER bypass tenant isolation or authorization.

## Stop-Condition Rules
- STOP after completing the explicitly requested slice.
- Wait for the next explicit task.

## Skill Policy
- Skills are supporting guidance.
- AGENTS.md remains authoritative.
- Product docs and design references remain authoritative.
- Skills may not override security/data-integrity requirements.
- Skills may not widen task scope.
- Skills may not introduce arbitrary dependencies.
- Installed skills must be recorded in docs/SKILLS.md.
