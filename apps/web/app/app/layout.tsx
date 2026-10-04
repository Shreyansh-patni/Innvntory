import { Sidebar } from "@/components/app/sidebar";
import { CommandMenu } from "@/components/command/command-menu";
import { Button } from "@/components/ui/button";
import { ALL_NAV_ITEMS, APP_NAV } from "@/lib/nav";

/**
 * Authenticated application shell.
 *
 * Note on auth: authentication is NOT yet architecturally specified
 * (docs/ARCHITECTURE.md §15 row 4). This shell renders without a session because
 * no data is fetched here — every surface shows an honest empty state. It is
 * structurally correct but not an authorization boundary, and it must not be
 * treated as one until the auth decision lands.
 */
export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Placeholder until the auth provider is chosen. Real implementation reads the
  // active path and derives this from the session on the server.
  const activeHref = "/app";

  return (
    <div className="flex min-h-dvh bg-canvas">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:border focus:border-hairline-strong focus:bg-surface focus:px-3 focus:py-2 focus:text-sm"
      >
        Skip to main content
      </a>

      <aside className="hidden w-60 shrink-0 border-r border-hairline bg-surface lg:block">
        <Sidebar groups={APP_NAV} activeHref={activeHref} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center gap-4 border-b border-hairline bg-surface px-4 sm:px-6">
          <div className="w-full max-w-sm">
            <CommandMenu items={ALL_NAV_ITEMS} />
          </div>

          <div className="ml-auto flex items-center gap-3">
            <span className="hidden items-center gap-2 text-xs text-ink-muted sm:inline-flex">
              <span aria-hidden className="status-dot bg-caution" />
              Not signed in
            </span>
            <Button variant="secondary" disabled title="Available once a session provider is configured">
              Sign in
            </Button>
          </div>
        </header>

        <main id="main-content" className="flex-1 px-4 py-7 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>

        <footer className="border-t border-hairline bg-surface px-4 py-4 sm:px-6">
          <p className="mx-auto max-w-6xl text-xs text-ink-faint">
            Innvntory · Sahaya Technologies · Shell foundation — no business data is
            connected yet.
          </p>
        </footer>
      </div>
    </div>
  );
}