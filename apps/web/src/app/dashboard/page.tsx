import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) redirect("/");

  const meta = user.publicMetadata as {
    role?: "owner" | "walker";
    onboardingComplete?: boolean;
    pet?: { name: string; breed?: string; size?: string };
    services?: { durations: number[]; serviceRadius?: number };
  } | null;

  if (!meta?.onboardingComplete) redirect("/onboarding");

  const isOwner = meta.role === "owner";
  const firstName = user.firstName ?? "there";

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {firstName}!
        </h1>
        <p className="text-gray-500 mt-1">
          {isOwner ? "Find a walker for your dog." : "Manage your walks and schedule."}
        </p>
      </div>

      <div className="grid gap-4">
        {isOwner && meta.pet && (
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🐾</span>
              <h2 className="font-semibold text-gray-900">Your Pet</h2>
            </div>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <dt className="text-gray-500">Name</dt>
              <dd className="text-gray-900 font-medium">{meta.pet.name}</dd>
              {meta.pet.breed && (
                <>
                  <dt className="text-gray-500">Breed</dt>
                  <dd className="text-gray-900">{meta.pet.breed}</dd>
                </>
              )}
              {meta.pet.size && (
                <>
                  <dt className="text-gray-500">Size</dt>
                  <dd className="text-gray-900 capitalize">{meta.pet.size}</dd>
                </>
              )}
            </dl>
          </div>
        )}

        {!isOwner && meta.services && (
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🦮</span>
              <h2 className="font-semibold text-gray-900">Your Services</h2>
            </div>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <dt className="text-gray-500">Walk durations</dt>
              <dd className="text-gray-900">
                {meta.services.durations.sort((a, b) => a - b).join(", ")} min
              </dd>
              {meta.services.serviceRadius && (
                <>
                  <dt className="text-gray-500">Service radius</dt>
                  <dd className="text-gray-900">{meta.services.serviceRadius} miles</dd>
                </>
              )}
            </dl>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">🚧</span>
            <h2 className="font-semibold text-gray-900">Coming soon</h2>
          </div>
          <p className="text-sm text-gray-600">
            {isOwner
              ? "Walk booking, walker search, and payment are on the way."
              : "Walk requests, earnings, and scheduling are on the way."}
          </p>
        </div>
      </div>
    </div>
  );
}
