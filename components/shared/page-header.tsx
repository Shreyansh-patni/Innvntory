import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  badge,
  breadcrumbs,
  actions,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-border-subtle pb-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="mb-2 flex items-center gap-1.5 text-xs text-text-muted" aria-label="Breadcrumb">
            <Link href="/app/dashboard" className="hover:text-text-primary transition-colors">
              App
            </Link>
            {breadcrumbs.map((crumb) => (
              <div key={crumb.label} className="flex items-center gap-1.5">
                <ChevronRight className="h-3 w-3 text-text-muted/60" />
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-text-primary transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="font-medium text-text-secondary">{crumb.label}</span>
                )}
              </div>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-heading font-bold tracking-tight text-text-primary sm:text-3xl">
            {title}
          </h1>
          {badge && (
            <span className="inline-flex items-center rounded-full border border-border-subtle bg-surface-muted px-2.5 py-0.5 text-xs font-mono font-medium text-text-secondary">
              {badge}
            </span>
          )}
        </div>

        {description && (
          <p className="mt-1 text-sm text-text-secondary">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex flex-wrap items-center gap-2.5 sm:self-end">
          {actions}
        </div>
      )}
    </div>
  );
}
