'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod/v3';
import { useState } from 'react';
import { walkerService } from '@/services/walker.service';
import { useAuth } from '@/hooks/useAuth';
import { useOnboardingStore } from '@/lib/store';
import { ProgressBar } from '@/components/onboarding/ProgressBar';

const schema = z.object({
  idType: z.enum(["driver's_license", 'passport', 'state_id'], { required_error: 'Select an ID type' }),
  idFile: z.any(),
  consent: z.literal(true, { errorMap: () => ({ message: 'You must consent to the background check' }) }),
  ref1Name: z.string().min(2, 'Required'),
  ref1Phone: z.string().min(10, 'Valid phone required'),
  ref2Name: z.string().min(2, 'Required'),
  ref2Phone: z.string().min(10, 'Valid phone required'),
});

type FormData = z.infer<typeof schema>;

export default function WalkerBackgroundPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { patchWalker } = useOnboardingStore();
  const [submitted, setSubmitted] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (_data: FormData) => {
    if (user) {
      await walkerService.submitBackgroundCheck(user.id);
      patchWalker({ backgroundCheckSubmitted: true });
    }
    setSubmitted(true);
    setTimeout(() => router.push('/onboarding/walker/schedule'), 2000);
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto">
        <ProgressBar current={2} total={5} labels={['Profile', 'Background', 'Schedule', 'Payout', 'Done']} />
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📋</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Background Check Submitted!</h2>
          <p className="text-gray-500 text-sm mb-4">
            We'll process your check within 2 business days. In the meantime, let's set up your schedule.
          </p>
          <div className="flex items-center justify-center gap-2 text-blue-600 text-sm">
            <span className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            Continuing setup…
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <ProgressBar current={2} total={5} labels={['Profile', 'Background', 'Schedule', 'Payout', 'Done']} />

      <h2 className="text-2xl font-bold text-gray-900 mb-1">Background Check</h2>
      <p className="text-gray-500 text-sm mb-6">We verify all walkers to ensure pet owners can trust you completely.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* ID Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Government-Issued ID</label>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {(["driver's_license", 'passport', 'state_id'] as const).map((type) => (
              <label key={type} className="flex items-center gap-2 cursor-pointer p-2 border border-gray-200 rounded-lg hover:border-blue-400">
                <input type="radio" value={type} {...register('idType')} className="text-blue-600" />
                <span className="text-xs text-gray-700 capitalize">{type.replace('_', ' ')}</span>
              </label>
            ))}
          </div>
          {errors.idType && <p className="text-xs text-red-600 mb-2">{errors.idType.message}</p>}

          <div
            className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 cursor-pointer transition-colors"
            onClick={() => document.getElementById('id-upload')?.click()}
          >
            <input
              id="id-upload"
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              {...register('idFile', {
                onChange: (e) => setFileName(e.target.files?.[0]?.name ?? null),
              })}
            />
            {fileName ? (
              <div className="text-green-600 text-sm font-medium">✓ {fileName}</div>
            ) : (
              <>
                <div className="text-3xl mb-2">📄</div>
                <div className="text-sm text-gray-500">Click to upload ID photo or PDF</div>
                <div className="text-xs text-gray-400 mt-1">JPG, PNG, PDF — max 10MB</div>
              </>
            )}
          </div>
        </div>

        {/* Consent */}
        <label className="flex gap-3 cursor-pointer p-4 bg-blue-50 rounded-xl border border-blue-200">
          <input type="checkbox" {...register('consent')} className="mt-0.5 rounded text-blue-600" />
          <span className="text-sm text-gray-700">
            I consent to a background check being conducted. I certify that all information provided is accurate and truthful.
          </span>
        </label>
        {errors.consent && <p className="text-xs text-red-600 -mt-4">{errors.consent.message}</p>}

        {/* References */}
        <div className="border-t border-gray-100 pt-5">
          <h3 className="font-semibold text-gray-800 mb-3 text-sm">Two References</h3>
          <div className="space-y-4">
            {([1, 2] as const).map((n) => (
              <div key={n} className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Reference {n} Name</label>
                  <input
                    {...register(`ref${n}Name` as 'ref1Name' | 'ref2Name')}
                    placeholder="Jane Doe"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors[`ref${n}Name` as keyof typeof errors] && (
                    <p className="text-xs text-red-600 mt-1">{(errors[`ref${n}Name` as keyof typeof errors] as { message?: string })?.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Reference {n} Phone</label>
                  <input
                    {...register(`ref${n}Phone` as 'ref1Phone' | 'ref2Phone')}
                    placeholder="(415) 555-0000"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50 hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Submitting…</>
          ) : 'Submit Background Check →'}
        </button>
      </form>
    </div>
  );
}
