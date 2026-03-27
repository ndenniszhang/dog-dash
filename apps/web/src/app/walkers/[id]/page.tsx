'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { walkerService } from '@/services/walker.service';
import { reviewService } from '@/services/review.service';
import type { WalkerWithUser, Review } from '@/types';
import { format } from 'date-fns';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export default function WalkerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [walker, setWalker] = useState<WalkerWithUser | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      walkerService.getWithUser(id),
      reviewService.getByReviewee(id.startsWith('wp_') ? id.replace('wp_', 'user_walker_') : id),
    ]).then(([w, r]) => {
      setWalker(w);
      setReviews(r);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!walker) {
    return <div className="text-center py-20 text-gray-500">Walker not found.</div>;
  }

  const stars = Math.round(walker.rating);
  const availDays = DAYS.filter((d) => walker.availability[d]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="flex items-start gap-5">
          <img
            src={walker.user.imageUrl}
            alt={walker.user.firstName}
            className="w-20 h-20 rounded-full bg-gray-100"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">
              {walker.user.firstName} {walker.user.lastName}
            </h1>
            <div className="flex items-center gap-1 text-amber-400 mt-1">
              {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
              <span className="text-gray-500 text-sm ml-1">{walker.rating} · {walker.totalWalks} walks</span>
            </div>
            <div className="text-sm text-gray-500 mt-1">
              📍 {walker.city}, {walker.state} · {walker.serviceRadius} mi radius
            </div>
            <div className={`inline-flex items-center gap-1 mt-2 text-xs font-medium px-2 py-1 rounded-full ${
              walker.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
            }`}>
              {walker.isActive ? '🟢 Available' : '⚫ Unavailable'}
            </div>
          </div>
          <Link
            href={`/bookings/new?walkerId=${walker.userId}`}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors flex-shrink-0"
          >
            Book Now
          </Link>
        </div>
        <p className="mt-4 text-gray-600 text-sm leading-relaxed">{walker.bio}</p>
      </div>

      {/* Pricing */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h2 className="font-bold text-gray-900 mb-4">Pricing</h2>
        <div className="grid grid-cols-3 gap-3">
          {([30, 60, 90] as const).map((dur) => {
            const price = walker.pricing[dur];
            if (!price) return null;
            return (
              <div key={dur} className="text-center p-3 bg-blue-50 rounded-xl">
                <div className="font-bold text-blue-900 text-lg">${(price / 100).toFixed(0)}</div>
                <div className="text-xs text-blue-600 mt-0.5">{dur} min walk</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Availability */}
      {availDays.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="font-bold text-gray-900 mb-3">Availability</h2>
          <div className="flex flex-wrap gap-2">
            {availDays.map((d) => (
              <span key={d} className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full capitalize">
                {d}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Reviews */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h2 className="font-bold text-gray-900 mb-4">Reviews ({reviews.length})</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-400 text-sm">No reviews yet — be the first!</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-amber-400 text-sm">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                  <div className="text-xs text-gray-400">{format(new Date(r.createdAt), 'MMM d, yyyy')}</div>
                </div>
                <p className="text-sm text-gray-700">{r.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA */}
      <Link
        href={`/bookings/new?walkerId=${walker.userId}`}
        className="block w-full bg-blue-600 text-white py-4 rounded-xl font-semibold text-center text-lg hover:bg-blue-700 transition-colors"
      >
        Book {walker.user.firstName} →
      </Link>
    </div>
  );
}
