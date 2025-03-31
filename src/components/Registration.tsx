import React, { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { TooltipProvider } from "../components/ui/tooltip";

// Import new components and types
import { InitialRegistration } from "./registration/InitialRegistration";
import { PersonalDetails } from "./registration/PersonalDetails";
import { IdentityDocuments } from "./registration/IdentityDocuments";
import { AddressDetails } from "./registration/AddressDetails";
import { BankDetails } from "./registration/BankDetails";
import { ProgressIndicator } from "./registration/ProgressIndicator";
import type { FormData, FileChangeSection } from "./registration/types";
import { validateField, validateStep } from "./registration/validation";

const RegistrationForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    referralCode: "",
    mobileNumber: "",
    email: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    address: {
      line1: "",
      line2: "",
      city: "",
      pincode: "",
    },
    identityDetails: {
      panNumber: "",
      aadharNumber: "",
      panAttachment: null,
      aadharFront: null,
      aadharBack: null,
    },
    bankDetails: {
      bankAccountNumber: "",
      ifscCode: "",
      bankBranchName: "",
      bankProof: null,
    },
    // Keep commented verification flags if needed for future logic
    // isEmailVerified: false,
    // isMobileVerified: false,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Update handler to directly set errors and nested state
  const handleUpdateFormData = (updatedData: Partial<FormData>) => {
    let newErrors = { ...errors };
    // Create a deep copy to avoid direct mutation issues, especially with nested objects
    // Note: JSON methods work here as state is serializable (no functions, Dates, etc.)
    // For more complex state, consider a library like immer or lodash.cloneDeep
    const updatedFormData = JSON.parse(JSON.stringify(formData));

    Object.entries(updatedData).forEach(([key, value]) => {
        const formKey = key as keyof FormData;

        // Check if the key corresponds to a nested object in the original formData structure
        if (typeof formData[formKey] === 'object' && formData[formKey] !== null && !(formData[formKey] instanceof File)) {
             // Ensure the incoming value is also an object before merging
            if (typeof value === 'object' && value !== null && !Array.isArray(value) && !(value instanceof File)) {
                // Merge the nested object safely
                updatedFormData[formKey] = {
                    ...updatedFormData[formKey],
                    ...value,
                };
                // Validate fields within the updated nested object
                Object.entries(value).forEach(([nestedKey, nestedValue]) => {
                    const error = validateField(nestedKey, String(nestedValue));
                    // Use dot notation for nested error keys for clarity
                    const errorKey = `${formKey}.${nestedKey}`;
                    if (error) {
                        newErrors[errorKey] = error;
                    } else {
                        delete newErrors[errorKey];
                    }
                });
            } else {
                 // Log a warning if types don't match expectation (e.g., trying to assign a string to 'address')
                 console.warn(`Type mismatch: Expected object for key ${formKey}, but received ${typeof value}`);
            }
        } else {
            // Handle top-level fields (string, File | null)
            updatedFormData[formKey] = value; // Assign directly
            const error = validateField(formKey, String(value)); // Validate the field
             if (error) {
                newErrors[formKey] = error;
            } else {
                delete newErrors[formKey];
            }
        }
    });

    setFormData(updatedFormData);
    setErrors(newErrors);
  };

  const handleFileChange =
    (fileInfo: FileChangeSection) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        console.log(
          `File selected for ${fileInfo.section}.${fileInfo.field}:`,
          file
        );
        setFormData((prev) => ({
          ...prev,
          [fileInfo.section]: {
            ...prev[fileInfo.section],
            [fileInfo.field]: file,
          },
        }));
        // Optionally clear file-related errors here if needed
      }
    };

  const handleVerify = (field: "email" | "mobile") => {
    // Simulate verification process - update as needed for actual verification
    console.log(`Verification requested for ${field}`);
    // Example: Update state if you had isEmailVerified/isMobileVerified fields
    // const verificationField = field === "email" ? "isEmailVerified" : "isMobileVerified";
    // setFormData((prev) => ({
    //   ...prev,
    //   [verificationField]: true,
    // }));
  };

  const nextStep = () => {
    if (validateStep(step, formData, errors)) {
      setStep((prev) => prev + 1);
    } else {
      // Optionally trigger validation for all fields in the current step
      console.log("Validation failed for step", step);
      // You might want to show specific error messages to the user
    }
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 5 && validateStep(5, formData, errors)) {
      // Use FormData API for submission if backend expects multipart/form-data
      const submitApiData = new FormData();

      // Append non-file fields (handle nested structures)
      submitApiData.append("referralCode", formData.referralCode);
      submitApiData.append("mobileNumber", formData.mobileNumber);
      submitApiData.append("email", formData.email);
      submitApiData.append("firstName", formData.firstName);
      submitApiData.append("lastName", formData.lastName);
      submitApiData.append("dateOfBirth", formData.dateOfBirth);
      submitApiData.append("address.line1", formData.address.line1);
      submitApiData.append("address.line2", formData.address.line2);
      submitApiData.append("address.city", formData.address.city);
      submitApiData.append("address.pincode", formData.address.pincode);
      submitApiData.append("identityDetails.panNumber", formData.identityDetails.panNumber);
      submitApiData.append("identityDetails.aadharNumber", formData.identityDetails.aadharNumber);
      submitApiData.append("bankDetails.bankAccountNumber", formData.bankDetails.bankAccountNumber);
      submitApiData.append("bankDetails.ifscCode", formData.bankDetails.ifscCode);
      submitApiData.append("bankDetails.bankBranchName", formData.bankDetails.bankBranchName);

      // Append files
      if (formData.identityDetails.panAttachment) {
        submitApiData.append("panAttachment", formData.identityDetails.panAttachment);
      }
      if (formData.identityDetails.aadharFront) {
        submitApiData.append("aadharFront", formData.identityDetails.aadharFront);
      }
      if (formData.identityDetails.aadharBack) {
        submitApiData.append("aadharBack", formData.identityDetails.aadharBack);
      }
      if (formData.bankDetails.bankProof) {
        submitApiData.append("bankProof", formData.bankDetails.bankProof);
      }

      // Log the FormData content for debugging (entries() method)
      console.log("Submitting form data:");
      for (let pair of submitApiData.entries()) {
          console.log(pair[0]+ ', ' + pair[1]);
      }

      // Replace console.log with your actual API call
      // Example: const response = await fetch('/api/register', { method: 'POST', body: submitApiData });

      console.log("Simulating form submission...");
      // Potentially reset form or show success message
    } else {
      console.log("Cannot submit, validation failed or not on the final step.")
    }
  };

  // Common props for step components
  const stepProps = {
    formData,
    errors,
    onUpdateFormData: handleUpdateFormData,
    handleFileChange,
    handleVerify,
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen p-6 bg-gray-200">
        <Card className="w-full max-w-2xl mx-auto border-0 shadow-xl mt-10 mb-10 bg-[#E6F7FF]">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Use ProgressIndicator component */}
              <ProgressIndicator currentStep={step} totalSteps={5} />

              {/* Render current step component */}
              {step === 1 && <InitialRegistration {...stepProps} />}
              {step === 2 && <PersonalDetails {...stepProps} />}
              {step === 3 && <IdentityDocuments {...stepProps} />}
              {step === 4 && <AddressDetails {...stepProps} />}
              {step === 5 && <BankDetails {...stepProps} />}

              {/* Navigation buttons */}
              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={step === 1}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </Button>
                {step < 5 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    // Disable next if current step is invalid
                    // disabled={!validateStep(step, formData, errors)}
                    className="flex items-center gap-2 bg-[#08AFF1] text-white hover:bg-[#079adb]"
                  >
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    // Disable submit if final step is invalid
                    // disabled={!validateStep(5, formData, errors)}
                    className="flex items-center gap-2 bg-green-600 text-white hover:bg-green-700"
                  >
                    Submit Registration
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default RegistrationForm;
