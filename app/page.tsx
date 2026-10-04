export default function Home() {
  return (
    <main className="min-h-screen bg-canvas flex flex-col items-center justify-center p-8 space-y-8">
      <div className="max-w-2xl w-full bg-background border border-border-subtle rounded-lg p-8 shadow-sm">
        <h1 className="text-4xl font-heading font-bold text-text-primary mb-2">Innvntory</h1>
        <p className="text-text-secondary font-secondary text-lg mb-6">
          A modern business operating system for inventory-driven businesses.
        </p>
        
        <div className="bg-surface-muted p-4 rounded-md border border-border">
          <p className="text-sm text-text-muted font-secondary">
            Status: Foundation running.
          </p>
        </div>
      </div>
    </main>
  );
}
