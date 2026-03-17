'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { useOnboardingStore } from '@/lib/store';
import { ProgressBar } from '@/components/onboarding/ProgressBar';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
const DURATIONS = [30, 60, 90] as const;

type Day = typeof DAYS[number];

export default function WalkerSchedulePage() {
  const router = useRouter();
  const { updateAvailability, updatePricing } = useProfile();
  const { patchWalker } = useOnboardingStore();

  const [availability, setAvailability] = useState<Record<Day, boolean>>(
    Object.fromEntries(DAYS.map((d) => [d, false])) as Record<Day, boolean>,
  );
  const [activeDurations, setActiveDurations] = useState<Set<number>>(new Set([30, 60]));
  const [prices, setPrices] = useState<Record<number, string>>({ 30: '25', 60: '45', 90: '60' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const toggleDay = (d: Day) => setAvailability((prev) => ({ ...prev, [d]: !prev[d] }));

  const toggleDuration = (d: number) =>
    setActiveDurations((prev) => {
      const next = new Set(prev);
      next.has(d) ? next.delete(d) : next.add(d);
      return next;
    });

  const handleContinue = async () => {
    const daysSelected = Object.values(availability).some(Boolean);
    if (!daysSelected) { setError('Select at least one available day.'); return; }
    if (activeDurations.size === 0) { setError('Offer at least one walk duration.'); return; }
    setError('');
    setSaving(true);

    const pricingCents: Record<string, number> = {};
    for (const dur of activeDurations) {
      pricingCents[dur] = Math.round(parseFloat(prices[dur] || '0') * 100);
    }

    await updateAvailability(availability);
    await updatePricing(pricingCents);
    patchWalker({ availability, pricing: pricingCents });
    router.push('/onboarding/walker/payment');
  };

  return (
    <div className="max-w-lg mx-auto">
      <ProgressBar current={3} total={5} labels={['Profile', 'Background', 'Schedule', 'Payout', 'Done']} />

      <h2 className="text-2xl font-bold text-gray-900 mb-1">Schedule & Pricing</h2>
      <p className="text-gray-500 text-sm mb-6">When are you available, and what do you charge per walk?</p>

      {/* Availability */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-800 mb-3 text-sm">Weekly Availability</h3>
        <div className="grid grid-cols-7 gap-1.5">
          {DAYS.map((day) => (
            <button
              key={day}
              onClick={() => toggleDay(day)}
              className={`py-2.5 rounded-lg text-xs font-medium transition-all ${
                availability[day]
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {day.slice(0, 3).toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Walk durations + pricing */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-800 mb-3 text-sm">Walk Durations & Rates</h3>
        <div className="space-y-3">
          {DURATIONS.map((dur) => {
            const active = activeDurations.has(dur);
            return (
              <div
                key={dur}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                  active ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-white opacity-60'
                }`}
              >
                <button
                  onClick={() => toggleDuration(dur)}
                  className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                    active ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-400'
                  }`}
                >
                  {active && <span className="text-xs">✓</span>}
                </button>
                <div className="flex-1">
                  <div className="font-medium text-sm text-gray-800">{dur} min walk</div>
                  <div className="text-xs text-gray-500">Approx. {Math.round(dur / 15 * 0.5 * 10) / 10}–{Math.round(dur / 15 * 0.7 * 10) / 10} miles</div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-gray-500 text-sm">$</span>
                  <input
                    type="number"
                    min={5}
                    max={200}
                    value={prices[dur]}
                    onChange={(e) => setPrices((p) => ({ ...p, [dur]: e.target.value }))}
                    disabled={!active}
                    className="w-16 border border-gray-300 rounded-lg px-2 py-1.5 text-sm text-gray-900 bg-white text-right focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      <button
        onClick={handleContinue}
        disabled={saving}
        className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50 hover:bg-blue-700 transition-colors"
      >
        {saving ? 'Saving…' : 'Continue to Payout Setup →'}
      </button>
    </div>
  );
}
