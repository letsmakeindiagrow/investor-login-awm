import React from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Upload, Check } from "lucide-react";

interface FileUploadBoxProps {
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  file: File | null;
  accept?: string;
}

export const FileUploadBox: React.FC<FileUploadBoxProps> = ({
  label,
  onChange,
  file,
  accept = ".pdf,.jpg,.jpeg,.png",
}) => (
  <div className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition-colors">
    <Label className="block mb-2">{label}</Label>
    <div className="space-y-2">
      {file ? (
        <div className="text-sm text-green-600 flex items-center justify-center gap-2">
          <Check className="w-4 h-4" />
          {file.name}
        </div>
      ) : (
        <Upload className="w-8 h-8 mx-auto text-gray-400" />
      )}
      <Input
        type="file"
        onChange={onChange}
        accept={accept}
        className="hidden"
        id={label.replace(/\s+/g, "")}
      />
      <Button
        type="button"
        variant="outline"
        onClick={() => document.getElementById(label.replace(/\s+/g, ""))?.click()}
      >
        {file ? "Change File" : "Choose File"}
      </Button>
    </div>
  </div>
);
