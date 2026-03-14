'use client';

import Link from 'next/link';
import { useWalkerMap } from '@/hooks/useWalkerMap';
import { useBooking } from '@/hooks/useBooking';
import { useBookingStore } from '@/lib/store';
import type { WalkerWithUser, Walk } from '@/types';
import { format } from 'date-fns';

function WalkerCard({ walker, selected, onSelect }: {
  walker: WalkerWithUser;
  selected: boolean;
  onSelect: () => void;
}) {
  const stars = Math.round(walker.rating);
  return (
    <div
      onClick={onSelect}
      className={`bg-white border-2 rounded-xl p-4 cursor-pointer transition-all hover:shadow-md ${
        selected ? 'border-blue-600 shadow-md' : 'border-gray-200'
      }`}
    >
      <div className="flex items-start gap-3">
        <img
          src={walker.user.imageUrl}
          alt={walker.user.firstName}
          className="w-12 h-12 rounded-full bg-gray-100"
        />
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-900">
            {walker.user.firstName} {walker.user.lastName}
          </div>
          <div className="flex items-center gap-1 text-sm text-amber-500">
            {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
            <span className="text-gray-500 text-xs ml-1">{walker.rating} ({walker.totalWalks} walks)</span>
          </div>
          <div className="text-xs text-gray-500 mt-0.5">{walker.distanceMiles ?? '?'} mi away · {walker.city}</div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-xs text-gray-400">from</div>
          <div className="font-bold text-gray-900">${(Math.min(...Object.values(walker.pricing).filter(Boolean)) / 100).toFixed(0)}</div>
          <div className="text-xs text-gray-400">/walk</div>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-3 line-clamp-2">{walker.bio}</p>
      {selected && (
        <Link
          href={`/bookings/new?walkerId=${walker.userId}`}
          onClick={(e) => e.stopPropagation()}
          className="mt-3 block w-full text-center bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          Book {walker.user.firstName} →
        </Link>
      )}
    </div>
  );
}

const WALK_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700' },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-700' },
  in_progress: { label: 'In Progress', color: 'bg-green-100 text-green-700' },
  completed: { label: 'Completed', color: 'bg-gray-100 text-gray-600' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-600' },
};

function UpcomingWalkCard({ walk }: { walk: Walk }) {
  const s = WALK_STATUS_LABELS[walk.status];
  const isPast = walk.status === 'completed' || walk.status === 'cancelled';
  return (
    <Link
      href={`/bookings/${walk.id}`}
      className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between hover:shadow-sm transition-shadow"
    >
      <div>
        <div className="text-sm font-medium text-gray-900">
          {format(new Date(walk.scheduledStart), 'EEE, MMM d')} at {format(new Date(walk.scheduledStart), 'h:mm a')}
        </div>
        <div className="text-xs text-gray-500 mt-0.5">{walk.duration} min walk · ${(walk.price / 100).toFixed(2)}</div>
      </div>
      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${s.color}`}>{s.label}</span>
    </Link>
  );
}

export default function OwnerDashboardPage() {
  const { walkers, selectedWalker, selectWalker, isLoading } = useWalkerMap();
  const { walks } = useBooking();

  const upcomingWalks = walks.filter((w) => !['completed', 'cancelled'].includes(w.status));
  const pastWalks = walks.filter((w) => ['completed', 'cancelled'].includes(w.status)).slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Upcoming walks */}
      {upcomingWalks.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Upcoming Walks</h2>
          <div className="space-y-2">
            {upcomingWalks.map((w) => <UpcomingWalkCard key={w.id} walk={w} />)}
          </div>
        </section>
      )}

      {/* Walker discovery */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Find a Walker</h2>
            <p className="text-sm text-gray-500">Walkers near San Francisco, CA</p>
          </div>
          <div className="text-xs text-gray-400 bg-blue-50 px-2 py-1 rounded-full">
            📍 Live · refreshes every 30s
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-100 rounded-xl h-40 animate-pulse" />
            ))}
          </div>
        ) : walkers.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-3">🗺️</div>
            <p>No walkers available in your area right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {walkers.map((walker) => (
              <WalkerCard
                key={walker.id}
                walker={walker}
                selected={selectedWalker?.id === walker.id}
                onSelect={() => selectWalker(selectedWalker?.id === walker.id ? null : walker)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Past walks */}
      {pastWalks.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-900">Recent Walks</h2>
            <Link href="/bookings" className="text-sm text-blue-600 hover:underline">View all</Link>
          </div>
          <div className="space-y-2">
            {pastWalks.map((w) => <UpcomingWalkCard key={w.id} walk={w} />)}
          </div>
        </section>
      )}
    </div>
  );
}
