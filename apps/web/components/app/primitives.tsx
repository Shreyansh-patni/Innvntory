import { Check, Circle } from "lucide-react";

import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table as ShadcnTable, TableCell, TableHead } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * Innvntory application primitives.
 *
 * These compose the shadcn/ui base components (installed as the Level 1 foundation
 * per `AGENTS.md` §4) with the Innvntory design tokens from `docs/DESIGN-SYSTEM.md`.
 * shadcn supplies accessible behaviour; these supply Innvntory's visual language and
 * the domain-shaped pieces (metric tiles, empty states, the AI stage track).
 *
 * Presentational only. No business rules and no data access — those belong in the
 * backend business services (ADR 0004 Q4 layer table).
 *
 * Every primitive here carries the state set DESIGN-SYSTEM.md §13 requires.
 */

import type { ReactNode } from "react";

export { Button, Input };

/* -------------------------------------------------------------------------- */
/* Page header                                                                  */
/* -------------------------------------------------------------------------- */

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="border-b border-hairline pb-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div className="min-w-0">
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h1 className="mt-2 text-[1.5rem] leading-tight font-normal tracking-[-0.02em]">
            {title}
          </h1>
          {description ? (
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-secondary">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
      </div>
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/* KPI card                                                                     */
/* -------------------------------------------------------------------------- */

export type KpiTone = "neutral" | "positive" | "caution" | "critical";

export function KpiCard({
  label,
  value,
  detail,
  tone = "neutral",
  unavailable = false,
}: {
  label: string;
  value: string;
  detail?: string;
  tone?: KpiTone;
  unavailable?: boolean;
}) {
  return (
    <div className="card p-5">
      <p className="text-[0.6875rem] font-medium tracking-[0.02em] text-ink-muted">{label}</p>
      {unavailable ? (
        <>
          <p className="mt-3 text-[1.375rem] leading-none text-ink-faint">—</p>
          <p className="mt-2 text-[0.6875rem] text-ink-faint">Not connected yet</p>
        </>
      ) : (
        <>
          <p
            className={cn(
              "tabular mt-3 text-[1.375rem] leading-none",
              tone === "positive" && "text-positive",
              tone === "caution" && "text-caution",
              tone === "critical" && "text-critical",
              tone === "neutral" && "text-ink",
            )}
          >
            {value}
          </p>
          {detail ? <p className="mt-2 text-[0.6875rem] text-ink-faint">{detail}</p> : null}
        </>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Section                                                                      */
/* -------------------------------------------------------------------------- */

export function Section({
  title,
  description,
  actions,
  children,
  className,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("card overflow-hidden", className)}>
      <div className="flex flex-col justify-between gap-3 border-b border-hairline px-5 py-4 sm:flex-row sm:items-center">
        <div className="min-w-0">
          <h2 className="text-sm font-medium tracking-tight">{title}</h2>
          {description ? <p className="mt-1 text-xs text-ink-muted">{description}</p> : null}
        </div>
        {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
      </div>
      {children}
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Empty state — must be USEFUL, never "No data." (specification §70)           */
/* -------------------------------------------------------------------------- */

export function EmptyState({
  title,
  body,
  primaryAction,
  secondaryAction,
}: {
  title: string;
  body: string;
  primaryAction?: { label: string; disabled?: boolean };
  secondaryAction?: { label: string; disabled?: boolean };
}) {
  const deferred = "Available once the application is connected";
  return (
    <div className="px-6 py-14 text-center">
      <p className="text-sm font-medium text-ink">{title}</p>
      <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-ink-muted">{body}</p>
      {primaryAction || secondaryAction ? (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {primaryAction ? (
            <Button disabled={primaryAction.disabled} title={primaryAction.disabled ? deferred : undefined}>
              {primaryAction.label}
            </Button>
          ) : null}
          {secondaryAction ? (
            <Button
              variant="secondary"
              disabled={secondaryAction.disabled}
              title={secondaryAction.disabled ? deferred : undefined}
            >
              {secondaryAction.label}
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Table primitives — shadcn Table with Innvntory density                       */
/* -------------------------------------------------------------------------- */

export function TableShell({ children }: { children: ReactNode }) {
  return <ShadcnTable className="min-w-[44rem]">{children}</ShadcnTable>;
}

export function Th({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <TableHead scope="col" className={className}>
      {children}
    </TableHead>
  );
}

export function Td({
  children,
  className,
  mono,
}: {
  children: ReactNode;
  className?: string;
  /** Monospace face — appropriate for SKUs, barcodes and references. */
  mono?: boolean;
}) {
  return <TableCell className={cn(mono && "mono text-xs", className)}>{children}</TableCell>;
}

/* -------------------------------------------------------------------------- */
/* Status — never colour alone; the label is always present (spec §72)          */
/* -------------------------------------------------------------------------- */

export type StatusTone = "positive" | "caution" | "critical" | "neutral";

const STATUS_ICON: Record<StatusTone, "check" | "dot"> = {
  positive: "check",
  neutral: "dot",
  caution: "dot",
  critical: "dot",
};

export function StatusPill({ tone, label }: { tone: StatusTone; label: string }) {
  const variant: BadgeProps["variant"] =
    tone === "positive"
      ? "positive"
      : tone === "caution"
        ? "caution"
        : tone === "critical"
          ? "critical"
          : "neutral";

  return (
    <Badge variant={variant}>
      {STATUS_ICON[tone] === "check" ? (
        <Check aria-hidden />
      ) : (
        <Circle aria-hidden className="size-1.5 fill-current" />
      )}
      {label}
    </Badge>
  );
}

/* -------------------------------------------------------------------------- */
/* Toolbar                                                                      */
/* -------------------------------------------------------------------------- */

export function Toolbar({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 border-b border-hairline px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
      {children}
    </div>
  );
}

export function SearchField({ placeholder }: { placeholder: string }) {
  return (
    <div className="relative w-full sm:max-w-xs">
      <label htmlFor="table-search" className="sr-only">
        {placeholder}
      </label>
      <Input
        id="table-search"
        type="search"
        placeholder={placeholder}
        disabled
        className="disabled:cursor-not-allowed"
      />
      <p className="sr-only">Search is disabled until the application is connected.</p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* AI activity stages — foundation only (DESIGN-SYSTEM.md §12)                   */
/* -------------------------------------------------------------------------- */

export const AI_STAGES = [
  { id: "understanding", label: "Understanding" },
  { id: "reading", label: "Reading data" },
  { id: "analyzing", label: "Analyzing" },
  { id: "calculating", label: "Calculating" },
  { id: "recommending", label: "Recommending" },
  { id: "ready", label: "Ready" },
] as const;

export type AiStageId = (typeof AI_STAGES)[number]["id"];

export function AiStageTrack({ active }: { active: AiStageId }) {
  const activeIndex = AI_STAGES.findIndex((s) => s.id === active);
  return (
    <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-2">
      {AI_STAGES.map((stage, index) => {
        const state =
          index < activeIndex ? "done" : index === activeIndex ? "active" : "pending";
        return (
          <li key={stage.id} className="flex items-center gap-1.5">
            <span
              aria-current={state === "active" ? "step" : undefined}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.6875rem]",
                state === "active"
                  ? "border-hairline-strong bg-surface font-medium text-ink"
                  : state === "done"
                    ? "border-transparent bg-accent-soft text-accent"
                    : "border-hairline bg-surface-muted text-ink-faint",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "status-dot",
                  state === "active" ? "bg-ink" : state === "done" ? "bg-accent" : "bg-ink-faint",
                )}
              />
              {stage.label}
              {state === "done" ? <span className="sr-only">(completed)</span> : null}
              {state === "active" ? <span className="sr-only">(current step)</span> : null}
            </span>
          </li>
        );
      })}
    </ol>
  );
}