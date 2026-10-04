import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getUserContext } from '@/lib/auth/session';
import { getOnboardingStatus } from '@/lib/onboarding/service';
import { NormalOnboardingWizard } from '@/components/onboarding/normal-onboarding-wizard';
import { DemoOnboardingWizard } from '@/components/onboarding/demo-onboarding-wizard';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { LogOut } from 'lucide-react';
import { logoutAction } from '@/lib/auth/actions';

export const metadata: Metadata = {
  title: 'Workspace Onboarding — Innvntory',
  description: 'First-time setup wizard to configure your business and operations workspace.',
};

export default async function OnboardingPage() {
  const userContext = await getUserContext();

  if (!userContext || !userContext.user) {
    redirect('/login');
  }

  const status = await getOnboardingStatus();

  // If already completed, redirect directly to dashboard
  if (status.isCompleted) {
    redirect('/app/dashboard');
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-text-primary">
      {/* Onboarding Focused Header */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border-subtle bg-background px-4 lg:px-8">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-heading font-bold tracking-tight text-text-primary">
              Innvntory
            </span>
            <span className="rounded bg-surface-muted px-1.5 py-0.2 text-[10px] font-mono text-text-muted border border-border-subtle/50">
              OS
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          <form action={logoutAction}>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-md border border-border-subtle bg-surface px-2.5 py-1.5 text-xs text-text-secondary hover:border-border hover:text-text-primary transition-colors cursor-pointer"
              title="Sign out"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </form>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center px-4 py-8 sm:px-6 lg:px-8">
        {status.isDemo ? (
          <DemoOnboardingWizard />
        ) : (
          <NormalOnboardingWizard
            initialStep={status.currentStep}
            initialData={status.draftData}
            defaultOrgName={status.organizationName}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-text-muted border-t border-border-subtle/50">
        Innvntory Operations OS • Sahaya Technologies Pvt. Ltd.
      </footer>
    </div>
  );
}
