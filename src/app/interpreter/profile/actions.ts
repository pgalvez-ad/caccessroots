"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { geocodeAddress } from "@/lib/geocode";

export async function saveInterpreterProfileAction(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const home_address = String(formData.get("home_address") ?? "").trim();
  const service_radius_miles = Number(formData.get("service_radius_miles") ?? 25);
  const languages = String(formData.get("languages") ?? "ASL")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const modalities = (formData.getAll("modalities") as string[]).filter(Boolean);
  const credentials = String(formData.get("credentials") ?? "").trim() || null;
  const pro_bono_commitment =
    String(formData.get("pro_bono_commitment") ?? "").trim() || null;
  const accept = formData.get("accept_pro_bono") === "on";

  let geo = null;
  if (home_address) {
    geo = await geocodeAddress(home_address);
    if (!geo) throw new Error("Could not geocode your home address. Try adding city/state.");
  }

  const update: Record<string, unknown> = {
    profile_id: user.id,
    home_address: geo?.formatted ?? home_address,
    service_radius_miles,
    languages,
    modalities: modalities.length ? modalities : ["in_person"],
    credentials,
    pro_bono_commitment,
  };
  if (geo) {
    update.home_location = `SRID=4326;POINT(${geo.longitude} ${geo.latitude})`;
  }
  if (accept && pro_bono_commitment) {
    update.pro_bono_signed_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from("interpreter_profiles")
    .upsert(update, { onConflict: "profile_id" });
  if (error) throw new Error(error.message);

  revalidatePath("/interpreter/profile");
  revalidatePath("/interpreter");
}
