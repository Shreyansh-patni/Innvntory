# BILLING

**Selected SaaS Billing Platform:** Polar (https://polar.sh/docs/introduction)

## Intended Responsibilities
- SaaS products / plans
- Checkout
- Subscriptions
- Customer billing
- Entitlements
- Billing lifecycle events
- Webhooks
- Merchant of Record responsibilities

## Architecture & Integration
- Billing boundary is isolated in `lib/polar/`.
- Do not scatter Polar API calls throughout the UI components.
- External Polar payloads must be normalized into project-owned internal types.
- *Important:* Polar is for SaaS subscription billing only. Do not replace it with Stripe for this purpose. Operational/business payment functionality (e.g. paying invoices) remains a separate product decision.

## Rules
- Never hardcode billing secrets.
- Credentials remain server-side.
- Webhook handlers must eventually support:
  - Signature verification
  - Payload validation
  - Idempotency
  - Safe logging
  - Replay protection

*(Note: Do not implement actual billing flows during setup).*
