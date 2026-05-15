import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth";
import { formatDateTime } from "@/lib/utils";
import { acceptAssignmentAction, declineAssignmentAction } from "./actions";

export default async function MyAssignmentsPage() {
  const profile = await requireProfile();
  const supabase = createSupabaseServerClient();

  const { data: rows } = await supabase
    .from("assignments")
    .select("id,status,created_at,request:request_id(id,title,event_address,event_start,event_end,event_type,description)")
    .eq("interpreter_id", profile.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-semibold">My assignments</h1>
      <p className="text-ink-muted mt-1">
        Released assignments are waiting for your accept or decline.
      </p>

      <div className="space-y-4 mt-6">
        {rows?.map((row: any) => (
          <div key={row.id} className="card p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-ink-subtle capitalize">
                  {row.request?.event_type?.replace("_", " ")}
                </p>
                <h3 className="font-semibold mt-1">{row.request?.title}</h3>
                <p className="text-sm text-ink-muted mt-1">
                  {formatDateTime(row.request?.event_start)} — {row.request?.event_address}
                </p>
                {row.request?.description && (
                  <p className="text-sm mt-2">{row.request.description}</p>
                )}
              </div>
              <span className="badge bg-brand-50 text-brand-700 capitalize">
                {row.status.replace("_", " ")}
              </span>
            </div>
            {row.status === "released" && (
              <div className="mt-4 flex gap-2">
                <form action={acceptAssignmentAction}>
                  <input type="hidden" name="id" value={row.id} />
                  <button className="btn-primary text-sm py-1.5 px-3">Accept</button>
                </form>
                <form action={declineAssignmentAction} className="flex gap-2">
                  <input type="hidden" name="id" value={row.id} />
                  <input
                    name="decline_reason"
                    placeholder="Reason (optional)"
                    className="input text-sm py-1.5 max-w-xs"
                  />
                  <button className="btn-secondary text-sm py-1.5 px-3">Decline</button>
                </form>
              </div>
            )}
          </div>
        ))}
        {(!rows || rows.length === 0) && (
          <p className="text-ink-muted">No assignments yet.</p>
        )}
      </div>
    </div>
  );
}
