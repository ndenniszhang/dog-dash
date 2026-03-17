"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type PetSize = "small" | "medium" | "large";

export default function PetPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    breed: "",
    age: "",
    weight: "",
    size: "" as PetSize | "",
    specialNeeds: "",
  });

  function set(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.name.trim()) {
      setError("Pet name is required.");
      return;
    }
    if (!form.size) {
      setError("Please select your pet's size.");
      return;
    }

    setLoading(true);

    const pet: Record<string, unknown> = {
      name: form.name.trim(),
      size: form.size,
    };

    if (form.breed.trim()) pet.breed = form.breed.trim();
    if (form.age) pet.age = Number(form.age);
    if (form.weight) pet.weight = Number(form.weight);
    if (form.specialNeeds.trim()) pet.specialNeeds = form.specialNeeds.trim();

    try {
      const res = await fetch("/api/onboarding", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pet,
          onboardingStep: "complete",
          onboardingComplete: true,
        }),
      });

      if (!res.ok) throw new Error("Failed to save pet");

      router.push("/onboarding/complete");
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Add your first pet</h2>
        <p className="text-gray-600 mt-2">
          Help your walker get to know your dog before the first walk.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pet name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Buddy"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Breed</label>
          <input
            type="text"
            placeholder="e.g. Golden Retriever"
            value={form.breed}
            onChange={(e) => set("breed", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Age (years)</label>
            <input
              type="number"
              placeholder="e.g. 3"
              value={form.age}
              onChange={(e) => set("age", e.target.value)}
              min={0}
              max={30}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Weight (lbs)</label>
            <input
              type="number"
              placeholder="e.g. 55"
              value={form.weight}
              onChange={(e) => set("weight", e.target.value)}
              min={0}
              max={300}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Size <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(["small", "medium", "large"] as PetSize[]).map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => set("size", size)}
                className={`py-2 px-3 border-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                  form.size === size
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-200 text-gray-700 hover:border-gray-300"
                }`}
              >
                {size === "small" && "Small (< 25 lbs)"}
                {size === "medium" && "Medium (25–60 lbs)"}
                {size === "large" && "Large (60+ lbs)"}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Special needs or notes
          </label>
          <textarea
            placeholder="e.g. needs medication at noon, reactive to other dogs, favorite treat…"
            value={form.specialNeeds}
            onChange={(e) => set("specialNeeds", e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving…" : "Continue"}
        </button>
      </form>
    </div>
  );
}
