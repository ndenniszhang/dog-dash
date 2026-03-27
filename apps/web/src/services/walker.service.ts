/**
 * Walker profile service.
 * In-memory stub. Replace internals with Supabase + PostGIS calls.
 */

import type { WalkerProfile, WalkerProfileInput, WalkerWithUser, WalkDuration } from '@/types';
import { calculateDistance } from '@/lib/maps.stub';

// ─── Seed Data ────────────────────────────────────────────────────────────────

const seedProfiles: WalkerProfile[] = [
  {
    id: 'wp_bob',
    userId: 'user_walker_bob',
    bio: 'Certified dog trainer with 5 years of experience. I love all breeds and specialize in high-energy dogs. CPR and first-aid certified.',
    address: '742 Mission St',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94103',
    location: { type: 'Point', coordinates: [-122.4194, 37.7749] },
    rating: 4.9,
    totalWalks: 287,
    serviceRadius: 5,
    isActive: true,
    pricing: { 30: 2500, 60: 4500, 90: 6000 },
    availability: { monday: true, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: false, sunday: false },
    backgroundCheckStatus: 'approved',
    createdAt: '2024-01-05T09:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'wp_sara',
    userId: 'user_walker_sara',
    bio: 'Animal lover and former vet tech. Experienced with dogs of all sizes. Available for solo or group walks. References available.',
    address: '101 Haight St',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94117',
    location: { type: 'Point', coordinates: [-122.4469, 37.7699] },
    rating: 4.7,
    totalWalks: 142,
    serviceRadius: 3,
    isActive: true,
    pricing: { 30: 2200, 60: 4000, 90: 5500 },
    availability: { monday: true, tuesday: false, wednesday: true, thursday: false, friday: true, saturday: true, sunday: true },
    backgroundCheckStatus: 'approved',
    createdAt: '2024-01-08T09:00:00Z',
    updatedAt: '2024-01-14T10:00:00Z',
  },
  {
    id: 'wp_mike',
    userId: 'user_walker_mike',
    bio: 'Experienced with large breeds and multi-dog households. Marathon runner — your dog will get a real workout! Insured and bonded.',
    address: '2001 Union St',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94123',
    location: { type: 'Point', coordinates: [-122.4026, 37.7955] },
    rating: 4.5,
    totalWalks: 98,
    serviceRadius: 4,
    isActive: true,
    pricing: { 30: 2000, 60: 3800, 90: 5200 },
    availability: { monday: false, tuesday: true, wednesday: false, thursday: true, friday: false, saturday: true, sunday: true },
    backgroundCheckStatus: 'approved',
    createdAt: '2024-01-03T09:00:00Z',
    updatedAt: '2024-01-11T10:00:00Z',
  },
];

