import React from "react";
import { User, FileText, IdCard, Home, Banknote } from "lucide-react";

export const steps = [
  { icon: <User className="w-6 h-6" />, label: "Initial Registration" },
  { icon: <FileText className="w-6 h-6" />, label: "Personal Details" },
  { icon: <IdCard className="w-6 h-6" />, label: "Identity Document" },
  { icon: <Home className="w-6 h-6" />, label: "Address Details" },
  { icon: <Banknote className="w-6 h-6" />, label: "Bank Account Details" },
];

interface StepIndicatorProps {
  currentStep: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  return (
    <div className="flex justify-center mb-8">
      <div className="flex items-center gap-4 w-4/5">
        {steps.map((stepItem, index) => (
          <div key={index} className="flex items-center flex-1">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-medium ${
                currentStep >= index + 1
                  ? "bg-gradient-to-r from-[#08AFF1] to-[#A4CE3A]"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {stepItem.icon}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 ${
                  currentStep > index + 1
                    ? "bg-gradient-to-r from-[#08AFF1] to-[#A4CE3A]"
                    : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
