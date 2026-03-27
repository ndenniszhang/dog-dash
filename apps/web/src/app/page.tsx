'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { SignInButton, SignedOut, SignedIn } from '@clerk/nextjs';

export default function HomePage() {
  const { user, isLoaded, role, onboardingComplete } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded || !user) return;

    if (!role) {
      router.replace('/onboarding/role');
    } else if (!onboardingComplete) {
      if (role === 'owner') router.replace('/onboarding/owner/profile');
      else router.replace('/onboarding/walker/profile');
    } else {
      if (role === 'owner') router.replace('/dashboard/owner');
      else router.replace('/dashboard/walker');
    }
  }, [isLoaded, user, role, onboardingComplete]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {/* Landing page for signed-out users */}
      <SignedOut>
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center gap-8">
          <div className="text-6xl">🐾</div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Dog Dash</h1>
            <p className="text-xl text-gray-500 max-w-md">
              Connect with vetted, trusted dog walkers in your neighborhood — on demand.
            </p>
          </div>
          <div className="flex gap-4">
            <SignInButton mode="modal">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors">
                Get Started
              </button>
            </SignInButton>
          </div>
          <div className="grid grid-cols-3 gap-6 mt-8 max-w-lg">
            {[
              { icon: '🗺️', title: 'Find Walkers', desc: 'Discover walkers near you in real time' },
              { icon: '📅', title: 'Easy Booking', desc: 'Book and pay in under a minute' },
              { icon: '📍', title: 'Live Tracking', desc: 'Follow your dog\'s walk on a live map' },
            ].map((f) => (
              <div key={f.title} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="text-2xl mb-2">{f.icon}</div>
                <div className="font-semibold text-sm text-gray-900">{f.title}</div>
                <div className="text-xs text-gray-500 mt-1">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </SignedOut>

      {/* Signed-in: show spinner while redirecting */}
      <SignedIn>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-3 text-gray-500">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">Loading your dashboard…</span>
          </div>
        </div>
      </SignedIn>
    </>
  );
}
