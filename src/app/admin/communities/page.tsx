import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createCommunityAction, setCommunityStatusAction } from "./actions";

export default async function AdminCommunitiesPage() {
  const supabase = createSupabaseServerClient();
  const { data: communities } = await supabase
    .from("communities")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-semibold">Partner communities</h1>
      <p className="text-ink-muted mt-1">
        Deaf community organizations that partner with CAccessRoots.
      </p>

      <form action={createCommunityAction} className="card p-6 mt-6 grid sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2">
          <label className="label" htmlFor="name">Name</label>
          <input id="name" name="name" required className="input" />
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="description">Description</label>
          <textarea id="description" name="description" className="input" />
        </div>
        <div>
          <label className="label" htmlFor="city">City</label>
          <input id="city" name="city" className="input" />
        </div>
        <div>
          <label className="label" htmlFor="region">Region / State</label>
          <input id="region" name="region" className="input" />
        </div>
        <div className="sm:col-span-2">
          <button className="btn-primary">Add community</button>
        </div>
      </form>

      <div className="card mt-8 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-ink-muted">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Location</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {communities?.map((c: any) => (
              <tr key={c.id} className="border-t border-slate-100">
                <td className="px-4 py-3">
                  <p className="font-medium">{c.name}</p>
                  <p className="text-xs text-ink-muted">{c.description}</p>
                </td>
                <td className="px-4 py-3">{[c.city, c.region].filter(Boolean).join(", ")}</td>
                <td className="px-4 py-3 capitalize">{c.status}</td>
                <td className="px-4 py-3">
                  <form action={setCommunityStatusAction} className="flex gap-1">
                    <input type="hidden" name="id" value={c.id} />
                    <select name="status" className="input text-xs py-1" defaultValue={c.status}>
                      <option value="pending">pending</option>
                      <option value="active">active</option>
                      <option value="archived">archived</option>
                    </select>
                    <input
                      name="reason"
                      placeholder="Reason"
                      required
                      className="input text-xs py-1 max-w-[160px]"
                    />
                    <button className="btn-secondary text-xs py-1 px-2">Update</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
