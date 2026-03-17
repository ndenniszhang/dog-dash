import type { ReactNode } from "react";
import { UserButton } from "@clerk/nextjs";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <span className="text-xl font-bold text-blue-600">Dog Dash</span>
          <UserButton showName />
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
