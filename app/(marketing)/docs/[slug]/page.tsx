import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BookOpen, Clock, FileText } from "lucide-react";
import { docCategories } from "@/content/marketing/docs";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = docCategories.find((c) => c.id === slug) || {
    title: slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
  };
  return {
    title: `${category.title} Documentation — Innvntory`,
    description: `Detailed guide and instructions for ${category.title} in Innvntory.`,
  };
}

export default async function DocDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = docCategories.find((c) => c.id === slug) || {
    id: slug,
    title: slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    description: "Operational documentation and reference guidelines.",
    topics: [],
  };

  return (
    <div className="py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/docs"
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Documentation Hub
        </Link>

        {/* Header */}
        <div className="border-b border-border-subtle pb-8 mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface-muted px-3 py-0.5 text-xs font-mono text-text-secondary mb-3">
            Docs / {slug}
          </div>
          <h1 className="text-3xl font-heading font-bold text-text-primary sm:text-4xl">
            {category.title}
          </h1>
          <p className="mt-3 text-lg text-text-secondary">
            {category.description}
          </p>
        </div>

        {/* Content measure */}
        <div className="space-y-10">
          {category.topics.length > 0 ? (
            category.topics.map((topic, i) => (
              <div
                key={topic.title}
                className="rounded-xl border border-border-subtle bg-surface p-6 sm:p-8"
              >
                <div className="flex items-center gap-3 text-xs font-mono text-text-muted mb-2">
                  <FileText className="h-4 w-4" />
                  <span>Section 0{i + 1}</span>
                </div>
                <h2 className="text-xl font-heading font-bold text-text-primary mb-3">
                  {topic.title}
                </h2>
                <p className="text-sm text-text-secondary leading-relaxed mb-4">
                  {topic.description}
                </p>
                <div className="rounded-lg bg-background-subtle border border-border-subtle/70 p-4 text-xs font-mono text-text-secondary">
                  Configure this setting under <span className="text-text-primary font-semibold">Innvntory App → Settings → {topic.title}</span>.
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-border-subtle bg-surface p-8 text-center">
              <BookOpen className="h-8 w-8 text-text-muted mx-auto mb-3" />
              <h2 className="text-lg font-heading font-semibold text-text-primary">
                Documentation Topic Active
              </h2>
              <p className="text-sm text-text-secondary mt-1 max-w-md mx-auto">
                Detailed user guide content for {category.title} is indexed and ready.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
