import type { Metadata } from "next";

import {
  EmptyState,
  PageHeader,
  Section,
  StatusPill,
} from "@/components/app/primitives";

export const metadata: Metadata = { title: "Settings" };

/** Organization, team and roles — specification §42, §32. */
export default function SettingsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Configure"
        title="Settings"
        description="Your organization, the people in it, and what each of them may do."
      />

      <div className="mt-7 grid gap-5 lg:grid-cols-2">
        <Section title="Organization" description="How your business appears across Innvntory.">
          <dl className="divide-y divide-hairline-soft">
            {[
              { term: "Name", detail: "Set during onboarding" },
              { term: "Identifier", detail: "Your organization id scopes all of your data" },
              { term: "Locations", detail: "Warehouses and retail counters" },
              { term: "Tax details", detail: "GSTIN and HSN/SAC configuration" },
            ].map((row) => (
              <div key={row.term} className="flex items-start justify-between gap-4 px-5 py-3.5">
                <dt className="text-sm text-ink">{row.term}</dt>
                <dd className="text-right text-xs text-ink-faint">{row.detail}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section title="Data isolation" description="How your data is separated (ADR 0003).">
          <ul className="divide-y divide-hairline-soft">
            {[
              { label: "Every record carries an organization id", ok: true },
              { label: "Access scoped in the data layer", ok: true },
              { label: "Enforced again by the database", ok: true },
              { label: "A missing organization fails closed", ok: true },
              { label: "Database connection verified", ok: false },
            ].map((row) => (
              <li key={row.label} className="px-5 py-3.5">
                <StatusPill
                  tone={row.ok ? "positive" : "neutral"}
                  label={row.label}
                />
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <div className="mt-5">
        <Section
          title="People and roles"
          description="Role definitions are platform-wide. Who holds which role is specific to your organization."
        >
          <EmptyState
            title="No team members yet"
            body="Invite your team and assign a role. Roles are assigned per organization, so someone can hold different roles in different businesses."
            primaryAction={{ label: "Invite a team member", disabled: true }}
          />
        </Section>
      </div>

      <div className="mt-5">
        <Section
          title="Roles"
          description="The eight default roles, defined by the platform."
        >
          <ul className="divide-y divide-hairline-soft">
            {[
              { label: "Owner", detail: "Full access within the organization" },
              { label: "Admin", detail: "Administrative access" },
              { label: "Manager", detail: "Operational management" },
              { label: "Inventory Manager", detail: "Stock, locations, purchasing" },
              { label: "Sales Staff", detail: "Sales creation" },
              { label: "Purchase Staff", detail: "Purchase orders" },
              { label: "Accountant", detail: "Reporting and transactions" },
              { label: "Viewer", detail: "Read-only" },
            ].map((role) => (
              <li
                key={role.label}
                className="flex items-center justify-between gap-4 px-5 py-3"
              >
                <span className="text-sm text-ink">{role.label}</span>
                <span className="text-xs text-ink-faint">{role.detail}</span>
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </>
  );
}