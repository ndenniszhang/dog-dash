'use client';

/**
 * useWalkerMap — walker discovery map data.
 * Polls nearby walkers every 30s. Manages selected walker client state.
 */

import { useQuery } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { useBookingStore } from '@/lib/store';
import { walkerService } from '@/services/walker.service';
import { DEFAULT_LOCATION } from '@/lib/maps.stub';
import type { WalkerWithUser } from '@/types';

export function useWalkerMap() {
  const { user } = useAuth();
  const { selectedWalker, setSelectedWalker } = useBookingStore();

  const walkersQuery = useQuery({
    queryKey: ['nearby-walkers', user?.id],
    queryFn: () =>
      walkerService.getNearby(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng, 10),
    enabled: !!user,
    refetchInterval: 30_000,
  });

  const selectWalker = (walker: WalkerWithUser | null) => {
    setSelectedWalker(walker);
  };

  return {
    walkers: walkersQuery.data ?? [],
    selectedWalker,
    selectWalker,
    isLoading: walkersQuery.isLoading,
    error: walkersQuery.error,
  };
}
