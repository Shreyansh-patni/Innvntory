import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Terminal, Sparkles } from "lucide-react";
import { docCategories } from "@/content/marketing/docs";

export const metadata: Metadata = {
  title: "Innvntory Documentation — Guides, Reference, and Tutorials",
  description:
    "Learn how to configure your workspace, manage multi-warehouse stock, automate purchasing, and integrate using our REST APIs.",
};

export default function DocsPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface-muted px-3.5 py-1 text-xs font-medium text-text-secondary mb-4">
            Documentation Hub
          </div>
          <h1 className="text-4xl font-heading font-bold text-text-primary tracking-tight sm:text-5xl">
            Innvntory Documentation
          </h1>
          <p className="mt-4 text-lg text-text-secondary">
            Comprehensive guides and developer references for operating high-velocity inventory workflows.
          </p>
        </div>

        {/* Quickstart Callout */}
        <div className="mt-12 rounded-2xl border border-border-subtle bg-surface p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-muted text-text-primary flex-shrink-0">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-heading font-bold text-text-primary">
                Quick Start: 5-Minute Workspace Setup
              </h2>
              <p className="text-sm text-text-secondary mt-1">
                Step-by-step guide to provisioning your first warehouse facility and uploading initial catalog items.
              </p>
            </div>
          </div>
          <Link
            href="/docs/getting-started"
            className="inline-flex items-center gap-2 rounded-md bg-text-primary px-4 py-2.5 text-sm font-medium text-background hover:bg-text-primary/90 transition-colors flex-shrink-0"
          >
            Start Setup Guide
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Documentation Categories Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {docCategories.map((category) => (
            <div
              key={category.id}
              className="rounded-2xl border border-border-subtle bg-surface p-6 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-heading font-bold text-text-primary mb-1">
                  {category.title}
                </h3>
                <p className="text-xs text-text-secondary mb-6">
                  {category.description}
                </p>

                <div className="space-y-3">
                  {category.topics.map((topic) => (
                    <Link
                      key={topic.title}
                      href={topic.href}
                      className="group block rounded-lg border border-border-subtle/60 p-3 hover:border-border hover:bg-surface-muted/50 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-text-primary group-hover:underline">
                          {topic.title}
                        </span>
                        {topic.badge && (
                          <span className="text-[10px] font-mono uppercase bg-surface-muted px-1.5 py-0.5 rounded text-text-muted">
                            {topic.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-text-secondary mt-1 line-clamp-1">
                        {topic.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border-subtle/50">
                <Link
                  href={`/docs/${category.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-primary hover:underline"
                >
                  Browse all {category.title} guides
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
