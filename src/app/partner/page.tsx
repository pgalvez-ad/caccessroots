import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth";

export default async function PartnerHome() {
  const profile = await requireProfile();
  const supabase = createSupabaseServerClient();
  const { data: memberships } = await supabase
    .from("community_memberships")
    .select("community:community_id(id,name,city,region,description)")
    .eq("profile_id", profile.id)
    .eq("is_admin", true);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Partner community</h1>
        <p className="text-ink-muted mt-1">
          Welcome. As a partner admin you can vouch for community members and
          view your community's activity. You don't see other communities'
          requests.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {memberships?.map((m: any) => (
          <div key={m.community?.id} className="card p-5">
            <h2 className="font-semibold">{m.community?.name}</h2>
            <p className="text-sm text-ink-muted">
              {[m.community?.city, m.community?.region].filter(Boolean).join(", ")}
            </p>
            <p className="text-sm mt-2">{m.community?.description}</p>
          </div>
        ))}
        {(!memberships || memberships.length === 0) && (
          <p className="text-ink-muted">
            You aren't yet linked to a community as admin. An AD admin will set this up.
          </p>
        )}
      </div>
    </div>
  );
}
