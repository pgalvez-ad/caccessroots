"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function setUserStatusAction(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const id = String(formData.get("id"));
  const status = String(formData.get("status"));
  const reason = String(formData.get("reason") ?? "").trim() || null;

  if (!["pending", "active", "suspended", "archived"].includes(status)) {
    throw new Error("Invalid status");
  }
  const { error } = await supabase.from("profiles").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);

  await supabase.rpc("write_audit", {
    p_action: `profile.status.${status}`,
    p_target_table: "profiles",
    p_target_id: id,
    p_before: null,
    p_after: { status },
    p_reason: reason,
  });

  revalidatePath("/admin/users");
}

export async function requestRoleEscalationAction(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const profile_id = String(formData.get("profile_id"));
  const new_role = String(formData.get("new_role"));

  if (!["coordinator", "admin", "partner_admin"].includes(new_role)) {
    throw new Error("Invalid role");
  }

  const requires_two_keys = new_role === "admin" || new_role === "coordinator";

  const { error } = await supabase.from("approvals").insert({
    kind: "role_escalation",
    target_table: "profiles",
    target_id: profile_id,
    requested_by: user.id,
    requires_two_keys,
    context: { profile_id, new_role },
  });
  if (error) throw new Error(error.message);

  revalidatePath("/admin/users");
  revalidatePath("/admin/approvals");
}
