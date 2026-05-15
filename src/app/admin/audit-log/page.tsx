import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatDateTime } from "@/lib/utils";

export default async function AuditLogPage({
  searchParams,
}: {
  searchParams?: { table?: string; action?: string };
}) {
  const supabase = createSupabaseServerClient();
  let query = supabase
    .from("audit_log")
    .select("id,actor_id,action,target_table,target_id,reason,created_at,actor:actor_id(full_name)")
    .order("created_at", { ascending: false })
    .limit(200);
  if (searchParams?.table) query = query.eq("target_table", searchParams.table);
  if (searchParams?.action) query = query.ilike("action", `${searchParams.action}%`);
  const { data } = await query;

  return (
    <div>
      <h1 className="text-2xl font-semibold">Audit log</h1>
      <p className="text-ink-muted mt-1">
        Append-only. Every change to a profile, request, assignment, blocklist,
        approval, or community is recorded here.
      </p>

      <form className="mt-4 flex gap-3" action="/admin/audit-log">
        <input name="table" placeholder="Filter by table" className="input max-w-xs" />
        <input name="action" placeholder="Filter by action prefix" className="input max-w-xs" />
        <button className="btn-secondary">Filter</button>
      </form>

      <div className="card mt-6 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-ink-muted">
            <tr>
              <th className="px-4 py-2">When</th>
              <th className="px-4 py-2">Who</th>
              <th className="px-4 py-2">Action</th>
              <th className="px-4 py-2">Table</th>
              <th className="px-4 py-2">Reason</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((row: any) => (
              <tr key={row.id} className="border-t border-slate-100 align-top">
                <td className="px-4 py-3 text-ink-muted">{formatDateTime(row.created_at)}</td>
                <td className="px-4 py-3">{row.actor?.full_name ?? "—"}</td>
                <td className="px-4 py-3 font-mono text-xs">{row.action}</td>
                <td className="px-4 py-3">{row.target_table}</td>
                <td className="px-4 py-3 text-ink-muted">{row.reason ?? "—"}</td>
              </tr>
            ))}
            {(!data || data.length === 0) && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-ink-muted">
                  No entries match this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
