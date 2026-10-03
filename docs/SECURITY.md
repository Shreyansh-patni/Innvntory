# Innvntory — Security Baseline

**Status:** Phase 0 — requirements baseline only. **No security control is
implemented, configured, or verified.**

> **No claims in this document are verified.** Innvntory holds no security
> certification, audit, penetration test, or compliance attestation. Any such claim
> would be fabricated. See §12.

---

## 1. Fixed by the specification

Specification §50 lists the required security capabilities:

```text
Secure authentication · Password hashing · Session management · MFA support
RBAC · Tenant isolation · Input validation · CSRF protection where applicable
Rate limiting · Secure cookies · Encryption in transit · Encryption at rest
Secret management · Audit logging · Dependency security
```

Specification §51 (data protection):

```text
Collect only what is needed. · Store only what is needed. · Restrict access.
Log sensitive actions. · Encrypt sensitive information.
```

Specification §33 and §66 (auditability) and §58 (named critical scenarios) are
normative. See `docs/DESIGN-SYSTEM.md` §10 for the accessibility target (WCAG 2.1
AA), which is a security-adjacent requirement because it governs error and
permission-state disclosure.

---

## 2. Authentication

**Required:**

- Secure authentication with hashed passwords (spec §50).
- Session management with secure cookies (spec §50).
- MFA support (spec §50).
- Launch methods: **Email + Password and Google only** (spec §30). OTP and passkeys
  are specified as options but are **not** in the initial launch.
- Account creation precedes organization creation in onboarding (spec §68).

**Design requirements:**

- Password hashing must use a memory-hard adaptive algorithm. The specific
  algorithm and parameters are `TBD — requires architectural decision`.
- Sessions must be revocable, and must support invalidation on password change and
  on membership removal. Revocation design is `TBD`.
- Authentication failures must not reveal whether an account exists.
- Brute-force protection and rate limiting apply to all authentication endpoints.

**Not implemented.** Auth provider, session strategy, and MFA policy are open — see
`docs/ARCHITECTURE.md` §5.

---

## 3. Authorization and RBAC

**Required:**

- Granular, string-identified permissions (spec §32), e.g. `products.read`,
  `products.create`, `inventory.adjust`, `inventory.transfer`, `sales.cancel`,
  `purchases.approve`.
- Eight default roles (spec §32): Owner, Admin, Manager, Inventory Manager, Sales
  Staff, Purchase Staff, Accountant, Viewer.
- **Server-side enforcement on every operation.** A hidden UI control is not
  authorization.
- AI actions are evaluated against the invoking user's real permissions, with no
  elevated privilege (`AGENTS.md` §6).

**Design requirements:**

- Deny by default. Absence of a permission is denial, not allowance.
- Authorization decisions must be recorded where they protect a sensitive action.
- Permission checks belong in the business service layer so the UI and the AI tool
  interface cannot diverge (`docs/API-GUIDE.md`).

**Open:** permission storage, customisability per organization, and record/field
scope — `TBD — requires architectural decision`.

---

## 4. Tenant isolation

**This is the highest-severity property in the product.**

- Multi-tenant from day one (spec §4.8).
- **"No organization should be access another organization's data"** (spec §31).
- Every tenant-owned record carries `organization_id` (spec §35).
- Both application-level authorization **and** database-level safeguards are to be
  considered (spec §35).
- Named critical test scenario (spec §58): *"User A must never access Organization
  B's data."*

**Requirements:**

- Tenant context is established server-side and is never accepted from a
  client-supplied value without validation.
- Every query path is tenant-scoped, including aggregates, exports, search, and
  background jobs.
- Cross-tenant access is a **security incident**, not a bug — it must be detectable
  and alertable, not merely fixed.
- Isolation must be testable, with a dedicated test that fails loudly on regression.

**Open:** isolation mechanism — `TBD — architectural decision required`
(`docs/DATABASE.md` §4).

---

## 5. Input validation

- Validation is required on every API input (spec §37, §50).
- Validation happens server-side. Client-side validation is a UX affordance only.
- All input is untrusted, including values that "came from" our own UI.
- Typed contracts are the primary control (spec §4.9) — see `docs/API-GUIDE.md`.
- File uploads require validation of type, size, and content.

**Open:** validation approach and library — `TBD — requires architectural decision`.

---

## 6. Secret management

- Secret management is required (spec §50, §83).
- **Secrets are never committed.** `.gitignore` excludes `.env` and `.env.*`;
  only `.env.example` is tracked, and it contains no values.
- Secrets are injected at runtime from the deployment environment or a secret
  manager. Provider is `TBD — requires architectural decision`.
- **Never use production credentials locally** (spec §62).
- No secret may appear in source, in a log line, in an error message (spec §38), in
  a test fixture, or in a screenshot in this repository.
- Credential rotation procedure is `TBD` and must exist before production.

**Current state:** no secret exists in this repository, and none is required at
Phase 0.

---

## 7. Audit logging

**Required:**

- Every sensitive operation is recorded (spec §33).
- **Audit logs are immutable** (spec §33).
- Every important operation records (spec §66):

  ```text
  Who · What · When · Where · Before · After · Reference
  ```

