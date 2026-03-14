'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useOnboardingStore } from '@/lib/store';
import type { UserRole } from '@/types';

export default function RoleSelectionPage() {
  const { setRole: setAuthRole } = useAuth();
  const { setRole: setStoreRole } = useOnboardingStore();
  const router = useRouter();
  const [selected, setSelected] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!selected) return;
    setLoading(true);
    await setAuthRole(selected);
    setStoreRole(selected);
    if (selected === 'owner') router.push('/onboarding/owner/profile');
    else router.push('/onboarding/walker/profile');
  };

  return (
    <div className="max-w-xl mx-auto pt-8">
      <div className="text-center mb-10">
        <div className="text-5xl mb-4">🐾</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Dog Dash!</h1>
        <p className="text-gray-500">How will you be using Dog Dash?</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {([
          {
            role: 'owner' as UserRole,
            emoji: '🏠',
            title: "I'm a Pet Owner",
            desc: 'Find trusted walkers for your dogs',
            benefits: ['GPS-tracked walks', 'Instant booking', 'Vetted walkers'],
          },
          {
            role: 'walker' as UserRole,
            emoji: '🚶',
            title: "I'm a Dog Walker",
            desc: 'Earn money walking dogs you love',
            benefits: ['Flexible schedule', 'Set your own rates', 'Reliable payments'],
          },
        ] as const).map(({ role, emoji, title, desc, benefits }) => (
          <button
            key={role}
            onClick={() => setSelected(role)}
            className={`p-6 rounded-2xl border-2 text-left transition-all ${
              selected === role
                ? 'border-blue-600 bg-blue-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
            }`}
          >
            <div className="text-4xl mb-3">{emoji}</div>
            <div className="font-bold text-gray-900 mb-1">{title}</div>
            <div className="text-sm text-gray-500 mb-4">{desc}</div>
            <ul className="space-y-1">
              {benefits.map((b) => (
                <li key={b} className="text-xs text-gray-600 flex items-center gap-1.5">
                  <span className="text-green-500">✓</span> {b}
                </li>
              ))}
            </ul>
            {selected === role && (
              <div className="mt-3 text-xs font-semibold text-blue-600">Selected ✓</div>
            )}
          </button>
        ))}
      </div>

      <button
        onClick={handleContinue}
        disabled={!selected || loading}
        className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
      >
        {loading ? 'Setting up your account…' : 'Continue'}
      </button>
    </div>
  );
}
