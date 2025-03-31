import React from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { AlertCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { FileUploadBox } from "./FileUploadBox";
import type { StepProps } from "./types";

export const BankDetails: React.FC<StepProps> = ({
  formData,
  errors,
  onUpdateFormData,
  handleFileChange,
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Bank Account Details</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="bankAccountNumber">Bank Account Number</Label>
          <div className="relative">
            <Input
              id="bankAccountNumber"
              name="bankAccountNumber"
              value={formData.bankDetails.bankAccountNumber}
              onChange={(e) =>
                onUpdateFormData({
                  bankDetails: {
                    ...formData.bankDetails,
                    bankAccountNumber: e.target.value,
                  },
                })
              }
              required
              className={errors.bankAccountNumber ? "border-red-500" : ""}
            />
            {errors.bankAccountNumber && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertCircle className="w-4 h-4 text-red-500 absolute right-2 top-1/2 transform -translate-y-1/2" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{errors.bankAccountNumber}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
        <div>
          <Label htmlFor="ifscCode">IFSC Code</Label>
          <div className="relative">
            <Input
              id="ifscCode"
              name="ifscCode"
              value={formData.bankDetails.ifscCode}
              onChange={(e) =>
                onUpdateFormData({
                  bankDetails: {
                    ...formData.bankDetails,
                    ifscCode: e.target.value,
                  },
                })
              }
              required
              className={errors.ifscCode ? "border-red-500" : ""}
            />
            {errors.ifscCode && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertCircle className="w-4 h-4 text-red-500 absolute right-2 top-1/2 transform -translate-y-1/2" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{errors.ifscCode}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
        <div>
          <Label htmlFor="bankBranchName">Bank Branch Name</Label>
          <Input
            id="bankBranchName"
            name="bankBranchName"
            value={formData.bankDetails.bankBranchName}
            onChange={(e) =>
              onUpdateFormData({
                bankDetails: {
                  ...formData.bankDetails,
                  bankBranchName: e.target.value,
                },
              })
            }
            required
          />
        </div>
        <FileUploadBox
          label="Bank Proof (Cancelled Cheque/Passbook/Statement)"
          onChange={handleFileChange({
            section: "bankDetails",
            field: "bankProof",
          })}
          file={formData.bankDetails.bankProof}
        />
      </div>
    </div>
  );
};
