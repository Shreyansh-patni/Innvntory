# ADR 0005 — Authentication and Session Architecture

- **Status:** **Accepted**
- **Proposed:** 2026-10-04
- **Accepted:** 2026-10-04
- **Decision authority:** Human-approved architectural decision
- **Accepted decision:** Identity-only authentication boundary with a provider-neutral adapter contract, server-side session model, and Innvntown-owned authorization
- **Specification references:** `Innvntory.md.txt` §4.7, §4.8, §30, §31, §32, §33, §35, §50, §51, §58, §66, §68, §88
- **Related:** [ADR 0001](0001-backend-architecture.md), [ADR 0002](0002-frontend-framework.md), [ADR 0003](0003-database-isolation-access-layer.md), [ADR 0004](0004-orm-query-access-and-pooling.md) (all `Accepted`)
- **Supersedes:** nothing
- **Superseded by:** nothing

---

## Status

**Accepted — 2026-10-04.**

**Provider selection is DEFERRED, deliberately.** Section 8 explains why, and what
the deferral does and does not permit.

The provider-neutral architecture, session model, active-organization model, and
authorization boundary are implemented. **Production authentication is not
available**, and nothing in the codebase pretends otherwise: every unauthenticated
request fails closed.

---

## Context

Three accepted decisions left authentication as the last open architectural blocker
before domain schema work (`docs/ARCHITECTURE.md` §15 row 4).

The prior placeholder (`apps/api/src/platform/auth/resolve-session.ts`) defined a
resolver interface but had three deficiencies this record fixes:

1. Its `ResolvedSession` conflated **identity** with **authorization** — it carried
   `roleId` and `permissions` as if the authenticator supplied them. That would have
   let a vendor become the authorization source, which §8 forbids.
2. It had no session *lifecycle* concept: no identifier, creation, or expiry.
3. It had no organization-switching contract, so the most dangerous future
   implementation — trusting a client-supplied `organizationId` — was unconstrained.

Specification §30 fixes the launch methods: **Email + Password and Google**. §50
requires secure authentication, password hashing, session management, and MFA support.

---

## 1. Authentication boundary

**Authentication is an identity boundary, not a business authorization layer.**

The authentication system establishes:

- user identity
- an authenticated session
- session lifecycle
- basic account state (active / suspended / deleted)

Business authorization remains **inside Innvntory's backend**.

**The authentication provider must never become the source of** inventory
authorization, organization roles, product permissions, business permissions, or
tenant-data authorization.

The canonical authorization model is unchanged and remains Innvntown-owned:

```text
users · organizations · organization_memberships · roles · permissions · role_permissions
```

A provider's `role` or `permissions` claim is **identity-provider metadata**. It is
never trusted unless explicitly verified against Innvntory's own tables.

---

## 2. Provider abstraction

```text
Authentication Provider
        ↓
Auth Adapter                     ← the ONLY code that knows the vendor
        ↓
AuthenticatedSession             ← provider-neutral, internal contract
        ↓
SessionResolver
        ↓
TenantContext                     ← existing ADR 0003 contract
        ↓
Backend Authorization            ← Innvntory-owned RBAC
        ↓
Business Services
        ↓
Data Access / RLS                 ← existing ADR 0003/0004 backstop
```

Application code depends on the **internal** contract. Vendor SDK types do not
appear in service, data-access, or route code. Adapter isolation is enforced by
dependency direction: `apps/api/src/auth/provider.ts` defines the port; no other
module imports a vendor.

---

## 3. Session

A trusted, server-side session representation:

| Field | Source | Trust |
|---|---|---|
| `sessionId` | Session store | Trusted |
| `userId` | Authentication | Trusted |
| `authState` | Session store | Trusted (`active` / `suspended`) |
| `createdAt` / `expiresAt` | Session store | Trusted |
| `activeOrganizationId` | **Session state, set only after membership verification** | Trusted |
| `correlationId` | Backend infrastructure | Trusted |

**Never accepted as authoritative from a request:** `actorId`, `organizationId`,
`role`, or `permissions`. The authenticated session is the only source of identity.

---

## 4. Active organization

A user may belong to **many** organizations. There is no permanent organization
ownership on `users` (ADR 0004 Q6).

The active organization is resolved from **trusted session state only**.

**Switching requires all of:**

1. the user is authenticated;
2. the user has an **active** membership in the *target* organization
   (server-side lookup — never trusted from the request);
3. a new session state carrying that active organization is persisted;
4. the next request builds a fresh `TenantContext` from it.

A client request carrying an `organizationId` is treated as a **request to switch**,
never as proof of membership. Membership is always verified server-side.

---

## 5. TenantContext

