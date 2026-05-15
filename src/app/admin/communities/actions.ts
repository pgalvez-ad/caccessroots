"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function createCommunityAction(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const city = String(formData.get("city") ?? "").trim() || null;
  const region = String(formData.get("region") ?? "").trim() || null;
  if (!name) throw new Error("Name required");

  const { error } = await supabase.from("communities").insert({
    name,
    description,
    city,
    region,
    status: "active",
    created_by: user.id,
  });
  if (error) throw new Error(error.message);

  revalidatePath("/admin/communities");
}

export async function setCommunityStatusAction(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const id = String(formData.get("id"));
  const status = String(formData.get("status"));
  const reason = String(formData.get("reason") ?? "").trim() || null;
  const { error } = await supabase.from("communities").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);

  await supabase.rpc("write_audit", {
    p_action: `community.status.${status}`,
    p_target_table: "communities",
    p_target_id: id,
    p_before: null,
    p_after: { status },
    p_reason: reason,
  });

  revalidatePath("/admin/communities");
}
