import type { Metadata } from "next";
import { ShieldCheck, Target } from "lucide-react";
import { CTASection } from "@/components/marketing/cta-section";

export const metadata: Metadata = {
  title: "About Innvntory — Sahaya Technologies Pvt. Ltd.",
  description:
    "Learn about Innvntory's mission to make complex business operations feel simple through modern software engineering.",
};

export default function AboutPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface-muted px-3.5 py-1 text-xs font-medium text-text-secondary mb-4">
            About Sahaya Technologies
          </div>
          <h1 className="text-4xl font-heading font-bold text-text-primary tracking-tight sm:text-5xl">
            Building the operating system for modern business operations.
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-text-secondary leading-relaxed">
            Innvntory is engineered by Sahaya Technologies Pvt. Ltd. to bridge the gap between fragile spreadsheets and bloated legacy ERPs.
          </p>
        </div>

        {/* Mission / Philosophy Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20 max-w-5xl mx-auto">
          <div className="rounded-2xl border border-border-subtle bg-surface p-8 sm:p-10">
            <div className="h-10 w-10 rounded-lg bg-surface-muted flex items-center justify-center text-text-primary mb-6">
              <Target className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-heading font-bold text-text-primary mb-3">
              The Mission
            </h2>
            <p className="text-base text-text-secondary leading-relaxed">
              To make inventory and everyday business operations simple, reliable, and accessible from anywhere.
              We believe business software should be as fast, responsive, and delightful as modern consumer software, without sacrificing data integrity.
            </p>
          </div>

          <div className="rounded-2xl border border-border-subtle bg-surface p-8 sm:p-10">
            <div className="h-10 w-10 rounded-lg bg-surface-muted flex items-center justify-center text-text-primary mb-6">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-heading font-bold text-text-primary mb-3">
              Data Integrity First
            </h2>
            <p className="text-base text-text-secondary leading-relaxed">
              In business operations, partial states create chaos. Our architecture guarantees strict relational constraints,
              immutable audit logging, and zero ghost stock drift across multi-warehouse networks.
            </p>
          </div>
        </div>

        {/* Long Term Positioning */}
        <div className="rounded-2xl border border-border-subtle bg-background-subtle/60 p-8 sm:p-12 max-w-5xl mx-auto mb-20">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4">
            Product Evolution
          </h2>
          <h3 className="text-2xl font-heading font-bold text-text-primary mb-6">
            Our Long-Term Architecture Horizon
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-xl border border-border-subtle bg-surface p-5">
              <div className="text-xs font-mono text-text-muted mb-1">Phase 1</div>
              <div className="text-base font-bold text-text-primary mb-2">Inventory System</div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Multi-facility tracking, batch control, and zero-compromise stock integrity.
              </p>
            </div>
            <div className="rounded-xl border border-border-subtle bg-surface p-5">
              <div className="text-xs font-mono text-text-muted mb-1">Phase 2</div>
              <div className="text-base font-bold text-text-primary mb-2">Business Operations</div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Integrated purchasing, 3-way match, sales fulfillment, and GST invoicing.
              </p>
            </div>
            <div className="rounded-xl border border-border-subtle bg-surface p-5">
              <div className="text-xs font-mono text-text-muted mb-1">Phase 3</div>
              <div className="text-base font-bold text-text-primary mb-2">Business Intelligence</div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Automated stock velocity, turnover metrics, and gross margin analytics.
              </p>
            </div>
            <div className="rounded-xl border border-border-subtle bg-surface p-5">
              <div className="text-xs font-mono text-text-muted mb-1">Phase 4</div>
              <div className="text-base font-bold text-text-primary mb-2">AI-Powered OS</div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Predictive replenishment algorithms and intelligent warehouse routing.
              </p>
            </div>
          </div>
        </div>
      </div>

      <CTASection />
    </div>
  );
}
