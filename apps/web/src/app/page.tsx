import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SignInButton } from "@clerk/nextjs";

export default async function Home() {
  const user = await currentUser();

  if (user) {
    const meta = user.publicMetadata as { onboardingComplete?: boolean } | null;
    if (meta?.onboardingComplete) {
      redirect("/dashboard");
    } else {
      redirect("/onboarding");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">🐕</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Dog Dash</h1>
        <p className="text-lg text-gray-600 mb-8">
          Connect with trusted dog walkers in your neighborhood.
        </p>
        <SignInButton mode="modal" forceRedirectUrl="/onboarding">
          <button className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-lg">
            Get started
          </button>
        </SignInButton>
      </div>
    </div>
  );
}
