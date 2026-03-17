import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ProfileForm from "./_ProfileForm";

export default async function ProfilePage() {
  const user = await currentUser();

  if (!user) redirect("/");

  const meta = user.publicMetadata as { role?: string; onboardingStep?: string } | null;

  if (!meta?.role) redirect("/onboarding/role");

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Set up your profile</h2>
        <p className="text-gray-600 mt-2">
          {meta.role === "walker"
            ? "Tell pet owners about yourself."
            : "Let us know how to reach you."}
        </p>
      </div>

      <ProfileForm
        role={meta.role as "owner" | "walker"}
        initialFirstName={user.firstName ?? ""}
        initialLastName={user.lastName ?? ""}
      />
    </div>
  );
}
