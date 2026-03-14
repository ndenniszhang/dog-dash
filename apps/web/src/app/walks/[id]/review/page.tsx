'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod/v3';
import { useBooking } from '@/hooks/useBooking';
import { bookingService } from '@/services/booking.service';
import { reviewService } from '@/services/review.service';
import type { WalkDetail } from '@/types';

const schema = z.object({
  rating: z.coerce.number().min(1).max(5),
  comment: z.string().min(10, 'Please write a brief comment (at least 10 characters)').max(500),
});

type FormData = z.infer<typeof schema>;

export default function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { submitReview, isSubmittingReview } = useBooking();
  const [walk, setWalk] = useState<WalkDetail | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { rating: 0 },
  });

  const rating = watch('rating');

  useEffect(() => {
    bookingService.getDetail(id).then(setWalk);
    reviewService.getForWalk(id).then((r) => { if (r) setSubmitted(true); });
  }, [id]);

  const onSubmit = async (data: FormData) => {
    if (!walk) return;
    await submitReview({
      walkId: id,
      revieweeId: walk.walkerId,
      rating: data.rating,
      comment: data.comment,
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto text-center pt-16">
        <div className="text-6xl mb-6">⭐</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Review Submitted!</h1>
        <p className="text-gray-500 mb-8">Thank you for helping the Dog Dash community.</p>
        <button
          onClick={() => router.push('/dashboard/owner')}
          className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!walk) {
    return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;
  }

  const displayRating = hoveredStar || rating;

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Leave a Review</h1>

      {/* Walker info */}
      <div className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl mb-6">
        <img
          src={walk.walker.imageUrl}
          alt={walk.walker.firstName}
          className="w-14 h-14 rounded-full bg-gray-100"
        />
        <div>
          <div className="font-semibold text-gray-900">{walk.walker.firstName} {walk.walker.lastName}</div>
          <div className="text-sm text-gray-500">Your dog walker</div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Star rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Your Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                onClick={() => setValue('rating', star, { shouldValidate: true })}
                className={`text-4xl transition-transform hover:scale-110 ${
                  star <= displayRating ? 'text-amber-400' : 'text-gray-200'
                }`}
              >
                ★
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-sm text-gray-600 mt-2">
              {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent!'][rating]}
            </p>
          )}
          {errors.rating && <p className="text-xs text-red-600 mt-1">Please select a rating</p>}
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Your Review ({watch('comment')?.length ?? 0}/500)
          </label>
          <textarea
            {...register('comment')}
            rows={5}
            placeholder="How was the walk? Was the walker punctual, attentive to your dog's needs? Would you book again?"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          {errors.comment && <p className="text-xs text-red-600 mt-1">{errors.comment.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmittingReview || rating === 0}
          className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          {isSubmittingReview ? (
            <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Submitting…</>
          ) : '⭐ Submit Review'}
        </button>
      </form>
    </div>
  );
}
