import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth";
import { formatDateTime } from "@/lib/utils";
import { vouchAction } from "./actions";

export default async function PartnerMembersPage() {
  const profile = await requireProfile();
  const supabase = createSupabaseServerClient();

  const { data: myCommunities } = await supabase
    .from("community_memberships")
    .select("community:community_id(id,name)")
    .eq("profile_id", profile.id)
    .eq("is_admin", true);

  const communityIds = (myCommunities ?? []).map((m: any) => m.community?.id).filter(Boolean);

  const { data: members } = communityIds.length
    ? await supabase
        .from("community_memberships")
        .select("id,vouched_at,community:community_id(name),profile:profile_id(full_name,email,role)")
        .in("community_id", communityIds)
    : { data: [] };

  return (
    <div>
      <h1 className="text-2xl font-semibold">Members</h1>
      <p className="text-ink-muted mt-1">
        Vouch for a Deaf community member you know so they're recognized in your
        community.
      </p>

      <form action={vouchAction} className="card p-6 mt-6 grid sm:grid-cols-3 gap-3">
        <div>
          <label className="label" htmlFor="community_id">Community</label>
          <select id="community_id" name="community_id" className="input">
            {myCommunities?.map((m: any) => (
              <option key={m.community?.id} value={m.community?.id}>
                {m.community?.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="requestor_email">Requestor's email</label>
          <input id="requestor_email" name="requestor_email" type="email" required className="input" />
        </div>
        <div className="flex items-end">
          <button className="btn-primary w-full">Vouch</button>
        </div>
      </form>

      <div className="card mt-8 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-ink-muted">
            <tr>
              <th className="px-4 py-2">Member</th>
              <th className="px-4 py-2">Community</th>
              <th className="px-4 py-2">Vouched</th>
            </tr>
          </thead>
          <tbody>
            {members?.map((m: any) => (
              <tr key={m.id} className="border-t border-slate-100">
                <td className="px-4 py-3">
                  <p className="font-medium">{m.profile?.full_name}</p>
                  <p className="text-xs text-ink-muted">{m.profile?.email}</p>
                </td>
                <td className="px-4 py-3">{m.community?.name}</td>
                <td className="px-4 py-3 text-ink-muted">
                  {m.vouched_at ? formatDateTime(m.vouched_at) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
