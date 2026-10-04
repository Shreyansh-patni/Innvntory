"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";

/**
 * Shared authentication form.
 *
 * HONESTY — READ BEFORE EDITING.
 *
 * Authentication is NOT functional. No provider has been selected (ADR 0005 §8):
 * there is no account, no credential, and no cost basis in this repository. This
 * component therefore:
 *
 *   - does NOT store passwords
 *   - does NOT implement cryptography
 *   - does NOT create a local credential store
 *   - does NOT fake a successful sign-in
 *
 * The submit action is intentionally inert and says so. It will refuse rather than
 * pretend. Wiring it to a real provider is a separate, explicit task (ADR 0006).
 */

export type AuthMode = "login" | "signup";

const COPY: Record<
  AuthMode,
  {
    title: string;
    subtitle: string;
    submit: string;
    switchPrompt: string;
    switchHref: string;
    switchLabel: string;
  }
> = {
  login: {
    title: "Sign in",
    subtitle: "Access your organization's inventory, purchasing and sales.",
    submit: "Sign in",
    switchPrompt: "New to Innvntory?",
    switchHref: "/signup",
    switchLabel: "Create an account",
  },
  signup: {
    title: "Create your account",
    subtitle: "Start with a single organization. You can add locations and people later.",
    submit: "Create account",
    switchPrompt: "Already have an account?",
    switchHref: "/login",
    switchLabel: "Sign in",
  },
};

export function AuthForm({ mode }: { mode: AuthMode }) {
  const copy = COPY[mode];
  const [status, setStatus] = useState<"idle" | "submitted">("idle");

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    // Deliberately inert. Prevents a default form POST to this page.
    event.preventDefault();
    setStatus("submitted");
  }

  return (
    <div className="w-full max-w-sm">
      <div className="card p-7">
        <h1 className="text-[1.25rem] leading-tight font-medium tracking-[-0.015em]">
          {copy.title}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{copy.subtitle}</p>

        <form onSubmit={onSubmit} className="mt-7 space-y-5" noValidate>
          <Field label="Work email" htmlFor="email">
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              required
              placeholder="you@business.com"
              aria-describedby={status === "submitted" ? "auth-deferred" : undefined}
            />
          </Field>

          <Field
            label="Password"
            htmlFor="password"
            hint={
              mode === "signup"
                ? "At least 12 characters. Stored only by the authentication provider."
                : undefined
            }
          >
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              required
              minLength={12}
              aria-describedby={status === "submitted" ? "auth-deferred" : undefined}
            />
          </Field>

          {status === "submitted" ? (
            <div
              id="auth-deferred"
              role="status"
              aria-live="polite"
              className="rounded-md border border-caution/30 bg-caution-soft px-3.5 py-3"
            >
              <p className="text-xs font-medium text-caution">
                Authentication is not available yet
              </p>
              <p className="mt-1 text-xs leading-relaxed text-ink-secondary">
                No authentication provider has been configured for this deployment, so
                nothing was submitted and no account was created. See ADR 0005.
              </p>
            </div>
          ) : null}

          <Button type="submit" className="w-full" size="lg">
            {copy.submit}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-ink-muted">
          {copy.switchPrompt}{" "}
          <Link
            href={copy.switchHref}
            className="font-medium text-ink underline underline-offset-4 hover:text-ink-secondary"
          >
            {copy.switchLabel}
          </Link>
        </p>
      </div>

      <p className="mt-5 text-center text-xs leading-relaxed text-ink-faint">
        Passwords are never stored by Innvntory. When a provider is connected,
        credential handling, hashing and MFA belong entirely to it.
      </p>
    </div>
  );
}