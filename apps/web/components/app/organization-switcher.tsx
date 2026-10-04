"use client";

import { Building2, Check, ChevronsUpDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

/**
 * Organization switcher — UI foundation only.
 *
 * SECURITY (ADR 0005 §4): a client-supplied `organizationId` is a REQUEST TO SWITCH,
 * never proof of membership. The backend re-verifies the membership server-side
 * before any session state changes, and this control does nothing until a real
 * authenticated session exists.
 *
 * It is therefore permanently disabled in this build, and says why. It is NOT a
 * control that would work if a user clicked it.
 */

export interface OrganizationOption {
  readonly organizationId: string;
  readonly name: string;
  readonly isActive: boolean;
}

export function OrganizationSwitcher({
  organizations,
  enabled,
}: {
  organizations: readonly OrganizationOption[];
  /** Only ever true once a real session exists. */
  enabled: boolean;
}) {
  const active = organizations.find((o) => o.isActive);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        // Disabled until authentication is configured. Radix passes through the
        // native disabled attribute, so this cannot be opened.
        disabled={!enabled}
        aria-label="Switch organization"
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-md border border-hairline",
          "bg-surface px-3 py-2 text-left text-sm transition-colors",
          "hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
          "disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-surface",
        )}
      >
        <span className="flex min-w-0 items-center gap-2">
          <Building2 aria-hidden className="size-4 shrink-0 text-ink-muted" />
          <span className="min-w-0">
            <span className="block truncate text-[0.6875rem] text-ink-faint">Organization</span>
            <span className="block truncate font-medium">
              {active?.name ?? "Not signed in"}
            </span>
          </span>
        </span>
        <ChevronsUpDown aria-hidden className="size-4 shrink-0 text-ink-faint" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-[var(--radix-dropdown-menu-trigger-width)]">
        <DropdownMenuLabel>Organization</DropdownMenuLabel>
        {organizations.map((org) => (
          <DropdownMenuItem key={org.organizationId} disabled>
            <span className="flex-1 truncate">{org.name}</span>
            {org.isActive ? <Check aria-hidden className="size-3.5 text-accent" /> : null}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <p className="px-2.5 py-1.5 text-[0.6875rem] leading-relaxed text-ink-faint">
          Switching is verified against your organization membership on the server. It is
          unavailable until sign-in is configured.
        </p>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}