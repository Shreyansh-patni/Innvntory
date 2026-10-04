import { cn } from "@/lib/utils";

export type StatusType =
  | "reconciled"
  | "in-transit"
  | "low-stock"
  | "draft"
  | "pending"
  | "completed"
  | "cancelled"
  | "awaiting-data"
  | "active"
  | "inactive"
  | "archived"
  | "scheduled";

interface StatusBadgeProps {
  status: StatusType | string;
  label?: string;
  className?: string;
}

const statusConfig: Record<string, { label: string; dotClass: string; containerClass: string }> = {
  reconciled: {
    label: "Reconciled",
    dotClass: "bg-emerald-500",
    containerClass: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  },
  completed: {
    label: "Completed",
    dotClass: "bg-emerald-500",
    containerClass: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  },
  active: {
    label: "Active",
    dotClass: "bg-emerald-500",
    containerClass: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  },
  inactive: {
    label: "Inactive",
    dotClass: "bg-amber-500",
    containerClass: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
  },
  archived: {
    label: "Archived",
    dotClass: "bg-neutral-500",
    containerClass: "bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 border-neutral-500/20",
  },
  "in-transit": {
    label: "In Transit",
    dotClass: "bg-sky-500",
    containerClass: "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20",
  },
  pending: {
    label: "Pending Review",
    dotClass: "bg-amber-500",
    containerClass: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
  },
  "low-stock": {
    label: "Low Stock",
    dotClass: "bg-amber-500",
    containerClass: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
  },
  draft: {
    label: "Draft",
    dotClass: "bg-text-muted",
    containerClass: "bg-surface-muted text-text-secondary border-border-subtle",
  },
  scheduled: {
    label: "Scheduled",
    dotClass: "bg-indigo-500",
    containerClass: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20",
  },
  cancelled: {
    label: "Cancelled",
    dotClass: "bg-red-500",
    containerClass: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
  },
  "awaiting-data": {
    label: "Awaiting Data",
    dotClass: "bg-text-muted",
    containerClass: "bg-surface-muted text-text-muted border-border-subtle",
  },
};

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig["awaiting-data"];
  const displayLabel = label || config.label;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-mono font-medium",
        config.containerClass,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dotClass)} />
      <span>{displayLabel}</span>
    </span>
  );
}