- AI-initiated actions are additionally attributable as such (`AGENTS.md` §6).

**Requirements:**

- Append-only. No update or delete path at the application level.
- Audit entries must not be modifiable by the users whose actions they record.
- Audit reads are themselves permission-controlled and auditable.
- Retention and archival policy: `TBD — requires architectural decision`.

> **Note on the specification's example.** Spec §33 uses the name "Shreyansh" in an
> illustrative audit-log example. That is sample content in the source document, not
> a real person or user. It must not be treated as a data-seeding instruction.

---

## 8. Rate limiting

- Required on APIs (spec §37, §50).
- Applied per operation, with stricter limits on authentication, password reset,
  search, exports, and any AI endpoint.
- Rate-limit response is a structured error, not a stack trace (spec §38).

**Open:** limits, storage, and strategy — `TBD — requires architectural decision`.

---

## 9. API security

- Versioned, predictable API conventions (spec §36).
- Authentication and authorization on every endpoint (spec §37).
- Structured errors with a request ID, never exposing stack traces, secrets,
  database details, or internal infrastructure (spec §38).
- CSRF protection where cookie-based session authentication is used (spec §50).
- Idempotency on payments, webhooks, orders, stock movements, and external
  integrations (spec §56) — this is a security control as well as a correctness one.
- Rate limiting (above), request IDs, pagination (spec §59 — never return unbounded
  result sets).

**Open:** transport, versioning mechanism, and auth transport for the API —
`TBD — requires architectural decision`. See `docs/API-GUIDE.md`.

---

## 10. Encryption and data protection

**Required (spec §50, §51):**

- Encryption in transit.
- Encryption at rest.
- Encrypt sensitive information.
- Data minimisation — collect only what is needed, store only what is needed.
- Restrict access. Log sensitive actions.

**Data requiring particular care:** credentials, session tokens, GSTIN, customer
and supplier contact details, financial records, invoices, and audit logs.

**Not established:**

```text
TBD — requires architectural decision
  · Encryption key management and rotation
  · Data residency (unaddressed anywhere in the specification)
  · Retention and deletion schedules per data class
  · Backup encryption (spec §52 requires automated backups and recovery testing)
  · Right-to-erasure / data export mechanics for customers
```

---

## 11. AI action safety

Full detail: `docs/AI-DECISIONS.md`. Security-relevant summary:

| Control | Requirement |
|---|---|
| Tenant boundary | AI never observes or acts across organizations |
| RBAC parity | AI holds no privilege of its own; evaluated as the invoking user |
| Access path | Typed business tools/services only — never unrestricted database access |
| Determinism | Quantities, money, and stock levels come from the transactional system, never from model output |
| Auditability | Every AI read and write attributable, and distinguishable from a direct user action |
| Confirmation | Payments, stock adjustments, invoices, and deletes require explicit human confirmation |
| Traceability | Recommendations traceable to underlying business data (spec §28) |
| Injection resistance | Untrusted business data and user content must not be able to grant tools or escalate permissions — mechanism `TBD` |

**No AI system exists. No AI endpoint exists.** This section is a forward
constraint, not a description of a control in place.

---

## 12. Compliance and claims

**Innvntory currently holds no security certification and makes no compliance
claim.** Specifically, none of the following may be stated, implied, or displayed
in Innvntory product or marketing surfaces:

```text
SOC 2 · ISO 27001 · GDPR compliance · HIPAA · PCI DSS
penetration tested · security audited · certified · compliant
```

until such a claim is true, evidenced, and approved.

**Separately**, specification §74 requires that tax functionality be validated
against current official requirements before production use. Tax compliance in
Innvntory is a functional correctness obligation, not a marketing claim, and
compliance with GST, e-invoicing, and e-way-bill requirements must be established
for real before it is asserted.

---

## 13. Security review checklist

To be completed before production (specification §83, adapted — items marked *not
implemented* are Phase 0 status, not failures):

```text
[ ] Authentication implemented and reviewed                    — not implemented
[ ] Password hashing with a memory-hard algorithm               — not implemented
[ ] Session management, secure cookies, revocation             — not implemented
[ ] MFA support                                               — not implemented
[ ] RBAC enforced server-side on every operation              — not implemented
[ ] Tenant isolation verified by dedicated test                — not implemented
[ ] Input validation on every endpoint                         — not implemented
[ ] CSRF protection where applicable                          — not implemented
[ ] Rate limiting configured                                   — not implemented
[ ] Encryption in transit and at rest                          — not implemented
[ ] Secret management and rotation procedure                   — not implemented
[ ] Audit logging complete and immutable                       — not implemented
[ ] Dependency scanning in CI                                  — CI does not exist
[ ] Backup and restore verified by an actual restore test     — not implemented
[ ] Independent security review before production              — not performed
```

Specification §52: *"A backup that has never been restored should not be
considered verified."* The same honesty applies to every row above.

---

## 14. What this document does not establish

- No threat model. `TBD` — a threat model is required before implementation begins
  and should be the first security artefact produced in Phase 1.
- No security testing plan or tooling.
- No vulnerability disclosure process.
- No incident response procedure.
- No data classification scheme beyond the brief notes in §10.
- No verified control of any kind.
