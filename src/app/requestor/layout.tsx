import { requireRole } from "@/lib/auth";
import AppShell from "@/components/app-shell";

export default async function RequestorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireRole(["requestor", "admin"]);
  return <AppShell profile={profile}>{children}</AppShell>;
}
