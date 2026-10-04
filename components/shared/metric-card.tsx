import { type LucideIcon, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: LucideIcon;
  statusBadge?: string;
  trend?: {
    direction: "up" | "down" | "neutral";
    value: string;
    label?: string;
  };
  className?: string;
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  statusBadge,
  trend,
  className,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-xl border border-border-subtle bg-surface p-5 transition-colors hover:border-border",
        className
      )}
    >
      <div className="flex items-center justify-between text-xs text-text-muted mb-2.5">
        <span className="font-semibold uppercase tracking-wider text-[11px]">
          {title}
        </span>
        {Icon && <Icon className="h-4 w-4 text-text-muted" />}
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <div className="text-2xl font-bold font-heading text-text-primary tracking-tight">
          {value}
        </div>
        {statusBadge && (
          <span className="inline-flex items-center rounded bg-surface-muted px-2 py-0.5 text-[11px] font-mono font-medium text-text-secondary border border-border-subtle/60">
            {statusBadge}
          </span>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-2.5 flex items-center gap-2 text-xs text-text-secondary">
          {trend && (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 font-medium",
                trend.direction === "up" && "text-emerald-600",
                trend.direction === "down" && "text-amber-600",
                trend.direction === "neutral" && "text-text-muted"
              )}
            >
              {trend.direction === "up" && <ArrowUpRight className="h-3 w-3" />}
              {trend.direction === "down" && <ArrowDownRight className="h-3 w-3" />}
              {trend.direction === "neutral" && <Minus className="h-3 w-3" />}
              {trend.value}
            </span>
          )}
          {subtitle && (
            <span className="text-text-muted truncate">{subtitle}</span>
          )}
        </div>
      )}
    </div>
  );
}