// Seed user info for enriching WalkerWithUser
const seedUserInfo: Record<string, { id: string; firstName: string; lastName: string; imageUrl: string }> = {
  'user_walker_bob': { id: 'user_walker_bob', firstName: 'Bob', lastName: 'Martinez', imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob' },
  'user_walker_sara': { id: 'user_walker_sara', firstName: 'Sara', lastName: 'Chen', imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sara' },
  'user_walker_mike': { id: 'user_walker_mike', firstName: 'Mike', lastName: 'Thompson', imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike' },
};

// ─── Store ────────────────────────────────────────────────────────────────────

const store = new Map<string, WalkerProfile>(
  seedProfiles.map((p) => [p.id, p]),
);
const byUserId = new Map<string, string>(
  seedProfiles.map((p) => [p.userId, p.id]),
);

function now() { return new Date().toISOString(); }
function newId() { return `wp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`; }

// ─── Service ──────────────────────────────────────────────────────────────────

export const walkerService = {
  async getByUserId(userId: string): Promise<WalkerProfile | null> {
    const id = byUserId.get(userId);
    return id ? (store.get(id) ?? null) : null;
  },

  async getById(id: string): Promise<WalkerProfile | null> {
    return store.get(id) ?? null;
  },

  /** Get walker with enriched user info */
  async getWithUser(walkerId: string): Promise<WalkerWithUser | null> {
    const profile = store.get(walkerId);
    if (!profile) return null;
    const userInfo = seedUserInfo[profile.userId];
    if (!userInfo) return null;
    return { ...profile, user: userInfo };
  },

  /** Create or update a walker profile */
  async upsert(userId: string, data: Partial<WalkerProfileInput>): Promise<WalkerProfile> {
    const existingId = byUserId.get(userId);
    if (existingId) {
      const existing = store.get(existingId)!;
      const updated: WalkerProfile = {
        ...existing,
        bio: data.bio ?? existing.bio,
        address: data.address ?? existing.address,
        city: data.city ?? existing.city,
        state: data.state ?? existing.state,
        zipCode: data.zipCode ?? existing.zipCode,
        serviceRadius: data.serviceRadius ?? existing.serviceRadius,
        updatedAt: now(),
      };
      store.set(existingId, updated);
      return updated;
    }

    const profile: WalkerProfile = {
      id: newId(),
      userId,
      bio: data.bio ?? '',
      address: data.address ?? '',
      city: data.city ?? 'San Francisco',
      state: data.state ?? 'CA',
      zipCode: data.zipCode ?? '',
      location: { type: 'Point', coordinates: [-122.4194, 37.7749] },
      rating: 0,
      totalWalks: 0,
      serviceRadius: data.serviceRadius ?? 5,
      isActive: false,
      pricing: {},
      availability: { monday: false, tuesday: false, wednesday: false, thursday: false, friday: false, saturday: false, sunday: false },
      backgroundCheckStatus: 'pending',
      createdAt: now(),
      updatedAt: now(),
    };
    store.set(profile.id, profile);
    byUserId.set(userId, profile.id);
    return profile;
  },

  async updatePricing(userId: string, pricing: WalkerProfile['pricing']): Promise<WalkerProfile | null> {
    const id = byUserId.get(userId);
    if (!id) return null;
    const profile = store.get(id)!;
    const updated = { ...profile, pricing, updatedAt: now() };
    store.set(id, updated);
    return updated;
  },

  async updateAvailability(userId: string, availability: WalkerProfile['availability']): Promise<WalkerProfile | null> {
    const id = byUserId.get(userId);
    if (!id) return null;
    const profile = store.get(id)!;
    const updated = { ...profile, availability, updatedAt: now() };
    store.set(id, updated);
    return updated;
  },

  async activateProfile(userId: string): Promise<WalkerProfile | null> {
    const id = byUserId.get(userId);
    if (!id) return null;
    const profile = store.get(id)!;
    const updated = { ...profile, isActive: true, updatedAt: now() };
    store.set(id, updated);
    return updated;
  },

  /** Simulate background check approval */
  async submitBackgroundCheck(userId: string): Promise<void> {
    const id = byUserId.get(userId);
    if (!id) return;
    const profile = store.get(id)!;
    // Stub: auto-approve after a delay to simulate async check
    setTimeout(() => {
      store.set(id, { ...profile, backgroundCheckStatus: 'approved', updatedAt: now() });
    }, 2000);
  },

  /** Get walkers near a location */
  async getNearby(lat: number, lng: number, radiusMiles = 10): Promise<WalkerWithUser[]> {
    const results: WalkerWithUser[] = [];
    for (const profile of store.values()) {
      if (!profile.isActive) continue;
      const [pLng, pLat] = profile.location.coordinates;
      const dist = calculateDistance({ lat, lng }, { lat: pLat, lng: pLng });
      if (dist <= radiusMiles) {
        const userInfo = seedUserInfo[profile.userId];
        if (userInfo) {
          results.push({ ...profile, user: userInfo, distanceMiles: Math.round(dist * 10) / 10 });
        }
      }
    }
    return results.sort((a, b) => b.rating - a.rating);
  },

  /** Update walker rating after a review */
  async updateRating(userId: string, newRating: number): Promise<void> {
    const id = byUserId.get(userId);
    if (!id) return;
    const profile = store.get(id)!;
    const updatedTotalWalks = profile.totalWalks + 1;
    const updatedRating = Math.round(
      ((profile.rating * profile.totalWalks + newRating) / updatedTotalWalks) * 10,
    ) / 10;
    store.set(id, { ...profile, rating: updatedRating, totalWalks: updatedTotalWalks, updatedAt: now() });
  },

  /** Get price for a specific duration */
  getPriceForDuration(profile: WalkerProfile, duration: WalkDuration): number {
    return profile.pricing[duration] ?? 0;
  },

  async list(): Promise<WalkerProfile[]> {
    return Array.from(store.values());
  },
};
