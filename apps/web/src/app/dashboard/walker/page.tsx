'use client';

import Link from 'next/link';
import { useBooking } from '@/hooks/useBooking';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import type { Walk } from '@/types';
import { format } from 'date-fns';

const STATUS = {
  pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700' },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-700' },
  in_progress: { label: 'In Progress', color: 'bg-green-100 text-green-700' },
  completed: { label: 'Completed', color: 'bg-gray-100 text-gray-600' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-600' },
};

function WalkRow({ walk, onConfirm, onDecline, onStart }: {
  walk: Walk;
  onConfirm: (id: string) => void;
  onDecline: (id: string) => void;
  onStart: (id: string) => void;
}) {
  const s = STATUS[walk.status];
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="font-medium text-gray-900">
            {format(new Date(walk.scheduledStart), 'EEE, MMM d')} · {format(new Date(walk.scheduledStart), 'h:mm a')}
          </div>
          <div className="text-sm text-gray-500">{walk.duration} min · {walk.petIds.length} dog(s)</div>
        </div>
        <div className="text-right">
          <div className="font-bold text-gray-900">${(walk.price / 100).toFixed(2)}</div>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.color}`}>{s.label}</span>
        </div>
      </div>
      <div className="flex gap-2">
        {walk.status === 'pending' && (
          <>
            <button
              onClick={() => onConfirm(walk.id)}
              className="flex-1 bg-blue-600 text-white py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Confirm
            </button>
            <button
              onClick={() => onDecline(walk.id)}
              className="flex-1 border border-gray-300 text-gray-600 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Decline
            </button>
          </>
        )}
        {walk.status === 'confirmed' && (
          <button
            onClick={() => onStart(walk.id)}
            className="flex-1 bg-green-600 text-white py-1.5 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
          >
            Start Walk
          </button>
        )}
        {walk.status === 'in_progress' && (
          <Link
            href={`/walks/${walk.id}/track`}
            className="flex-1 bg-green-600 text-white py-1.5 rounded-lg text-sm font-medium text-center hover:bg-green-700 transition-colors"
          >
            📍 Live Tracking
          </Link>
        )}
        <Link
          href={`/bookings/${walk.id}`}
          className="px-4 border border-gray-300 text-gray-600 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Details
        </Link>
      </div>
    </div>
  );
}

export default function WalkerDashboardPage() {
  const { walks, isLoading, confirmWalk, cancelWalk, startWalk } = useBooking();
  const { walkerProfile } = useProfile();
  const { user } = useAuth();

  const upcoming = walks.filter((w) => !['completed', 'cancelled'].includes(w.status));
  const past = walks.filter((w) => w.status === 'completed');
  const totalEarnings = past.reduce((sum, w) => sum + w.price, 0);

  const handleStart = async (walkId: string) => {
    await startWalk(walkId);
    window.location.href = `/walks/${walkId}/track`;
  };

  return (
    <div className="space-y-8">
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">${(totalEarnings / 100).toFixed(0)}</div>
          <div className="text-xs text-gray-500 mt-1">Total Earned</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{past.length}</div>
          <div className="text-xs text-gray-500 mt-1">Walks Completed</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-amber-500">{walkerProfile?.rating ?? '—'}</div>
          <div className="text-xs text-gray-500 mt-1">Rating ★</div>
        </div>
      </div>

      {/* Walker profile status */}
      {walkerProfile && (
        <div className={`p-4 rounded-xl flex items-center gap-3 ${
          walkerProfile.isActive ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'
        }`}>
          <span className="text-xl">{walkerProfile.isActive ? '🟢' : '🟡'}</span>
          <div>
            <div className="font-medium text-sm text-gray-900">
              {walkerProfile.isActive ? 'Profile Active' : 'Profile Pending Activation'}
            </div>
            <div className="text-xs text-gray-500">
              {walkerProfile.isActive
                ? `Visible to owners within ${walkerProfile.serviceRadius} miles`
                : 'Background check in progress — usually 2 business days'}
            </div>
          </div>
        </div>
      )}

      {/* Upcoming walks */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-3">
          Upcoming Walks
          {upcoming.length > 0 && (
            <span className="ml-2 text-sm font-normal text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{upcoming.length}</span>
          )}
        </h2>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => <div key={i} className="bg-gray-100 rounded-xl h-28 animate-pulse" />)}
          </div>
        ) : upcoming.length === 0 ? (
          <div className="text-center py-10 text-gray-400 bg-white border border-gray-200 rounded-xl">
            <div className="text-3xl mb-2">📅</div>
            <p className="text-sm">No upcoming walks. New requests will appear here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcoming.map((w) => (
              <WalkRow
                key={w.id}
                walk={w}
                onConfirm={confirmWalk}
                onDecline={cancelWalk}
                onStart={handleStart}
              />
            ))}
          </div>
        )}
      </section>

      {/* Past walks */}
      {past.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-900">Recent Walks</h2>
            <Link href="/bookings" className="text-sm text-blue-600 hover:underline">View all</Link>
          </div>
          <div className="space-y-2">
            {past.slice(0, 3).map((w) => (
              <Link
                key={w.id}
                href={`/bookings/${w.id}`}
                className="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-3 hover:shadow-sm transition-shadow"
              >
                <div>
                  <div className="text-sm font-medium text-gray-900">{format(new Date(w.scheduledStart), 'MMM d, yyyy')}</div>
                  <div className="text-xs text-gray-500">{w.duration} min</div>
                </div>
                <div className="text-sm font-semibold text-gray-900">${(w.price / 100).toFixed(2)}</div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
