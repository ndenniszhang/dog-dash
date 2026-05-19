'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useOnboardingStore } from '@/lib/store';
import { ProgressBar } from '@/components/onboarding/ProgressBar';

const PROTOCOLS = [
  {
    id: 'leash',
    title: 'Leash Safety',
    desc: 'Always keep dogs on a leash unless in a designated off-leash area. Check equipment before every walk. Never wrap the leash around your hand.',
  },
  {
    id: 'emergency',
    title: 'Emergency Procedures',
    desc: 'Know the location of the nearest emergency vet. Keep the owner\'s contact info and vet info on hand. Call owner immediately for any incident or injury.',
  },
  {
    id: 'weather',
    title: 'Weather Awareness',
    desc: 'Do not walk dogs in extreme heat (>90°F) or when sidewalks burn. Shorten walks and carry water in hot weather. Watch for signs of overheating.',
  },
  {
    id: 'other_dogs',
    title: 'Dog-to-Dog Interactions',
    desc: 'Ask permission before allowing dogs to meet. Keep a safe distance from reactive dogs. Do not break up a dog fight by grabbing collars — use a distraction.',
  },
  {
    id: 'data',
    title: 'Privacy & Data',
    desc: "Do not share owners' addresses or personal information. GPS tracking is for walk verification only. All walk data is handled per Dog Dash's privacy policy.",
  },
] as const;

export default function WalkerTrainingPage() {
  const router = useRouter();
  const { patchWalker } = useOnboardingStore();
  const [read, setRead] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<string | null>('leash');
  const [certified, setCertified] = useState(false);
  const [saving, setSaving] = useState(false);

  const toggleRead = (id: string) =>
    setRead((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const allRead = read.size === PROTOCOLS.length;
  const canProceed = allRead && certified;

  const handleContinue = async () => {
    setSaving(true);
    patchWalker({ trainingAcknowledged: true });
    router.push('/onboarding/walker/complete');
  };

  return (
    <div className="max-w-lg mx-auto">
      <ProgressBar current={5} total={5} labels={['Profile', 'Background', 'Schedule', 'Payout', 'Done']} />

      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Safety Training</h2>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Review each protocol, then certify your commitment to pet safety.</p>

      <div className="space-y-3 mb-6">
        {PROTOCOLS.map((p) => (
          <div key={p.id} className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
            <button
              onClick={() => setExpanded(expanded === p.id ? null : p.id)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => { e.stopPropagation(); toggleRead(p.id); }}
                  className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                    read.has(p.id) ? 'border-green-500 bg-green-500 text-white' : 'border-gray-300 dark:border-gray-600 dark:bg-gray-800'
                  }`}
                >
                  {read.has(p.id) && <span className="text-xs">✓</span>}
                </button>
                <span className="font-medium text-sm text-gray-900 dark:text-gray-100">{p.title}</span>
              </div>
              <span className="text-gray-400 dark:text-gray-500 text-xs">{expanded === p.id ? '▲' : '▼'}</span>
            </button>
            {expanded === p.id && (
              <div className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800">
                <p className="pt-3">{p.desc}</p>
                {!read.has(p.id) && (
                  <button
                    onClick={() => toggleRead(p.id)}
                    className="mt-3 text-blue-600 dark:text-blue-400 text-xs font-semibold hover:underline"
                  >
                    Mark as read ✓
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className={`p-4 rounded-xl border-2 mb-6 transition-colors ${canProceed ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50'}`}>
        <label className="flex gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={certified}
            onChange={(e) => setCertified(e.target.checked)}
            disabled={!allRead}
            className="mt-0.5 rounded text-green-600 dark:bg-gray-800 dark:border-gray-600"
          />
          <span className={`text-sm ${allRead ? 'text-gray-800 dark:text-gray-200' : 'text-gray-400 dark:text-gray-600'}`}>
            I have read and understood all safety protocols above. I certify that I will follow these guidelines on every walk I conduct through Dog Dash.
          </span>
        </label>
        {!allRead && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 ml-6">Read all {PROTOCOLS.length} protocols to enable this checkbox</p>
        )}
      </div>

      <button
        onClick={handleContinue}
        disabled={!canProceed || saving}
        className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
      >
        {saving ? 'Finalizing…' : 'Complete Setup →'}
      </button>
    </div>
  );
}
