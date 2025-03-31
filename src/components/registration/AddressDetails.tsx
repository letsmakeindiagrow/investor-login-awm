import React from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { AlertCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import type { StepProps } from "./types";

export const AddressDetails: React.FC<StepProps> = ({
  formData,
  errors,
  onUpdateFormData,
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Address Details</h2>
      <div>
        <Label htmlFor="line1">Address Line 1</Label>
        <Input
          id="line1"
          name="line1"
          value={formData.address.line1}
          onChange={(e) =>
            onUpdateFormData({
              address: { ...formData.address, line1: e.target.value },
            })
          }
          required
        />
      </div>
      <div>
        <Label htmlFor="line2">Address Line 2 (Optional)</Label>
        <Input
          id="line2"
          name="line2"
          value={formData.address.line2}
          onChange={(e) =>
            onUpdateFormData({
              address: { ...formData.address, line2: e.target.value },
            })
          }
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            name="city"
            value={formData.address.city}
            onChange={(e) =>
              onUpdateFormData({
                address: { ...formData.address, city: e.target.value },
              })
            }
            required
          />
        </div>
        <div>
          <Label htmlFor="pincode">Pincode</Label>
          <div className="relative">
            <Input
              id="pincode"
              name="pincode"
              value={formData.address.pincode}
              onChange={(e) =>
                onUpdateFormData({
                  address: { ...formData.address, pincode: e.target.value },
                })
              }
              required
              className={errors.pincode ? "border-red-500" : ""}
            />
            {errors.pincode && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertCircle className="w-4 h-4 text-red-500 absolute right-2 top-1/2 transform -translate-y-1/2" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{errors.pincode}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
