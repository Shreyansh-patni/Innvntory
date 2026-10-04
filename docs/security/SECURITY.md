# SECURITY

## Baseline (Non-negotiable)
- No secrets in source control.
- Use environment variables for all sensitive configuration.
- Runtime validation for untrusted input strictly.
- Server-side authentication enforcement.
- Server-side authorization enforcement.
- Tenant isolation is mandatory (via Supabase RLS and application logic).
- Use least privilege for database access, service roles, and users.
- Safe error responses (avoid leaking internal errors).
- Protect against XSS and CSRF.
- Webhook signature verification strictly.
- Make sensitive operations idempotent.
- Audit logging for important actions.
- Review dependencies regularly.
- Define data retention/deletion planning.
