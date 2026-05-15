"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function acceptAssignmentAction(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const id = String(formData.get("id") ?? "");
  const { error } = await supabase
    .from("assignments")
    .update({ status: "accepted", accepted_at: new Date().toISOString() })
    .eq("id", id)
    .eq("interpreter_id", user.id)
    .eq("status", "released");
  if (error) throw new Error(error.message);

  // Update the parent request to "assigned"
  const { data: a } = await supabase
    .from("assignments")
    .select("request_id")
    .eq("id", id)
    .single();
  if (a?.request_id) {
    await supabase
      .from("requests")
      .update({ status: "assigned" })
      .eq("id", a.request_id);
  }

  revalidatePath("/interpreter/assignments");
}

export async function declineAssignmentAction(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const id = String(formData.get("id") ?? "");
  const decline_reason =
    String(formData.get("decline_reason") ?? "").trim() || null;

  const { error } = await supabase
    .from("assignments")
    .update({
      status: "declined",
      declined_at: new Date().toISOString(),
      decline_reason,
    })
    .eq("id", id)
    .eq("interpreter_id", user.id)
    .eq("status", "released");
  if (error) throw new Error(error.message);

  // Return the request to the coordinator queue
  const { data: a } = await supabase
    .from("assignments")
    .select("request_id")
    .eq("id", id)
    .single();
  if (a?.request_id) {
    await supabase
      .from("requests")
      .update({ status: "open" })
      .eq("id", a.request_id);
  }

  revalidatePath("/interpreter/assignments");
}
