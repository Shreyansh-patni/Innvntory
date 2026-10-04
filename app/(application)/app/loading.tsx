export default function ApplicationLoading() {
  return (
    <div className="flex h-64 items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-text-primary border-t-transparent" />
        <span className="text-xs font-mono text-text-muted">Loading workspace state…</span>
      </div>
    </div>
  );
}
