import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function InterpretersDirectoryPage() {
  const supabase = createSupabaseServerClient();
  const { data: interpreters } = await supabase
    .from("profiles")
    .select(
      "id,full_name,email,status,interp:interpreter_profiles(home_address,service_radius_miles,languages,credentials,total_completed,pro_bono_signed_at)"
    )
    .eq("role", "interpreter")
    .order("full_name");

  return (
    <div>
      <h1 className="text-2xl font-semibold">Interpreters</h1>
      <p className="text-ink-muted mt-1">The full roster of pro bono interpreters.</p>

      <div className="card mt-6 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-ink-muted">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Home</th>
              <th className="px-4 py-2">Radius</th>
              <th className="px-4 py-2">Languages</th>
              <th className="px-4 py-2">Pro bono done</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {interpreters?.map((p: any) => (
              <tr key={p.id} className="border-t border-slate-100">
                <td className="px-4 py-3">
                  <p className="font-medium">{p.full_name}</p>
                  <p className="text-xs text-ink-muted">{p.email}</p>
                </td>
                <td className="px-4 py-3">{p.interp?.home_address ?? "—"}</td>
                <td className="px-4 py-3">{p.interp?.service_radius_miles ?? "—"} mi</td>
                <td className="px-4 py-3">{p.interp?.languages?.join(", ") ?? "—"}</td>
                <td className="px-4 py-3">{p.interp?.total_completed ?? 0}</td>
                <td className="px-4 py-3">
                  <span
                    className={`badge capitalize ${
                      p.status === "active"
                        ? "bg-emerald-50 text-emerald-700"
                        : p.status === "pending"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
