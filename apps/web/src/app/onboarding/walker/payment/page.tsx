'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod/v3';
import { useState } from 'react';
import { connectPayoutAccount } from '@/lib/stripe.stub';
import { useOnboardingStore } from '@/lib/store';
import { ProgressBar } from '@/components/onboarding/ProgressBar';

const schema = z.object({
  routingNumber: z.string().regex(/^\d{9}$/, '9-digit routing number required'),
  accountNumber: z.string().regex(/^\d{8,17}$/, '8–17 digit account number required'),
  accountType: z.enum(['checking', 'savings']),
  taxId: z.string().regex(/^\d{4}$/, 'Enter last 4 digits of SSN'),
});

type FormData = z.infer<typeof schema>;

export default function WalkerPaymentPage() {
  const router = useRouter();
  const { patchWalker } = useOnboardingStore();
  const [connected, setConnected] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { accountType: 'checking' },
  });

  const onSubmit = async (data: FormData) => {
    const result = await connectPayoutAccount(data.routingNumber, data.accountNumber);
    if (result.success) {
      patchWalker({ payoutAccountId: result.accountId });
      setConnected(true);
    }
  };

  if (connected) {
    return (
      <div className="max-w-lg mx-auto">
        <ProgressBar current={4} total={5} labels={['Profile', 'Background', 'Schedule', 'Payout', 'Done']} />
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🏦</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Payout Account Connected!</h2>
          <p className="text-gray-500 text-sm mb-8">Earnings will be deposited within 2 business days after each completed walk.</p>
          <button
            onClick={() => router.push('/onboarding/walker/training')}
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Continue →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <ProgressBar current={4} total={5} labels={['Profile', 'Background', 'Schedule', 'Payout', 'Done']} />

      <h2 className="text-2xl font-bold text-gray-900 mb-1">Payout Setup</h2>
      <p className="text-gray-500 text-sm mb-6">Where should we send your earnings?</p>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6 flex gap-2">
        <span className="text-amber-500">🔒</span>
        <p className="text-xs text-amber-700">Demo mode — use any 9-digit routing number and 8-digit account number (e.g. 110000000 / 000123456789).</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="flex gap-4 mb-2">
          {(['checking', 'savings'] as const).map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" value={type} {...register('accountType')} className="text-blue-600" />
              <span className="text-sm text-gray-700 capitalize">{type}</span>
            </label>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Routing Number</label>
          <input
            {...register('routingNumber')}
            placeholder="110000000"
            maxLength={9}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.routingNumber && <p className="text-xs text-red-600 mt-1">{errors.routingNumber.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
          <input
            {...register('accountNumber')}
            placeholder="000123456789"
            type="password"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.accountNumber && <p className="text-xs text-red-600 mt-1">{errors.accountNumber.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last 4 digits of SSN (for 1099)</label>
          <input
            {...register('taxId')}
            placeholder="1234"
            maxLength={4}
            type="password"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.taxId && <p className="text-xs text-red-600 mt-1">{errors.taxId.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50 hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Connecting…</>
          ) : '🏦 Connect Payout Account'}
        </button>
      </form>
    </div>
  );
}
