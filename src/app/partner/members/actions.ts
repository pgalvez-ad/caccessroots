"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function vouchAction(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const community_id = String(formData.get("community_id"));
  const requestor_email = String(formData.get("requestor_email") ?? "").trim();
  if (!community_id || !requestor_email) throw new Error("Missing fields");

  // Find the requestor by email
  const { data: req } = await supabase
    .from("profiles")
    .select("id,role")
    .eq("email", requestor_email)
    .single();
  if (!req || req.role !== "requestor") {
    throw new Error("No requestor with that email.");
  }

  const { error } = await supabase.from("community_memberships").upsert(
    {
      community_id,
      profile_id: req.id,
      vouched_by: user.id,
      vouched_at: new Date().toISOString(),
    },
    { onConflict: "community_id,profile_id" }
  );
  if (error) throw new Error(error.message);

  revalidatePath("/partner/members");
}
