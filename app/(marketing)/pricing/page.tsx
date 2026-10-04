import type { Metadata } from "next";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { pricingPlans } from "@/content/marketing/pricing";
import { FAQSection } from "@/components/marketing/faq-section";

export const metadata: Metadata = {
  title: "Innvntory Pricing — Transparent Plans for Growing Businesses",
  description:
    "Choose the right plan for your business. From single-warehouse Free tier to multi-facility Enterprise scale.",
};

export default function PricingPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface-muted px-3.5 py-1 text-xs font-medium text-text-secondary mb-4">
            Plans & Pricing
          </div>
          <h1 className="text-4xl font-heading font-bold text-text-primary tracking-tight sm:text-5xl">
            Predictable pricing that scales with your operations.
          </h1>
          <p className="mt-4 text-lg text-text-secondary">
            No hidden charges. Clear tier limits. All plans include continuous updates and enterprise data isolation.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pricingPlans.slice(0, 3).map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl border flex flex-col justify-between p-8 ${
                plan.highlighted
                  ? "border-text-primary bg-surface shadow-md ring-1 ring-text-primary"
                  : "border-border-subtle bg-surface"
              }`}
            >
              <div>
                {plan.badge && (
                  <span className="absolute -top-3 left-8 rounded-full bg-text-primary px-3 py-0.5 text-xs font-semibold text-background">
                    {plan.badge}
                  </span>
                )}
                <h3 className="text-xl font-heading font-bold text-text-primary">
                  {plan.name}
                </h3>
                <p className="text-xs text-text-secondary mt-1 min-h-[32px]">
                  {plan.description}
                </p>

                <div className="mt-6 border-y border-border-subtle py-4">
                  <div className="text-3xl font-heading font-bold text-text-primary">
                    {plan.priceMonthly}
                  </div>
                  <div className="text-xs text-text-muted mt-1">
                    {plan.billingPeriod}
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                    Plan Highlights
                  </div>
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2 text-sm text-text-secondary">
                      <Check className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-border-subtle">
                <Link
                  href={plan.ctaHref}
                  className={`flex w-full items-center justify-center gap-2 rounded-md py-2.5 text-sm font-medium transition-colors ${
                    plan.highlighted
                      ? "bg-text-primary text-background hover:bg-text-primary/90"
                      : "border border-border bg-surface text-text-primary hover:bg-surface-muted"
                  }`}
                >
                  {plan.ctaText}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Business & Enterprise Extended Tiers */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {pricingPlans.slice(3, 5).map((plan) => (
            <div
              key={plan.id}
              className="rounded-2xl border border-border-subtle bg-background-subtle/40 p-8 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-heading font-bold text-text-primary">
                    {plan.name}
                  </h3>
                  <span className="text-xs font-mono rounded bg-surface-muted px-2.5 py-1 text-text-secondary">
                    {plan.billingPeriod}
                  </span>
                </div>
                <p className="text-sm text-text-secondary mt-2">
                  {plan.description}
                </p>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2 text-xs text-text-secondary">
                      <Check className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-border-subtle flex items-center justify-between">
                <div>
                  <span className="text-xs text-text-muted">Pricing Status:</span>
                  <p className="text-sm font-semibold text-text-primary">{plan.priceMonthly}</p>
                </div>
                <Link
                  href={plan.ctaHref}
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary hover:bg-surface-muted transition-colors"
                >
                  {plan.ctaText}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-20">
        <FAQSection />
      </div>
    </div>
  );
}
