import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatDateTime } from "@/lib/utils";
import { decideApprovalAction } from "./actions";

const KIND_LABEL: Record<string, string> = {
  interpreter_onboarding: "Interpreter onboarding",
  community_onboarding: "Community onboarding",
  sensitive_assignment: "Sensitive assignment",
  role_escalation: "Role escalation",
  reinstatement: "Reinstatement",
  blocklist_edit: "Blocklist edit",
};

export default async function ApprovalsPage() {
  const supabase = createSupabaseServerClient();
  const { data: approvals } = await supabase
    .from("approvals")
    .select("*")
    .eq("final_decision", "pending")
    .order("created_at", { ascending: true });

  return (
    <div>
      <h1 className="text-2xl font-semibold">Approvals queue</h1>
      <p className="text-ink-muted mt-1">
        Items waiting for an admin. Role escalations require a second admin's key.
      </p>

      <div className="space-y-4 mt-6">
        {approvals?.map((a: any) => {
          const isSecondKey =
            a.requires_two_keys && a.first_decision !== "pending";
          return (
            <div key={a.id} className="card p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-ink-subtle">
                    {KIND_LABEL[a.kind] ?? a.kind}
                  </p>
                  <p className="font-semibold mt-1">
                    {summarize(a)}
                  </p>
                  <p className="text-xs text-ink-muted mt-1">
                    Filed {formatDateTime(a.created_at)} •{" "}
                    {a.requires_two_keys ? "Two-key required" : "Single approver"}
                    {isSecondKey && " • Awaiting second key"}
                  </p>
                </div>
                {a.requires_two_keys && (
                  <span className="badge bg-amber-50 text-amber-700">Two-key</span>
                )}
              </div>

              <pre className="mt-3 text-xs bg-slate-50 rounded-lg p-3 overflow-auto">
{JSON.stringify(a.context ?? {}, null, 2)}
              </pre>

              <form action={decideApprovalAction} className="mt-4 flex flex-col sm:flex-row gap-2">
                <input type="hidden" name="id" value={a.id} />
                <input
                  name="reason"
                  className="input"
                  placeholder="Reason (recorded in audit log)"
                  required
                />
                <button name="decision" value="approved" className="btn-primary">
                  Approve
                </button>
                <button name="decision" value="rejected" className="btn-danger">
                  Reject
                </button>
              </form>
            </div>
          );
        })}
        {(!approvals || approvals.length === 0) && (
          <div className="card p-8 text-center text-ink-muted">
            Nothing waiting. ✨
          </div>
        )}
      </div>
    </div>
  );
}

function summarize(a: any): string {
  switch (a.kind) {
    case "interpreter_onboarding":
      return "New interpreter awaiting vetting";
    case "community_onboarding":
      return "Partner community awaiting activation";
    case "sensitive_assignment":
      return "Sensitive assignment proposed by coordinator";
    case "role_escalation":
      return `Promote user to ${a.context?.new_role ?? "(role)"}`;
    case "reinstatement":
      return "Reactivate a previously suspended interpreter";
    case "blocklist_edit":
      return "Admin edit to a requestor's COI blocklist";
    default:
      return a.kind;
  }
}
