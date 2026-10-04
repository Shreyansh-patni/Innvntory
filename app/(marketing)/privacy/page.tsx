import type { Metadata } from "next";
import { AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy — Innvntory",
  description: "Privacy policy and data protection principles of Innvntory by Sahaya Technologies Pvt. Ltd.",
};

export default function PrivacyPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="border-b border-border-subtle pb-8 mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface-muted px-3 py-0.5 text-xs font-mono text-text-secondary mb-3">
            Legal & Compliance
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-text-primary">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-text-muted">
            Last Updated: October 2026 • Sahaya Technologies Pvt. Ltd.
          </p>
        </div>

        {/* Draft Notice Alert */}
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 sm:p-5 flex items-start gap-3.5 mb-10 text-xs sm:text-sm text-text-secondary leading-relaxed">
          <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-text-primary">Provisional Document Notice: </span>
            This document outlines the privacy and data governance framework for Innvntory. Formal legally binding clauses are subject to ongoing regulatory counsel review.
          </div>
        </div>

        {/* Content sections */}
        <div className="space-y-8 text-sm sm:text-base text-text-secondary leading-relaxed font-sans">
          <section className="space-y-3">
            <h2 className="text-xl font-heading font-bold text-text-primary">
              1. Information We Collect
            </h2>
            <p>
              Innvntory collects information necessary to provision and maintain your organization&apos;s business workspace, including account credentials (name, email, organization name), workspace configurations, inventory transaction records, and technical telemetry required for system stability.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-heading font-bold text-text-primary">
              2. Data Isolation & Tenant Confidentiality
            </h2>
            <p>
              Your business data (catalogs, stock quantities, vendor pricing, customer ledgers, and invoices) is strictly isolated using database-level multi-tenancy. We do not sell, rent, or cross-train models on proprietary customer business data.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-heading font-bold text-text-primary">
              3. Data Security & Storage
            </h2>
            <p>
              All data in transit is encrypted using modern TLS protocols, and sensitive data at rest is protected with industry-standard encryption. Access to production environments is governed by strict least-privilege policies.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-heading font-bold text-text-primary">
              4. Contact for Privacy Inquiries
            </h2>
            <p>
              For privacy-related inquiries, data export requests, or governance questions, please contact our data protection team at <span className="font-mono text-text-primary">privacy@innvntory.com</span>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
