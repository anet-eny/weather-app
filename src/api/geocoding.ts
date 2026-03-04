import type { GeoResult, GeocodingResponse } from "../types/weather";

const GEO_BASE = "https://geocoding-api.open-meteo.com/v1";

export async function searchCities(
  query: string,
  count = 5,
): Promise<GeoResult[]> {
  if (!query.trim()) return [];

  const params = new URLSearchParams({
    name: query.trim(),
    count: String(count),
    language: "en",
    format: "json",
  });

  const res = await fetch(`${GEO_BASE}/search?${params}`);

  if (!res.ok) {
    throw new Error(`Geocoding failed: ${res.status} ${res.statusText}`);
  }

  const data: GeocodingResponse = await res.json();

  return data.results ?? [];
}

export function formatLocationLabel(geo: GeoResult): string {
  const parts = [geo.name, geo.admin1, geo.country].filter(Boolean);
  return parts.join(", ");
}
