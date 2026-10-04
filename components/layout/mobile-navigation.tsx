"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ExternalLink } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { navigation, isNavSection, type NavItem } from "@/content/navigation";
import { cn } from "@/lib/utils";

function MobileNavLink({ item, onNavigate }: { item: NavItem; onNavigate: () => void }) {
  const pathname = usePathname();
  const isActive =
    pathname === item.href ||
    (item.href !== "/app/dashboard" && pathname.startsWith(item.href));
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-secondary font-medium transition-colors",
        isActive
          ? "bg-surface-muted text-text-primary font-semibold border-l-2 border-text-primary pl-2.5"
          : "text-text-secondary hover:bg-surface-muted/60 hover:text-text-primary"
      )}
    >
      {Icon && <Icon className="h-4.5 w-4.5 shrink-0" />}
      <span>{item.label}</span>
    </Link>
  );
}

export function MobileNavigation() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <button
            className="lg:hidden flex items-center justify-center h-9 w-9 rounded-md text-text-secondary hover:bg-surface-muted hover:text-text-primary transition-colors cursor-pointer"
            aria-label="Open navigation menu"
          />
        }
      >
        <Menu className="h-5 w-5" />
      </SheetTrigger>
      <SheetContent side="left" showCloseButton={false} className="w-[280px] bg-background-subtle p-0 border-r border-border-subtle flex flex-col justify-between">
        <div>
          <SheetTitle className="sr-only">App Navigation</SheetTitle>
          {/* Wordmark */}
          <div className="flex h-14 items-center justify-between px-5 border-b border-border-subtle">
            <Link href="/app/dashboard" onClick={() => setOpen(false)} className="flex items-center gap-2">
              <span className="text-lg font-heading font-bold tracking-tight text-text-primary">
                Innvntory
              </span>
              <span className="rounded bg-surface-muted px-1.5 py-0.2 text-[10px] font-mono text-text-muted">
                App
              </span>
            </Link>
            <button
              onClick={() => setOpen(false)}
              className="flex items-center justify-center h-8 w-8 rounded-md text-text-muted hover:bg-surface-muted hover:text-text-primary transition-colors cursor-pointer"
              aria-label="Close navigation menu"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5" aria-label="Main navigation">
            {navigation.map((entry) => {
              if (isNavSection(entry)) {
                return (
                  <div key={entry.label}>
                    <p className="mb-1.5 px-3 text-[11px] font-secondary font-semibold uppercase tracking-wider text-text-muted">
                      {entry.label}
                    </p>
                    <div className="space-y-0.5">
                      {entry.items.map((item) => (
                        <MobileNavLink key={item.href} item={item} onNavigate={() => setOpen(false)} />
                      ))}
                    </div>
                  </div>
                );
              }
              return <MobileNavLink key={entry.href} item={entry} onNavigate={() => setOpen(false)} />;
            })}
          </nav>
        </div>

        {/* Footer Link to Marketing Website */}
        <div className="p-4 border-t border-border-subtle">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex items-center justify-between rounded-md border border-border-subtle px-3 py-2 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-surface-muted transition-colors"
          >
            <span>Public Website</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
