import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth";
import { addBlockAction, removeBlockAction } from "./actions";

export default async function BlocklistPage() {
  const profile = await requireProfile();
  const supabase = createSupabaseServerClient();
  const { data: blocks } = await supabase
    .from("coi_blocks")
    .select("id,reason,interpreter:interpreter_id(id,full_name,email)")
    .eq("requestor_id", profile.id);

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold">My blocklist</h1>
      <p className="text-ink-muted mt-1">
        Interpreters on this list will never be matched to your requests, and
        they won't see your requests at all. This list is private to you. An
        admin can only review it with a written reason, and you'll be notified
        if that ever happens.
      </p>

      <form action={addBlockAction} className="card p-6 mt-6 space-y-4">
        <div>
          <label className="label" htmlFor="interpreter_email">
            Interpreter's email
          </label>
          <input
            id="interpreter_email"
            name="interpreter_email"
            type="email"
            required
            className="input"
            placeholder="name@example.com"
          />
        </div>
        <div>
          <label className="label" htmlFor="reason">
            Reason (optional, private)
          </label>
          <textarea
            id="reason"
            name="reason"
            className="input min-h-[64px]"
            placeholder="Just for your own records."
          />
        </div>
        <button className="btn-primary">Add to my blocklist</button>
      </form>

      <div className="card mt-8 overflow-hidden">
        <h2 className="px-6 py-4 font-semibold">Current blocklist</h2>
        <ul className="divide-y divide-slate-100">
          {blocks?.map((b: any) => (
            <li key={b.id} className="px-6 py-4 flex items-center justify-between">
              <div>
                <p className="font-medium">{b.interpreter?.full_name}</p>
                <p className="text-sm text-ink-muted">{b.interpreter?.email}</p>
                {b.reason && (
                  <p className="text-sm text-ink-muted mt-1 italic">"{b.reason}"</p>
                )}
              </div>
              <form action={removeBlockAction}>
                <input type="hidden" name="id" value={b.id} />
                <button className="btn-secondary text-sm py-1.5 px-3">Remove</button>
              </form>
            </li>
          ))}
          {(!blocks || blocks.length === 0) && (
            <li className="px-6 py-6 text-sm text-ink-muted text-center">
              No one on your blocklist.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
