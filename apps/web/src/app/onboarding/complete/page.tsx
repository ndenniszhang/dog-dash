import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function CompletePage() {
  const user = await currentUser();

  if (!user) redirect("/");

  const meta = user.publicMetadata as {
    role?: "owner" | "walker";
    onboardingComplete?: boolean;
    pet?: { name: string };
  } | null;

  if (!meta?.onboardingComplete) redirect("/onboarding");

  const isOwner = meta.role === "owner";
  const firstName = user.firstName ?? "there";

  return (
    <div className="text-center py-4">
      <div className="text-6xl mb-6">{isOwner ? "🎉" : "🦮"}</div>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        You&apos;re all set, {firstName}!
      </h2>

      <p className="text-gray-600 mb-8">
        {isOwner
          ? `Your account is ready. ${
              meta.pet?.name ? `${meta.pet.name} is` : "Your pet is"
            } going to love their new walker.`
          : "Your walker profile is live. You can now start accepting walk requests."}
      </p>

      <div className="bg-gray-50 rounded-xl p-5 mb-8 text-left space-y-3">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          What&apos;s next
        </h3>
        {isOwner ? (
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">✓</span>
              Browse available walkers in your area
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">✓</span>
              Book your first walk
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">✓</span>
              Add a payment method before booking
            </li>
          </ul>
        ) : (
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">✓</span>
              Complete your availability schedule
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">✓</span>
              Add banking info to receive payouts
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">✓</span>
              Wait for your first walk request
            </li>
          </ul>
        )}
      </div>

      <Link
        href="/dashboard"
        className="inline-block w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-center"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}
