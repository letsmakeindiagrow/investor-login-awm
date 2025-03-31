import React from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { AlertCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { FileUploadBox } from "./FileUploadBox";
import type { StepProps } from "./types";

export const IdentityDocuments: React.FC<StepProps> = ({
  formData,
  errors,
  onUpdateFormData,
  handleFileChange,
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Identity Documents</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="panNumber">PAN Number</Label>
          <div className="relative">
            <Input
              id="panNumber"
              name="panNumber"
              value={formData.identityDetails.panNumber}
              onChange={(e) =>
                onUpdateFormData({
                  identityDetails: {
                    ...formData.identityDetails,
                    panNumber: e.target.value,
                  },
                })
              }
              required
              className={errors.panNumber ? "border-red-500" : ""}
            />
            {errors.panNumber && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertCircle className="w-4 h-4 text-red-500 absolute right-2 top-1/2 transform -translate-y-1/2" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{errors.panNumber}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
        <FileUploadBox
          label="PAN Card Attachment"
          onChange={handleFileChange({
            section: "identityDetails",
            field: "panAttachment",
          })}
          file={formData.identityDetails.panAttachment}
        />
        <div>
          <Label htmlFor="aadharNumber">Aadhar Number</Label>
          <div className="relative">
            <Input
              id="aadharNumber"
              name="aadharNumber"
              value={formData.identityDetails.aadharNumber}
              onChange={(e) =>
                onUpdateFormData({
                  identityDetails: {
                    ...formData.identityDetails,
                    aadharNumber: e.target.value,
                  },
                })
              }
              required
              className={errors.aadharNumber ? "border-red-500" : ""}
            />
            {errors.aadharNumber && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertCircle className="w-4 h-4 text-red-500 absolute right-2 top-1/2 transform -translate-y-1/2" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{errors.aadharNumber}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FileUploadBox
            label="Aadhar Front"
            onChange={handleFileChange({
              section: "identityDetails",
              field: "aadharFront",
            })}
            file={formData.identityDetails.aadharFront}
          />
          <FileUploadBox
            label="Aadhar Back"
            onChange={handleFileChange({
              section: "identityDetails",
              field: "aadharBack",
            })}
            file={formData.identityDetails.aadharBack}
          />
        </div>
      </div>
    </div>
  );
};
