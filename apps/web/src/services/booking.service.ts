/**
 * Booking / Walk service.
 * In-memory stub. Replace internals with Supabase calls.
 */

import type { Walk, WalkStatus, WalkDetail, BookingInput, WalkDuration } from '@/types';
import { petService } from './pet.service';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function now() { return new Date().toISOString(); }
function newId() { return `walk_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`; }

function scheduledEnd(start: string, durationMins: number): string {
  return new Date(new Date(start).getTime() + durationMins * 60_000).toISOString();
}

// ─── Seed Data ────────────────────────────────────────────────────────────────

const seedWalks: Walk[] = [
  {
    id: 'walk_001',
    ownerId: 'user_owner_alice',
    walkerId: 'user_walker_bob',
    petIds: ['pet_buddy'],
    status: 'completed',
    scheduledStart: '2024-01-20T09:00:00Z',
    scheduledEnd: '2024-01-20T10:00:00Z',
    duration: 60,
    distance: 2.3,
    price: 4500,
    paymentStatus: 'paid',
    paymentIntentId: 'pi_mock_seed_001',
    pickupLocation: { type: 'Point', coordinates: [-122.4194, 37.7749] },
    currentLocation: null,
    notes: 'Please use the back gate.',
    createdAt: '2024-01-19T18:00:00Z',
    updatedAt: '2024-01-20T10:05:00Z',
  },
  {
    id: 'walk_002',
    ownerId: 'user_owner_alice',
    walkerId: 'user_walker_sara',
    petIds: ['pet_buddy', 'pet_luna'],
    status: 'completed',
    scheduledStart: '2024-01-25T14:00:00Z',
    scheduledEnd: '2024-01-25T14:30:00Z',
    duration: 30,
    distance: 1.1,
    price: 2200,
    paymentStatus: 'paid',
    paymentIntentId: 'pi_mock_seed_002',
    pickupLocation: { type: 'Point', coordinates: [-122.4194, 37.7749] },
    currentLocation: null,
    notes: '',
    createdAt: '2024-01-24T10:00:00Z',
    updatedAt: '2024-01-25T14:35:00Z',
  },
  {
    id: 'walk_003',
    ownerId: 'user_owner_alice',
    walkerId: 'user_walker_bob',
    petIds: ['pet_luna'],
    status: 'confirmed',
    scheduledStart: new Date(Date.now() + 86_400_000).toISOString(), // tomorrow
    scheduledEnd: new Date(Date.now() + 86_400_000 + 3_600_000).toISOString(),
    duration: 60,
    distance: 0,
    price: 4500,
    paymentStatus: 'paid',
    paymentIntentId: 'pi_mock_seed_003',
    pickupLocation: { type: 'Point', coordinates: [-122.4194, 37.7749] },
    currentLocation: null,
    notes: 'Treats in the red bag by the door.',
    createdAt: new Date(Date.now() - 3_600_000).toISOString(),
    updatedAt: new Date(Date.now() - 3_600_000).toISOString(),
  },
];

// ─── Seed user info ───────────────────────────────────────────────────────────

const seedUserInfo: Record<string, { id: string; firstName: string; lastName: string; imageUrl: string }> = {
  'user_owner_alice': { id: 'user_owner_alice', firstName: 'Alice', lastName: 'Johnson', imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice' },
  'user_walker_bob': { id: 'user_walker_bob', firstName: 'Bob', lastName: 'Martinez', imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob' },
  'user_walker_sara': { id: 'user_walker_sara', firstName: 'Sara', lastName: 'Chen', imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sara' },
  'user_walker_mike': { id: 'user_walker_mike', firstName: 'Mike', lastName: 'Thompson', imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike' },
};

// ─── Store ────────────────────────────────────────────────────────────────────

const store = new Map<string, Walk>(
  seedWalks.map((w) => [w.id, w]),
);

// Listeners for real-time simulation
type WalkListener = (walk: Walk) => void;
const listeners = new Map<string, WalkListener[]>();

// ─── Service ──────────────────────────────────────────────────────────────────

function emit(walkId: string, walk: Walk) {
  (listeners.get(walkId) ?? []).forEach((cb) => cb(walk));
}

export const bookingService = {
  async getById(id: string): Promise<Walk | null> {
    return store.get(id) ?? null;
  },

  async getByOwner(ownerId: string): Promise<Walk[]> {
    return Array.from(store.values())
      .filter((w) => w.ownerId === ownerId)
      .sort((a, b) => new Date(b.scheduledStart).getTime() - new Date(a.scheduledStart).getTime());
  },

  async getByWalker(walkerId: string): Promise<Walk[]> {
    return Array.from(store.values())
      .filter((w) => w.walkerId === walkerId)
      .sort((a, b) => new Date(b.scheduledStart).getTime() - new Date(a.scheduledStart).getTime());
  },

  async getDetail(id: string): Promise<WalkDetail | null> {
    const walk = store.get(id);
    if (!walk) return null;
    const pets = await petService.getByIds(walk.petIds);
    const owner = seedUserInfo[walk.ownerId];
    const walker = seedUserInfo[walk.walkerId];
    if (!owner || !walker) return null;
    return { ...walk, owner, walker, pets };
  },

  async create(data: BookingInput & { ownerId: string; price: number; paymentIntentId: string }): Promise<Walk> {
    const walk: Walk = {
      id: newId(),
      ownerId: data.ownerId,
      walkerId: data.walkerId,
      petIds: data.petIds,
      status: 'pending',
      scheduledStart: data.scheduledStart,
      scheduledEnd: scheduledEnd(data.scheduledStart, data.duration),
      duration: data.duration as WalkDuration,
      distance: 0,
      price: data.price,
      paymentStatus: 'paid',
      paymentIntentId: data.paymentIntentId,
      pickupLocation: { type: 'Point', coordinates: [-122.4194, 37.7749] },
      currentLocation: null,
      notes: data.notes,
      createdAt: now(),
      updatedAt: now(),
    };
    store.set(walk.id, walk);
    return walk;
  },

  async updateStatus(id: string, status: WalkStatus): Promise<Walk | null> {
    const walk = store.get(id);
    if (!walk) return null;
    const updated: Walk = { ...walk, status, updatedAt: now() };
    store.set(id, updated);
    emit(id, updated);
    return updated;
  },

  async updateLocation(id: string, lat: number, lng: number): Promise<Walk | null> {
    const walk = store.get(id);
    if (!walk) return null;
    const updated: Walk = {
      ...walk,
      currentLocation: { type: 'Point', coordinates: [lng, lat] },
      updatedAt: now(),
    };
    store.set(id, updated);
    emit(id, updated);
    return updated;
  },

  async cancel(id: string): Promise<Walk | null> {
    return bookingService.updateStatus(id, 'cancelled');
  },

  /** Subscribe to real-time walk updates */
  subscribe(walkId: string, cb: WalkListener): () => void {
    const existing = listeners.get(walkId) ?? [];
    listeners.set(walkId, [...existing, cb]);
    return () => {
      const remaining = (listeners.get(walkId) ?? []).filter((l) => l !== cb);
      listeners.set(walkId, remaining);
    };
  },

  /** Get active (in_progress) walk for a user */
  async getActiveWalk(userId: string): Promise<Walk | null> {
    for (const walk of store.values()) {
      if (walk.status === 'in_progress' && (walk.ownerId === userId || walk.walkerId === userId)) {
        return walk;
      }
    }
    return null;
  },
};
