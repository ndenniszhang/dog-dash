'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod/v3';
import { useProfile } from '@/hooks/useProfile';
import { ProgressBar } from '@/components/onboarding/ProgressBar';
import type { PetProfile } from '@/types';

const schema = z.object({
  name: z.string().min(1, 'Required'),
  breed: z.string().min(1, 'Required'),
  age: z.coerce.number().min(0).max(30),
  weight: z.coerce.number().min(1).max(300),
  description: z.string().default(''),
  specialNeeds: z.string().default(''),
  vetName: z.string().default(''),
  vetPhone: z.string().default(''),
});

type FormData = z.infer<typeof schema>;

const PetCard = ({ pet, onRemove }: { pet: PetProfile; onRemove: (id: string) => void }) => (
  <div className="flex items-start justify-between p-4 bg-white border border-gray-200 rounded-xl">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-lg">🐕</div>
      <div>
        <div className="font-semibold text-gray-900">{pet.name}</div>
        <div className="text-sm text-gray-500">{pet.breed} · {pet.age}yr · {pet.weight}lb</div>
        {pet.specialNeeds && pet.specialNeeds !== 'None' && (
          <div className="text-xs text-amber-600 mt-0.5">⚠ {pet.specialNeeds}</div>
        )}
      </div>
    </div>
    <button
      onClick={() => onRemove(pet.id)}
      className="text-red-400 hover:text-red-600 text-sm transition-colors"
    >
      Remove
    </button>
  </div>
);

const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    {children}
    {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
  </div>
);

export default function OwnerPetsPage() {
  const router = useRouter();
  const { pets, addPet, removePet, isLoadingPets } = useProfile();
  const showForm = pets.length === 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
  });

  const onAdd = async (data: FormData) => {
    await addPet(data);
    reset();
    router.push('/onboarding/owner/payment');
  };



  return (
    <div className="max-w-lg mx-auto">
      <ProgressBar current={2} total={4} labels={['Profile', 'Pets', 'Payment', 'Done']} />

      <h2 className="text-2xl font-bold text-gray-900 mb-1">Your Dog</h2>
      <p className="text-gray-500 text-sm mb-6">Add your dog so walkers know who they'll be spending time with.</p>

      {/* Existing pets */}
      {isLoadingPets ? (
        <div className="text-sm text-gray-400">Loading pets…</div>
      ) : (
        <div className="space-y-3 mb-4">
          {pets.map((pet) => <PetCard key={pet.id} pet={pet} onRemove={removePet} />)}
        </div>
      )}

      {/* Add pet form */}
      {showForm && (
        <div className="bg-white border border-blue-200 rounded-xl p-5 mb-4">
          <h3 className="font-semibold text-gray-900 mb-4">Add a Dog</h3>
          <form onSubmit={handleSubmit(onAdd)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Name" error={errors.name?.message}>
                <input {...register('name')} placeholder="Buddy" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </Field>
              <Field label="Breed" error={errors.breed?.message}>
                <input {...register('breed')} placeholder="Golden Retriever" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Age (years)" error={errors.age?.message}>
                <input {...register('age')} type="number" placeholder="3" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </Field>
              <Field label="Weight (lbs)" error={errors.weight?.message}>
                <input {...register('weight')} type="number" placeholder="65" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </Field>
            </div>
            <Field label="Description (optional)" error={errors.description?.message}>
              <textarea {...register('description')} placeholder="Friendly and energetic…" rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </Field>
            <Field label="Special Needs (optional)" error={errors.specialNeeds?.message}>
              <input {...register('specialNeeds')} placeholder="Allergies, medications, etc." className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Vet Name (optional)" error={errors.vetName?.message}>
                <input {...register('vetName')} placeholder="Dr. Smith" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </Field>
              <Field label="Vet Phone (optional)" error={errors.vetPhone?.message}>
                <input {...register('vetPhone')} placeholder="(415) 555-9000" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </Field>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={isSubmitting} className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-semibold text-sm disabled:opacity-50 hover:bg-blue-700 transition-colors">
                {isSubmitting ? 'Saving…' : 'Save & Continue'}
              </button>
            </div>
          </form>
        </div>
      )}

      {pets.length > 0 && (
        <button
          onClick={() => router.push('/onboarding/owner/payment')}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
        >
          Continue to Payment →
        </button>
      )}
    </div>
  );
}
