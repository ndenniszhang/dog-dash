'use client';

/**
 * useProfile — user/walker/pet profile data and mutations.
 * Orchestrates walkerService + petService via TanStack Query.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { walkerService } from '@/services/walker.service';
import { petService } from '@/services/pet.service';
import { userService } from '@/services/user.service';
import type { PetProfileInput, WalkerProfileInput, OwnerProfileInput } from '@/types';

export function useProfile() {
  const { user } = useAuth();
  const qc = useQueryClient();

  // ── Walker profile ──────────────────────────────────────────────────────────
  const walkerProfileQuery = useQuery({
    queryKey: ['walker-profile', user?.id],
    queryFn: () => (user ? walkerService.getByUserId(user.id) : null),
    enabled: !!user && user.role === 'walker',
  });

  // ── Pet profiles ────────────────────────────────────────────────────────────
  const petsQuery = useQuery({
    queryKey: ['pets', user?.id],
    queryFn: () => (user ? petService.getByOwnerId(user.id) : []),
    enabled: !!user && user.role === 'owner',
  });

  // ── Mutations ───────────────────────────────────────────────────────────────
  const updateOwnerProfileMut = useMutation({
    mutationFn: async (data: Partial<OwnerProfileInput>) => {
      if (!user) throw new Error('Not authenticated');
      return userService.updateOwnerProfile(user.clerkId, data);
    },
  });

  const updateWalkerProfileMut = useMutation({
    mutationFn: async (data: Partial<WalkerProfileInput>) => {
      if (!user) throw new Error('Not authenticated');
      await userService.updateWalkerUser(user.clerkId, data);
      return walkerService.upsert(user.id, data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['walker-profile', user?.id] }),
  });

  const updatePricingMut = useMutation({
    mutationFn: async (pricing: Record<string, number>) => {
      if (!user) throw new Error('Not authenticated');
      return walkerService.updatePricing(user.id, pricing);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['walker-profile', user?.id] }),
  });

  const updateAvailabilityMut = useMutation({
    mutationFn: async (availability: Record<string, boolean>) => {
      if (!user) throw new Error('Not authenticated');
      return walkerService.updateAvailability(user.id, availability);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['walker-profile', user?.id] }),
  });

  const addPetMut = useMutation({
    mutationFn: async (data: PetProfileInput) => {
      if (!user) throw new Error('Not authenticated');
      return petService.create(user.id, data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['pets', user?.id] }),
  });

  const updatePetMut = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<PetProfileInput> }) => {
      return petService.update(id, data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['pets', user?.id] }),
  });

  const removePetMut = useMutation({
    mutationFn: async (petId: string) => {
      await petService.remove(petId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['pets', user?.id] }),
  });

  const activateProfileMut = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Not authenticated');
      return walkerService.activateProfile(user.id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['walker-profile', user?.id] }),
  });

  return {
    // Walker
    walkerProfile: walkerProfileQuery.data ?? null,
    isLoadingWalkerProfile: walkerProfileQuery.isLoading,
    updateWalkerProfile: updateWalkerProfileMut.mutateAsync,
    updatePricing: updatePricingMut.mutateAsync,
    updateAvailability: updateAvailabilityMut.mutateAsync,
    activateProfile: activateProfileMut.mutateAsync,
    // Owner
    updateOwnerProfile: updateOwnerProfileMut.mutateAsync,
    // Pets
    pets: petsQuery.data ?? [],
    isLoadingPets: petsQuery.isLoading,
    addPet: addPetMut.mutateAsync,
    updatePet: updatePetMut.mutateAsync,
    removePet: removePetMut.mutateAsync,
    // Shared
    isLoading: walkerProfileQuery.isLoading || petsQuery.isLoading,
  };
}
