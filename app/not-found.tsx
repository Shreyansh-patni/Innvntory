import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-4">
      <h2 className="text-xl font-heading font-semibold text-text-primary">
        Page not found
      </h2>
      <p className="text-sm font-secondary text-text-muted">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="rounded-md bg-text-primary px-4 py-2 text-sm font-secondary font-medium text-background hover:opacity-90 transition-opacity"
      >
        Return home
      </Link>
    </div>
  );
}
