# DATABASE

**Selected Backend Platform:** Supabase (https://supabase.com/docs)

## Intended Responsibilities
- PostgreSQL
- Authentication
- Storage
- Realtime (where justified)
- Migrations
- Supabase CLI (where appropriate)
- Row Level Security (RLS)
- Tenant isolation
- Secure database access

## Principles
- **PostgreSQL:** Utilize full relational capabilities.
- **Referential Integrity:** Enforce foreign keys rigorously.
- **Database Constraints:** Use checks, unique constraints, and defaults to guarantee validity.
- **Transactions:** Use transactions for all multi-step mutations to prevent partial state.
- **Indexing:** Optimize query patterns early.
- **Migration Safety:** All changes must be made via safe migrations.
- **Auditability:** Keep audit trails for important records.
- **Tenant Isolation:** Row Level Security (RLS) must enforce organization-level isolation. Every tenant-owned record should have an organization boundary.
- **Data Consistency:** Inventory correctness is paramount. Inventory operations should be atomic. No partial inventory state. Database correctness is higher priority than convenience.
- **Idempotency:** Webhook processing and sensitive mutations must be idempotent.

*(Note: Do not implement any of these yet).*
