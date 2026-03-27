'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useOnboardingStore } from '@/lib/store';

export default function OwnerCompletePage() {
  const router = useRouter();
  const { completeOnboarding } = useAuth();
  const { reset: resetOnboarding } = useOnboardingStore();

  useEffect(() => {
    completeOnboarding().then(() => resetOnboarding());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="max-w-md mx-auto text-center pt-16">
      {/* Confetti-style decoration */}
      <div className="relative mb-8">
        <div className="text-7xl animate-bounce">🎉</div>
        <div className="absolute top-0 left-1/4 text-2xl animate-pulse delay-100">🐾</div>
        <div className="absolute top-2 right-1/4 text-2xl animate-pulse delay-200">🐕</div>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-3">You're all set!</h1>
      <p className="text-gray-500 mb-2">
        Welcome to Dog Dash. Your account is ready — start exploring walkers in your neighborhood.
      </p>
      <p className="text-sm text-gray-400 mb-10">
        San Francisco, CA · Your dogs deserve the best walks 🐶
      </p>

      <div className="grid grid-cols-3 gap-4 mb-10 text-center">
        {[
          { emoji: '🗺️', label: 'GPS tracked walks' },
          { emoji: '⭐', label: 'Vetted walkers' },
          { emoji: '💳', label: 'Secure payments' },
        ].map((f) => (
          <div key={f.label} className="bg-blue-50 rounded-xl p-3">
            <div className="text-2xl mb-1">{f.emoji}</div>
            <div className="text-xs text-blue-700 font-medium">{f.label}</div>
          </div>
        ))}
      </div>

      <button
        onClick={() => router.push('/dashboard/owner')}
        className="bg-blue-600 text-white px-10 py-3.5 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors"
      >
        Find a Walker →
      </button>
    </div>
  );
}
