"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ProfileFormProps {
  role: "owner" | "walker";
  initialFirstName: string;
  initialLastName: string;
}

export default function ProfileForm({ role, initialFirstName, initialLastName }: ProfileFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    firstName: initialFirstName,
    lastName: initialLastName,
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    bio: "",
    notifEmail: true,
    notifSms: true,
    notifPush: false,
  });

  function set(field: keyof typeof form, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.phone.trim()) {
      setError("Phone number is required.");
      return;
    }
    if (!form.address.trim() || !form.city.trim() || !form.state.trim() || !form.zipCode.trim()) {
      setError("Please fill in your full address.");
      return;
    }
    if (role === "walker" && !form.bio.trim()) {
      setError("Please write a short bio.");
      return;
    }

    setLoading(true);

    const payload: Record<string, unknown> = {
      onboardingStep: "role-specific",
      phone: form.phone.trim(),
      address: form.address.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      zipCode: form.zipCode.trim(),
      notificationPreferences: {
        email: form.notifEmail,
        sms: form.notifSms,
        push: form.notifPush,
      },
    };

    if (role === "walker") {
      payload.bio = form.bio.trim();
    }

    try {
      const res = await fetch("/api/onboarding", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save profile");

      router.push(role === "walker" ? "/onboarding/services" : "/onboarding/pet");
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">First name</label>
          <input
            type="text"
            value={form.firstName}
            onChange={(e) => set("firstName", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            readOnly
          />
          <p className="text-xs text-gray-400 mt-1">From your account</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
          <input
            type="text"
            value={form.lastName}
            onChange={(e) => set("lastName", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            readOnly
          />
          <p className="text-xs text-gray-400 mt-1">From your account</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone number <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          placeholder="(555) 000-0000"
          value={form.phone}
          onChange={(e) => set("phone", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <fieldset>
        <legend className="block text-sm font-medium text-gray-700 mb-2">
          Address <span className="text-red-500">*</span>
        </legend>
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Street address"
            value={form.address}
            onChange={(e) => set("address", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <div className="grid grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="City"
              value={form.city}
              onChange={(e) => set("city", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 col-span-1"
              required
            />
            <input
              type="text"
              placeholder="State"
              value={form.state}
              onChange={(e) => set("state", e.target.value)}
              maxLength={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              placeholder="ZIP"
              value={form.zipCode}
              onChange={(e) => set("zipCode", e.target.value)}
              maxLength={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
      </fieldset>

      {role === "walker" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bio <span className="text-red-500">*</span>
          </label>
          <textarea
            placeholder="Tell pet owners about your experience with dogs, your approach, and why you love walking them…"
            value={form.bio}
            onChange={(e) => set("bio", e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            required
          />
        </div>
      )}

      <fieldset>
        <legend className="block text-sm font-medium text-gray-700 mb-2">
          Notification preferences
        </legend>
        <div className="space-y-2">
          {(
            [
              { key: "notifEmail", label: "Email notifications" },
              { key: "notifSms", label: "SMS notifications" },
              { key: "notifPush", label: "Push notifications" },
            ] as const
          ).map(({ key, label }) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form[key]}
                onChange={(e) => set(key, e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Saving…" : "Continue"}
      </button>
    </form>
  );
}
