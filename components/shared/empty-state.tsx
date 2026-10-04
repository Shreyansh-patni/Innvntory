import Link from "next/link";
import { type LucideIcon, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  compact?: boolean;
  className?: string;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  compact = false,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center rounded-xl border border-dashed border-border-subtle bg-surface/50",
        compact ? "py-8 px-4" : "py-12 px-6 sm:py-16",
        className
      )}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-muted text-text-muted mb-3.5 border border-border-subtle">
        <Icon className="h-5 w-5" />
      </div>

      <h3 className="text-sm font-heading font-semibold text-text-primary mb-1">
        {title}
      </h3>

      <p className="text-xs text-text-secondary max-w-sm leading-relaxed mb-5">
        {description}
      </p>

      {action && (
        action.href ? (
          <Link
            href={action.href}
            className="inline-flex items-center justify-center rounded-md bg-text-primary px-4 py-2 text-xs font-medium text-background hover:bg-text-primary/90 transition-colors"
          >
            {action.label}
          </Link>
        ) : (
          <button
            type="button"
            onClick={action.onClick}
            className="inline-flex items-center justify-center rounded-md bg-text-primary px-4 py-2 text-xs font-medium text-background hover:bg-text-primary/90 transition-colors cursor-pointer"
          >
            {action.label}
          </button>
        )
      )}
    </div>
  );
}
