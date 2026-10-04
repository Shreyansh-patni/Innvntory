import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center py-16 px-4 text-center">
      <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-muted border border-border-subtle text-text-primary mb-6">
        <Compass className="h-7 w-7" />
      </div>

      <div className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface-muted px-3 py-0.5 text-xs font-mono text-text-secondary mb-4">
        Error 404
      </div>

      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-text-primary tracking-tight">
        Page not found
      </h1>

      <p className="mt-4 text-base text-text-secondary max-w-md mx-auto leading-relaxed">
        The requested URL could not be located in our routing directory. It may have moved or does not exist.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-text-primary px-5 py-2.5 text-sm font-medium text-background hover:bg-text-primary/90 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Homepage
        </Link>
        <Link
          href="/docs"
          className="inline-flex items-center justify-center rounded-md border border-border bg-surface px-5 py-2.5 text-sm font-medium text-text-primary hover:bg-surface-muted transition-colors"
        >
          Browse Documentation
        </Link>
      </div>
    </div>
  );
}
