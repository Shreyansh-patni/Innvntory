import Link from "next/link";

import { AuthForm } from "@/components/app/auth-form";

/**
 * Public auth screen. Uses the marketing surface's calmer density
 * (docs/DESIGN-SYSTEM.md §11) rather than the denser application shell.
 */
export default function LoginPage() {
  return (
    <div className="relative flex min-h-dvh flex-col bg-canvas">
      <div aria-hidden className="grid-field pointer-events-none absolute inset-0 opacity-60" />

      <header className="relative border-b border-hairline">
        <div className="mx-auto flex h-16 max-w-6xl items-center px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span
              aria-hidden
              className="grid h-7 w-7 place-items-center rounded-md bg-primary text-[0.6875rem] font-semibold text-on-primary"
            >
              IN
            </span>
            <span className="text-[0.9375rem] font-medium tracking-tight">Innvntory</span>
          </Link>
        </div>
      </header>

      <main className="relative flex flex-1 items-center justify-center px-6 py-16">
        <AuthForm mode="login" />
      </main>

      <footer className="relative border-t border-hairline">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <p className="text-xs text-ink-faint">
            © 2026 Sahaya Technologies.{" "}
            <Link href="/" className="underline underline-offset-4 hover:text-ink-secondary">
              Back to Innvntory
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}