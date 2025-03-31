export interface FormData {
  referralCode: string;
  mobileNumber: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  address: {
    line1: string;
    line2: string;
    city: string;
    pincode: string;
  };
  identityDetails: {
    panNumber: string;
    aadharNumber: string;
    panAttachment: File | null;
    aadharFront: File | null;
    aadharBack: File | null;
  };
  bankDetails: {
    bankAccountNumber: string;
    ifscCode: string;
    bankBranchName: string;
    bankProof: File | null;
  };
}

export type FileChangeSection =
  | {
      section: "identityDetails";
      field: "panAttachment" | "aadharFront" | "aadharBack";
    }
  | {
      section: "bankDetails";
      field: "bankProof";
    };

export interface StepProps {
  formData: FormData;
  errors: { [key: string]: string };
  onUpdateFormData: (updatedData: Partial<FormData>) => void;
  handleFileChange: (fileInfo: FileChangeSection) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleVerify: (field: "email" | "mobile") => void;
}
