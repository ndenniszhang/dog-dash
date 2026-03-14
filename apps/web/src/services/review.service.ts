/**
 * Review service.
 * In-memory stub. Replace internals with Supabase calls.
 */

import type { Review } from '@/types';

// ─── Seed Data ────────────────────────────────────────────────────────────────

const seedReviews: Review[] = [
  {
    id: 'rev_001',
    walkId: 'walk_001',
    reviewerId: 'user_owner_alice',
    revieweeId: 'user_walker_bob',
    rating: 5,
    comment: 'Bob was amazing with Buddy! He sent updates throughout the walk and Buddy came home happy and tired. Will definitely book again.',
    createdAt: '2024-01-20T11:00:00Z',
  },
  {
    id: 'rev_002',
    walkId: 'walk_002',
    reviewerId: 'user_owner_alice',
    revieweeId: 'user_walker_sara',
    rating: 5,
    comment: 'Sara was so gentle with Luna and understood her needs right away. Great walker!',
    createdAt: '2024-01-25T15:30:00Z',
  },
];

// ─── Store ────────────────────────────────────────────────────────────────────

const store = new Map<string, Review>(
  seedReviews.map((r) => [r.id, r]),
);

function now() { return new Date().toISOString(); }
function newId() { return `rev_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`; }

// ─── Service ──────────────────────────────────────────────────────────────────

export const reviewService = {
  async getById(id: string): Promise<Review | null> {
    return store.get(id) ?? null;
  },

  async getForWalk(walkId: string): Promise<Review | null> {
    for (const r of store.values()) {
      if (r.walkId === walkId) return r;
    }
    return null;
  },

  async getByReviewee(revieweeId: string): Promise<Review[]> {
    return Array.from(store.values())
      .filter((r) => r.revieweeId === revieweeId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getByReviewer(reviewerId: string): Promise<Review[]> {
    return Array.from(store.values())
      .filter((r) => r.reviewerId === reviewerId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async create(data: {
    walkId: string;
    reviewerId: string;
    revieweeId: string;
    rating: number;
    comment: string;
  }): Promise<Review> {
    // Check for duplicate
    const existing = await reviewService.getForWalk(data.walkId);
    if (existing) return existing;

    const review: Review = {
      id: newId(),
      walkId: data.walkId,
      reviewerId: data.reviewerId,
      revieweeId: data.revieweeId,
      rating: data.rating,
      comment: data.comment,
      createdAt: now(),
    };
    store.set(review.id, review);
    return review;
  },

  async averageRating(revieweeId: string): Promise<number> {
    const reviews = await reviewService.getByReviewee(revieweeId);
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  },
};
