import { Search, SlidersHorizontal, ArrowUpDown } from "lucide-react";

export interface FilterOption {
  label: string;
  options: { label: string; value: string }[];
}

export interface PageToolbarProps {
  searchPlaceholder?: string;
  filterOptions?: FilterOption[];
  children?: React.ReactNode;
  actions?: React.ReactNode;
}

export function PageToolbar({
  searchPlaceholder = "Search records…",
  children,
  actions,
}: PageToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 py-1">
      {/* Left: Search input + optional filters */}
      <div className="flex flex-1 items-center gap-2.5">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-text-muted" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="h-8.5 w-full rounded-md border border-border-subtle bg-surface pl-8.5 pr-3 text-xs text-text-primary placeholder:text-text-muted focus:border-border focus:outline-none"
          />
        </div>

        <button
          type="button"
          className="inline-flex h-8.5 items-center gap-1.5 rounded-md border border-border-subtle bg-surface px-3 text-xs font-medium text-text-secondary hover:bg-surface-muted hover:text-text-primary transition-colors cursor-pointer"
        >
          <SlidersHorizontal className="h-3.5 w-3.5 text-text-muted" />
          <span className="hidden sm:inline">Filter</span>
        </button>

        <button
          type="button"
          className="inline-flex h-8.5 items-center gap-1.5 rounded-md border border-border-subtle bg-surface px-3 text-xs font-medium text-text-secondary hover:bg-surface-muted hover:text-text-primary transition-colors cursor-pointer"
        >
          <ArrowUpDown className="h-3.5 w-3.5 text-text-muted" />
          <span className="hidden sm:inline">Sort</span>
        </button>

        {children}
      </div>

      {/* Right: Actions slot */}
      {actions && (
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {actions}
        </div>
      )}
    </div>
  );
}
