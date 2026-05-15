// Geocoding + travel time via Mapbox.
// Server-only — pass results to client. Token is public-by-design but we still
// fetch from the server to keep keys consistent and add basic caching later.

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

export interface GeocodeResult {
  longitude: number;
  latitude: number;
  formatted: string;
}

export async function geocodeAddress(address: string): Promise<GeocodeResult | null> {
  if (!TOKEN) return null;
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    address
  )}.json?access_token=${TOKEN}&limit=1`;
  const res = await fetch(url, { next: { revalidate: 86400 } });
  if (!res.ok) return null;
  const data = await res.json();
  const feature = data?.features?.[0];
  if (!feature) return null;
  const [lng, lat] = feature.center;
  return { longitude: lng, latitude: lat, formatted: feature.place_name };
}

export async function travelMinutes(
  fromLng: number,
  fromLat: number,
  toLng: number,
  toLat: number
): Promise<number | null> {
  if (!TOKEN) return null;
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${fromLng},${fromLat};${toLng},${toLat}?access_token=${TOKEN}&overview=false`;
  const res = await fetch(url, { next: { revalidate: 1800 } });
  if (!res.ok) return null;
  const data = await res.json();
  const seconds = data?.routes?.[0]?.duration;
  if (!seconds) return null;
  return Math.round(seconds / 60);
}
