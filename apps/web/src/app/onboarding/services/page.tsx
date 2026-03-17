"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const DURATIONS = [15, 30, 60] as const;
type Duration = (typeof DURATIONS)[number];

export default function ServicesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedDurations, setSelectedDurations] = useState<Duration[]>([30]);
  const [rates, setRates] = useState<Record<Duration, string>>({
    15: "",
    30: "",
    60: "",
  });
  const [serviceRadius, setServiceRadius] = useState("5");

  function toggleDuration(d: Duration) {
    setSelectedDurations((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );
  }

  function setRate(duration: Duration, value: string) {
    setRates((prev) => ({ ...prev, [duration]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (selectedDurations.length === 0) {
      setError("Please select at least one walk duration.");
      return;
    }

    for (const d of selectedDurations) {
      if (!rates[d] || Number(rates[d]) <= 0) {
        setError(`Please enter a rate for ${d}-minute walks.`);
        return;
      }
    }

    setLoading(true);

    const services: Record<string, unknown> = {
      durations: selectedDurations,
      serviceRadius: Number(serviceRadius) || 5,
    };

    for (const d of selectedDurations) {
      services[`baseRate${d}`] = Number(rates[d]);
    }

    try {
      const res = await fetch("/api/onboarding", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          services,
          onboardingStep: "complete",
          onboardingComplete: true,
        }),
      });

      if (!res.ok) throw new Error("Failed to save services");

      router.push("/onboarding/complete");
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  const durationLabels: Record<Duration, string> = {
    15: "15 min",
    30: "30 min",
    60: "60 min",
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Configure your services</h2>
        <p className="text-gray-600 mt-2">
          Set up what walks you offer and what you charge.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Walk durations offered <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {DURATIONS.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => toggleDuration(d)}
                className={`py-2 px-3 border-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedDurations.includes(d)
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-200 text-gray-700 hover:border-gray-300"
                }`}
              >
                {durationLabels[d]}
              </button>
            ))}
          </div>
        </div>

        {selectedDurations.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your rates <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {selectedDurations
                .slice()
                .sort((a, b) => a - b)
                .map((d) => (
                  <div key={d} className="flex items-center gap-3">
                    <span className="w-20 text-sm text-gray-600">{durationLabels[d]}</span>
                    <div className="relative flex-1 max-w-xs">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                        $
                      </span>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={rates[d]}
                        onChange={(e) => setRate(d, e.target.value)}
                        min={1}
                        step="0.01"
                        className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <span className="text-sm text-gray-500">per walk</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Service radius (miles)
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={1}
              max={25}
              value={serviceRadius}
              onChange={(e) => setServiceRadius(e.target.value)}
              className="flex-1"
            />
            <span className="w-16 text-sm font-medium text-gray-700 text-center">
              {serviceRadius} mi
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            You&apos;ll only see walk requests within this radius of your address.
          </p>
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
