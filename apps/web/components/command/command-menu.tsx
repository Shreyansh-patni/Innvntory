"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { NavItem } from "@/lib/nav";

/**
 * Global command menu — specification §29 and §43.
 *
 * FOUNDATION ONLY. This contains navigation and navigation-adjacent actions
 * (spec §43). It deliberately does NOT contain arbitrary AI actions: AI actions
 * are Phase 7 and must go through business services, never from a client-side
 * command list (ADR 0001 D3, `AGENTS.md` §6).
 */
export function CommandMenu({ items }: { items: readonly NavItem[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (i) =>
        i.label.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        i.keywords.some((k) => k.includes(q)),
    );
  }, [items, query]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
  }, []);

  // Cmd/Ctrl+K toggles the menu (specification §29).
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape" && open) {
        e.preventDefault();
        close();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
    else inputRef.current?.blur();
  }, [open]);

  // Keep the highlighted row in view during keyboard traversal.
  useEffect(() => {
    const list = listRef.current;
    const item = list?.children[activeIndex] as HTMLElement | undefined;
    item?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  function onListKeyDown(e: React.KeyboardEvent<HTMLUListElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = results[activeIndex];
      if (target) {
        close();
        router.push(target.href);
      }
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="btn btn-secondary w-full justify-between text-ink-muted"
      >
        <span className="text-sm">Search or jump to…</span>
        <kbd className="mono rounded border border-hairline bg-surface-muted px-1.5 py-0.5 text-[0.625rem] text-ink-faint">
          ⌘K
        </kbd>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]"
          role="dialog"
          aria-modal="true"
          aria-label="Command menu"
        >
          <button
            type="button"
            aria-label="Close command menu"
            onClick={close}
            className="absolute inset-0 cursor-default bg-ink/20 backdrop-blur-[2px]"
          />

          <div className="card relative w-full max-w-xl overflow-hidden">
            <div className="border-b border-hairline p-3">
              <input
                ref={inputRef}
                type="text"
                role="combobox"
                aria-expanded={open}
                aria-controls="command-list"
                aria-activedescendant={
                  results[activeIndex] ? `cmd-${activeIndex}` : undefined
                }
                aria-autocomplete="list"
                placeholder="Search pages and actions…"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter") {
                    e.preventDefault();
                    onListKeyDown(e as unknown as React.KeyboardEvent<HTMLUListElement>);
                  }
                }}
                className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-faint"
              />
            </div>

            <ul
              ref={listRef}
              id="command-list"
              role="listbox"
              aria-label="Commands"
              onKeyDown={onListKeyDown}
              className="max-h-80 overflow-y-auto p-2"
            >
              {results.length === 0 ? (
                <li className="px-3 py-8 text-center">
                  <p className="text-sm text-ink-secondary">
                    No matching command
                  </p>
                  <p className="mt-1 text-xs text-ink-faint">
                    Try a page name, or press Escape to close.
                  </p>
                </li>
              ) : (
                results.map((item, index) => (
                  <li key={item.href} id={`cmd-${index}`} role="option" aria-selected={index === activeIndex}>
                    <button
                      type="button"
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => {
                        close();
                        router.push(item.href);
                      }}
                      className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left transition-colors ${
                        index === activeIndex
                          ? "bg-surface-muted"
                          : "hover:bg-surface-muted"
                      }`}
                    >
                      <span>
                        <span className="block text-sm text-ink">{item.label}</span>
                        <span className="block text-xs text-ink-muted">
                          {item.description}
                        </span>
                      </span>
                      <span aria-hidden className="text-ink-faint">
                        ↵
                      </span>
                    </button>
                  </li>
                ))
              )}
            </ul>

            <div className="flex items-center justify-between border-t border-hairline bg-surface-muted px-3 py-2 text-[0.625rem] text-ink-faint">
              <span>↑↓ to navigate · ↵ to open · Esc to close</span>
              <span>Navigation only — AI actions arrive with the assistant</span>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}