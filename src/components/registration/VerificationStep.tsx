import React from "react";
import { Button } from "@/components/ui/button";

interface VerificationStepProps {
  email: string;
  isEmailVerified: boolean;
  onVerifyClick: () => void;
  onFinalSubmit: () => void;
}

export const VerificationStep: React.FC<VerificationStepProps> = ({
  email,
  isEmailVerified,
  onVerifyClick,
  onFinalSubmit,
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Verify Your Contact Details</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span>Email: {email}</span>
          <div className="flex gap-2">
            <Button
              onClick={onVerifyClick}
              disabled={isEmailVerified}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {isEmailVerified ? "Verified ✓" : "Verify"}
            </Button>
          </div>
        </div>
        {isEmailVerified && (
          <div className="mt-6 flex justify-center">
            <Button
              onClick={onFinalSubmit}
              className="bg-green-600 text-white hover:bg-green-700 px-8"
            >
              Complete Registration
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
