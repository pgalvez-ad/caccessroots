import { requireRole } from "@/lib/auth";
import AppShell from "@/components/app-shell";

export default async function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireRole(["partner_admin", "admin"]);
  return <AppShell profile={profile}>{children}</AppShell>;
}
