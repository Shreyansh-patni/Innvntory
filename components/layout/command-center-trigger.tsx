"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";

export function CommandCenterTrigger() {
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().includes("MAC"));
  }, []);

  return (
    <button
      className="flex items-center gap-2 h-8 rounded-md border border-border-subtle bg-background px-3 text-[13px] font-secondary text-text-muted hover:border-border hover:text-text-secondary transition-colors cursor-pointer"
      aria-label="Open command center"
    >
      <Search className="h-3.5 w-3.5" />
      <span className="hidden sm:inline">Search…</span>
      <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-border-subtle bg-surface-muted px-1.5 py-0.5 text-[10px] font-mono font-medium text-text-muted">
        {isMac ? "⌘" : "Ctrl"} K
      </kbd>
    </button>
  );
}
