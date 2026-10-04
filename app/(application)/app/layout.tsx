import { AppShell } from "@/components/layout/app-shell";

export default function ApplicationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
