import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { featureCategories } from "@/content/marketing/features";
import { CTASection } from "@/components/marketing/cta-section";

export const metadata: Metadata = {
  title: "Innvntory Features — Comprehensive Operations Platform",
  description:
    "Explore Innvntory's capabilities: multi-warehouse tracking, smart purchasing, sales orders, GST invoicing, analytics, and enterprise security.",
};

export default function FeaturesPage() {
  return (
    <div className="py-16 md:py-24">
      {/* Page Header */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface-muted px-3.5 py-1 text-xs font-medium text-text-secondary mb-4">
            Platform Capabilities
          </div>
          <h1 className="text-4xl font-heading font-bold text-text-primary tracking-tight sm:text-5xl">
            Everything required to run modern operations.
          </h1>
          <p className="mt-4 text-lg text-text-secondary">
            Built from first principles to eliminate inventory discrepancies, streamline vendor procurement, and accelerate order settlement.
          </p>
        </div>

        {/* Feature Categories */}
        <div className="mt-20 space-y-16">
          {featureCategories.map((category) => (
            <div
              key={category.id}
              id={category.id}
              className="rounded-2xl border border-border-subtle bg-surface p-8 sm:p-12 shadow-sm"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-subtle pb-6 mb-8">
                <div>
                  <h2 className="text-2xl font-heading font-bold text-text-primary">
                    {category.title}
                  </h2>
                  <p className="text-sm text-text-secondary mt-1">
                    {category.description}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center rounded-full border border-border-subtle bg-surface-muted px-3 py-1 text-xs font-mono text-text-secondary">
                    {category.status}
                  </span>
                </div>
              </div>

              {/* Feature Grid inside Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {category.features.map((feature) => (
                  <div
                    key={feature.name}
                    className="flex gap-3 rounded-lg border border-border-subtle/70 bg-background-subtle/30 p-5"
                  >
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-base font-heading font-semibold text-text-primary">
                        {feature.name}
                      </h3>
                      <p className="text-sm text-text-secondary mt-1 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-20">
        <CTASection />
      </div>
    </div>
  );
}
