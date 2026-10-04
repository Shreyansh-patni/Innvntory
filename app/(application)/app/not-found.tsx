import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

export default function ApplicationNotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center p-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-muted border border-border-subtle text-text-muted mb-4">
        <Compass className="h-6 w-6" />
      </div>

      <div className="inline-flex items-center rounded-full border border-border-subtle bg-surface-muted px-2.5 py-0.5 text-xs font-mono text-text-muted mb-3">
        404
      </div>

      <h2 className="text-xl font-heading font-bold text-text-primary mb-2">
        Application Module Not Found
      </h2>

      <p className="text-xs text-text-secondary max-w-md mb-6 leading-relaxed">
        The requested application module does not exist in this workspace or requires higher administrative permissions.
      </p>

      <Link
        href="/app/dashboard"
        className="inline-flex items-center gap-2 rounded-md bg-text-primary px-4 py-2 text-xs font-medium text-background hover:bg-text-primary/90 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Return to Dashboard
      </Link>
    </div>
  );
}
