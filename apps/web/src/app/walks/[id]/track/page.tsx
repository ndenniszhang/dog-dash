'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBooking } from '@/hooks/useBooking';
import { useAuth } from '@/hooks/useAuth';
import { bookingService } from '@/services/booking.service';
import type { Walk } from '@/types';
import { format, differenceInMinutes } from 'date-fns';

export default function WalkTrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user, role } = useAuth();
  const { startTracking, stopTracking, completeWalk } = useBooking();
  const [walk, setWalk] = useState<Walk | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    bookingService.getById(id).then((w) => {
      setWalk(w);
      setLoading(false);
      if (w && w.status === 'in_progress') {
        const [lng, lat] = w.pickupLocation.coordinates;
        startTracking(id, lat, lng);
      }
    });

    // Subscribe to real-time walk updates
    const unsub = bookingService.subscribe(id, (updated) => setWalk(updated));

    return () => {
      stopTracking();
      unsub();
    };
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleComplete = async () => {
    setCompleting(true);
    await completeWalk(id);
    router.push(`/bookings/${id}`);
  };

  if (loading) {
    return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (!walk) {
    return <div className="text-center py-20 text-gray-500">Walk not found.</div>;
  }

  const currentLat = walk.currentLocation?.coordinates[1];
  const currentLng = walk.currentLocation?.coordinates[0];
  const startTime = new Date(walk.scheduledStart);
  const elapsedMins = differenceInMinutes(new Date(), startTime);
  const progress = Math.min(100, Math.round((elapsedMins / walk.duration) * 100));

  return (
    <div className="max-w-lg mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Walk in Progress</h1>
          <p className="text-sm text-gray-500">Started {format(startTime, 'h:mm a')}</p>
        </div>
        <div className="bg-green-100 text-green-700 text-sm font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Live
        </div>
      </div>

      {/* Map placeholder */}
      <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl overflow-hidden" style={{ height: 280 }}>
        <div className="h-full flex flex-col items-center justify-center gap-3 p-6 text-center">
          <div className="text-5xl animate-bounce">🐕</div>
          <div className="bg-white/80 backdrop-blur rounded-xl px-4 py-3">
            <div className="text-xs text-gray-500 mb-1">Current Location</div>
            {currentLat && currentLng ? (
              <div className="font-mono text-sm text-gray-800">
                {currentLat.toFixed(5)}, {currentLng.toFixed(5)}
              </div>
            ) : (
              <div className="text-sm text-gray-400">Acquiring GPS…</div>
            )}
          </div>
          <p className="text-xs text-gray-500 bg-white/60 px-3 py-1.5 rounded-full">
            📍 GPS updates every 3 seconds
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Walk Progress</span>
          <span className="text-sm text-gray-500">{Math.min(elapsedMins, walk.duration)}/{walk.duration} min</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1.5">
          <span>{format(startTime, 'h:mm a')}</span>
          <span>{format(new Date(walk.scheduledEnd), 'h:mm a')}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Elapsed', value: `${Math.max(0, elapsedMins)} min` },
          { label: 'Remaining', value: `${Math.max(0, walk.duration - elapsedMins)} min` },
          { label: 'Distance', value: `${walk.distance.toFixed(1)} mi` },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-xl p-3 text-center">
            <div className="font-bold text-gray-900">{value}</div>
            <div className="text-xs text-gray-500">{label}</div>
          </div>
        ))}
      </div>

      {/* Walker controls */}
      {role === 'walker' && walk.status === 'in_progress' && (
        <button
          onClick={handleComplete}
          disabled={completing}
          className="w-full bg-gray-900 text-white py-4 rounded-xl font-semibold text-lg disabled:opacity-50 hover:bg-black transition-colors"
        >
          {completing ? 'Completing…' : '✅ Complete Walk'}
        </button>
      )}

      {/* Owner view info */}
      {role === 'owner' && (
        <div className="text-center text-sm text-gray-400 py-2">
          This page updates in real time. Your walker's location refreshes every 3 seconds.
        </div>
      )}
    </div>
  );
}
