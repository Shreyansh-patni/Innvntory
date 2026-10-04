import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * shadcn/ui Input — adapted to the Innvntory design system.
 *
 * Labels are never placeholders: DESIGN-SYSTEM.md §13 and specification §72
 * require a real associated label. Placeholder text is supplementary only.
 */
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-hairline bg-surface px-3 py-2 text-sm text-ink",
        "placeholder:text-ink-faint",
        "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ink",
        "disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-ink-disabled",
        "aria-[invalid=true]:border-critical",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

/** Accessible label + optional hint/error wrapper. */
function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const hintId = hint ? `${htmlFor}-hint` : undefined;
  const errorId = error ? `${htmlFor}-error` : undefined;

  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {hint ? (
        <p id={hintId} className="text-xs text-ink-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} role="alert" className="text-xs text-critical">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export { Field, Input };