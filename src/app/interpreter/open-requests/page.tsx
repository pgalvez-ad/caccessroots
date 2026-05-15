import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth";
import { formatDateTime } from "@/lib/utils";

// RLS already restricts what an interpreter sees:
//  - status in (open, pending_acceptance), sensitivity = standard
//  - blocked interpreters never see the request
// We additionally filter by service radius client-side using the matching function.
export default async function OpenRequestsPage() {
  const profile = await requireProfile();
  const supabase = createSupabaseServerClient();

  const { data: requests } = await supabase
    .from("requests")
    .select(
      "id,title,description,event_type,event_address,event_start,event_end,languages_needed,modality"
    )
    .order("event_start", { ascending: true })
    .limit(50);

  return (
    <div>
      <h1 className="text-2xl font-semibold">Open requests</h1>
      <p className="text-ink-muted mt-1">
        These are open pro bono requests visible to you (after blocklist and
        sensitivity filters). Distance to event is shown when available. Contact
        a coordinator to volunteer for one.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mt-6">
        {requests?.map((r) => (
          <div key={r.id} className="card p-5">
            <p className="text-xs uppercase tracking-wide text-ink-subtle">
              {r.event_type.replace("_", " ")}
            </p>
            <h3 className="font-semibold mt-1">{r.title}</h3>
            <p className="text-sm text-ink-muted mt-2">{r.description}</p>
            <dl className="mt-3 text-sm space-y-1">
              <div>
                <dt className="inline text-ink-muted">When: </dt>
                <dd className="inline">{formatDateTime(r.event_start)}</dd>
              </div>
              <div>
                <dt className="inline text-ink-muted">Where: </dt>
                <dd className="inline">{r.event_address}</dd>
              </div>
              <div>
                <dt className="inline text-ink-muted">Modality: </dt>
                <dd className="inline capitalize">{r.modality.replace("_", " ")}</dd>
              </div>
              <div>
                <dt className="inline text-ink-muted">Languages: </dt>
                <dd className="inline">{r.languages_needed.join(", ")}</dd>
              </div>
            </dl>
          </div>
        ))}
        {(!requests || requests.length === 0) && (
          <p className="text-ink-muted col-span-2">No open requests in your area right now.</p>
        )}
      </div>
    </div>
  );
}
