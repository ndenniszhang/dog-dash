/**
 * User service — manages users and their profiles.
 * In-memory stub. Replace internals with Supabase calls; interface stays the same.
 */

import type { User, UserRole, OwnerProfileInput, WalkerProfileInput } from '@/types';

// ─── Seed Data ────────────────────────────────────────────────────────────────

const seedUsers: User[] = [
  {
    id: 'user_owner_alice',
    clerkId: 'clerk_owner_alice',
    email: 'alice@example.com',
    firstName: 'Alice',
    lastName: 'Johnson',
    phone: '(415) 555-0101',
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
    role: 'owner',
    onboardingComplete: true,
    notificationPrefs: { walkRequests: true, walkUpdates: true, payments: true, marketing: false },
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'user_walker_bob',
    clerkId: 'clerk_walker_bob',
    email: 'bob@example.com',
    firstName: 'Bob',
    lastName: 'Martinez',
    phone: '(415) 555-0202',
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
    role: 'walker',
    onboardingComplete: true,
    notificationPrefs: { walkRequests: true, walkUpdates: true, payments: true, marketing: true },
    createdAt: '2024-01-05T09:00:00Z',
    updatedAt: '2024-01-12T10:00:00Z',
  },
  {
    id: 'user_walker_sara',
    clerkId: 'clerk_walker_sara',
    email: 'sara@example.com',
    firstName: 'Sara',
    lastName: 'Chen',
    phone: '(415) 555-0303',
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sara',
    role: 'walker',
    onboardingComplete: true,
    notificationPrefs: { walkRequests: true, walkUpdates: true, payments: true, marketing: false },
    createdAt: '2024-01-08T09:00:00Z',
    updatedAt: '2024-01-14T10:00:00Z',
  },
  {
    id: 'user_walker_mike',
    clerkId: 'clerk_walker_mike',
    email: 'mike@example.com',
    firstName: 'Mike',
    lastName: 'Thompson',
    phone: '(415) 555-0404',
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
    role: 'walker',
    onboardingComplete: true,
    notificationPrefs: { walkRequests: true, walkUpdates: true, payments: true, marketing: true },
    createdAt: '2024-01-03T09:00:00Z',
    updatedAt: '2024-01-11T10:00:00Z',
  },
];

// ─── Store ────────────────────────────────────────────────────────────────────

const store = new Map<string, User>(
  seedUsers.map((u) => [u.id, u]),
);
const byClerkId = new Map<string, string>(
  seedUsers.map((u) => [u.clerkId, u.id]),
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function newId(prefix = 'user') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

function now() {
  return new Date().toISOString();
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const userService = {
  /** Get user by internal ID */
  async getById(id: string): Promise<User | null> {
    return store.get(id) ?? null;
  },

  /** Get user by Clerk ID */
  async getByClerkId(clerkId: string): Promise<User | null> {
    const id = byClerkId.get(clerkId);
    return id ? (store.get(id) ?? null) : null;
  },

  /** Create or update a user from Clerk data */
  async upsert(data: {
    clerkId: string;
    email: string;
    firstName: string;
    lastName: string;
    imageUrl?: string;
    phone?: string;
  }): Promise<User> {
    const existingId = byClerkId.get(data.clerkId);
    if (existingId) {
      const existing = store.get(existingId)!;
      const updated: User = {
        ...existing,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        imageUrl: data.imageUrl ?? existing.imageUrl,
        phone: data.phone ?? existing.phone,
        updatedAt: now(),
      };
      store.set(existingId, updated);
      return updated;
    }

    const user: User = {
      id: newId('user'),
      clerkId: data.clerkId,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone ?? '',
      imageUrl: data.imageUrl ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.clerkId}`,
      role: null,
      onboardingComplete: false,
      notificationPrefs: { walkRequests: true, walkUpdates: true, payments: true, marketing: false },
      createdAt: now(),
      updatedAt: now(),
    };
    store.set(user.id, user);
    byClerkId.set(data.clerkId, user.id);
    return user;
  },

  /** Set user role after role selection */
  async setRole(clerkId: string, role: UserRole): Promise<User | null> {
    const id = byClerkId.get(clerkId);
    if (!id) return null;
    const user = store.get(id)!;
    const updated = { ...user, role, updatedAt: now() };
    store.set(id, updated);
    return updated;
  },

  /** Mark onboarding as complete */
  async completeOnboarding(clerkId: string): Promise<User | null> {
    const id = byClerkId.get(clerkId);
    if (!id) return null;
    const user = store.get(id)!;
    const updated = { ...user, onboardingComplete: true, updatedAt: now() };
    store.set(id, updated);
    return updated;
  },

  /** Update owner profile fields */
  async updateOwnerProfile(clerkId: string, data: Partial<OwnerProfileInput>): Promise<User | null> {
    const id = byClerkId.get(clerkId);
    if (!id) return null;
    const user = store.get(id)!;
    const updated: User = {
      ...user,
      firstName: data.firstName ?? user.firstName,
      lastName: data.lastName ?? user.lastName,
      phone: data.phone ?? user.phone,
      notificationPrefs: data.notificationPrefs ?? user.notificationPrefs,
      updatedAt: now(),
    };
    store.set(id, updated);
    return updated;
  },

  /** Update walker basic user fields */
  async updateWalkerUser(clerkId: string, data: Partial<WalkerProfileInput>): Promise<User | null> {
    const id = byClerkId.get(clerkId);
    if (!id) return null;
    const user = store.get(id)!;
    const updated: User = {
      ...user,
      firstName: data.firstName ?? user.firstName,
      lastName: data.lastName ?? user.lastName,
      phone: data.phone ?? user.phone,
      updatedAt: now(),
    };
    store.set(id, updated);
    return updated;
  },

  /** Get all users (admin/debug) */
  async list(): Promise<User[]> {
    return Array.from(store.values());
  },
};
