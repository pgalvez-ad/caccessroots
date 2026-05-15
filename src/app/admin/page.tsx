import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminHome() {
  const supabase = createSupabaseServerClient();

  const [{ count: pendingApprovals }, { count: pendingUsers }, { count: openRequests }, { count: sensitiveOpen }] =
    await Promise.all([
      supabase.from("approvals").select("id", { count: "exact", head: true }).eq("final_decision", "pending"),
      supabase.from("profiles").select("id", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("requests").select("id", { count: "exact", head: true }).in("status", ["open", "proposed"]),
      supabase
        .from("requests")
        .select("id", { count: "exact", head: true })
        .eq("sensitivity", "sensitive")
        .in("status", ["open", "proposed", "pending_acceptance"]),
    ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Admin overview</h1>
        <p className="text-ink-muted mt-1">
          Oversight, approvals, and audit. Every action you take here is logged.
        </p>
      </div>

      <div className="grid sm:grid-cols-4 gap-4">
        <Stat label="Pending approvals" value={pendingApprovals ?? 0} href="/admin/approvals" tone="amber" />
        <Stat label="Users awaiting review" value={pendingUsers ?? 0} href="/admin/users?status=pending" />
        <Stat label="Open requests" value={openRequests ?? 0} href="/coordinator" />
        <Stat label="Sensitive in flight" value={sensitiveOpen ?? 0} href="/coordinator" tone="amber" />
      </div>

      <section className="card p-6">
        <h2 className="font-semibold">Quick actions</h2>
        <ul className="mt-3 space-y-2 text-sm">
          <li>
            <Link href="/admin/approvals" className="text-brand-600 font-medium">
              Review pending approvals →
            </Link>
          </li>
          <li>
            <Link href="/admin/users" className="text-brand-600 font-medium">
              Manage users (vet, promote, suspend) →
            </Link>
          </li>
          <li>
            <Link href="/admin/communities" className="text-brand-600 font-medium">
              Manage partner communities →
            </Link>
          </li>
          <li>
            <Link href="/admin/audit-log" className="text-brand-600 font-medium">
              Open the audit log →
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  href,
  tone,
}: {
  label: string;
  value: number;
  href: string;
  tone?: "amber";
}) {
  return (
    <Link href={href} className="card p-4 block hover:shadow-md transition">
      <p className="text-xs uppercase tracking-wide text-ink-subtle">{label}</p>
      <p className={`text-3xl font-semibold mt-1 ${tone === "amber" ? "text-amber-700" : ""}`}>
        {value}
      </p>
    </Link>
  );
}
