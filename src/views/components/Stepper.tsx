import React from "react";

interface StepperProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
}

export function Stepper({ currentStep, totalSteps, labels }: StepperProps) {
  const defaultLabels = ["Basic Info", "Interests", "About You", "Availability", "Review"];
  const stepLabels = labels || defaultLabels;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, i) => {
          const step = i + 1;
          const isComplete = step < currentStep;
          const isCurrent = step === currentStep;

          return (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                    isComplete
                      ? "bg-green-500 text-white"
                      : isCurrent
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {isComplete ? "✓" : step}
                </div>
                <span
                  className={`text-xs mt-1 ${isCurrent ? "text-blue-600 font-medium" : "text-gray-400"}`}
                >
                  {stepLabels[i] || `Step ${step}`}
                </span>
              </div>
              {step < totalSteps && (
                <div
                  className={`flex-1 h-0.5 mx-2 ${isComplete ? "bg-green-500" : "bg-gray-200"}`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
