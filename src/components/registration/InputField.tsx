import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  className,
  ...props
}) => {
  return (
    <div>
      <Label htmlFor={props.id}>{label}</Label>
      <div className="relative">
        <Input
          {...props}
          className={`${error ? "border-red-500" : ""} ${className || ""}`}
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
    </div>
  );
};
