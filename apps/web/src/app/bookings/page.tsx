'use client';

import Link from 'next/link';
import { useBooking } from '@/hooks/useBooking';
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

function BookingRow({ walk }: { walk: Walk }) {
  const s = STATUS[walk.status];
  return (
    <Link
      href={`/bookings/${walk.id}`}
      className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between hover:shadow-sm transition-shadow"
    >
      <div>
        <div className="font-medium text-gray-900 text-sm">
          {format(new Date(walk.scheduledStart), 'EEE, MMM d · h:mm a')}
        </div>
        <div className="text-xs text-gray-500 mt-0.5">
          {walk.duration} min · {walk.petIds.length} dog(s) · ${(walk.price / 100).toFixed(2)}
        </div>
      </div>
      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${s.color}`}>{s.label}</span>
    </Link>
  );
}

export default function BookingsPage() {
  const { walks, isLoading } = useBooking();
  const { role } = useAuth();

  const active = walks.filter((w) => !['completed', 'cancelled'].includes(w.status));
  const past = walks.filter((w) => ['completed', 'cancelled'].includes(w.status));

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{role === 'owner' ? 'My Bookings' : 'My Walks'}</h1>
        {role === 'owner' && (
          <Link href="/dashboard/owner" className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
            + New Booking
          </Link>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <>
          {active.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Active</h2>
              <div className="space-y-2">
                {active.map((w) => <BookingRow key={w.id} walk={w} />)}
              </div>
            </section>
          )}
          {past.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Past</h2>
              <div className="space-y-2">
                {past.map((w) => <BookingRow key={w.id} walk={w} />)}
              </div>
            </section>
          )}
          {walks.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <div className="text-4xl mb-3">📅</div>
              <p className="mb-4">No walks yet.</p>
              {role === 'owner' && (
                <Link href="/dashboard/owner" className="text-blue-600 hover:underline text-sm">Find a walker →</Link>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
