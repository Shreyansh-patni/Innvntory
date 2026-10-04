"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { landingFaqs, type FAQItem } from "@/content/marketing/faq";

export function FAQSection({ items = landingFaqs }: { items?: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 border-t border-border-subtle bg-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-3xl font-heading font-bold text-text-primary tracking-tight sm:text-4xl">
            Everything you need to know.
          </p>
          <p className="mt-4 text-base text-text-secondary">
            Have questions about implementation, migration, or multi-warehouse capabilities?
          </p>
        </div>

        <div className="space-y-4">
          {items.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className="rounded-xl border border-border-subtle bg-surface overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggle(index)}
                  className="flex w-full items-center justify-between p-5 sm:p-6 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-heading font-semibold text-text-primary">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 flex-shrink-0 text-text-muted transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-text-primary" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-sm text-text-secondary leading-relaxed border-t border-border-subtle/50 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
