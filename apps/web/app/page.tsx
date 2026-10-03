import Link from "next/link";

const MODULES = [
  {
    title: "Inventory",
    body: "Real-time stock across every location, with a ledger that shows exactly how each quantity changed.",
  },
  {
    title: "Purchasing",
    body: "Suppliers, purchase orders, goods receipt and supplier payments — one continuous flow.",
  },
  {
    title: "Sales & invoicing",
    body: "Orders, GST-ready invoices, partial payments, returns and refunds without spreadsheet drift.",
  },
  {
    title: "Customers & suppliers",
    body: "Credit limits, payment terms and outstanding balances visible on every record.",
  },
  {
    title: "Reports",
    body: "Stock valuation, sales, purchasing and financial reporting built on your own data.",
  },
  {
    title: "Contextual AI",
    body: "Ask questions in plain language. Answers come from your business data, and every action is confirmed before it runs.",
  },
] as const;

const PRINCIPLES = [
  {
    title: "Accurate and traceable",
    body: "Every stock movement is recorded with who, what, when and why. Nothing is silently adjusted.",
  },
  {
    title: "Simple by default",
    body: "The common path needs no training. Depth is there when you want it, and never in the way.",
  },
  {
    title: "Safe multi-tenant by design",
    body: "Each business's data is isolated and enforced at the database, not just in the interface.",
  },
] as const;

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-canvas">
      {/* ---------------------------------------------------------------- */}
      {/* Header                                                            */}
      {/* ---------------------------------------------------------------- */}
      <header className="sticky top-0 z-30 border-b border-hairline bg-canvas/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span
              aria-hidden
              className="grid h-7 w-7 place-items-center rounded-md bg-primary text-[0.6875rem] font-semibold tracking-tight text-on-primary"
            >
              IN
            </span>
            <span className="text-[0.9375rem] font-medium tracking-tight">Innvntory</span>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
            <a
              href="#platform"
              className="text-sm text-ink-secondary transition-colors hover:text-ink"
            >
              Platform
            </a>
            <a
              href="#principles"
              className="text-sm text-ink-secondary transition-colors hover:text-ink"
            >
              How it works
            </a>
            <Link
              href="/app"
              className="text-sm text-ink-secondary transition-colors hover:text-ink"
            >
              Sign in
            </Link>
          </nav>

          <Link href="/app" className="btn btn-primary">
            Open application
          </Link>
        </div>
      </header>

      <main>
        {/* ---------------------------------------------------------------- */}
        {/* Hero — editorial pacing, not a dashboard template                */}
        {/* ---------------------------------------------------------------- */}
        <section className="relative overflow-hidden border-b border-hairline">
          <div aria-hidden className="grid-field absolute inset-0 opacity-70" />
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-px bg-hairline"
          />

          <div className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32">
            <p className="eyebrow">Inventory &amp; business operations</p>

            <h1
              className="mt-6 max-w-3xl text-[2.75rem] leading-[1.08] font-normal tracking-[-0.03em] text-balance sm:text-[3.75rem]"
            >
              Know what you have, what it cost, and what happens next.
            </h1>

            <p className="mt-7 max-w-xl text-[1.0625rem] leading-relaxed text-ink-secondary">
              Innvntory brings products, stock, purchasing, sales, billing and
              reporting into one system — then makes it answerable in plain
              language, grounded in your own records.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link href="/app" className="btn btn-primary">
                Open the application
              </Link>
              <a href="#platform" className="btn btn-secondary">
                See what it covers
              </a>
            </div>

            <p className="mt-5 text-xs text-ink-faint">
              Built for Indian retail, wholesale, distribution and manufacturing
              operations.
            </p>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Module grid                                                      */}
        {/* ---------------------------------------------------------------- */}
        <section id="platform" className="border-b border-hairline bg-surface">
          <div className="mx-auto max-w-6xl px-6 py-24">
            <p className="eyebrow">The platform</p>
            <h2 className="mt-4 max-w-2xl text-[1.75rem] leading-tight font-normal tracking-[-0.02em]">
              One operating loop, not six disconnected tools.
            </h2>

            <div className="mt-14 grid gap-px overflow-hidden rounded-lg border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-3">
              {MODULES.map((m) => (
                <div key={m.title} className="bg-surface p-7">
                  <h3 className="text-[0.9375rem] font-medium tracking-tight">
                    {m.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink-secondary">
                    {m.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Principles                                                       */}
        {/* ---------------------------------------------------------------- */}
        <section id="principles" className="border-b border-hairline">
          <div className="mx-auto max-w-6xl px-6 py-24">
            <div className="grid gap-14 lg:grid-cols-[minmax(0,22rem)_1fr]">
              <div>
                <p className="eyebrow">How it works</p>
                <h2 className="mt-4 text-[1.75rem] leading-tight font-normal tracking-[-0.02em]">
                  Built so the record stays trustworthy.
                </h2>
                <p className="mt-5 text-sm leading-relaxed text-ink-secondary">
                  Inventory systems fail quietly. Innvntory is designed around the
                  assumption that they will, and puts the checks in the database
                  rather than in a promise.
                </p>
              </div>

              <dl className="space-y-px overflow-hidden rounded-lg border border-hairline bg-hairline">
                {PRINCIPLES.map((p) => (
                  <div key={p.title} className="bg-canvas p-6">
                    <dt className="text-[0.9375rem] font-medium tracking-tight">
                      {p.title}
                    </dt>
                    <dd className="mt-2 text-sm leading-relaxed text-ink-secondary">
                      {p.body}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* CTA                                                              */}
        {/* ---------------------------------------------------------------- */}
        <section className="relative overflow-hidden bg-canvas-soft">
          <div aria-hidden className="hairline-grid absolute inset-0 opacity-60" />
          <div className="relative mx-auto max-w-6xl px-6 py-28 text-center">
            <h2 className="mx-auto max-w-2xl text-[2rem] leading-tight font-normal tracking-[-0.025em]">
              See your operation clearly first.
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-[0.9375rem] leading-relaxed text-ink-secondary">
              The application shell is ready. Sign in to explore the dashboard,
              inventory workspace and command centre.
            </p>
            <Link href="/app" className="btn btn-primary mt-9">
              Open the application
            </Link>
          </div>
        </section>
      </main>

      {/* ------------------------------------------------------------------ */}
      {/* Footer                                                             */}
      {/* ------------------------------------------------------------------ */}
      <footer className="border-t border-hairline bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="flex flex-col justify-between gap-8 sm:flex-row">
            <div>
              <div className="flex items-center gap-2.5">
                <span
                  aria-hidden
                  className="grid h-6 w-6 place-items-center rounded-md bg-primary text-[0.5625rem] font-semibold text-on-primary"
                >
                  IN
                </span>
                <span className="text-sm font-medium tracking-tight">Innvntory</span>
              </div>
              <p className="mt-3 max-w-xs text-xs leading-relaxed text-ink-faint">
                Inventory and business operations platform. A product of Sahaya
                Technologies.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-12 gap-y-6 text-xs sm:grid-cols-3">
              <div>
                <p className="eyebrow">Product</p>
                <ul className="mt-3 space-y-2">
                  <li>
                    <Link href="/app/inventory" className="text-ink-secondary hover:text-ink">
                      Inventory
                    </Link>
                  </li>
                  <li>
                    <Link href="/app/products" className="text-ink-secondary hover:text-ink">
                      Products
                    </Link>
                  </li>
                  <li>
                    <Link href="/app/orders" className="text-ink-secondary hover:text-ink">
                      Orders
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <p className="eyebrow">Intelligence</p>
                <ul className="mt-3 space-y-2">
                  <li>
                    <Link href="/app/ai" className="text-ink-secondary hover:text-ink">
                      AI assistant
                    </Link>
                  </li>
                  <li>
                    <Link href="/app" className="text-ink-secondary hover:text-ink">
                      Dashboard
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <p className="eyebrow">Configure</p>
                <ul className="mt-3 space-y-2">
                  <li>
                    <Link href="/app/settings" className="text-ink-secondary hover:text-ink">
                      Settings
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <p className="mt-12 border-t border-hairline-soft pt-6 text-xs text-ink-faint">
            © 2026 Sahaya Technologies. Innvntory is a product of Sahaya
            Technologies Pvt. Ltd.
          </p>
        </div>
      </footer>
    </div>
  );
}