Unchanged from ADR 0003. Authentication **feeds** `TenantContext` and never bypasses it.

- explicitly passed, immutable, no ambient global state
- `organizationId` from the **session**
- `actorId` from **authentication**
- `permissions` from **server-side authorization**, never from a claim
- `actorType` controlled by backend infrastructure
- `correlationId` generated by backend infrastructure

---

## 6. RBAC

Roles and permissions remain Innvntory-owned. Effective permissions are derived from:

```text
authenticated user + active organization + organization membership
                     + assigned role + role permissions
```

Client-supplied role or permission claims are **ignored**.

---

## 7. API authentication

Every protected route resolves the session **before** constructing `TenantContext`.

Unauthenticated request → **fail closed**. Specifically prohibited:

- a silent anonymous tenant
- a default or fallback organization
- a "development admin" identity in production code
- a fake authenticated user created to make a path work

Test doubles are permitted **only** behind explicit test interfaces.

---

## 8. Authentication provider — DEFERRED

### Evaluation performed against the brief's criteria

| Criterion | Assessment |
|---|---|
| Next.js compatibility | All major candidates compatible |
| Server-side session verification | All major candidates support it |
| Secure cookie/session handling | Provider-owned |
| Multi-tenant / org switching | Must be verified **against Innvntory's** membership table regardless of vendor |
| API authentication | All support it |
| TypeScript support | All support it |
| Local development | Varies |
| Production deployment | Varies |
| Migration complexity | Low now, high later — migration is cheap at zero users and expensive at scale |
| **Vendor lock-in** | **The deciding factor.** Whichever is chosen, it must stay behind §2's adapter |
| Keeping authorization in Innvntory | Achievable with any provider, **provided** §1 and §6 are enforced |
| Cost / operational complexity | **Cannot be evaluated** — depends on user volume and plan, which are unknown |
| Future AI/tool authentication | Must resolve to an invoking human actor; provider-neutral |
| Future worker authentication | Must use durable job context, not a provider session; provider-neutral |

### Decision

**No provider is selected in this record.**

**Rationale.** Every criterion above is either provider-neutral or requires
information the repository does not contain: an actual account, real credentials, and
a known expected user volume to evaluate cost against. Selecting a vendor from this
information would be choosing on convenience — which §8 of the brief explicitly
prohibits, and which `docs/DEPENDENCIES.md` §1 also prohibits.

Concretely, this repository has: no provider account, no client ID or secret, no
external service provisioned, and no stated user-volume target. Any provider choice
made now would be a guess dressed as a decision.

**What deferral permits, and what it does not.**

| Permitted now | Not permitted now |
|---|---|
| Provider-neutral session and adapter contracts | Selecting a vendor SDK |
| A development/test adapter behind an explicit boundary | Any real credential in the repository |
| Membership verification against Innvntory's own tables | A session table invented speculatively |
| Protected routes that fail closed | Any code path that assumes a signed-in user |

The correct next input is a human decision on provider, made with account and cost
information available. It is recorded in `docs/KNOWN-ISSUES.md`.

---

## 9. Security

Responsibility is explicit, because duplicating a provider's work is as wrong as
missing your own.

| Concern | Owner | Note |
|---|---|---|
| Password hashing | **Provider** | Innvntory does not implement cryptography (§ brief) |
| MFA | **Provider** | §50 requires MFA support |
| OAuth callback validation | **Provider** | Callback is provider territory |
| Session token issuance, rotation | **Provider** | |
| Session fixation protection | **Provider** | Rotating the session identifier on privilege change |
| Session expiry / absolute + idle limits | **Provider**, **enforced by Innvntory** | Innvntory re-checks `expiresAt` on every resolution regardless of provider |
| Logout / revocation | **Provider**, **contract exposed by Innvntory** | §"Logout/revocation contract" |
| Cookie flags (HttpOnly, Secure, SameSite) | **Infrastructure / Provider** | |
| CSRF protection | **Innvntory** | Required wherever cookie session auth is used (§50). Enforced by the protected-route helper. |
| Origin validation | **Innvntory** | On session-mutating requests |
| **Organization-switch security** | **Innvntory** | Membership verified server-side (§4). The single most important control in this record. |
| **RBAC enforcement** | **Innvntory** | |
| **Tenant isolation** | **Database** + Innvntory | ADR 0003/0004 |
| Audit logging | **Innvntory** | §33/§66: actor, org context, action, target, timestamp, correlation id. Never secrets. |
| Brute-force / rate limiting | **Provider + Innvntory** | Provider for credential endpoints; Innvntory for application endpoints (§37) |
| Account enumeration resistance | **Provider**, **Innvntory** | Generic failure messages at the Innvntory layer |
| Secret handling / server-only credentials | **Infrastructure** | Never in the repo, never in a client bundle |
| **Operator vs user identity** | **Innvntown** | Separate `OperatorContext`; never inferred (ADR 0004 Q2) |
| **Worker identity** | **Innvntory** | Durable job context; not a human session |
| **AI tool identity** | **Innvntory** | Inherits the invoking actor; never selects a tenant |

