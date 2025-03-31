import React from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Check, AlertCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface VerificationFieldProps {
  label: string;
  value: string;
  isVerified: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVerify: () => void;
  name: string;
  type?: string;
  error?: string;
}

export const VerificationField: React.FC<VerificationFieldProps> = ({
  label,
  value,
  isVerified,
  onChange,
  onVerify,
  name,
  type = "text",
  error,
}) => (
  <div className="space-y-2">
    <Label htmlFor={name}>{label}</Label>
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          className={isVerified ? "border-green-500" : error ? "border-red-500" : ""}
          required
        />
        {error && (
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertCircle className="w-4 h-4 text-red-500 absolute right-2 top-1/2 transform -translate-y-1/2" />
            </TooltipTrigger>
            <TooltipContent>
              <p>{error}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
      <Button
        type="button"
        onClick={onVerify}
        disabled={isVerified || !value}
        className="whitespace-nowrap bg-blue-600 text-white hover:bg-blue-700"
      >
        {isVerified ? (
          <span className="flex items-center gap-1">
            <Check className="w-4 h-4" /> Verified
          </span>
        ) : (
          "Verify"
        )}
      </Button>
    </div>
  </div>
);
