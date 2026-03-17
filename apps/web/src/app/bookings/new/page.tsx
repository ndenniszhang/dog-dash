'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod/v3';
import { useState, useEffect, Suspense } from 'react';
import { useBooking } from '@/hooks/useBooking';
import { useProfile } from '@/hooks/useProfile';
import { walkerService } from '@/services/walker.service';
import type { WalkerWithUser } from '@/types';
import { format, addMinutes } from 'date-fns';

const schema = z.object({
  scheduledStart: z.string().min(1, 'Select a date & time'),
  duration: z.coerce.number().refine((v) => [30, 60, 90].includes(v), 'Select a duration'),
  notes: z.string().max(500).default(''),
  petIds: z.array(z.string()).min(1, 'Select at least one dog'),
});

type FormData = z.infer<typeof schema>;

function NewBookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const walkerId = searchParams.get('walkerId');

  const { createBooking, isCreating } = useBooking();
  const { pets } = useProfile();
  const [walker, setWalker] = useState<WalkerWithUser | null>(null);
  const [loadingWalker, setLoadingWalker] = useState(true);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: { duration: 60, petIds: [] },
  });

  const duration = watch('duration');
  const scheduledStart = watch('scheduledStart');
  const selectedPets = watch('petIds');

  useEffect(() => {
    if (!walkerId) { setLoadingWalker(false); return; }
    walkerService.getByUserId(walkerId).then((p) => {
      if (p) {
        walkerService.getWithUser(p.id).then((w) => { setWalker(w); setLoadingWalker(false); });
      } else setLoadingWalker(false);
    });
  }, [walkerId]);

  // Toggle pet selection
  const togglePet = (petId: string) => {
    const current = selectedPets ?? [];
    const next = current.includes(petId) ? current.filter((id) => id !== petId) : [...current, petId];
    setValue('petIds', next, { shouldValidate: true });
  };

  const price = walker?.pricing[duration as 30 | 60 | 90] ?? 0;
  const endTime = scheduledStart ? addMinutes(new Date(scheduledStart), duration) : null;

  const onSubmit = async (data: FormData) => {
    if (!walkerId) return;
    const walk = await createBooking({
      walkerId,
      petIds: data.petIds,
      scheduledStart: new Date(data.scheduledStart).toISOString(),
      duration: data.duration as 30 | 60 | 90,
      notes: data.notes ?? '',
    });
    router.push(`/bookings/${walk.id}`);
  };

  if (loadingWalker) {
    return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (!walker && !loadingWalker) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 mb-4">No walker selected.</p>
        <button onClick={() => router.push('/dashboard/owner')} className="text-blue-600 hover:underline">Browse walkers</button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-700 mb-6 flex items-center gap-1">
        ← Back
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">Book a Walk</h1>
      {walker && (
        <p className="text-gray-500 text-sm mb-6">with {walker.user.firstName} {walker.user.lastName}</p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Date & time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
          <input
            {...register('scheduledStart')}
            type="datetime-local"
            min={new Date().toISOString().slice(0, 16)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.scheduledStart && <p className="text-xs text-red-600 mt-1">{errors.scheduledStart.message}</p>}
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Walk Duration</label>
          <div className="grid grid-cols-3 gap-3">
            {([30, 60, 90] as const).map((d) => {
              const p = walker?.pricing[d];
              if (!p) return null;
              return (
                <label
                  key={d}
                  className={`cursor-pointer p-3 rounded-xl border-2 text-center transition-all ${
                    duration === d ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <input type="radio" value={d} {...register('duration')} className="sr-only" />
                  <div className="font-bold text-gray-900">{d} min</div>
                  <div className="text-sm text-blue-600 font-semibold">${(p / 100).toFixed(0)}</div>
                </label>
              );
            })}
          </div>
          {errors.duration && <p className="text-xs text-red-600 mt-1">{errors.duration.message}</p>}
        </div>

        {/* Pets */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Dog(s)</label>
          {pets.length === 0 ? (
            <p className="text-sm text-gray-400">No pets added. <a href="/onboarding/owner/pets" className="text-blue-600 hover:underline">Add a dog first.</a></p>
          ) : (
            <div className="space-y-2">
              {pets.map((pet) => (
                <label
                  key={pet.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedPets?.includes(pet.id) ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedPets?.includes(pet.id) ?? false}
                    onChange={() => togglePet(pet.id)}
                    className="rounded text-blue-600"
                  />
                  <div>
                    <div className="font-medium text-sm text-gray-900">{pet.name}</div>
                    <div className="text-xs text-gray-500">{pet.breed} · {pet.weight}lb</div>
                  </div>
                </label>
              ))}
            </div>
          )}
          {errors.petIds && <p className="text-xs text-red-600 mt-1">{errors.petIds.message}</p>}
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes for Walker (optional)</label>
          <textarea
            {...register('notes')}
            rows={3}
            placeholder="Access instructions, key code, special requests…"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Summary */}
        {price > 0 && scheduledStart && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2">
            <div className="font-semibold text-gray-900 text-sm mb-2">Booking Summary</div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Walker</span>
              <span>{walker?.user.firstName} {walker?.user.lastName}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Date</span>
              <span>{format(new Date(scheduledStart), 'EEE, MMM d')}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Time</span>
              <span>{format(new Date(scheduledStart), 'h:mm a')} → {endTime ? format(endTime, 'h:mm a') : '—'}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-gray-900 border-t border-gray-200 pt-2 mt-2">
              <span>Total</span>
              <span>${(price / 100).toFixed(2)}</span>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isCreating || pets.length === 0}
          className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-lg"
        >
          {isCreating ? (
            <><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />Processing payment…</>
          ) : `🔒 Book & Pay $${(price / 100).toFixed(2)}`}
        </button>
      </form>
    </div>
  );
}

export default function NewBookingPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>}>
      <NewBookingForm />
    </Suspense>
  );
}
