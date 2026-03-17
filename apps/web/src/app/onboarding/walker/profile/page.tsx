'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod/v3';
import { useProfile } from '@/hooks/useProfile';
import { useOnboardingStore } from '@/lib/store';
import { ProgressBar } from '@/components/onboarding/ProgressBar';

const schema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  phone: z.string().min(10, 'Enter a valid phone number'),
  address: z.string().min(5, 'Required'),
  city: z.string().min(1, 'Required'),
  state: z.string().length(2, 'Use 2-letter code'),
  zipCode: z.string().regex(/^\d{5}$/, '5-digit ZIP'),
  bio: z.string().min(50, 'Tell us a bit more (at least 50 characters)').max(500),
  serviceRadius: z.coerce.number().min(1).max(20),
});

type FormData = z.infer<typeof schema>;

const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    {children}
    {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
  </div>
);

export default function WalkerProfilePage() {
  const router = useRouter();
  const { updateWalkerProfile } = useProfile();
  const { patchWalker } = useOnboardingStore();

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { serviceRadius: 5 },
  });

  const bioValue = watch('bio', '');
  const radiusValue = watch('serviceRadius', 5);

  const onSubmit = async (data: FormData) => {
    await updateWalkerProfile({
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      address: data.address,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      bio: data.bio,
      serviceRadius: data.serviceRadius,
    });
    patchWalker({
      firstName: data.firstName, lastName: data.lastName, phone: data.phone,
      address: data.address, city: data.city, state: data.state, zipCode: data.zipCode,
      bio: data.bio, serviceRadius: data.serviceRadius,
    });
    router.push('/onboarding/walker/background');
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const inp = (name: keyof FormData, placeholder = '') => (
    <input
      {...(register as any)(name)}
      placeholder={placeholder}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );



  return (
    <div className="max-w-lg mx-auto">
      <ProgressBar current={1} total={5} labels={['Profile', 'Background', 'Schedule', 'Payout', 'Done']} />

      <h2 className="text-2xl font-bold text-gray-900 mb-1">Your Walker Profile</h2>
      <p className="text-gray-500 text-sm mb-6">Tell pet owners about yourself and your experience.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <Field label="First Name" error={errors.firstName?.message}>{inp('firstName', 'Bob')}</Field>
          <Field label="Last Name" error={errors.lastName?.message}>{inp('lastName', 'Martinez')}</Field>
        </div>
        <Field label="Phone Number" error={errors.phone?.message}>{inp('phone', '(415) 555-0202')}</Field>
        <Field label="Street Address" error={errors.address?.message}>{inp('address', '742 Mission St')}</Field>
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-1">
            <Field label="City" error={errors.city?.message}>{inp('city', 'San Francisco')}</Field>
          </div>
          <Field label="State" error={errors.state?.message}>{inp('state', 'CA')}</Field>
          <Field label="ZIP" error={errors.zipCode?.message}>{inp('zipCode', '94103')}</Field>
        </div>

        <Field label={`About You (${bioValue?.length ?? 0}/500)`} error={errors.bio?.message}>
          <textarea
            {...register('bio')}
            rows={4}
            placeholder="Tell pet owners about your experience with dogs, any certifications, and what makes you a great walker…"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </Field>

        <Field label={`Service Radius: ${radiusValue} miles`} error={errors.serviceRadius?.message}>
          <input
            {...register('serviceRadius')}
            type="range"
            min={1}
            max={20}
            className="w-full accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>1 mi</span>
            <span>10 mi</span>
            <span>20 mi</span>
          </div>
        </Field>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50 hover:bg-blue-700 transition-colors"
        >
          {isSubmitting ? 'Saving…' : 'Continue →'}
        </button>
      </form>
    </div>
  );
}
