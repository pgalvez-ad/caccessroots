"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { geocodeAddress } from "@/lib/geocode";

export async function createRequestAction(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const event_type = String(formData.get("event_type") ?? "other");
  const sensitivity =
    formData.get("sensitivity") === "sensitive" ? "sensitive" : "standard";
  const event_address = String(formData.get("event_address") ?? "").trim();
  const event_start = String(formData.get("event_start") ?? "");
  const event_end = String(formData.get("event_end") ?? "");
  const modality = String(formData.get("modality") ?? "in_person");
  const languages_needed = String(formData.get("languages_needed") ?? "ASL")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (!title || !event_address || !event_start || !event_end) {
    throw new Error("Missing required fields");
  }

  const geo = await geocodeAddress(event_address);
  if (!geo) throw new Error("Could not geocode the event address");

  const { data, error } = await supabase
    .from("requests")
    .insert({
      requestor_id: user.id,
      title,
      description,
      event_type,
      sensitivity,
      event_address: geo.formatted,
      event_location: `SRID=4326;POINT(${geo.longitude} ${geo.latitude})`,
      event_start,
      event_end,
      languages_needed,
      modality,
      status: "open",
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  redirect(`/requestor/requests`);
}
