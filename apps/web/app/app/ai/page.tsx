import type { Metadata } from "next";

import {
  AiStageTrack,
  EmptyState,
  PageHeader,
  Section,
  StatusPill,
} from "@/components/app/primitives";

export const metadata: Metadata = { title: "AI" };

/**
 * AI surface foundation.
 *
 * NOT a chatbot. Nothing here answers questions or invents business figures.
 * This establishes the interaction model the product will use, and states plainly
 * what is not yet true:
 *
 *   - The assistant reads and analyses data through authorized backend business
 *     services (ADR 0001 D3, `AGENTS.md` §6).
 *   - It holds no separate copy of your numbers. Figures come from the
 *     transactional system, never from a model (specification §28).
 *   - It takes no consequential action without explicit confirmation.
 *
 * AI capability is Phase 7 (docs/ROADMAP.md). No model, provider or prompt exists.
 */
export default function AiPage() {
  return (
    <>
      <PageHeader
        eyebrow="Intelligence"
        title="AI assistant"
        description="Ask about your operation in plain language. Answers come from your own records, and every consequential action is confirmed before it runs."
        actions={
          <button type="button" className="btn btn-secondary" disabled>
            Conversation history
          </button>
        }
      />

      {/* ---------------------------------------------------------------- */}
      {/* Composer's structural state                                       */}
      {/* ---------------------------------------------------------------- */}
      <div className="mt-7">
        <Section
          title="Ask Innvntory"
          description="Available once your data is connected and the assistant is enabled."
        >
          <div className="px-5 py-5">
            <label htmlFor="ai-prompt" className="sr-only">
              Ask a question about your business
            </label>
            <textarea
              id="ai-prompt"
              rows={3}
              disabled
              placeholder="Which products are likely to run out this month?"
              className="w-full resize-none rounded-md border border-hairline bg-surface-muted px-4 py-3 text-sm text-ink placeholder:text-ink-faint disabled:cursor-not-allowed"
            />

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-ink-faint">
                The assistant can read your data and propose actions. It cannot act
                on payments, invoices or stock changes without your confirmation.
              </p>
              <button type="button" className="btn btn-primary" disabled>
                Ask
              </button>
            </div>
          </div>
        </Section>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Stage model — DESIGN-SYSTEM.md §12                               */}
      {/* ---------------------------------------------------------------- */}
      <div className="mt-5">
        <Section
          title="How a request is handled"
          description="Each stage is visible. You can always see what the assistant is doing and on what basis."
        >
          <div className="space-y-6 px-5 py-5">
            <AiStageTrack active="ready" />

            <dl className="grid gap-5 sm:grid-cols-2">
              {[
                {
                  term: "Understanding",
                  detail:
                    "Your question is interpreted against your organization's actual data — the items, customers and periods you have.",
                },
                {
                  term: "Reading data",
                  detail:
                    "Business records are read through authorized services, scoped to your organization only.",
                },
                {
                  term: "Analyzing",
                  detail:
                    "Patterns are examined: movement, velocity, ageing, and how current figures compare with your own history.",
                },
                {
                  term: "Calculating",
                  detail:
                    "Figures are computed by the transactional system, not by a model. Totals are never estimated.",
                },
                {
                  term: "Recommending",
                  detail:
                    "Suggestions reference the records they came from, so you can check the reasoning.",
                },
                {
                  term: "Ready",
                  detail:
                    "The answer is presented with its basis, or with an honest statement that the data cannot support it.",
                },
              ].map((s) => (
                <div key={s.term}>
                  <dt className="text-sm font-medium tracking-tight">{s.term}</dt>
                  <dd className="mt-1.5 text-xs leading-relaxed text-ink-secondary">
                    {s.detail}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Section>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Suggested questions — structure, not answers                       */}
      {/* ---------------------------------------------------------------- */}
      <div className="mt-5">
        <Section
          title="Questions this assistant is designed for"
          description="From specification §28."
        >
          <ul className="divide-y divide-hairline-soft">
            {[
              "Which products are likely to run out this month?",
              "What should I reorder?",
              "Which products have not sold in 90 days?",
              "How much did we sell last month?",
              "Which location generated the most revenue?",
            ].map((q) => (
              <li key={q} className="flex items-center justify-between gap-4 px-5 py-3.5">
                <span className="text-sm text-ink-secondary">{q}</span>
                <button type="button" className="btn btn-ghost shrink-0" disabled>
                  Ask
                </button>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Honest status                                                     */}
      {/* ---------------------------------------------------------------- */}
      <div className="mt-5">
        <Section title="Assistant status" description="Stated plainly.">
          <ul className="divide-y divide-hairline-soft">
            {[
              { label: "Assistant interface", ok: true, note: "This foundation" },
              { label: "Connected business data", ok: false, note: "No database configured" },
              { label: "Business service tools", ok: false, note: "Defined in ADR 0001; not built" },
              { label: "Model provider", ok: false, note: "Not selected" },
            ].map((row) => (
              <li key={row.label} className="flex items-center justify-between gap-4 px-5 py-3.5">
                <StatusPill tone={row.ok ? "positive" : "neutral"} label={row.label} />
                <span className="text-xs text-ink-faint">{row.note}</span>
              </li>
            ))}
          </ul>

          <EmptyState
            title="The assistant is not answering yet"
            body="This is the interaction foundation only. No model is connected, so no question will be answered and no figure invented. The assistant arrives in Phase 7, once the transactional system is reliable."
          />
        </Section>
      </div>
    </>
  );
}