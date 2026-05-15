import { createSupabaseServerClient } from "@/lib/supabase/server";
import CoordinatorMap from "@/components/coordinator-map";

export default async function CoordinatorMapPage() {
  const supabase = createSupabaseServerClient();
  const [{ data: reqs }, { data: interps }] = await Promise.all([
    supabase.rpc("map_open_requests"),
    supabase.rpc("map_interpreters"),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-semibold">Map view</h1>
      <p className="text-ink-muted mt-1">
        Open requests and interpreter homes. Toggle layers to focus.
      </p>
      <div className="mt-6">
        <CoordinatorMap
          requests={(reqs ?? []) as any}
          interpreters={(interps ?? []) as any}
          token={process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? ""}
        />
      </div>
    </div>
  );
}
