import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth";

export default async function InterpreterHome() {
  const profile = await requireProfile();
  const supabase = createSupabaseServerClient();

  const { data: profileRow } = await supabase
    .from("interpreter_profiles")
    .select("home_address,service_radius_miles,languages,total_completed,pro_bono_signed_at")
    .eq("profile_id", profile.id)
    .maybeSingle();

  const { count: assignmentsCount } = await supabase
    .from("assignments")
    .select("id", { count: "exact", head: true })
    .eq("interpreter_id", profile.id)
    .in("status", ["released", "accepted"]);

  const setupNeeded =
    !profileRow?.home_address ||
    !profileRow?.languages?.length ||
    !profileRow?.pro_bono_signed_at;

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-semibold">
          Welcome, {profile.preferred_name || profile.full_name.split(" ")[0]}.
        </h1>
        <p className="text-ink-muted mt-1">
          Thank you for offering your time to the Deaf community.
        </p>
      </section>

      {setupNeeded && (
        <div className="card p-6 border-l-4 border-amber-400">
          <h2 className="font-semibold">Finish setting up your profile</h2>
          <p className="text-sm text-ink-muted mt-1">
            We need your home location, languages, and your signed pro bono
            commitment before you can be matched to a request.
          </p>
          <Link href="/interpreter/profile" className="btn-primary mt-4 inline-block">
            Complete profile
          </Link>
        </div>
      )}

      <section className="grid sm:grid-cols-3 gap-4">
        <Stat label="Service radius" value={`${profileRow?.service_radius_miles ?? 25} mi`} />
        <Stat label="Active assignments" value={String(assignmentsCount ?? 0)} />
        <Stat label="Pro bono completed" value={String(profileRow?.total_completed ?? 0)} />
      </section>

      <section className="card p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Next steps</h2>
        </div>
        <ul className="mt-4 space-y-3 text-sm">
          <li>
            <Link href="/interpreter/open-requests" className="text-brand-600 font-medium">
              Browse open requests near me →
            </Link>
          </li>
          <li>
            <Link href="/interpreter/assignments" className="text-brand-600 font-medium">
              View my assignments →
            </Link>
          </li>
          <li>
            <Link href="/interpreter/profile" className="text-brand-600 font-medium">
              Update my availability / radius →
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-4">
      <p className="text-xs uppercase tracking-wide text-ink-subtle">{label}</p>
      <p className="text-2xl font-semibold mt-1">{value}</p>
    </div>
  );
}
