/**
 * Google Maps stub.
 * Returns fake San Francisco–area coordinates and distances.
 * Replace with: @googlemaps/js-api-loader + google.maps.Geocoder, etc.
 */

const log = (method: string, ...args: unknown[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.debug(`[maps stub] ${method}`, ...args);
  }
};

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export interface LatLng {
  lat: number;
  lng: number;
}

export interface GeocodeResult {
  lat: number;
  lng: number;
  formattedAddress: string;
}

// Seed SF area locations for stub data
const SF_SEED_LOCATIONS: GeocodeResult[] = [
  { lat: 37.7749, lng: -122.4194, formattedAddress: 'San Francisco, CA 94102' },
  { lat: 37.7854, lng: -122.4005, formattedAddress: 'Financial District, San Francisco, CA' },
  { lat: 37.7699, lng: -122.4469, formattedAddress: 'Castro, San Francisco, CA' },
  { lat: 37.7955, lng: -122.4026, formattedAddress: 'North Beach, San Francisco, CA' },
  { lat: 37.7639, lng: -122.4089, formattedAddress: 'Mission District, San Francisco, CA' },
];

let geocodeIndex = 0;

/** Geocode an address to lat/lng (returns deterministic stub values) */
export async function geocodeAddress(address: string): Promise<GeocodeResult> {
  log('geocodeAddress', address);
  await delay(300);
  const result = SF_SEED_LOCATIONS[geocodeIndex % SF_SEED_LOCATIONS.length];
  geocodeIndex++;
  return { ...result, formattedAddress: address || result.formattedAddress };
}

/** Calculate distance between two points in miles (Haversine) */
export function calculateDistance(a: LatLng, b: LatLng): number {
  const R = 3958.8; // Earth radius in miles
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(h));
}

/** Get travel time estimate between two points (stub: 3 min/mile) */
export async function getDistanceMatrix(
  origin: LatLng,
  destination: LatLng,
): Promise<{ distanceMiles: number; durationMinutes: number }> {
  log('getDistanceMatrix', origin, destination);
  await delay(200);
  const distanceMiles = calculateDistance(origin, destination);
  const durationMinutes = Math.round(distanceMiles * 3);
  return { distanceMiles, durationMinutes };
}

/** Simulate GPS movement during a walk (±0.001° per step) */
export function simulateGpsStep(current: LatLng): LatLng {
  const jitter = () => (Math.random() - 0.5) * 0.002;
  return { lat: current.lat + jitter(), lng: current.lng + jitter() };
}

/** Default user location (SF city center) */
export const DEFAULT_LOCATION: LatLng = { lat: 37.7749, lng: -122.4194 };
