"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RolePage() {
  const [loading, setLoading] = useState<"owner" | "walker" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function selectRole(role: "owner" | "walker") {
    setLoading(role);
    setError(null);

    try {
      const res = await fetch("/api/onboarding", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, onboardingStep: "profile" }),
      });

      if (!res.ok) throw new Error("Failed to save role");

      router.push("/onboarding/profile");
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(null);
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Welcome to Dog Dash!</h2>
        <p className="text-gray-600 mt-2">Tell us how you&apos;ll be using the app.</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <button
          onClick={() => selectRole("owner")}
          disabled={loading !== null}
          className="flex flex-col items-center p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <div className="text-4xl mb-3">🐾</div>
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700">
            Pet Owner
          </h3>
          <p className="text-sm text-gray-500 mt-1 text-center">
            I want to find a trusted walker for my dog
          </p>
          {loading === "owner" && (
            <div className="mt-3 text-blue-600 text-sm">Setting up your account…</div>
          )}
        </button>

        <button
          onClick={() => selectRole("walker")}
          disabled={loading !== null}
          className="flex flex-col items-center p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <div className="text-4xl mb-3">🦮</div>
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700">
            Dog Walker
          </h3>
          <p className="text-sm text-gray-500 mt-1 text-center">
            I want to walk dogs and earn money
          </p>
          {loading === "walker" && (
            <div className="mt-3 text-blue-600 text-sm">Setting up your account…</div>
          )}
        </button>
      </div>
    </div>
  );
}
