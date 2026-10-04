import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Lock, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Sign In — Innvntory",
  description: "Sign in to your Innvntory organization workspace.",
};

export default function LoginPage() {
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
            Sign in to your workspace
          </h1>
          <p className="mt-2 text-xs text-text-secondary">
            Enter your organization email to access your inventory ledger.
          </p>
        </div>

        {/* Form Visual Structure */}
        <form className="mt-8 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-text-primary mb-2">
              Work Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-text-muted" />
              <input
                type="email"
                placeholder="name@company.com"
                className="w-full rounded-md border border-border bg-background pl-10 pr-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-text-primary"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-text-primary">
                Password
              </label>
              <a
                href="#"
                className="text-xs text-text-muted hover:text-text-primary transition-colors"
              >
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-text-muted" />
              <input
                type="password"
                placeholder="••••••••••••"
                className="w-full rounded-md border border-border bg-background pl-10 pr-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-text-primary"
              />
            </div>
          </div>

          <Link
            href="/app/dashboard"
            className="flex w-full items-center justify-center gap-2 rounded-md bg-text-primary py-2.5 text-sm font-medium text-background hover:bg-text-primary/90 transition-colors"
          >
            Sign In to App
            <ArrowRight className="h-4 w-4" />
          </Link>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border-subtle" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-surface px-2 text-text-muted">Or continue with</span>
          </div>
        </div>

        {/* SSO / Google Placeholder */}
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-md border border-border bg-surface px-4 py-2.5 text-sm font-medium text-text-primary hover:bg-surface-muted transition-colors"
        >
          <span className="font-semibold">Single Sign-On (SAML / SSO)</span>
        </button>

        {/* Switch to Signup */}
        <div className="text-center text-xs text-text-secondary pt-2">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-text-primary hover:underline"
          >
            Create organization workspace
          </Link>
        </div>
      </div>
    </div>
  );
}
