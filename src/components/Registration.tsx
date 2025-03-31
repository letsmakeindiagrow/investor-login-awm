import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import {
  ArrowRight,
  ArrowLeft,
  Upload,
  Check,
  AlertCircle,
  // Edit2,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User, FileText, IdCard, Home, Banknote } from "lucide-react";

interface FormData {
  referralCode: string;
  mobileNumber: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  panNumber: string;
  aadharNumber: string;
  line1: string;
  line2: string;
  city: string;
  pincode: string;
  bankAccountNumber: string;
  ifscCode: string;
  bankBranchName: string;
  isEmailVerified: boolean;
  isMobileVerified: boolean;
}

interface Documents {
  panAttachment: string;
  aadharFront: string;
  aadharBack: string;
  bankProof: string;
}

interface reqBody {
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
  bankDetails: {
    accountNumber: string;
    ifscCode: string;
    branchName: string;
    proofAttachment: string;
  };
  identityDetails: {
    panNumber: string;
    panAttachment: string;
    aadharNumber: string;
    aadharFront: string;
    aadharBack: string;
  };
}

interface FileUploadBoxProps {
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  file: string;
  accept?: string;
}

interface OTPDialogProps {
  isOpen: boolean;
  onClose: () => void;
  // onVerify: (otp: string) => void;
  type: "email" | "mobile";
}

const steps = [
  { icon: <User className="w-6 h-6" />, label: "Initial Registration" },
  { icon: <FileText className="w-6 h-6" />, label: "Personal Details" },
  { icon: <IdCard className="w-6 h-6" />, label: "Identity Document" },
  { icon: <Home className="w-6 h-6" />, label: "Address Details" },
  { icon: <Banknote className="w-6 h-6" />, label: "Bank Account Details" },
];

const FileUploadBox: React.FC<FileUploadBoxProps> = ({
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
          {/* {file.name} */}
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
        onClick={() =>
          document.getElementById(label.replace(/\s+/g, ""))?.click()
        }
      >
        {file ? "Change File" : "Choose File"}
      </Button>
    </div>
  </div>
);

const OTPDialog: React.FC<OTPDialogProps> = ({
  isOpen,
  onClose,
  // onVerify,
  type,
}) => {
  const [otp, setOtp] = useState("");
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission from refreshing the page

    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        console.error("User ID not found in localStorage");
        return;
      }

      const response = await axios.post(
        "http://localhost:5001/api/v1/auth/verify-otp",
        {
          userId,
          otp,
        }
      );

      if (response.data) {
        console.log("OTP verified successfully");
        onClose();
        console.log(response);
      }
    } catch (error) {
      console.error("OTP verification failed:", error);
      // Handle error appropriately (show error message to user)
    }
  };

  // const [generatedOTP, setGeneratedOTP] = useState("");

  // React.useEffect(() => {
  //   if (isOpen) {
  //     const newOTP = Math.floor(100000 + Math.random() * 900000).toString();
  //     setGeneratedOTP(newOTP);
  //     console.log(`OTP for ${type}: ${newOTP}`);
  //     alert(`OTP for ${type}: ${newOTP}`);
  //   }
  // }, [isOpen, type]);

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (otp === generatedOTP) {
  //     onVerify(otp);
  //     setOtp("");
  //   } else {
  //     alert("Invalid OTP");
  //   }
  // };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter OTP sent to your {type}</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleVerify}>
          <div>
            <Label htmlFor="otp">OTP</Label>
            <Input
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              pattern="\d{6}"
              required
              placeholder="Enter 6-digit OTP"
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            // onClick={() => onVerify(otp)}
          >
            Verify OTP
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const RegistrationForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [showEmailOTP, setShowEmailOTP] = useState(false);
  // const [showMobileOTP, setShowMobileOTP] = useState(false);
  // const [isEditing, setIsEditing] = useState<"email" | "mobile" | null>(null);
  const [formData, setFormData] = useState<FormData>({
    referralCode: "",
    mobileNumber: "",
    email: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    panNumber: "",
    aadharNumber: "",
    line1: "",
    line2: "",
    city: "",
    pincode: "",
    bankAccountNumber: "",
    ifscCode: "",
    bankBranchName: "",
    isEmailVerified: false,
    isMobileVerified: false,
  });

  const [documents, setDocuments] = useState<Documents>({
    panAttachment: "",
    aadharFront: "",
    aadharBack: "",
    bankProof: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    validateField(name, value);
  };

  const handleFileChange =
    (name: keyof Documents) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setDocuments((prev) => ({
          ...prev,
          [name]: file,
        }));
      }
    };

  const createRequestBody = (
    formData: FormData,
    documents: Documents
  ): reqBody => {
    // Validate required documents
    if (
      !documents.panAttachment ||
      !documents.aadharFront ||
      !documents.aadharBack ||
      !documents.bankProof
    ) {
      throw new Error("All documents are required");
    }

    function convertToISO(dateString: any) {
      const date = new Date(dateString);
      return date.toISOString().split(".")[0] + "Z";
    }

    const requestBody: reqBody = {
      mobileNumber: formData.mobileNumber,
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      referralCode: formData.referralCode,
      dateOfBirth: convertToISO(formData.dateOfBirth),
      address: {
        line1: formData.line1,
        line2: formData.line2,
        city: formData.city,
        pincode: formData.pincode,
      },
      bankDetails: {
        accountNumber: formData.bankAccountNumber,
        ifscCode: formData.ifscCode,
        branchName: formData.bankBranchName,
        proofAttachment: "https://github.com/",
      },
      identityDetails: {
        panNumber: formData.panNumber,
        panAttachment: "https://github.com/",
        aadharNumber: formData.aadharNumber,
        aadharFront: "https://github.com/",
        aadharBack: "https://github.com/",
      },
    };

    return requestBody;
  };

  const senReq = async () => {
    const body = createRequestBody(formData, documents);
    console.log(body);
    const response = await axios.post(
      "http://localhost:5001/api/v1/auth/register",
      body
    );
    localStorage.setItem("userId", response.data.user.id);
    // console.log(response);
    console.log(response.data.user.id);
  };

  const validateField = (name: string, value: string) => {
    let error = "";
    switch (name) {
      case "firstName":
      case "lastName":
        if (!/^[A-Za-z]+$/.test(value)) {
          error = "Only alphabets are allowed.";
        }
        break;
      case "mobileNumber":
        if (!/^\d{10}$/.test(value)) {
          error = "Mobile number must be 10 digits.";
        }
        break;
      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Invalid email format.";
        }
        break;
      case "panNumber":
        if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value)) {
          error = "Invalid PAN number format.";
        }
        break;
      case "aadharNumber":
        if (!/^\d{12}$/.test(value)) {
          error = "Aadhar number must be 12 digits.";
        }
        break;
      case "pincode":
        if (!/^\d{6}$/.test(value)) {
          error = "Pincode must be 6 digits.";
        }
        break;
      case "bankAccountNumber":
        if (!/^\d{9,18}$/.test(value)) {
          error = "Bank account number must be between 9 to 18 digits.";
        }
        break;
      case "ifscCode":
        if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(value)) {
          error = "Invalid IFSC code format.";
        }
        break;
    }
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const validateStep = (currentStep: number): boolean => {
    switch (currentStep) {
      case 1:
        return Boolean(
          formData.mobileNumber &&
            formData.email &&
            !errors.mobileNumber &&
            !errors.email
        );
      case 2:
        return Boolean(
          formData.firstName &&
            formData.lastName &&
            formData.dateOfBirth &&
            !errors.firstName &&
            !errors.lastName
        );
      case 3:
        return Boolean(
          formData.panNumber &&
            formData.aadharNumber &&
            documents.panAttachment &&
            documents.aadharFront &&
            documents.aadharBack &&
            !errors.panNumber &&
            !errors.aadharNumber
        );
      case 4:
        return Boolean(
          formData.line1 && formData.city && formData.pincode && !errors.pincode
        );
      case 5:
        return Boolean(
          formData.bankAccountNumber &&
            formData.ifscCode &&
            formData.bankBranchName &&
            documents.bankProof &&
            !errors.bankAccountNumber &&
            !errors.ifscCode
        );
      default:
        return false;
    }
  };

  // const handleVerify = (field: "email" | "mobile") => {
  //   const verificationField =
  //     field === "email" ? "isEmailVerified" : "isMobileVerified";
  //   setFormData((prev) => ({
  //     ...prev,
  //     [verificationField]: true,
  //   }));
  //   if (field === "email") {
  //     setShowEmailOTP(false);
  //   } else {
  //     // setShowMobileOTP(false);
  //   }

  //   if (
  //     (field === "email" && formData.isMobileVerified) ||
  //     (field === "mobile" && formData.isEmailVerified)
  //   ) {
  //     handleFinalSubmit();
  //   }
  // };

  // const handleVerify = async (otp: string) => {
  //   const response = await axios.post(
  //     "http://localhost:5001/api/v1/auth/verify-otp",
  //     {
  //       userId: localStorage.getItem("userId"),
  //       otp: otp,
  //     }
  //   );

  //   if (response.data.isVerified) {
  //     console.log("OTP verified successfully");
  //     console.log(response);
  //     setShowEmailOTP(false);
  //   } else {
  //     console.log("OTP verification failed");
  //   }
  // };

  const handleInitialSubmit = async () => {
    try {
      const submitData = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, String(value));
      });

      Object.entries(documents).forEach(([key, file]) => {
        if (file) {
          submitData.append(key, file);
        }
      });

      console.log("Initial form submission:", submitData);
      setIsFormSubmitted(true);
      // setShowMobileOTP(true);
      return true;
    } catch (error) {
      console.error("Error submitting form:", error);
      return false;
    }
  };

  const handleFinalSubmit = async () => {
    try {
      const finalData = {
        ...formData,
        isVerified: true,
      };
      console.log("Final submission with verified user:", finalData);
      alert("Registration completed successfully!");
    } catch (error) {
      console.error("Error in final submission:", error);
      alert("Error completing registration. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 5 && validateStep(5)) {
      const success = await handleInitialSubmit();
      if (!success) {
        alert("Error submitting form. Please try again.");
      }
    }
  };

  // const handleEdit = (type: "email" | "mobile") => {
  //   setIsEditing(type);
  //   if (type === "email") {
  //     setFormData((prev) => ({ ...prev, isEmailVerified: false }));
  //   } else {
  //     setFormData((prev) => ({ ...prev, isMobileVerified: false }));
  //   }
  // };

  // const handleEditSubmit = () => {
  //   setIsEditing(null);
  //   validateField(
  //     isEditing === "email" ? "email" : "mobileNumber",
  //     isEditing === "email" ? formData.email : formData.mobileNumber
  //   );
  // };

  const renderStep1 = () => (
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
      <div>
        <Label htmlFor="mobileNumber">Mobile Number</Label>
        <div className="relative">
          <Input
            id="mobileNumber"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleInputChange}
            required
            className={errors.mobileNumber ? "border-red-500" : ""}
          />
          {errors.mobileNumber && (
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertCircle className="w-4 h-4 text-red-500 absolute right-2 top-1/2 transform -translate-y-1/2" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{errors.mobileNumber}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertCircle className="w-4 h-4 text-red-500 absolute right-2 top-1/2 transform -translate-y-1/2" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{errors.email}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Personal Details</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <div className="relative">
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              className={errors.firstName ? "border-red-500" : ""}
            />
            {errors.firstName && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertCircle className="w-4 h-4 text-red-500 absolute right-2 top-1/2 transform -translate-y-1/2" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{errors.firstName}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <div className="relative">
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              className={errors.lastName ? "border-red-500" : ""}
            />
            {errors.lastName && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertCircle className="w-4 h-4 text-red-500 absolute right-2 top-1/2 transform -translate-y-1/2" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{errors.lastName}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </div>
      <div>
        <Label htmlFor="dateOfBirth">Date of Birth</Label>
        <Input
          id="dateOfBirth"
          name="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={handleInputChange}
          required
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Identity Documents</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="panNumber">PAN Number</Label>
          <div className="relative">
            <Input
              id="panNumber"
              name="panNumber"
              value={formData.panNumber}
              onChange={handleInputChange}
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
          onChange={handleFileChange("panAttachment")}
          file={documents.panAttachment}
        />
        <div>
          <Label htmlFor="aadharNumber">Aadhar Number</Label>
          <div className="relative">
            <Input
              id="aadharNumber"
              name="aadharNumber"
              value={formData.aadharNumber}
              onChange={handleInputChange}
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
            onChange={handleFileChange("aadharFront")}
            file={documents.aadharFront}
          />
          <FileUploadBox
            label="Aadhar Back"
            onChange={handleFileChange("aadharBack")}
            file={documents.aadharBack}
          />
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Address Details</h2>
      <div>
        <Label htmlFor="line1">Address Line 1</Label>
        <Input
          id="line1"
          name="line1"
          value={formData.line1}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="line2">Address Line 2 (Optional)</Label>
        <Input
          id="line2"
          name="line2"
          value={formData.line2}
          onChange={handleInputChange}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="pincode">Pincode</Label>
          <div className="relative">
            <Input
              id="pincode"
              name="pincode"
              value={formData.pincode}
              onChange={handleInputChange}
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

  const renderStep5 = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Bank Account Details</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="bankAccountNumber">Bank Account Number</Label>
          <div className="relative">
            <Input
              id="bankAccountNumber"
              name="bankAccountNumber"
              value={formData.bankAccountNumber}
              onChange={handleInputChange}
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
              value={formData.ifscCode}
              onChange={handleInputChange}
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
            value={formData.bankBranchName}
            onChange={handleInputChange}
            required
          />
        </div>
        <FileUploadBox
          label="Bank Proof (Cancelled Cheque/Passbook/Statement)"
          onChange={handleFileChange("bankProof")}
          file={documents.bankProof}
        />
      </div>
    </div>
  );

  const renderOTPVerification = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">
        Verify Your Contact Details
      </h2>
      <div className="space-y-4">
        {/* <div className="flex items-center justify-between">
          {isEditing === "mobile" ? (
            <div className="flex-1 mr-4">
              <Input
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleInputChange}
                placeholder="Enter mobile number"
                className={errors.mobileNumber ? "border-red-500" : ""}
              />
              {errors.mobileNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.mobileNumber}
                </p>
              )}
            </div>
          ) : (
            <span>Mobile Number: {formData.mobileNumber}</span>
          )}
          <div className="flex gap-2">
            {isEditing === "mobile" ? (
              <Button
                onClick={handleEditSubmit}
                disabled={!!errors.mobileNumber}
                className="bg-green-600 text-white hover:bg-green-700"
              >
                Save
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => handleEdit("mobile")}
                  className="bg-gray-600 text-white hover:bg-gray-700"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => setShowMobileOTP(true)}
                  disabled={formData.isMobileVerified}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  {formData.isMobileVerified ? "Verified ✓" : "Verify"}
                </Button>
              </>
            )}
          </div>
        </div> */}

        <div className="flex items-center justify-between">
          {/* {isEditing === "email" ? (
            <div className="flex-1 mr-4">
              <Input
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email"
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
          ) : (
            <span>Email: {formData.email}</span>
          )} */}
          <span>Email: {formData.email}</span>
          <div className="flex gap-2">
            {/* {isEditing === "email" ? (
              <Button
                onClick={handleEditSubmit}
                disabled={!!errors.email}
                className="bg-green-600 text-white hover:bg-green-700"
              >
                Save
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => handleEdit("email")}
                  className="bg-gray-600 text-white hover:bg-gray-700"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => setShowEmailOTP(true)}
                  disabled={formData.isEmailVerified}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  {formData.isEmailVerified ? "Verified ✓" : "Verify"}
                </Button>
              </>
            )} */}
            <Button
              onClick={() => setShowEmailOTP(true)}
              disabled={formData.isEmailVerified}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {formData.isEmailVerified ? "Verified ✓" : "Verify"}
            </Button>
          </div>
        </div>
        {formData.isEmailVerified && (
          <div className="mt-6 flex justify-center">
            <Button
              onClick={handleFinalSubmit}
              className="bg-green-600 text-white hover:bg-green-700 px-8"
            >
              Complete Registration
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <TooltipProvider>
      <div className="min-h-screen p-6 bg-gray-50">
        <div className="mb-8 flex justify-center">
          <img
            src="/logo.png"
            alt="Company Logo"
            className="h-20 object-contain"
          />
        </div>
        <Card className="w-full max-w-2xl mx-auto border-0 shadow-xl mt-10 mb-10">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {!isFormSubmitted ? (
                <>
                  <div className="flex justify-center mb-8">
                    <div className="flex items-center gap-4 w-4/5">
                      {steps.map((stepItem, index) => (
                        <div key={index} className="flex items-center flex-1">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-medium ${
                              step >= index + 1
                                ? "bg-gradient-to-r from-[#08AFF1] to-[#A4CE3A]"
                                : "bg-gray-200 text-gray-600"
                            }`}
                          >
                            {stepItem.icon}
                          </div>
                          {index < steps.length - 1 && (
                            <div
                              className={`flex-1 h-1 ${
                                step > index + 1
                                  ? "bg-gradient-to-r from-[#08AFF1] to-[#A4CE3A]"
                                  : "bg-gray-200"
                              }`}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {step === 1 && renderStep1()}
                  {step === 2 && renderStep2()}
                  {step === 3 && renderStep3()}
                  {step === 4 && renderStep4()}
                  {step === 5 && renderStep5()}

                  <div className="flex justify-between pt-6">
                    {step > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(step - 1)}
                        className="flex items-center gap-2 border-[#AACF45] text-[#AACF45] hover:bg-[#AACF45] hover:text-white"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Previous
                      </Button>
                    )}
                    <div className="ml-auto">
                      {step < 5 ? (
                        <Button
                          type="button"
                          onClick={() => setStep(step + 1)}
                          disabled={!validateStep(step)}
                          className="flex items-center gap-2 bg-[#08AFF1] text-white hover:bg-[#0899d1]"
                        >
                          Next
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          disabled={!validateStep(step)}
                          onClick={senReq}
                          className="flex items-center gap-2 bg-[#AACF45] text-white hover:bg-[#99bb3f]"
                        >
                          Submit and Proceed to Verification
                        </Button>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                renderOTPVerification()
              )}

              <div className="text-center text-sm text-gray-500 mt-4">
                {!isFormSubmitted
                  ? `Step ${step} of 5: ${steps[step - 1].label}`
                  : "Final Step: Contact Verification"}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* <OTPDialog
          isOpen={showMobileOTP}
          onClose={() => setShowMobileOTP(false)}
          onVerify={(otp) => handleVerify("mobile")}
          type="mobile"
        /> */}
        <OTPDialog
          isOpen={showEmailOTP}
          onClose={() => setShowEmailOTP(false)}
          // onVerify={(otp) => handleVerify(otp)}
          type="email"
        />
      </div>
    </TooltipProvider>
  );
};

export default RegistrationForm;
