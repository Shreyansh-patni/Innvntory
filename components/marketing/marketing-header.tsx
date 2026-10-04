"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

const navLinks = [
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Docs", href: "/docs" },
  { label: "Articles", href: "/articles" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function MarketingHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-subtle bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Wordmark */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2 group transition-opacity hover:opacity-80"
          >
            <span className="text-xl font-heading font-bold tracking-tight text-text-primary">
              Innvntory
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-text-primary ${
                    isActive
                      ? "text-text-primary font-semibold"
                      : "text-text-secondary"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Auth Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-text-secondary hover:text-text-primary px-3 py-1.5 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-md bg-text-primary text-background px-4 py-1.5 text-sm font-medium hover:bg-text-primary/90 transition-colors shadow-none"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex md:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={
                <button
                  className="flex items-center justify-center h-9 w-9 rounded-md text-text-secondary hover:bg-surface-muted hover:text-text-primary transition-colors"
                  aria-label="Open navigation menu"
                >
                  <Menu className="h-5 w-5" />
                </button>
              }
            />
            <SheetContent
              side="right"
              showCloseButton={false}
              className="w-[300px] bg-background p-0 border-l border-border-subtle flex flex-col justify-between"
            >
              <div>
                <SheetTitle className="sr-only">Marketing Navigation</SheetTitle>

                {/* Mobile Header */}
                <div className="flex h-16 items-center justify-between px-6 border-b border-border-subtle">
                  <Link
                    href="/"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2"
                  >
                    <span className="text-xl font-heading font-bold tracking-tight text-text-primary">
                      Innvntory
                    </span>
                  </Link>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center h-8 w-8 rounded-md text-text-secondary hover:bg-surface-muted hover:text-text-primary"
                    aria-label="Close menu"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Mobile Navigation Links */}
                <div className="px-6 py-6 space-y-4">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={`block text-base font-medium transition-colors ${
                          isActive
                            ? "text-text-primary font-semibold"
                            : "text-text-secondary hover:text-text-primary"
                        }`}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Footer Actions */}
              <div className="p-6 border-t border-border-subtle space-y-3">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex w-full items-center justify-center rounded-md border border-border px-4 py-2.5 text-sm font-medium text-text-primary hover:bg-surface-muted transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-text-primary px-4 py-2.5 text-sm font-medium text-background hover:bg-text-primary/90 transition-colors"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
