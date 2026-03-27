/**
 * Pet profile service.
 * In-memory stub. Replace internals with Supabase calls.
 */

import type { PetProfile, PetProfileInput } from '@/types';

// ─── Seed Data ────────────────────────────────────────────────────────────────

const seedPets: PetProfile[] = [
  {
    id: 'pet_buddy',
    ownerId: 'user_owner_alice',
    name: 'Buddy',
    breed: 'Golden Retriever',
    age: 3,
    weight: 65,
    description: 'Friendly and energetic golden retriever who loves everyone.',
    specialNeeds: 'None',
    vetName: 'Dr. Smith',
    vetPhone: '(415) 555-9001',
    imageUrls: ['https://api.dicebear.com/7.x/bottts/svg?seed=buddy'],
    isActive: true,
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-10T09:00:00Z',
  },
  {
    id: 'pet_luna',
    ownerId: 'user_owner_alice',
    name: 'Luna',
    breed: 'French Bulldog',
    age: 2,
    weight: 24,
    description: 'Sweet and calm Frenchie. Short walks preferred due to breathing.',
    specialNeeds: 'Avoid overheating — max 20 min walks in summer.',
    vetName: 'Dr. Smith',
    vetPhone: '(415) 555-9001',
    imageUrls: ['https://api.dicebear.com/7.x/bottts/svg?seed=luna'],
    isActive: true,
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-10T09:00:00Z',
  },
];

// ─── Store ────────────────────────────────────────────────────────────────────

const store = new Map<string, PetProfile>(
  seedPets.map((p) => [p.id, p]),
);

function now() { return new Date().toISOString(); }
function newId() { return `pet_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`; }

// ─── Service ──────────────────────────────────────────────────────────────────

export const petService = {
  async getByOwnerId(ownerId: string): Promise<PetProfile[]> {
    return Array.from(store.values()).filter((p) => p.ownerId === ownerId && p.isActive);
  },

  async getById(id: string): Promise<PetProfile | null> {
    return store.get(id) ?? null;
  },

  async getByIds(ids: string[]): Promise<PetProfile[]> {
    return ids.map((id) => store.get(id)).filter(Boolean) as PetProfile[];
  },

  async create(ownerId: string, data: PetProfileInput): Promise<PetProfile> {
    const pet: PetProfile = {
      id: newId(),
      ownerId,
      name: data.name,
      breed: data.breed,
      age: data.age,
      weight: data.weight,
      description: data.description,
      specialNeeds: data.specialNeeds,
      vetName: data.vetName,
      vetPhone: data.vetPhone,
      imageUrls: [`https://api.dicebear.com/7.x/bottts/svg?seed=${data.name.toLowerCase()}`],
      isActive: true,
      createdAt: now(),
      updatedAt: now(),
    };
    store.set(pet.id, pet);
    return pet;
  },

  async update(id: string, data: Partial<PetProfileInput>): Promise<PetProfile | null> {
    const pet = store.get(id);
    if (!pet) return null;
    const updated: PetProfile = {
      ...pet,
      name: data.name ?? pet.name,
      breed: data.breed ?? pet.breed,
      age: data.age ?? pet.age,
      weight: data.weight ?? pet.weight,
      description: data.description ?? pet.description,
      specialNeeds: data.specialNeeds ?? pet.specialNeeds,
      vetName: data.vetName ?? pet.vetName,
      vetPhone: data.vetPhone ?? pet.vetPhone,
      updatedAt: now(),
    };
    store.set(id, updated);
    return updated;
  },

  async remove(id: string): Promise<void> {
    const pet = store.get(id);
    if (pet) store.set(id, { ...pet, isActive: false, updatedAt: now() });
  },
};
