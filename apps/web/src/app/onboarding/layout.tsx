import type { ReactNode } from "react";
import { currentUser } from "@clerk/nextjs/server";
import ProgressBar from "./_components/ProgressBar";

export default async function OnboardingLayout({ children }: { children: ReactNode }) {
  const user = await currentUser();
  const role = (user?.publicMetadata as { role?: string } | null)?.role;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-lg mx-auto">
          <span className="text-xl font-bold text-blue-600">Dog Dash</span>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center py-10 px-4">
        <div className="w-full max-w-lg">
          <ProgressBar role={role} />
          {children}
        </div>
      </main>
    </div>
  );
}
