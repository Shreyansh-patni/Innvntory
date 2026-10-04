import { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { AppearanceForm } from '@/components/settings/appearance-form';
import { Palette, ShieldCheck, Laptop } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Appearance & Theme Settings — Innvntory',
  description: 'Customize interface theme and display preferences. Preferences persist across devices.',
};

export default function AppearanceSettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Appearance"
        description="Choose how Innvntory looks for you. Your preference persists across devices and sessions."
        breadcrumbs={[
          { label: 'Application', href: '/app/dashboard' },
          { label: 'Settings', href: '/app/settings/organization' },
          { label: 'Appearance' },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-border-subtle bg-surface p-6 space-y-6 shadow-sm">
            <div>
              <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2 font-secondary">
                <Palette className="w-4 h-4 text-text-muted" />
                Theme Preference
              </h3>
              <p className="text-xs text-text-muted mt-1">
                Select your preferred color mode. The interface updates instantly without requiring a page reload.
              </p>
            </div>

            <AppearanceForm />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-border-subtle bg-surface p-6 space-y-3 shadow-sm">
            <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2 font-secondary">
              <Laptop className="w-4 h-4 text-text-muted" />
              Cross-Device Synchronization
            </h3>
            <p className="text-xs text-text-muted leading-relaxed">
              For authenticated users, theme choices are stored in your secure user preferences table in PostgreSQL, ensuring identical appearance whether accessing Innvntory from mobile, tablet, or desktop.
            </p>
          </div>

          <div className="rounded-xl border border-border-subtle bg-surface p-6 space-y-3 shadow-sm">
            <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2 font-secondary">
              <ShieldCheck className="w-4 h-4 text-text-muted" />
              Tenant & User Independence
            </h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Theme preferences belong to your user profile, not individual tenant workspaces. Switching between organizations preserves your chosen theme seamlessly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
