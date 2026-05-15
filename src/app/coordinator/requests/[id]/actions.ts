"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function proposeAssignmentAction(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const request_id = String(formData.get("request_id"));
  const interpreter_id = String(formData.get("interpreter_id"));

  // The DB trigger downgrades status to pending_admin_release for sensitive requests.
  const { error } = await supabase.from("assignments").insert({
    request_id,
    interpreter_id,
    proposed_by: user.id,
    status: "proposed",
  });
  if (error) throw new Error(error.message);

  // Bump the request status
  const { data: req } = await supabase
    .from("requests")
    .select("sensitivity")
    .eq("id", request_id)
    .single();

  if (req?.sensitivity === "sensitive") {
    // Add to approvals queue
    await supabase.from("approvals").insert({
      kind: "sensitive_assignment",
      target_table: "assignments",
      target_id: request_id, // resolved by approver via lookup
      requested_by: user.id,
      requires_two_keys: false,
      context: { request_id, interpreter_id },
    });
    await supabase.from("requests").update({ status: "proposed" }).eq("id", request_id);
  } else {
    // Standard sensitivity → release immediately to the interpreter for accept/decline
    await supabase
      .from("assignments")
      .update({
        status: "released",
        released_by: user.id,
        released_at: new Date().toISOString(),
      })
      .eq("request_id", request_id)
      .eq("interpreter_id", interpreter_id)
      .eq("status", "proposed");
    await supabase
      .from("requests")
      .update({ status: "pending_acceptance" })
      .eq("id", request_id);
  }

  revalidatePath("/coordinator");
  redirect("/coordinator");
}
