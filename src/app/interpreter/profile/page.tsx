import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth";
import { saveInterpreterProfileAction } from "./actions";

export default async function InterpreterProfilePage() {
  const profile = await requireProfile();
  const supabase = createSupabaseServerClient();
  const { data: row } = await supabase
    .from("interpreter_profiles")
    .select("*")
    .eq("profile_id", profile.id)
    .maybeSingle();

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold">My interpreter profile</h1>
      <p className="text-ink-muted mt-1">
        This information helps us match you with requests close to home and
        appropriate to your skills.
      </p>

      <form action={saveInterpreterProfileAction} className="card p-6 mt-6 space-y-4">
        <div>
          <label className="label" htmlFor="home_address">Home address</label>
          <input
            id="home_address"
            name="home_address"
            required
            className="input"
            defaultValue={row?.home_address ?? ""}
            placeholder="Street, City, State"
          />
          <p className="text-xs text-ink-muted mt-1">
            Used to compute distance and travel time. Your full address is never
            shown to requestors.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="service_radius_miles">
              Service radius (miles)
            </label>
            <input
              id="service_radius_miles"
              name="service_radius_miles"
              type="number"
              min={1}
              max={500}
              required
              defaultValue={row?.service_radius_miles ?? 25}
              className="input"
            />
          </div>
          <div>
            <label className="label" htmlFor="languages">Languages</label>
            <input
              id="languages"
              name="languages"
              defaultValue={(row?.languages ?? ["ASL"]).join(", ")}
              className="input"
              placeholder="ASL, ProTactile, etc."
            />
          </div>
        </div>

        <fieldset className="rounded-xl border border-slate-200 p-4">
          <legend className="px-2 text-sm font-medium">Modalities</legend>
          <div className="flex gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="modalities"
                value="in_person"
                defaultChecked={row?.modalities?.includes("in_person") ?? true}
              />
              In person
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="modalities"
                value="video"
                defaultChecked={row?.modalities?.includes("video") ?? false}
              />
              Video
            </label>
          </div>
        </fieldset>

        <div>
          <label className="label" htmlFor="credentials">Credentials</label>
          <input
            id="credentials"
            name="credentials"
            className="input"
            defaultValue={row?.credentials ?? ""}
            placeholder="RID NIC, BEI, EIPA, etc."
          />
        </div>

        <div>
          <label className="label" htmlFor="pro_bono_commitment">
            Your pro bono commitment statement
          </label>
          <textarea
            id="pro_bono_commitment"
            name="pro_bono_commitment"
            className="input min-h-[96px]"
            defaultValue={row?.pro_bono_commitment ?? ""}
            placeholder="A few sentences about why you give pro bono time and what you'll offer the community."
          />
        </div>

        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            name="accept_pro_bono"
            defaultChecked={!!row?.pro_bono_signed_at}
            className="mt-1"
          />
          <span>
            I accept the pro bono terms — I will not invoice for assignments taken
            through this platform, I will respect the privacy of every requestor,
            and I will recuse myself from any assignment where I become aware of a
            conflict.
          </span>
        </label>

        <button className="btn-primary w-full">Save profile</button>
      </form>
    </div>
  );
}
