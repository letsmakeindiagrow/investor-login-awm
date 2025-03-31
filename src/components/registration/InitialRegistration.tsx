import React from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { VerificationField } from "./VerificationField";
import type { StepProps } from "./types";

export const InitialRegistration: React.FC<StepProps> = ({
  formData,
  errors,
  onUpdateFormData,
  handleVerify,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onUpdateFormData({ [name]: value });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Initial Registration</h2>
      <div>
        <Label htmlFor="referralCode">Referral Code (Optional)</Label>
        <Input
          id="referralCode"
          name="referralCode"
          value={formData.referralCode}
          onChange={handleInputChange}
        />
      </div>
      <VerificationField
        label="Mobile Number"
        value={formData.mobileNumber}
        isVerified={false}
        onChange={(e) => onUpdateFormData({ mobileNumber: e.target.value })}
        onVerify={() => handleVerify("mobile")}
        name="mobileNumber"
        type="tel"
        error={errors.mobileNumber}
      />
      <VerificationField
        label="Email"
        value={formData.email}
        isVerified={false}
        onChange={(e) => onUpdateFormData({ email: e.target.value })}
        onVerify={() => handleVerify("email")}
        name="email"
        type="email"
        error={errors.email}
      />
    </div>
  );
};
