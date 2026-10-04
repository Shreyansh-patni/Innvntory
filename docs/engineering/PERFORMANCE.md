# PERFORMANCE

Innvntory relies on strict architectural boundaries to maintain high performance.

## 1. Frontend Performance
- **Server Components by Default:** Minimize client-side JavaScript by rendering data-heavy components on the server.
- **Client JS Boundaries:** Push `'use client'` as far down the component tree as possible.
- **Route-level Performance:** Utilize Next.js caching and Suspense boundaries for non-blocking data fetching.
- **Assets:** Ensure all images are optimized (using `next/image`). Avoid oversized assets.
- **Fonts:** Load fonts optimally (using `next/font` for local fonts `NewBlack` and `LT-amber`) to prevent layout shift.
- **Animations:** No unnecessary decorative animations. Respect `prefers-reduced-motion`.

## 2. Backend & Database Performance
- **Indexes:** Ensure frequent query paths and foreign keys are indexed.
- **Caching:** Leverage Next.js data caching before introducing external caching services like Redis.
- **N+1 Queries:** Avoid N+1 queries by leveraging SQL joins and proper Supabase data fetching strategies.
