import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building, Lock, Mail, User } from "lucide-react";

export const metadata: Metadata = {
  title: "Create Account — Innvntory",
  description: "Start with a free organization workspace on Innvntory.",
};

export default function SignupPage() {
  return (
    <div className="flex min-h-[calc(100vh-16rem)] items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-border-subtle bg-surface p-8 sm:p-10 shadow-sm">
        {/* Brand Header */}
        <div className="text-center">
          <Link href="/" className="inline-block mb-3">
            <span className="text-2xl font-heading font-bold tracking-tight text-text-primary">
              Innvntory
            </span>
          </Link>
          <h1 className="text-xl font-heading font-bold text-text-primary">
            Create your organization workspace
          </h1>
          <p className="mt-2 text-xs text-text-secondary">
            Get started with 250 SKUs and 1 warehouse free forever. No credit card required.
          </p>
        </div>

        {/* Form Visual Structure */}
        <form className="mt-8 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 h-4 w-4 text-text-muted" />
              <input
                type="text"
                placeholder="Ramesh Sharma"
                className="w-full rounded-md border border-border bg-background pl-10 pr-3.5 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-text-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1.5">
              Work Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-text-muted" />
              <input
                type="email"
                placeholder="name@company.com"
                className="w-full rounded-md border border-border bg-background pl-10 pr-3.5 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-text-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1.5">
              Organization Name
            </label>
            <div className="relative">
              <Building className="absolute left-3.5 top-3 h-4 w-4 text-text-muted" />
              <input
                type="text"
                placeholder="Acme Enterprises Pvt. Ltd."
                className="w-full rounded-md border border-border bg-background pl-10 pr-3.5 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-text-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-text-muted" />
              <input
                type="password"
                placeholder="••••••••••••"
                className="w-full rounded-md border border-border bg-background pl-10 pr-3.5 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-text-primary"
              />
            </div>
          </div>

          <p className="text-[11px] text-text-muted leading-relaxed">
            By registering, you agree to Innvntory&apos;s{" "}
            <Link href="/terms" className="underline hover:text-text-primary">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline hover:text-text-primary">
              Privacy Policy
            </Link>.
          </p>

          <Link
            href="/app/dashboard"
            className="flex w-full items-center justify-center gap-2 rounded-md bg-text-primary py-2.5 text-sm font-medium text-background hover:bg-text-primary/90 transition-colors"
          >
            Create Workspace
            <ArrowRight className="h-4 w-4" />
          </Link>
        </form>

        {/* Switch to Login */}
        <div className="text-center text-xs text-text-secondary pt-2">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-text-primary hover:underline"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
