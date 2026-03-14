'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useOnboardingStore } from '@/lib/store';
import { useProfile } from '@/hooks/useProfile';

export default function WalkerCompletePage() {
  const router = useRouter();
  const { completeOnboarding } = useAuth();
  const { activateProfile } = useProfile();
  const { reset: resetOnboarding } = useOnboardingStore();

  useEffect(() => {
    Promise.all([completeOnboarding(), activateProfile()]).then(() => resetOnboarding());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="max-w-md mx-auto text-center pt-12">
      <div className="relative mb-8">
        <div className="text-7xl">🐾</div>
        <div className="absolute top-0 left-1/4 text-2xl animate-bounce">⭐</div>
        <div className="absolute top-2 right-1/4 text-2xl animate-bounce delay-100">🦮</div>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-3">Profile Activated!</h1>
      <p className="text-gray-500 mb-2">
        Your walker profile is live. Pet owners in your area can now find and book you.
      </p>
      <p className="text-sm text-gray-400 mb-8">
        Background check in progress — you'll receive an email once approved.
      </p>

      {/* Mock rating display */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8 shadow-sm">
        <div className="text-sm text-gray-500 mb-2">Your starting rating</div>
        <div className="flex items-center justify-center gap-1 text-2xl text-amber-400 mb-1">
          {'★★★★★'.split('').map((s, i) => <span key={i}>{s}</span>)}
        </div>
        <div className="font-bold text-gray-900 text-lg">New Walker</div>
        <div className="text-xs text-gray-400 mt-1">Build your reputation with great walks!</div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {[
          { emoji: '📅', label: 'Manage schedule' },
          { emoji: '💸', label: 'Track earnings' },
          { emoji: '⭐', label: 'Collect reviews' },
          { emoji: '📍', label: 'GPS-verified walks' },
        ].map((f) => (
          <div key={f.label} className="bg-blue-50 rounded-xl p-3">
            <div className="text-2xl mb-1">{f.emoji}</div>
            <div className="text-xs text-blue-700 font-medium">{f.label}</div>
          </div>
        ))}
      </div>

      <button
        onClick={() => router.push('/dashboard/walker')}
        className="bg-blue-600 text-white px-10 py-3.5 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors"
      >
        Go to Dashboard →
      </button>
    </div>
  );
}
