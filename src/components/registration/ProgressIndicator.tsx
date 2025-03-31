import React from "react";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  totalSteps,
}) => {
  return (
    <div className="flex justify-between mb-8">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((num) => (
        <div key={num} className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= num ? "bg-[#08AFF1] text-white" : "bg-gray-200"
            }`}
          >
            {num}
          </div>
          {num < totalSteps && (
            <div
              className={`w-16 h-1 ${
                currentStep > num ? "bg-[#08AFF1]" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};
