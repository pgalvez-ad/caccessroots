import { requireRole } from "@/lib/auth";
import AppShell from "@/components/app-shell";

export default async function InterpreterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireRole(["interpreter", "admin"]);
  return <AppShell profile={profile}>{children}</AppShell>;
}
