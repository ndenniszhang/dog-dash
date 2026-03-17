import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface OnboardingMetadata {
  role?: "owner" | "walker";
  onboardingStep?: "role" | "profile" | "role-specific" | "complete";
  onboardingComplete?: boolean;
}

export default async function OnboardingPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  const meta = (user.publicMetadata ?? {}) as OnboardingMetadata;

  if (meta.onboardingComplete) {
    redirect("/dashboard");
  }

  const step = meta.onboardingStep;

  if (!step || step === "role") {
    redirect("/onboarding/role");
  }

  if (step === "profile") {
    redirect("/onboarding/profile");
  }

  if (step === "role-specific") {
    if (meta.role === "walker") {
      redirect("/onboarding/services");
    }
    redirect("/onboarding/pet");
  }

  if (step === "complete") {
    redirect("/onboarding/complete");
  }

  redirect("/onboarding/role");
}
