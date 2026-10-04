import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { CommandCenterTrigger } from "@/components/layout/command-center-trigger";
import { Separator } from "@/components/ui/separator";

export function AppHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center border-b border-border-subtle bg-background px-4 lg:px-6">
      {/* Mobile nav trigger + wordmark (mobile only) */}
      <div className="flex items-center gap-3 lg:hidden">
        <MobileNavigation />
        <Separator orientation="vertical" className="h-5 bg-border-subtle" />
        <span className="text-base font-heading font-bold tracking-tight text-text-primary">
          Innvntory
        </span>
      </div>

      {/* Desktop: workspace context */}
      <div className="hidden lg:flex items-center gap-2">
        <span className="text-sm font-secondary font-medium text-text-secondary">
          Workspace
        </span>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Command Center */}
      <div className="flex items-center gap-3">
        <CommandCenterTrigger />
        {/* User area placeholder */}
        <div className="h-7 w-7 rounded-full bg-surface-muted border border-border-subtle" aria-hidden="true" />
      </div>
    </header>
  );
}
