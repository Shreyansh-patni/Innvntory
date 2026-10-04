import { AppShell } from "@/components/layout/app-shell";
import { AppHeader } from "@/components/layout/app-header";

export default function ApplicationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell header={<AppHeader />}>{children}</AppShell>;
}
