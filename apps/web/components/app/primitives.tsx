/**
 * Shared UI primitives for the application surface.
 *
 * Presentational only. No business rules and no data access — those belong in the
 * backend business services (ADR 0004 Q4 layer table).
 *
 * Every primitive here carries the state set DESIGN-SYSTEM.md §13 requires.
 */

import type { ReactNode } from "react";

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

const TONE_CLASS: Record<KpiTone, string> = {
  neutral: "text-ink",
  positive: "text-positive",
  caution: "text-caution",
  critical: "text-critical",
};

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
      <p className="text-[0.6875rem] font-medium tracking-[0.02em] text-ink-muted">
        {label}
      </p>
      {unavailable ? (
        <>
          {/* Distinguishable without relying on colour alone. */}
          <p className="mt-3 text-[1.375rem] leading-none text-ink-faint">—</p>
          <p className="mt-2 text-[0.6875rem] text-ink-faint">
            Not connected yet
          </p>
        </>
      ) : (
        <>
          <p className={`tabular mt-3 text-[1.375rem] leading-none ${TONE_CLASS[tone]}`}>
            {value}
          </p>
          {detail ? (
            <p className="mt-2 text-[0.6875rem] text-ink-faint">{detail}</p>
          ) : null}
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
    <section className={`card overflow-hidden ${className ?? ""}`}>
      <div className="flex flex-col justify-between gap-3 border-b border-hairline px-5 py-4 sm:flex-row sm:items-center">
        <div className="min-w-0">
          <h2 className="text-sm font-medium tracking-tight">{title}</h2>
          {description ? (
            <p className="mt-1 text-xs text-ink-muted">{description}</p>
          ) : null}
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
  return (
    <div className="px-6 py-14 text-center">
      <p className="text-sm font-medium text-ink">{title}</p>
      <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-ink-muted">
        {body}
      </p>
      {primaryAction || secondaryAction ? (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {primaryAction ? (
            <button
              type="button"
              className="btn btn-primary"
              disabled={primaryAction.disabled}
              title={
                primaryAction.disabled
                  ? "Available once the application is connected"
                  : undefined
              }
            >
              {primaryAction.label}
            </button>
          ) : null}
          {secondaryAction ? (
            <button
              type="button"
              className="btn btn-secondary"
              disabled={secondaryAction.disabled}
              title={
                secondaryAction.disabled
                  ? "Available once the application is connected"
                  : undefined
              }
            >
              {secondaryAction.label}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Table primitives                                                             */
/* -------------------------------------------------------------------------- */

export function TableShell({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[44rem] border-collapse text-left text-sm">
        {children}
      </table>
    </div>
  );
}

export function Th({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <th
      scope="col"
      className={`border-b border-hairline px-5 py-3 text-[0.6875rem] font-semibold tracking-[0.02em] text-ink-muted ${className ?? ""}`}
    >
      {children}
    </th>
  );
}

export function Td({
  children,
  className,
  mono,
}: {
  children: ReactNode;
  className?: string;
  /** Use the monospace face — appropriate for SKUs, barcodes and references. */
  mono?: boolean;
}) {
  return (
    <td
      className={`border-b border-hairline-soft px-5 py-3.5 ${mono ? "mono text-xs" : ""} ${className ?? ""}`}
    >
      {children}
    </td>
  );
}

/* -------------------------------------------------------------------------- */
/* Status                                                                       */
/* -------------------------------------------------------------------------- */

export type StatusTone = "positive" | "caution" | "critical" | "neutral";

const STATUS_DOT: Record<StatusTone, string> = {
  positive: "bg-positive",
  caution: "bg-caution",
  critical: "bg-critical",
  neutral: "bg-ink-faint",
};

/** Status is never colour alone — a text label always accompanies the dot. */
export function StatusPill({ tone, label }: { tone: StatusTone; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-ink-secondary">
      <span aria-hidden className={`status-dot ${STATUS_DOT[tone]}`} />
      {label}
    </span>
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
      <input
        id="table-search"
        type="search"
        placeholder={placeholder}
        disabled
        className="w-full rounded-md border border-hairline bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-faint disabled:cursor-not-allowed disabled:bg-surface-muted"
      />
      <p className="sr-only">Search is disabled until the application is connected.</p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* AI activity stages — foundation only (DESIGN-SYSTEM.md §12)                    */
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
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.6875rem] ${
                state === "active"
                  ? "border-hairline-strong bg-surface font-medium text-ink"
                  : state === "done"
                    ? "border-transparent bg-accent-soft text-accent"
                    : "border-hairline bg-surface-muted text-ink-faint"
              }`}
            >
              <span
                aria-hidden
                className={`status-dot ${
                  state === "active"
                    ? "bg-ink"
                    : state === "done"
                      ? "bg-accent"
                      : "bg-ink-faint"
                }`}
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