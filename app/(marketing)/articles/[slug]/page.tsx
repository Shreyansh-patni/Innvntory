import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { articles } from "@/content/marketing/articles";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) return { title: "Article Not Found — Innvntory" };

  return {
    title: `${article.title} — Innvntory Articles`,
    description: article.excerpt,
  };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  return (
    <article className="py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Back navigation */}
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors mb-10"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all articles
        </Link>

        {/* Article Editorial Header */}
        <div className="border-b border-border-subtle pb-10 mb-12">
          <div className="flex items-center gap-3 text-xs text-text-muted mb-4">
            <span className="rounded-full bg-surface-muted px-3 py-1 font-mono font-medium text-text-secondary">
              {article.category}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {article.date}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {article.readTime}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-text-primary leading-[1.15]">
            {article.title}
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-text-secondary leading-relaxed font-sans">
            {article.excerpt}
          </p>

          <div className="mt-8 flex items-center justify-between border-t border-border-subtle/70 pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-surface-muted border border-border-subtle flex items-center justify-center font-heading font-bold text-text-primary text-sm">
                ST
              </div>
              <div>
                <div className="text-sm font-semibold text-text-primary">
                  {article.author.name}
                </div>
                <div className="text-xs text-text-muted">
                  {article.author.role} • Sahaya Technologies Pvt. Ltd.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Article Body Sections */}
        <div className="space-y-12 text-base sm:text-lg text-text-secondary leading-relaxed font-sans">
          {article.content.map((section, idx) => (
            <div key={idx} className="space-y-6">
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary tracking-tight">
                {section.sectionHeading}
              </h2>

              {section.paragraphs.map((p, pIdx) => (
                <p key={pIdx} className="text-text-secondary">
                  {p}
                </p>
              ))}

              {section.callout && (
                <div className="rounded-xl border-l-4 border-text-primary bg-surface-muted/50 p-6 my-8">
                  <p className="text-base sm:text-lg font-medium text-text-primary italic">
                    &ldquo;{section.callout}&rdquo;
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Attribution & Back */}
        <div className="mt-16 border-t border-border-subtle pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-text-muted">
            Published under Innvntory Engineering Publications.
          </div>
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 text-sm font-semibold text-text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Explore more publications
          </Link>
        </div>
      </div>
    </article>
  );
}
