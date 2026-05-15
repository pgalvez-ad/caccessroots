import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth";
import { formatDateTime } from "@/lib/utils";

export default async function MyRequestsPage() {
  const profile = await requireProfile();
  const supabase = createSupabaseServerClient();
  const { data: requests } = await supabase
    .from("requests")
    .select("id,title,event_start,event_address,status,sensitivity,event_type")
    .eq("requestor_id", profile.id)
    .order("event_start", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-semibold">My requests</h1>
      <p className="text-ink-muted mt-1">All your requests, past and upcoming.</p>

      <div className="card mt-6 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-ink-muted text-left">
            <tr>
              <th className="px-4 py-2">Event</th>
              <th className="px-4 py-2">When</th>
              <th className="px-4 py-2">Where</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {requests?.map((r) => (
              <tr key={r.id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium">{r.title}</td>
                <td className="px-4 py-3">{formatDateTime(r.event_start)}</td>
                <td className="px-4 py-3 text-ink-muted">{r.event_address}</td>
                <td className="px-4 py-3 capitalize">
                  {r.event_type.replace("_", " ")}
                  {r.sensitivity === "sensitive" && (
                    <span className="badge bg-terra-100 text-terra-900 ml-2">
                      Sensitive
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className="badge bg-brand-50 text-brand-700 capitalize">
                    {r.status.replace("_", " ")}
                  </span>
                </td>
              </tr>
            ))}
            {(!requests || requests.length === 0) && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-ink-muted">
                  No requests yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
