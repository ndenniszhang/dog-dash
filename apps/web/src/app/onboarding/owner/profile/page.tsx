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
  state: z.string().length(2, 'Use 2-letter state code'),
  zipCode: z.string().regex(/^\d{5}$/, 'Enter a 5-digit ZIP'),
  emergencyContactName: z.string().min(1, 'Required'),
  emergencyContactPhone: z.string().min(10, 'Enter a valid phone number'),
  notifyWalkRequests: z.boolean(),
  notifyWalkUpdates: z.boolean(),
  notifyPayments: z.boolean(),
});

type FormData = z.infer<typeof schema>;

export default function OwnerProfilePage() {
  const router = useRouter();
  const { updateOwnerProfile } = useProfile();
  const { patchOwner } = useOnboardingStore();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      notifyWalkRequests: true,
      notifyWalkUpdates: true,
      notifyPayments: true,
    },
  });

  const onSubmit = async (data: FormData) => {
    await updateOwnerProfile({
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      address: data.address,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      emergencyContactName: data.emergencyContactName,
      emergencyContactPhone: data.emergencyContactPhone,
      notificationPrefs: {
        walkRequests: data.notifyWalkRequests,
        walkUpdates: data.notifyWalkUpdates,
        payments: data.notifyPayments,
        marketing: false,
      },
    });
    patchOwner({
      firstName: data.firstName, lastName: data.lastName, phone: data.phone,
      address: data.address, city: data.city, state: data.state, zipCode: data.zipCode,
      emergencyContactName: data.emergencyContactName,
      emergencyContactPhone: data.emergencyContactPhone,
    });
    router.push('/onboarding/owner/pets');
  };

  const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const input = (name: keyof FormData, placeholder = '') =>
    <input
      {...(register as any)(name)}
      placeholder={placeholder}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />;

  return (
    <div className="max-w-lg mx-auto">
      <ProgressBar current={1} total={4} labels={['Profile', 'Pets', 'Payment', 'Done']} />

      <h2 className="text-2xl font-bold text-gray-900 mb-1">Your Profile</h2>
      <p className="text-gray-500 text-sm mb-6">Tell us about yourself so walkers can get to know you.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Name */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="First Name" error={errors.firstName?.message}>
            {input('firstName', 'Alice')}
          </Field>
          <Field label="Last Name" error={errors.lastName?.message}>
            {input('lastName', 'Johnson')}
          </Field>
        </div>

        <Field label="Phone Number" error={errors.phone?.message}>
          {input('phone', '(415) 555-0000')}
        </Field>

        {/* Address */}
        <Field label="Street Address" error={errors.address?.message}>
          {input('address', '123 Main St')}
        </Field>
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-1">
            <Field label="City" error={errors.city?.message}>{input('city', 'San Francisco')}</Field>
          </div>
          <Field label="State" error={errors.state?.message}>{input('state', 'CA')}</Field>
          <Field label="ZIP" error={errors.zipCode?.message}>{input('zipCode', '94102')}</Field>
        </div>

        {/* Emergency contact */}
        <div className="border-t border-gray-100 pt-5">
          <h3 className="font-semibold text-gray-800 mb-3 text-sm">Emergency Contact</h3>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Contact Name" error={errors.emergencyContactName?.message}>
              {input('emergencyContactName', 'John Johnson')}
            </Field>
            <Field label="Contact Phone" error={errors.emergencyContactPhone?.message}>
              {input('emergencyContactPhone', '(415) 555-1111')}
            </Field>
          </div>
        </div>

        {/* Notification prefs */}
        <div className="border-t border-gray-100 pt-5">
          <h3 className="font-semibold text-gray-800 mb-3 text-sm">Notification Preferences</h3>
          <div className="space-y-2">
            {([
              { name: 'notifyWalkRequests', label: 'Walk requests & confirmations' },
              { name: 'notifyWalkUpdates', label: 'Walk status updates' },
              { name: 'notifyPayments', label: 'Payment receipts' },
            ] as const).map(({ name, label }) => (
              <label key={name} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="checkbox" {...register(name)} className="rounded text-blue-600 focus:ring-blue-500" />
                {label}
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50 hover:bg-blue-700 transition-colors"
        >
          {isSubmitting ? 'Saving…' : 'Continue to Pets →'}
        </button>
      </form>
    </div>
  );
}
