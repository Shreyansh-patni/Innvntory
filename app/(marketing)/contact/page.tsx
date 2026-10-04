import type { Metadata } from "next";
import { Mail, MapPin, Building2, Clock, Send } from "lucide-react";
import { FAQSection } from "@/components/marketing/faq-section";

export const metadata: Metadata = {
  title: "Contact Innvntory — Get in Touch with Solutions Engineering",
  description:
    "Connect with the Innvntory team at Sahaya Technologies Pvt. Ltd. for enterprise inquiries, demos, or support.",
};

export default function ContactPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface-muted px-3.5 py-1 text-xs font-medium text-text-secondary mb-4">
            Contact & Solutions
          </div>
          <h1 className="text-4xl font-heading font-bold text-text-primary tracking-tight sm:text-5xl">
            Let&apos;s talk about your operations.
          </h1>
          <p className="mt-4 text-lg text-text-secondary">
            Whether you are evaluating multi-facility migration or need a customized enterprise rollout, we are ready to assist.
          </p>
        </div>

        {/* 2-Column Contact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
          {/* Left: Contact Info */}
          <div className="lg:col-span-5 space-y-8">
            <div className="rounded-2xl border border-border-subtle bg-surface p-8">
              <h2 className="text-xl font-heading font-bold text-text-primary mb-6">
                Sahaya Technologies Pvt. Ltd.
              </h2>

              <div className="space-y-6 text-sm text-text-secondary">
                <div className="flex items-start gap-3.5">
                  <Building2 className="h-5 w-5 text-text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-text-primary">Corporate Headquarters</div>
                    <div className="text-text-muted mt-0.5">India</div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Mail className="h-5 w-5 text-text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-text-primary">Email Support & Sales</div>
                    <div className="text-text-muted mt-0.5">support@innvntory.com</div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Clock className="h-5 w-5 text-text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-text-primary">Support Hours</div>
                    <div className="text-text-muted mt-0.5">Monday – Friday, 9:00 AM – 6:00 PM IST</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border-subtle bg-background-subtle/50 p-6 text-xs text-text-muted leading-relaxed">
              <p>
                Inquiries are triaged by our technical solutions team. Typical response turnaround is under 24 business hours.
              </p>
            </div>
          </div>

          {/* Right: Contact Form Visual Structure */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-border-subtle bg-surface p-8 sm:p-10 shadow-sm">
              <h2 className="text-2xl font-heading font-bold text-text-primary mb-2">
                Send a Message
              </h2>
              <p className="text-xs text-text-secondary mb-8">
                Fill in your company details below and a solution specialist will reach out.
              </p>

              <form className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-text-primary mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Sharma"
                      className="w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-text-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-primary mb-2">
                      Work Email
                    </label>
                    <input
                      type="email"
                      placeholder="ramesh@company.com"
                      className="w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-text-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-text-primary mb-2">
                      Organization Name
                    </label>
                    <input
                      type="text"
                      placeholder="Company Pvt. Ltd."
                      className="w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-text-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-primary mb-2">
                      Warehouse Count
                    </label>
                    <select className="w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-text-primary">
                      <option>1 Facility</option>
                      <option>2 – 5 Facilities</option>
                      <option>6 – 20 Facilities</option>
                      <option>20+ Facilities (Enterprise)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-2">
                    How can we help?
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us about your current inventory workflow or integration requirements..."
                    className="w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-text-primary"
                  />
                </div>

                <button
                  type="button"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md bg-text-primary px-6 py-3 text-sm font-medium text-background hover:bg-text-primary/90 transition-colors"
                >
                  <Send className="h-4 w-4" />
                  Submit Inquiry
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-20">
        <FAQSection />
      </div>
    </div>
  );
}
