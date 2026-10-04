import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { CommandCenterTrigger } from "@/components/layout/command-center-trigger";
import { UserAccountMenu } from "@/components/layout/user-account-menu";
import { Separator } from "@/components/ui/separator";
import { Building2, Warehouse, Bell, ChevronDown } from "lucide-react";
import { getUserContext } from "@/lib/auth/session";

export async function AppHeader() {
  const userContext = await getUserContext();

  const orgName = userContext?.organization?.name || "Sahaya Technologies";
  const userEmail = userContext?.user?.email;
  const userFullName = userContext?.user?.fullName;

  return (
    <header className="flex h-14 shrink-0 items-center border-b border-border-subtle bg-background px-4 lg:px-6 z-10">
      {/* Mobile nav trigger + wordmark (mobile only) */}
      <div className="flex items-center gap-3 lg:hidden">
        <MobileNavigation />
        <Separator orientation="vertical" className="h-5 bg-border-subtle" />
        <span className="text-base font-heading font-bold tracking-tight text-text-primary">
          Innvntory
        </span>
      </div>

      {/* Desktop: Organization & Warehouse Context Switchers */}
      <div className="hidden lg:flex items-center gap-3">
        {/* Org Switcher */}
        <div className="flex items-center gap-2 rounded-md border border-border-subtle bg-surface px-2.5 py-1 text-xs text-text-secondary hover:border-border transition-colors cursor-pointer">
          <Building2 className="h-3.5 w-3.5 text-text-muted" />
          <span className="font-medium text-text-primary">{orgName}</span>
          <span className="rounded bg-surface-muted px-1.5 py-0.2 text-[10px] font-mono text-text-muted">
            Workspace
          </span>
          <ChevronDown className="h-3 w-3 text-text-muted ml-0.5" />
        </div>

        <Separator orientation="vertical" className="h-4 bg-border-subtle" />

        {/* Warehouse Switcher */}
        <div className="flex items-center gap-2 rounded-md border border-border-subtle bg-surface px-2.5 py-1 text-xs text-text-secondary hover:border-border transition-colors cursor-pointer">
          <Warehouse className="h-3.5 w-3.5 text-text-muted" />
          <span>All Warehouses</span>
          <ChevronDown className="h-3 w-3 text-text-muted ml-0.5" />
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right Tools: Command Center, Notifications, User Profile */}
      <div className="flex items-center gap-3">
        <CommandCenterTrigger />

        {/* Notifications Placeholder */}
        <button
          type="button"
          aria-label="Notifications"
          className="flex h-8 w-8 items-center justify-center rounded-md border border-border-subtle bg-surface text-text-muted hover:border-border hover:text-text-primary transition-colors cursor-pointer"
        >
          <Bell className="h-3.5 w-3.5" />
        </button>

        {/* Authenticated User Account Menu */}
        <UserAccountMenu
          email={userEmail}
          fullName={userFullName}
          organizationName={orgName}
        />
      </div>
    </header>
  );
}
