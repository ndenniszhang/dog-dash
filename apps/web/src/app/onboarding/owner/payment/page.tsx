'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod/v3';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { savePaymentMethod } from '@/lib/stripe.stub';
import { useOnboardingStore } from '@/lib/store';
import { ProgressBar } from '@/components/onboarding/ProgressBar';

const schema = z.object({
  cardNumber: z.string().regex(/^[\d\s]{16,19}$/, 'Enter a valid card number'),
  expiry: z.string().regex(/^\d{2}\/\d{2}$/, 'Use MM/YY format'),
  cvv: z.string().regex(/^\d{3,4}$/, 'Enter 3 or 4 digits'),
  nameOnCard: z.string().min(2, 'Required'),
});

type FormData = z.infer<typeof schema>;

export default function OwnerPaymentPage() {
  const router = useRouter();
  const { patchOwner } = useOnboardingStore();
  const [saved, setSaved] = useState(false);

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    const result = await savePaymentMethod(data.cardNumber, data.expiry, data.cvv);
    if (result.success) {
      patchOwner({ paymentMethodId: result.paymentMethodId, paymentLast4: result.last4 });
      setSaved(true);
    }
  };

  if (saved) {
    return (
      <div className="max-w-lg mx-auto">
        <ProgressBar current={3} total={4} labels={['Profile', 'Pets', 'Payment', 'Done']} />
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✓</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Method Saved</h2>
          <p className="text-gray-500 mb-8">Card ending in {useOnboardingStore.getState().ownerData.paymentLast4 ?? '****'} has been added to your account.</p>
          <button
            onClick={() => router.push('/onboarding/owner/complete')}
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
      <ProgressBar current={3} total={4} labels={['Profile', 'Pets', 'Payment', 'Done']} />

      <h2 className="text-2xl font-bold text-gray-900 mb-1">Payment Method</h2>
      <p className="text-gray-500 text-sm mb-6">Add a card to pay for walks. Charges happen after each walk completes.</p>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6 flex gap-2">
        <span className="text-amber-500">🔒</span>
        <p className="text-xs text-amber-700">This is a demo. Use any test card number (e.g. 4242 4242 4242 4242).</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
          <input
            {...register('cardNumber')}
            placeholder="4242 4242 4242 4242"
            maxLength={19}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono tracking-wider"
          />
          {errors.cardNumber && <p className="text-xs text-red-600 mt-1">{errors.cardNumber.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry</label>
            <input
              {...register('expiry')}
              placeholder="12/26"
              maxLength={5}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
            {errors.expiry && <p className="text-xs text-red-600 mt-1">{errors.expiry.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
            <input
              {...register('cvv')}
              placeholder="123"
              maxLength={4}
              type="password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
            {errors.cvv && <p className="text-xs text-red-600 mt-1">{errors.cvv.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name on Card</label>
          <input
            {...register('nameOnCard')}
            placeholder="Alice Johnson"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.nameOnCard && <p className="text-xs text-red-600 mt-1">{errors.nameOnCard.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50 hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing…
            </>
          ) : (
            '🔒 Save Card'
          )}
        </button>
      </form>
    </div>
  );
}