---

## 10. AI, worker, and operator identities

Preserved unchanged from ADR 0003/0004, restated here because authentication is where
these are most likely to be broken by accident:

- **AI tools** never receive an `organizationId` from the model; they inherit trusted
  context from the invoking authenticated actor and call business services.
- **Workers** use explicit durable job context; `organizationId` must be present for
  tenant-scoped work; worker identity is not a human user; permissions are explicitly
  constrained and not a superset.
- **Operators** use a separate `OperatorContext`, never inferred from missing tenant
  context, and privileged access is explicit and audited.

No worker, operator console, or AI system is implemented by this record.

---

## Consequences

1. `apps/api/src/auth/` becomes the only place authentication concepts live.
2. Vendor SDK types are confined to an adapter; no service or data-access module
   imports a vendor.
3. **No session table is created.** Session persistence is provider-owned; inventing
   one before a provider is chosen would be speculative.
4. Protected routes fail closed until an adapter is configured.
5. The schema already models the required membership model — **no database change**.
6. Organization switching is safe-by-construction: membership is verified server-side
   before any session state changes.
7. `/login` and `/signup` exist as real UI but **cannot authenticate**, and say so.

---

## Risks

| # | Risk | Mitigation |
|---|---|---|
| A1 | Someone later trusts a client-supplied `organizationId` | Adapter contract has no such parameter; tests cover it |
| A2 | A provider's role claim leaks into authorization | §6 forbids it; permission derivation is server-side only |
| A3 | Provider deferral drifts into "no auth at all" | Protected routes fail closed; the gap is tracked in `KNOWN-ISSUES.md` |
| A4 | Test adapter leaks into production | Separate module, guarded by an explicit runtime check |
| A5 | CSRF overlooked when cookie sessions land | Recorded as Innvntory-owned in §9 |
| A6 | Session expiry assumed to be the provider's job | Innvntory re-checks `expiresAt` on every resolution |
| A7 | Rate limiting assumed to be the provider's job | Application endpoints remain Innvntory-owned (§37) |

---

## Revisit conditions

| Condition | Action |
|---|---|
| A provider account and cost information become available | Human decision; record as ADR 0006 |
| Session persistence requirements diverge from the provider's model | Add a session table under a new ADR — not speculatively |
| Operator console is built | Separate ADR; ADR 0004 Q2 constrains it |
| Worker authentication needs a real identity | Separate ADR |
| AI tool authentication needs a provider capability | Separate ADR |

---

## Provenance

**Human decisions (2026-10-04)** — the full architectural contract in §1–§10 and the
Accepted status of this record.

**Specification** — `Innvntory.md.txt` v1.0: §4.7, §4.8, §30 (launch auth methods),
§31, §32, §33, §35, §50, §51, §58, §66, §68, §88. **Verified absence:** the
specification names no authentication vendor and mandates no session storage model.

**Decision records** — ADR 0001 (D3/D5/D6/D8), ADR 0002 (constraints 9/10/11),
ADR 0003 (Q1 resolved: multi-organization membership; Q6 resolved: `users` is
platform identity), ADR 0004 (Q2: explicit operator context; Q6: membership model;
Q7: role separation).

**Project documentation** — `docs/SECURITY.md` §2/§3/§4, `docs/API-GUIDE.md` §4,
`docs/ARCHITECTURE.md` §5/§15 row 4, `docs/KNOWN-ISSUES.md` §1.4, `docs/CODE-STYLE.md` §9.

**Not used as inputs** — vendor marketing claims; convenience; any presumed provider.

---

## Decision

**ACCEPTED — 2026-10-04.**

```text
Authentication boundary ....... identity only; authorization stays in Innvntory
Provider abstraction .......... internal contract; vendor isolated to an adapter
Session ....................... server-side, trusted, provider-neutral
Active organization .......... session state; switching verified server-side
TenantContext ................ fed by auth, never bypassed by it
RBAC ......................... Innvntory-owned tables; provider claims untrusted
API auth ..................... fail closed; no anonymous or fallback tenant
Provider ..................... DEFERRED — no account, credentials, or volume basis
```

**This decision is production-*shaped*, not production-*ready*.** The architecture is
fixed; the vendor and a real credential path are not. See
`docs/KNOWN-ISSUES.md` for the tracked blockers.