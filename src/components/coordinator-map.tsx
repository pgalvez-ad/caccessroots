"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface RequestPin {
  id: string;
  title: string;
  event_address: string;
  event_start: string;
  sensitivity: "standard" | "sensitive";
  status: string;
  lng: number;
  lat: number;
}

interface InterpreterPin {
  profile_id: string;
  full_name: string;
  service_radius_miles: number;
  languages: string[];
  lng: number;
  lat: number;
}

export default function CoordinatorMap({
  requests,
  interpreters,
  token,
}: {
  requests: RequestPin[];
  interpreters: InterpreterPin[];
  token: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [filter, setFilter] = useState<"all" | "requests" | "interpreters">("all");

  useEffect(() => {
    if (!containerRef.current || mapRef.current || !token) return;
    mapboxgl.accessToken = token;

    const fallbackCenter: [number, number] = [-77.0369, 38.9072]; // Washington DC
    const first =
      requests[0]
        ? ([requests[0].lng, requests[0].lat] as [number, number])
        : interpreters[0]
        ? ([interpreters[0].lng, interpreters[0].lat] as [number, number])
        : fallbackCenter;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: first,
      zoom: 9,
    });
    mapRef.current = map;

    map.on("load", () => {
      if (filter !== "interpreters") {
        for (const r of requests) {
          const el = document.createElement("div");
          el.className =
            "h-4 w-4 rounded-full border-2 border-white shadow-md " +
            (r.sensitivity === "sensitive" ? "bg-amber-500" : "bg-rose-500");
          new mapboxgl.Marker(el)
            .setLngLat([r.lng, r.lat])
            .setPopup(
              new mapboxgl.Popup({ offset: 12 }).setHTML(
                `<div class="text-sm">
                   <p class="font-semibold">${escapeHtml(r.title)}</p>
                   <p class="text-slate-500">${escapeHtml(r.event_address)}</p>
                   <p class="text-xs mt-1">${new Date(r.event_start).toLocaleString()}</p>
                 </div>`
              )
            )
            .addTo(map);
        }
      }
      if (filter !== "requests") {
        for (const i of interpreters) {
          const el = document.createElement("div");
          el.className = "h-3 w-3 rounded-full bg-emerald-500 border-2 border-white shadow";
          new mapboxgl.Marker(el)
            .setLngLat([i.lng, i.lat])
            .setPopup(
              new mapboxgl.Popup({ offset: 10 }).setHTML(
                `<div class="text-sm">
                   <p class="font-semibold">${escapeHtml(i.full_name)}</p>
                   <p class="text-slate-500">Radius: ${i.service_radius_miles} mi</p>
                   <p class="text-xs">${escapeHtml(i.languages.join(", "))}</p>
                 </div>`
              )
            )
            .addTo(map);
        }
      }
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <button
          className={`btn ${filter === "all" ? "btn-primary" : "btn-secondary"} text-xs py-1 px-2`}
          onClick={() => setFilter("all")}
        >
          Show all
        </button>
        <button
          className={`btn ${filter === "requests" ? "btn-primary" : "btn-secondary"} text-xs py-1 px-2`}
          onClick={() => setFilter("requests")}
        >
          Requests only
        </button>
        <button
          className={`btn ${filter === "interpreters" ? "btn-primary" : "btn-secondary"} text-xs py-1 px-2`}
          onClick={() => setFilter("interpreters")}
        >
          Interpreters only
        </button>
        <div className="ml-auto flex items-center gap-3 text-xs text-ink-muted">
          <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-rose-500" /> Standard request</span>
          <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500" /> Sensitive request</span>
          <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Interpreter home</span>
        </div>
      </div>
      <div
        ref={containerRef}
        className="rounded-2xl border border-slate-200 h-[640px]"
        style={{ background: "#f8fafc" }}
      />
      {!token && (
        <p className="text-sm text-ink-muted mt-3">
          Add <code>NEXT_PUBLIC_MAPBOX_TOKEN</code> in your <code>.env.local</code> to enable the map.
        </p>
      )}
    </div>
  );
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string)
  );
}
