import { Inbox } from "lucide-react";

export interface Column {
  header?: string;
  label?: string;
  key?: string;
  width?: string;
  align?: "left" | "center" | "right";
}

export interface DataPlaceholderTableProps {
  columns: Column[];
  moduleName?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  phaseNote?: string;
}

export function DataPlaceholderTable({
  columns,
  moduleName = "Records",
  emptyTitle,
  emptyDescription,
  phaseNote = "Awaiting database records in Core Inventory / Operations phase.",
}: DataPlaceholderTableProps) {
  const displayTitle = emptyTitle || `No ${moduleName} Records Found`;
  const displayDescription = emptyDescription || phaseNote;

  return (
    <div className="rounded-xl border border-border-subtle bg-surface overflow-hidden shadow-none">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          {/* Table Header */}
          <thead className="border-b border-border-subtle bg-surface-muted/50 text-text-muted">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={col.key || idx}
                  style={{ width: col.width }}
                  className={`px-4 py-3 font-semibold uppercase tracking-wider text-[11px] font-secondary ${
                    col.align === "right"
                      ? "text-right"
                      : col.align === "center"
                      ? "text-center"
                      : "text-left"
                  }`}
                >
                  {col.header || col.label || ""}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body Empty State Row */}
          <tbody>
            <tr>
              <td colSpan={columns.length} className="py-16 px-4 text-center">
                <div className="flex flex-col items-center justify-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-muted text-text-muted mb-3 border border-border-subtle/70">
                    <Inbox className="h-5 w-5" />
                  </div>
                  <h4 className="text-sm font-heading font-semibold text-text-primary">
                    {displayTitle}
                  </h4>
                  <p className="mt-1 text-xs text-text-secondary max-w-sm leading-relaxed">
                    {displayDescription}
                  </p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
