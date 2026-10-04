# UNRESOLVED DECISIONS (TBD)

This document lists architectural, design, and product decisions that are genuinely unresolved and require an explicit project decision in the future. 

Do not prematurely choose technologies or values to fill these gaps.

## Design & UI
- Final Innvntory color tokens (including Primary CTA color)
- Final typography (Geist vs Inter vs other)
- Dark Mode token strategy (Is it required for MVP?)
- Exact responsive breakpoints

## Architecture & Engineering
- State-management strategy
- ORM/query strategy (if one is eventually required)
- Caching strategy
- Background-job architecture
- Exact authentication implementation details (using Supabase Auth)
- Exact production hosting platform (e.g., Vercel, AWS, etc.)

## Services & Infrastructure
- Analytics provider
- Observability provider
- Detailed billing entitlement model

## Product & Future Scope
- Mobile/PWA strategy
- Operational payment integrations (e.g., Razorpay, Stripe) vs SaaS billing (Polar)
