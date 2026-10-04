import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 border-t border-border-subtle bg-surface-muted/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border bg-text-primary text-background p-8 sm:p-12 lg:p-16 text-center max-w-5xl mx-auto shadow-sm">
          <h2 className="text-3xl font-heading font-bold tracking-tight sm:text-4xl text-background">
            Ready to upgrade your inventory operations?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-background/80 max-w-2xl mx-auto">
            Experience the precision of an event-backed inventory operating system.
            Start free today or speak with our solutions engineering team.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-md bg-background text-text-primary px-6 py-3 text-base font-medium hover:bg-background/90 transition-colors"
            >
              Start Free Workspace
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex w-full sm:w-auto items-center justify-center rounded-md border border-background/20 bg-transparent px-6 py-3 text-base font-medium text-background hover:bg-background/10 transition-colors"
            >
              Talk to Solutions Team
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
