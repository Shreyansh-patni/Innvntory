"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { navigation, isNavSection, type NavItem } from "@/content/navigation";
import { cn } from "@/lib/utils";

function MobileNavLink({ item, onNavigate }: { item: NavItem; onNavigate: () => void }) {
  const pathname = usePathname();
  const isActive = pathname === item.href;
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-secondary font-medium transition-colors",
        isActive
          ? "bg-surface-muted text-text-primary"
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
            className="lg:hidden flex items-center justify-center h-9 w-9 rounded-md text-text-secondary hover:bg-surface-muted hover:text-text-primary transition-colors"
            aria-label="Open navigation menu"
          />
        }
      >
        <Menu className="h-5 w-5" />
      </SheetTrigger>
      <SheetContent side="left" showCloseButton={false} className="w-[280px] bg-background-subtle p-0 border-r border-border-subtle">
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        {/* Wordmark */}
        <div className="flex h-14 items-center justify-between px-5 border-b border-border-subtle">
          <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-2">
            <span className="text-lg font-heading font-bold tracking-tight text-text-primary">
              Innvntory
            </span>
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="flex items-center justify-center h-8 w-8 rounded-md text-text-muted hover:bg-surface-muted hover:text-text-primary transition-colors"
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
      </SheetContent>
    </Sheet>
  );
}
