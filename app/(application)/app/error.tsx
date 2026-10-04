"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function ApplicationError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log non-sensitive error metadata in development
    console.error("Application shell error boundary:", error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center p-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 mb-4">
        <AlertTriangle className="h-6 w-6" />
      </div>

      <h2 className="text-xl font-heading font-bold text-text-primary mb-2">
        Operational View Error
      </h2>

      <p className="text-xs text-text-secondary max-w-md mb-6 leading-relaxed">
        An error occurred while rendering this application component. Your organization data and database integrity remain completely safe.
      </p>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-md bg-text-primary px-4 py-2 text-xs font-medium text-background hover:bg-text-primary/90 transition-colors cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Retry View
        </button>
        <Link
          href="/app/dashboard"
          className="inline-flex items-center rounded-md border border-border bg-surface px-4 py-2 text-xs font-medium text-text-primary hover:bg-surface-muted transition-colors"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
