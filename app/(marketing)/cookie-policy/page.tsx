import type { Metadata } from "next";
import { AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Cookie Policy — Innvntory",
  description: "Cookie policy and local storage practices for Innvntory by Sahaya Technologies Pvt. Ltd.",
};

export default function CookiePolicyPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="border-b border-border-subtle pb-8 mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface-muted px-3 py-0.5 text-xs font-mono text-text-secondary mb-3">
            Legal & Compliance
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-text-primary">
            Cookie Policy
          </h1>
          <p className="mt-2 text-sm text-text-muted">
            Last Updated: October 2026 • Sahaya Technologies Pvt. Ltd.
          </p>
        </div>

        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 sm:p-5 flex items-start gap-3.5 mb-10 text-xs sm:text-sm text-text-secondary leading-relaxed">
          <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-text-primary">Provisional Document Notice: </span>
            This policy describes the operational cookies and session tokens utilized by Innvntory.
          </div>
        </div>

        <div className="space-y-8 text-sm sm:text-base text-text-secondary leading-relaxed font-sans">
          <section className="space-y-3">
            <h2 className="text-xl font-heading font-bold text-text-primary">
              1. Essential Cookies & Session Tokens
            </h2>
            <p>
              Innvntory uses strictly necessary cookies and browser storage tokens to authenticate users, protect against Cross-Site Request Forgery (CSRF), and maintain your active workspace session securely.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-heading font-bold text-text-primary">
              2. Preference & Theme State
            </h2>
            <p>
              Local storage is used to store user UI preferences, such as Light or Dark mode selections, collapsed sidebar state, and table column widths.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-heading font-bold text-text-primary">
              3. No Third-Party Tracking Pixels
            </h2>
            <p>
              We do not embed third-party advertising tracking cookies or data broker beacons inside authenticated application workflows.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
