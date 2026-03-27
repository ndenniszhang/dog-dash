'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useBooking } from '@/hooks/useBooking';
import { useAuth } from '@/hooks/useAuth';
import { bookingService } from '@/services/booking.service';
import type { WalkDetail } from '@/types';
import { format } from 'date-fns';

const STATUS_CONFIG = {
  pending: { label: 'Pending Confirmation', color: 'bg-amber-100 text-amber-700', icon: '⏳' },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-700', icon: '✓' },
  in_progress: { label: 'Walk in Progress', color: 'bg-green-100 text-green-700', icon: '🐾' },
  completed: { label: 'Completed', color: 'bg-gray-100 text-gray-700', icon: '✅' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-600', icon: '✕' },
};

export default function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user, role } = useAuth();
  const { confirmWalk, cancelWalk, startWalk, completeWalk } = useBooking();
  const [walk, setWalk] = useState<WalkDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const loadWalk = () => bookingService.getDetail(id).then((w) => { setWalk(w); setLoading(false); });

  useEffect(() => { loadWalk(); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleConfirm = async () => {
    await confirmWalk(id);
    loadWalk();
  };

  const handleCancel = async () => {
    await cancelWalk(id);
    loadWalk();
  };

  const handleStart = async () => {
    await startWalk(id);
    router.push(`/walks/${id}/track`);
  };

  const handleComplete = async () => {
    await completeWalk(id);
    loadWalk();
  };

  if (loading) {
    return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (!walk) {
    return <div className="text-center py-20 text-gray-500">Booking not found.</div>;
  }

  const s = STATUS_CONFIG[walk.status];
  const isOwner = user?.id === walk.ownerId;
  const isWalker = user?.id === walk.walkerId;

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
        ← Back
      </button>

      {/* Status banner */}
      <div className={`flex items-center gap-3 p-4 rounded-xl ${s.color}`}>
        <span className="text-2xl">{s.icon}</span>
        <div>
          <div className="font-semibold">{s.label}</div>
          <div className="text-xs opacity-75">Walk ID: {walk.id.slice(0, 8)}…</div>
        </div>
      </div>

      {/* Walk details */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-3">
        <h2 className="font-bold text-gray-900">Walk Details</h2>
        <div className="space-y-2 text-sm">
          {[
            { label: 'Date', value: format(new Date(walk.scheduledStart), 'EEEE, MMMM d, yyyy') },
            { label: 'Time', value: `${format(new Date(walk.scheduledStart), 'h:mm a')} → ${format(new Date(walk.scheduledEnd), 'h:mm a')}` },
            { label: 'Duration', value: `${walk.duration} minutes` },
            { label: 'Price', value: `$${(walk.price / 100).toFixed(2)}` },
            { label: 'Payment', value: walk.paymentStatus === 'paid' ? '✓ Paid' : 'Unpaid' },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between">
              <span className="text-gray-500">{label}</span>
              <span className="font-medium text-gray-900">{value}</span>
            </div>
          ))}
        </div>
        {walk.notes && (
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">Notes</div>
            <div className="text-sm text-gray-700">{walk.notes}</div>
          </div>
        )}
      </div>

      {/* People */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5">
        <h2 className="font-bold text-gray-900 mb-3">People</h2>
        <div className="space-y-3">
          {[
            { person: walk.owner, role: 'Pet Owner' },
            { person: walk.walker, role: 'Walker' },
          ].map(({ person, role: roleLabel }) => (
            <div key={person.id} className="flex items-center gap-3">
              <img src={person.imageUrl} alt={person.firstName} className="w-10 h-10 rounded-full bg-gray-100" />
              <div>
                <div className="font-medium text-sm text-gray-900">{person.firstName} {person.lastName}</div>
                <div className="text-xs text-gray-500">{roleLabel}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pets */}
      {walk.pets.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <h2 className="font-bold text-gray-900 mb-3">Dogs</h2>
          <div className="space-y-2">
            {walk.pets.map((pet) => (
              <div key={pet.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">🐕</div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{pet.name}</div>
                  <div className="text-xs text-gray-500">{pet.breed} · {pet.weight}lb</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-2">
        {walk.status === 'in_progress' && (
          <Link href={`/walks/${walk.id}/track`} className="block w-full text-center bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors">
            📍 View Live Tracking
          </Link>
        )}
        {walk.status === 'completed' && isOwner && (
          <Link href={`/walks/${walk.id}/review`} className="block w-full text-center bg-amber-500 text-white py-3 rounded-xl font-semibold hover:bg-amber-600 transition-colors">
            ⭐ Leave a Review
          </Link>
        )}
        {walk.status === 'pending' && isOwner && (
          <button onClick={handleCancel} className="w-full border-2 border-red-300 text-red-600 py-3 rounded-xl font-semibold hover:bg-red-50 transition-colors">
            Cancel Booking
          </button>
        )}
        {walk.status === 'pending' && isWalker && (
          <div className="grid grid-cols-2 gap-3">
            <button onClick={handleConfirm} className="bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
              Confirm Walk
            </button>
            <button onClick={handleCancel} className="border-2 border-red-300 text-red-600 py-3 rounded-xl font-semibold hover:bg-red-50 transition-colors">
              Decline
            </button>
          </div>
        )}
        {walk.status === 'confirmed' && isWalker && (
          <button onClick={handleStart} className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors">
            Start Walk
          </button>
        )}
        {walk.status === 'in_progress' && isWalker && (
          <button onClick={handleComplete} className="w-full bg-gray-800 text-white py-3 rounded-xl font-semibold hover:bg-gray-900 transition-colors">
            Complete Walk
          </button>
        )}
      </div>
    </div>
  );
}
