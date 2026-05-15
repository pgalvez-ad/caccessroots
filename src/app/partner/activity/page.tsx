import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth";
import { formatDateTime } from "@/lib/utils";

export default async function PartnerActivityPage() {
  const profile = await requireProfile();
  const supabase = createSupabaseServerClient();

  const { data: communities } = await supabase
    .from("community_memberships")
    .select("community_id")
    .eq("profile_id", profile.id)
    .eq("is_admin", true);

  const ids = (communities ?? []).map((c: any) => c.community_id);

  const { data: requests } = ids.length
    ? await supabase
        .from("requests")
        .select("id,title,event_start,event_type,status,sensitivity,community:community_id(name)")
        .in("community_id", ids)
        .order("event_start", { ascending: false })
        .limit(50)
    : { data: [] };

  return (
    <div>
      <h1 className="text-2xl font-semibold">Community activity</h1>
      <p className="text-ink-muted mt-1">
        Recent requests linked to your community. Sensitive requests show only
        their title for privacy.
      </p>

      <div className="card mt-6 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-ink-muted">
            <tr>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Community</th>
              <th className="px-4 py-2">When</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {requests?.map((r: any) => (
              <tr key={r.id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium">{r.title}</td>
                <td className="px-4 py-3 capitalize">
                  {r.event_type.replace("_", " ")}
                  {r.sensitivity === "sensitive" && (
                    <span className="badge bg-terra-100 text-terra-900 ml-2">Sensitive</span>
                  )}
                </td>
                <td className="px-4 py-3">{r.community?.name}</td>
                <td className="px-4 py-3">{formatDateTime(r.event_start)}</td>
                <td className="px-4 py-3 capitalize">
                  <span className="badge bg-brand-50 text-brand-700">
                    {r.status.replace("_", " ")}
                  </span>
                </td>
              </tr>
            ))}
            {(!requests || requests.length === 0) && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-ink-muted">
                  No requests yet from your community.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
