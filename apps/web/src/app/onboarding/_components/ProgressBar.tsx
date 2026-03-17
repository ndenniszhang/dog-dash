"use client";

import { usePathname } from "next/navigation";

interface ProgressBarProps {
  role?: string;
}

const STEP_PATHS = ["/onboarding/role", "/onboarding/profile", "/onboarding/pet", "/onboarding/complete"];
const WALKER_STEP_PATHS = ["/onboarding/role", "/onboarding/profile", "/onboarding/services", "/onboarding/complete"];

function getStepLabels(role?: string) {
  const roleSpecificLabel = role === "walker" ? "Services" : "Your Pet";
  return ["Choose Role", "Your Profile", roleSpecificLabel, "Complete"];
}

function getCurrentStep(pathname: string, role?: string): number {
  if (pathname.includes("/complete")) return 3;
  if (pathname.includes("/pet") || pathname.includes("/services")) return 2;
  if (pathname.includes("/profile")) return 1;
  return 0;
}

export default function ProgressBar({ role }: ProgressBarProps) {
  const pathname = usePathname();
  const currentStep = getCurrentStep(pathname, role);
  const stepLabels = getStepLabels(role);
  const totalSteps = stepLabels.length;
  const progressPct = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        {stepLabels.map((label, i) => (
          <span
            key={label}
            className={`text-xs font-medium ${
              i < currentStep
                ? "text-blue-600"
                : i === currentStep
                ? "text-blue-700 font-semibold"
                : "text-gray-400"
            }`}
          >
            {label}
          </span>
        ))}
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-2 bg-blue-600 rounded-full transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>
      <p className="text-xs text-gray-500 mt-1 text-right">
        Step {currentStep + 1} of {totalSteps}
      </p>
    </div>
  );
}
