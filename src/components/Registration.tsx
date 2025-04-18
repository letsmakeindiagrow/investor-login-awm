import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { StepIndicator, steps } from "./registration/StepIndicator";
import { FormStep } from "./registration/FormStep";
import { InputField } from "./registration/InputField";
import { FileUploadField } from "./registration/FileUploadField";
import { VerificationStep } from "./registration/VerificationStep";
import { OTPDialog } from "./registration/OTPDialog";
import {
  type FormData,
  type Documents,
  type RequestBody,
  type DocumentUrls,
} from "./registration/types";

// Use VITE_BACKEND_URL from .env for backend API base URL
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const RegistrationForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [showEmailOTP, setShowEmailOTP] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
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
    isMobileVerified: false, // Assuming mobile verification might be added later
    password: "",
    confirmPassword: "",
  });

  const [documents, setDocuments] = useState<Documents>({
    panAttachment: null,
    aadharFront: null,
    aadharBack: null,
    bankProof: null,
  });

  const [documentUrls, setDocumentUrls] = useState<DocumentUrls>({
    panAttachment: "",
    aadharFront: "",
    aadharBack: "",
    bankProof: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [underageError, setUnderageError] = useState("");
  const [isUploading, setIsUploading] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: number;
  }>({});
  const [uploadErrors, setUploadErrors] = useState<{ [key: string]: string }>(
    {}
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    validateField(name, value);
    if (name === "dateOfBirth") {
      // Check if user is under 18
      const dob = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      const d = today.getDate() - dob.getDate();
      let isUnder18 = false;
      if (age < 18) {
        isUnder18 = true;
      } else if (age === 18) {
        if (m < 0 || (m === 0 && d < 0)) {
          isUnder18 = true;
        }
      }
      if (isUnder18) {
        setUnderageError("You must be at least 18 years old to register.");
      } else {
        setUnderageError("");
      }
    }
  };

  const uploadFile = async (file: File, documentType: keyof Documents) => {
    const maxSize = 5 * 1024 * 1024; // 5MB max size

    if (file.size > maxSize) {
      setUploadErrors((prev) => ({
        ...prev,
        [documentType]: "File size must be less than 5MB",
      }));
      return null;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("documentType", documentType);

    try {
      setIsUploading((prev) => ({ ...prev, [documentType]: true }));

      const response = await axios.post(
        `${BACKEND_URL}/api/v1/documents/upload`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const progress = progressEvent.total
              ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
              : 0;
            setUploadProgress((prev) => ({
              ...prev,
              [documentType]: progress,
            }));
          },
        }
      );

      // Store both the File object and the uploaded URL
      setDocuments((prev) => ({
        ...prev,
        [documentType]: file,
      }));
      setDocumentUrls((prev) => ({
        ...prev,
        [documentType]: response.data.url,
      }));

      return response.data.url;
    } catch (error) {
      console.error(`Error uploading ${documentType}:`, error);
      setUploadErrors((prev) => ({
        ...prev,
        [documentType]: "Failed to upload file. Please try again.",
      }));
      return null;
    } finally {
      setIsUploading((prev) => ({ ...prev, [documentType]: false }));
      setUploadProgress((prev) => ({ ...prev, [documentType]: 0 }));
    }
  };

  const handleFileChange =
    (name: keyof Documents) =>
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        await uploadFile(file, name);
      }
    };

  const createRequestBody = (
    formData: FormData,
    documentUrls: DocumentUrls
  ): RequestBody => {
    // Validate that all required documents are uploaded
    const requiredDocuments = [
      "panAttachment",
      "aadharFront",
      "aadharBack",
      "bankProof",
    ] as const;
    const missingDocuments = requiredDocuments.filter(
      (doc) => !documentUrls[doc]
    );

    if (missingDocuments.length > 0) {
      throw new Error(
        `Missing required documents: ${missingDocuments.join(", ")}`
      );
    }

    function convertToISO(dateString: string): string {
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
          // Handle invalid date string
          console.error("Invalid date format:", dateString);
          return new Date().toISOString().split(".")[0] + "Z"; // Return current date as fallback
        }
        return date.toISOString().split(".")[0] + "Z";
      } catch (error) {
        console.error("Error converting date:", dateString, error);
        return new Date().toISOString().split(".")[0] + "Z"; // Fallback on error
      }
    }

    const requestBody: RequestBody = {
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
        proofAttachment: documentUrls.bankProof, // Use the uploaded URL
      },
      identityDetails: {
        panNumber: formData.panNumber,
        panAttachment: documentUrls.panAttachment, // Use the uploaded URL
        aadharNumber: formData.aadharNumber,
        aadharFront: documentUrls.aadharFront, // Use the uploaded URL
        aadharBack: documentUrls.aadharBack, // Use the uploaded URL
      },
      password: formData.password,
    };

    return requestBody;
  };

  const sendRegistrationRequest = async () => {
    console.trace("sendRegistrationRequest called");

    // Check if all required documents are uploaded
    const allDocumentsUploaded = Object.values(documentUrls).every(
      (url) => url !== ""
    );
    if (!allDocumentsUploaded) {
      alert("Please upload all required documents before proceeding.");
      return false;
    }

    try {
      setIsRegistering(true);
      const body = createRequestBody(formData, documentUrls);
      console.log("Sending registration request:", body);

      const response = await axios.post(
        `${BACKEND_URL}/api/v1/auth/register`,
        body,
        {
          withCredentials: true,
        }
      );

      localStorage.setItem("userId", response.data.user.id);
      console.log("Registration successful, User ID:", response.data.user.id);
      return true;
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed. Please check your details and try again.");
      return false;
    } finally {
      setIsRegistering(false);
    }
  };

  const validateField = (name: string, value: string) => {
    let error = "";
    switch (name) {
      case "firstName":
      case "lastName":
        if (!/^[A-Za-z]+$/.test(value) && value) {
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
        if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value.toUpperCase())) {
          error = "Invalid PAN number format (e.g., ABCDE1234F).";
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
        if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(value.toUpperCase())) {
          error = "Invalid IFSC code format (e.g., ABCD0123456).";
        }
        break;
      case "password":
        if (value.length < 8) {
          error = "Password must be at least 8 characters long.";
        }
        break;
      case "confirmPassword":
        if (value !== formData.password) {
          error = "Passwords do not match.";
        }
        break;
    }
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  // Normalize PAN and IFSC codes to uppercase
  const handleInputChangeNormalized = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    let normalizedValue = value;
    if (name === "panNumber" || name === "ifscCode") {
      normalizedValue = value.toUpperCase();
    }
    setFormData((prev) => ({
      ...prev,
      [name]: normalizedValue,
    }));
    validateField(name, normalizedValue);
  };

  const validateStep = (currentStep: number): boolean => {
    // Check for errors first
    const stepErrors = Object.entries(errors)
      .filter(([, value]) => value !== "") // Filter out empty error strings
      .reduce((acc, [key]) => {
        // Check if the field with error belongs to the current step
        switch (currentStep) {
          case 1:
            if (["mobileNumber", "email"].includes(key)) acc = true;
            break;
          case 2:
            if (["firstName", "lastName"].includes(key)) acc = true;
            break;
          case 3:
            if (["panNumber", "aadharNumber"].includes(key)) acc = true;
            break;
          case 4:
            if (["pincode"].includes(key)) acc = true;
            break;
          case 5:
            if (["bankAccountNumber", "ifscCode"].includes(key)) acc = true;
            break;
        }
        return acc;
      }, false);

    if (stepErrors) return false; // If any field in the current step has an error, validation fails

    // Check if required fields are filled
    switch (currentStep) {
      case 1:
        return Boolean(formData.mobileNumber && formData.email);
      case 2:
        // Also check underageError
        return Boolean(
          formData.firstName &&
            formData.lastName &&
            formData.dateOfBirth &&
            !underageError
        );
      case 3:
        return Boolean(
          formData.panNumber &&
            formData.aadharNumber &&
            documentUrls.panAttachment &&
            documentUrls.aadharFront &&
            documentUrls.aadharBack
        );
      case 4:
        return Boolean(formData.line1 && formData.city && formData.pincode);
      case 5:
        return Boolean(
          formData.bankAccountNumber &&
            formData.ifscCode &&
            formData.bankBranchName &&
            documentUrls.bankProof
        );
      default:
        return false;
    }
  };

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 5 && validateStep(5)) {
      const success = await sendRegistrationRequest();
      if (success) {
        setIsFormSubmitted(true); // Show OTP dialog
      }
      // Do nothing if not successful (error handled in sendRegistrationRequest)
    }
  };

  const handleFinalSubmit = async () => {
    // Just mark as verified, show success, etc.
    setFormData((prev) => ({ ...prev, isEmailVerified: true }));
    // You can show a success message or redirect here if you want
    alert("Registration completed successfully!");
  };

  // Function to render the current step's form fields
  const renderFormStep = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return (
          <FormStep title="Initial Registration">
            <InputField
              label="Referral Code (Optional)"
              id="referralCode"
              name="referralCode"
              value={formData.referralCode}
              onChange={handleInputChange}
            />
            <InputField
              label="Mobile Number"
              id="mobileNumber"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleInputChange}
              error={errors.mobileNumber}
              maxLength={10}
              required
            />
            <InputField
              label="Email"
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
              required
            />
            <InputField
              label="Password"
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              error={errors.password}
              required
            />
            <InputField
              label="Confirm Password"
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              error={errors.confirmPassword}
              required
            />
          </FormStep>
        );
      case 2:
        return (
          <FormStep title="Personal Details">
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="First Name"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChangeNormalized}
                error={errors.firstName}
                required
              />
              <InputField
                label="Last Name"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChangeNormalized}
                error={errors.lastName}
                required
              />
            </div>
            <InputField
              label="Date of Birth"
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              required
            />
            {underageError && (
              <div className="text-red-500 text-sm mt-1">{underageError}</div>
            )}
          </FormStep>
        );
      case 3:
        return (
          <FormStep title="Identity Documents">
            <InputField
              label="PAN Number"
              id="panNumber"
              name="panNumber"
              value={formData.panNumber}
              onChange={handleInputChangeNormalized} // Use normalized handler
              error={errors.panNumber}
              maxLength={10}
              required
            />
            <FileUploadField
              label="PAN Card Attachment"
              onChange={handleFileChange("panAttachment")}
              file={documents.panAttachment}
              fileUrl={documentUrls.panAttachment}
              isUploading={isUploading.panAttachment}
              progress={uploadProgress.panAttachment}
              error={uploadErrors.panAttachment}
            />
            <InputField
              label="Aadhar Number"
              id="aadharNumber"
              name="aadharNumber"
              value={formData.aadharNumber}
              onChange={handleInputChange}
              error={errors.aadharNumber}
              maxLength={12}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <FileUploadField
                label="Aadhar Front"
                onChange={handleFileChange("aadharFront")}
                file={documents.aadharFront}
                fileUrl={documentUrls.aadharFront}
                isUploading={isUploading.aadharFront}
                progress={uploadProgress.aadharFront}
                error={uploadErrors.aadharFront}
              />
              <FileUploadField
                label="Aadhar Back"
                onChange={handleFileChange("aadharBack")}
                file={documents.aadharBack}
                fileUrl={documentUrls.aadharBack}
                isUploading={isUploading.aadharBack}
                progress={uploadProgress.aadharBack}
                error={uploadErrors.aadharBack}
              />
            </div>
          </FormStep>
        );
      case 4:
        return (
          <FormStep title="Address Details">
            <InputField
              label="Address Line 1"
              id="line1"
              name="line1"
              value={formData.line1}
              onChange={handleInputChange}
              required
            />
            <InputField
              label="Address Line 2 (Optional)"
              id="line2"
              name="line2"
              value={formData.line2}
              onChange={handleInputChange}
            />
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="City"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
              />
              <InputField
                label="Pincode"
                id="pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                error={errors.pincode}
                maxLength={6}
                required
              />
            </div>
          </FormStep>
        );
      case 5:
        return (
          <FormStep title="Bank Account Details">
            <InputField
              label="Bank Account Number"
              id="bankAccountNumber"
              name="bankAccountNumber"
              value={formData.bankAccountNumber}
              onChange={handleInputChange}
              error={errors.bankAccountNumber}
              required
            />
            <InputField
              label="IFSC Code"
              id="ifscCode"
              name="ifscCode"
              value={formData.ifscCode}
              onChange={handleInputChangeNormalized} // Use normalized handler
              error={errors.ifscCode}
              maxLength={11}
              required
            />
            <InputField
              label="Bank Branch Name"
              id="bankBranchName"
              name="bankBranchName"
              value={formData.bankBranchName}
              onChange={handleInputChange}
              required
            />
            <FileUploadField
              label="Bank Proof (Cancelled Cheque/Passbook/Statement)"
              onChange={handleFileChange("bankProof")}
              file={documents.bankProof}
              fileUrl={documentUrls.bankProof}
              isUploading={isUploading.bankProof}
              progress={uploadProgress.bankProof}
              error={uploadErrors.bankProof}
            />
          </FormStep>
        );
      default:
        return null;
    }
  };

  // Add this overlay component inside RegistrationForm
  const LoadingOverlay = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl flex flex-col items-center animate-fade-in">
        <Loader2 className="h-16 w-16 text-[#00ADEF] animate-spin mb-6" />
        <h2 className="text-2xl font-semibold mb-2 text-[#00ADEF]">
          Processing Registration...
        </h2>
        <p className="text-gray-600 text-center">
          Please wait while we create your account.
          <br />
          This may take a few seconds.
        </p>
      </div>
    </div>
  );

  return (
    <TooltipProvider>
      {isRegistering && <LoadingOverlay />}
      <div className="min-h-screen p-6 bg-gray-50">
        <div className="mb-8 flex justify-center">
          <img
            src="/logo.png" // Make sure logo.png is in the public folder
            alt="Company Logo"
            className="h-20 object-contain"
          />
        </div>
        <Card className="w-full max-w-2xl mx-auto border-0 shadow-xl mt-10 mb-10">
          <CardContent className="pt-6">
            {isVerified ? (
              <div className="flex flex-col items-center justify-center min-h-[300px] text-center p-8">
                <div className="mb-6 animate-bounce">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-20 w-20 text-[#A8CF45]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2l4 -4"
                    />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold mb-4">
                  Verification Completed!
                </h1>
                <p className="text-gray-600 mb-8 max-w-md">
                  Your email has been verified. You can now go to your
                  dashboard.
                </p>
                <a
                  href="https://www.aadyanviwealth.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="bg-[#00ADEF] hover:bg-[#0099d1] text-white">
                    Go to Dashboard
                  </Button>
                </a>
              </div>
            ) : !showEmailOTP ? (
              <form onSubmit={handleInitialSubmit} className="space-y-6">
                {!isFormSubmitted ? (
                  <>
                    <StepIndicator currentStep={step} />
                    {renderFormStep(step)}
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
                            className="flex items-center gap-2 bg-[#08AFF1] text-white hover:bg-[#0899d1] disabled:opacity-50"
                          >
                            Next
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button
                            type="submit"
                            disabled={!validateStep(step)}
                            className="flex items-center gap-2 bg-[#AACF45] text-white hover:bg-[#99bb3f] disabled:opacity-50"
                          >
                            Submit and Proceed to Verification
                          </Button>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <VerificationStep
                    email={formData.email}
                    isEmailVerified={formData.isEmailVerified}
                    onVerifyClick={() => setShowEmailOTP(true)}
                    onFinalSubmit={handleFinalSubmit}
                  />
                )}
                <div className="text-center text-sm text-gray-500 mt-4">
                  {!isFormSubmitted
                    ? `Step ${step} of ${steps.length}: ${
                        steps[step - 1].label
                      }`
                    : "Final Step: Contact Verification"}
                </div>
              </form>
            ) : (
              <OTPDialog
                isOpen={showEmailOTP}
                onClose={() => {
                  setShowEmailOTP(false);
                  setIsVerified(true);
                }}
                type="email"
              />
            )}
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default RegistrationForm;
