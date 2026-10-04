import type { Metadata } from "next";
import { AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms & Conditions — Innvntory",
  description: "Terms of service and subscription agreement for Innvntory by Sahaya Technologies Pvt. Ltd.",
};

export default function TermsPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="border-b border-border-subtle pb-8 mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface-muted px-3 py-0.5 text-xs font-mono text-text-secondary mb-3">
            Legal & Compliance
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-text-primary">
            Terms & Conditions
          </h1>
          <p className="mt-2 text-sm text-text-muted">
            Last Updated: October 2026 • Sahaya Technologies Pvt. Ltd.
          </p>
        </div>

        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 sm:p-5 flex items-start gap-3.5 mb-10 text-xs sm:text-sm text-text-secondary leading-relaxed">
          <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-text-primary">Provisional Document Notice: </span>
            These Terms & Conditions represent the standard operating principles for Innvntory SaaS services. Formal legal terms are pending final legal review.
          </div>
        </div>

        <div className="space-y-8 text-sm sm:text-base text-text-secondary leading-relaxed font-sans">
          <section className="space-y-3">
            <h2 className="text-xl font-heading font-bold text-text-primary">
              1. Service Provision & Account Responsibilities
            </h2>
            <p>
              By accessing Innvntory, your organization agrees to provide accurate entity information, maintain the security of workspace credentials, and comply with all applicable local trade and tax regulations.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-heading font-bold text-text-primary">
              2. Subscription, Billing & Tier Limits
            </h2>
            <p>
              Usage of the platform is subject to the boundaries of your selected subscription tier (number of warehouses, team seats, monthly invoice volume, and SKU limits). Upgrades and plan adjustments take effect immediately.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-heading font-bold text-text-primary">
              3. System Availability & Service Levels
            </h2>
            <p>
              Sahaya Technologies strives to maintain high availability across all production infrastructure. Scheduled maintenance windows will be communicated in advance via platform notices.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
