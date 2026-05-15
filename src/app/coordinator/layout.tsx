import { requireRole } from "@/lib/auth";
import AppShell from "@/components/app-shell";

export default async function CoordinatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireRole(["coordinator", "admin"]);
  return <AppShell profile={profile}>{children}</AppShell>;
}
