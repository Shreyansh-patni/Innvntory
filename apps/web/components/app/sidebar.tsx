import { OrganizationSwitcher } from "@/components/app/organization-switcher";
import type { NavGroup, NavItem } from "@/lib/nav";

/**
 * Sidebar navigation.
 *
 * A Server Component: the shell needs no client-side state. Only the command
 * palette and interactive controls are client components (ADR 0002 — Server
 * Components by default).
 */
export function Sidebar({
  groups,
  activeHref,
}: {
  groups: readonly NavGroup[];
  activeHref: string;
}) {
  return (
    <nav aria-label="Application" className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center border-b border-hairline px-5">
        <span
          aria-hidden
          className="grid h-7 w-7 place-items-center rounded-md bg-primary text-[0.6875rem] font-semibold text-on-primary"
        >
          IN
        </span>
        <span className="ml-2.5 text-[0.9375rem] font-medium tracking-tight">
          Innvntory
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-5">
        {groups.map((group) => (
          <div key={group.label} className="mb-6 last:mb-0">
            <p className="px-2 pb-2 text-[0.625rem] font-semibold tracking-[0.14em] text-ink-faint uppercase">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => (
                <li key={item.href}>
                  <SidebarLink item={item} active={item.href === activeHref} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <TenantBoundaryNote />
    </nav>
  );
}

function SidebarLink({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <a
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={`block rounded-md px-2.5 py-1.5 text-sm transition-colors ${
        active
          ? "bg-surface-muted font-medium text-ink"
          : "text-ink-secondary hover:bg-surface-muted hover:text-ink"
      }`}
    >
      {item.label}
    </a>
  );
}

/**
 * Active-organization control and the isolation note.
 *
 * Shown because tenant scoping is a real product property (specification §31, §58),
 * not decoration. The switcher is disabled until a real session exists; switching is
 * verified server-side in any case (ADR 0005 §4).
 */
function TenantBoundaryNote() {
  return (
    <div className="shrink-0 space-y-2 border-t border-hairline p-3">
      <OrganizationSwitcher organizations={[]} enabled={false} />

      <div className="rounded-md border border-hairline bg-surface-muted p-3">
        <p className="text-[0.6875rem] font-semibold tracking-tight text-ink">
          Data isolation
        </p>
        <p className="mt-1 text-[0.6875rem] leading-relaxed text-ink-muted">
          Records are scoped to one organization and enforced at the database.
        </p>
        <p className="mono mt-2 text-[0.625rem] text-ink-faint">session: none</p>
      </div>
    </div>
  );
}