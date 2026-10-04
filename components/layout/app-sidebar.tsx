"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { navigation, isNavSection, type NavItem } from "@/content/navigation";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

function NavLink({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const isActive =
    pathname === item.href ||
    (item.href !== "/app/dashboard" && pathname.startsWith(item.href));
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] font-secondary font-medium transition-colors",
        isActive
          ? "bg-surface-muted text-text-primary font-semibold border-l-2 border-text-primary pl-2"
          : "text-text-secondary hover:bg-surface-muted/60 hover:text-text-primary"
      )}
    >
      {Icon && <Icon className="h-4 w-4 shrink-0" />}
      <span>{item.label}</span>
    </Link>
  );
}

export function AppSidebar() {
  return (
    <aside className="hidden lg:flex lg:w-[240px] lg:flex-col lg:border-r lg:border-border-subtle bg-background-subtle">
      {/* Brand Wordmark + Public site shortcut */}
      <div className="flex h-14 items-center justify-between px-5 border-b border-border-subtle">
        <Link href="/app/dashboard" className="flex items-center gap-2">
          <span className="text-lg font-heading font-bold tracking-tight text-text-primary">
            Innvntory
          </span>
          <span className="rounded bg-surface-muted px-1.5 py-0.2 text-[10px] font-mono text-text-muted border border-border-subtle/50">
            OS
          </span>
        </Link>
        <Link
          href="/"
          className="text-text-muted hover:text-text-primary transition-colors p-1"
          title="Visit Public Website"
          aria-label="Visit Public Website"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5" aria-label="Application navigation">
        {navigation.map((entry) => {
          if (isNavSection(entry)) {
            return (
              <div key={entry.label}>
                <p className="mb-1.5 px-2.5 text-[11px] font-secondary font-semibold uppercase tracking-wider text-text-muted">
                  {entry.label}
                </p>
                <div className="space-y-0.5">
                  {entry.items.map((item) => (
                    <NavLink key={item.href} item={item} />
                  ))}
                </div>
              </div>
            );
          }
          return <NavLink key={entry.href} item={entry} />;
        })}
      </nav>
    </aside>
  );
}
