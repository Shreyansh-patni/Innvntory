import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, Calendar, BookOpen } from "lucide-react";
import { articles } from "@/content/marketing/articles";

export const metadata: Metadata = {
  title: "Innvntory Articles — Operations Insights & Engineering Notes",
  description:
    "Architectural insights, multi-warehouse strategies, and best practices for scaling inventory-driven businesses.",
};

export default function ArticlesPage() {
  const featuredArticle = articles.find((a) => a.featured) || articles[0];
  const regularArticles = articles.filter((a) => a.slug !== featuredArticle?.slug);

  return (
    <div className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Editorial Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface-muted px-3.5 py-1 text-xs font-medium text-text-secondary mb-4">
            Publications & Notes
          </div>
          <h1 className="text-4xl font-heading font-bold text-text-primary tracking-tight sm:text-5xl">
            Articles & Operational Insights
          </h1>
          <p className="mt-4 text-lg text-text-secondary">
            Essays on high-reliability software architecture, inventory control, and enterprise operations.
          </p>
        </div>

        {/* Featured Article Card (Aoutive Hero Article Style) */}
        {featuredArticle && (
          <div className="mb-16">
            <Link
              href={`/articles/${featuredArticle.slug}`}
              className="group block rounded-2xl border border-border-subtle bg-surface p-8 sm:p-12 hover:border-border transition-all"
            >
              <div className="flex items-center gap-3 text-xs text-text-muted mb-4">
                <span className="rounded-full bg-surface-muted px-3 py-1 font-mono font-medium text-text-secondary">
                  Featured / {featuredArticle.category}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {featuredArticle.date}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {featuredArticle.readTime}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-text-primary group-hover:underline leading-tight">
                {featuredArticle.title}
              </h2>

              <p className="mt-4 text-base sm:text-lg text-text-secondary leading-relaxed max-w-4xl">
                {featuredArticle.excerpt}
              </p>

              <div className="mt-8 flex items-center justify-between border-t border-border-subtle pt-6">
                <div className="text-xs text-text-muted">
                  By <span className="font-semibold text-text-primary">{featuredArticle.author.name}</span> — {featuredArticle.author.role}
                </div>
                <div className="inline-flex items-center gap-1 text-sm font-semibold text-text-primary group-hover:translate-x-1 transition-transform">
                  Read Essay
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Regular Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {regularArticles.map((article) => (
            <Link
              key={article.slug}
              href={`/articles/${article.slug}`}
              className="group flex flex-col justify-between rounded-xl border border-border-subtle bg-surface p-6 sm:p-8 hover:border-border transition-all"
            >
              <div>
                <div className="flex items-center gap-3 text-xs text-text-muted mb-3">
                  <span className="rounded bg-surface-muted px-2 py-0.5 font-mono text-text-secondary">
                    {article.category}
                  </span>
                  <span>{article.date}</span>
                  <span>•</span>
                  <span>{article.readTime}</span>
                </div>

                <h3 className="text-xl font-heading font-bold text-text-primary group-hover:underline">
                  {article.title}
                </h3>

                <p className="mt-3 text-sm text-text-secondary leading-relaxed">
                  {article.excerpt}
                </p>
              </div>

              <div className="mt-6 border-t border-border-subtle/60 pt-4 flex items-center justify-between text-xs text-text-muted">
                <span>{article.author.name}</span>
                <span className="font-semibold text-text-primary group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                  Read <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
