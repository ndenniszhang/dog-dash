'use client';

/**
 * useBooking — booking flow and walk lifecycle management.
 * Only hook that touches bookingService, reviewService, notificationService.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { useAuth } from './useAuth';
import { useBookingStore } from '@/lib/store';
import { bookingService } from '@/services/booking.service';
import { reviewService } from '@/services/review.service';
import { notificationService } from '@/services/notification.service';
import { simulatePayment } from '@/lib/stripe.stub';
import { simulateGpsStep } from '@/lib/maps.stub';
import { walkerService } from '@/services/walker.service';
import type { BookingInput, WalkDuration } from '@/types';

export function useBooking() {
  const { user } = useAuth();
  const { activeWalk, setActiveWalk } = useBookingStore();
  const qc = useQueryClient();
  const gpsIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Queries ─────────────────────────────────────────────────────────────────
  const walksQuery = useQuery({
    queryKey: ['walks', user?.id, user?.role],
    queryFn: async () => {
      if (!user) return [];
      if (user.role === 'owner') return bookingService.getByOwner(user.id);
      if (user.role === 'walker') return bookingService.getByWalker(user.id);
      return [];
    },
    enabled: !!user,
  });

  // ── Create booking ──────────────────────────────────────────────────────────
  const createBookingMut = useMutation({
    mutationFn: async (input: BookingInput) => {
      if (!user) throw new Error('Not authenticated');

      // 1. Get walker profile for pricing
      const walkerProfile = await walkerService.getByUserId(input.walkerId);
      if (!walkerProfile) throw new Error('Walker not found');
      const price = walkerProfile.pricing[input.duration as WalkDuration] ?? 0;

      // 2. Simulate payment
      const payment = await simulatePayment(price);
      if (!payment.success) throw new Error('Payment failed');

      // 3. Create the walk record
      const walk = await bookingService.create({
        ...input,
        ownerId: user.id,
        price,
        paymentIntentId: payment.paymentIntentId,
      });

      // 4. Notify walker
      await notificationService.add({
        userId: input.walkerId,
        type: 'walk_request',
        title: 'New Walk Request',
        body: `${user.firstName} ${user.lastName} wants to book a ${input.duration}-min walk.`,
        data: { walkId: walk.id },
      });

      return walk;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['walks', user?.id] }),
  });

  // ── Status transitions ──────────────────────────────────────────────────────
  const confirmWalkMut = useMutation({
    mutationFn: async (walkId: string) => {
      const walk = await bookingService.updateStatus(walkId, 'confirmed');
      if (walk) {
        await notificationService.add({
          userId: walk.ownerId,
          type: 'walk_confirmed',
          title: 'Walk Confirmed!',
          body: `Your walk has been confirmed.`,
          data: { walkId: walk.id },
        });
      }
      return walk;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['walks', user?.id] }),
  });

  const cancelWalkMut = useMutation({
    mutationFn: async (walkId: string) => {
      const walk = await bookingService.cancel(walkId);
      if (walk) {
        const notifyId = user?.role === 'owner' ? walk.walkerId : walk.ownerId;
        await notificationService.add({
          userId: notifyId,
          type: 'walk_cancelled',
          title: 'Walk Cancelled',
          body: `A walk has been cancelled.`,
          data: { walkId: walk.id },
        });
      }
      return walk;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['walks', user?.id] }),
  });

  const startWalkMut = useMutation({
    mutationFn: async (walkId: string) => {
      const walk = await bookingService.updateStatus(walkId, 'in_progress');
      if (walk) {
        setActiveWalk(walk);
        await notificationService.add({
          userId: walk.ownerId,
          type: 'walk_started',
          title: 'Walk Started!',
          body: `Your dog's walk has begun.`,
          data: { walkId: walk.id },
        });
      }
      return walk;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['walks', user?.id] }),
  });

  const completeWalkMut = useMutation({
    mutationFn: async (walkId: string) => {
      stopTracking();
      const walk = await bookingService.updateStatus(walkId, 'completed');
      if (walk) {
        setActiveWalk(null);
        await notificationService.add({
          userId: walk.ownerId,
          type: 'walk_completed',
          title: 'Walk Complete!',
          body: `Your dog's walk is done. Leave a review!`,
          data: { walkId: walk.id },
        });
      }
      return walk;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['walks', user?.id] }),
  });

  // ── GPS tracking simulation ─────────────────────────────────────────────────
  const startTracking = (walkId: string, initialLat = 37.7749, initialLng = -122.4194) => {
    if (gpsIntervalRef.current) return;
    let current = { lat: initialLat, lng: initialLng };
    gpsIntervalRef.current = setInterval(async () => {
      current = simulateGpsStep(current);
      const updated = await bookingService.updateLocation(walkId, current.lat, current.lng);
      if (updated) setActiveWalk(updated);
    }, 3000);
  };

  const stopTracking = () => {
    if (gpsIntervalRef.current) {
      clearInterval(gpsIntervalRef.current);
      gpsIntervalRef.current = null;
    }
  };

  // Clean up interval on unmount
  useEffect(() => {
    return () => stopTracking();
  }, []);

  // ── Reviews ─────────────────────────────────────────────────────────────────
  const submitReviewMut = useMutation({
    mutationFn: async ({
      walkId,
      revieweeId,
      rating,
      comment,
    }: {
      walkId: string;
      revieweeId: string;
      rating: number;
      comment: string;
    }) => {
      if (!user) throw new Error('Not authenticated');
      const review = await reviewService.create({
        walkId,
        reviewerId: user.id,
        revieweeId,
        rating,
        comment,
      });
      await walkerService.updateRating(revieweeId, rating);
      await notificationService.add({
        userId: revieweeId,
        type: 'review',
        title: 'New Review',
        body: `${user.firstName} left you a ${rating}-star review.`,
        data: { walkId },
      });
      return review;
    },
  });

  return {
    walks: walksQuery.data ?? [],
    isLoading: walksQuery.isLoading,
    activeWalk,
    createBooking: createBookingMut.mutateAsync,
    isCreating: createBookingMut.isPending,
    confirmWalk: confirmWalkMut.mutateAsync,
    cancelWalk: cancelWalkMut.mutateAsync,
    startWalk: startWalkMut.mutateAsync,
    completeWalk: completeWalkMut.mutateAsync,
    startTracking,
    stopTracking,
    submitReview: submitReviewMut.mutateAsync,
    isSubmittingReview: submitReviewMut.isPending,
  };
}
