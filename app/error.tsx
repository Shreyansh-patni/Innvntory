"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-4">
      <h2 className="text-xl font-heading font-semibold text-text-primary">
        Something went wrong
      </h2>
      <p className="text-sm font-secondary text-text-muted">
        An unexpected error occurred. Please try again.
      </p>
      <button
        onClick={reset}
        className="rounded-md bg-text-primary px-4 py-2 text-sm font-secondary font-medium text-background hover:opacity-90 transition-opacity"
      >
        Try again
      </button>
    </div>
  );
}
