"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function addBlockAction(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const interpreter_email = String(formData.get("interpreter_email") ?? "").trim();
  const reason = String(formData.get("reason") ?? "").trim() || null;

  // Look up interpreter by email (must exist and be role=interpreter)
  const { data: interp, error: lookupErr } = await supabase
    .from("profiles")
    .select("id,role")
    .eq("email", interpreter_email)
    .single();
  if (lookupErr || !interp) {
    throw new Error("No interpreter found with that email.");
  }
  if (interp.role !== "interpreter") {
    throw new Error("That account isn't an interpreter.");
  }

  const { error } = await supabase.from("coi_blocks").insert({
    requestor_id: user.id,
    interpreter_id: interp.id,
    reason,
  });
  if (error && !error.message.includes("duplicate")) throw new Error(error.message);

  revalidatePath("/requestor/blocklist");
}

export async function removeBlockAction(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const id = String(formData.get("id") ?? "");
  const { error } = await supabase
    .from("coi_blocks")
    .delete()
    .eq("id", id)
    .eq("requestor_id", user.id);
  if (error) throw new Error(error.message);

  revalidatePath("/requestor/blocklist");
}
