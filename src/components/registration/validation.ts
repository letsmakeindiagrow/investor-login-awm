export const validateField = (name: string, value: string): string => {
  switch (name) {
    case "firstName":
    case "lastName":
      if (!/^[A-Za-z]+$/.test(value)) {
        return "Only alphabets are allowed.";
      }
      break;
    case "mobileNumber":
      if (!/^\d{10}$/.test(value)) {
        return "Mobile number must be 10 digits.";
      }
      break;
    case "email":
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return "Invalid email format.";
      }
      break;
    case "panNumber":
      if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value)) {
        return "Invalid PAN number format.";
      }
      break;
    case "aadharNumber":
      if (!/^\d{12}$/.test(value)) {
        return "Aadhar number must be 12 digits.";
      }
      break;
    case "pincode":
      if (!/^\d{6}$/.test(value)) {
        return "Pincode must be 6 digits.";
      }
      break;
    case "bankAccountNumber":
      if (!/^\d{9,18}$/.test(value)) {
        return "Bank account number must be between 9 to 18 digits.";
      }
      break;
    case "ifscCode":
      if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(value)) {
        return "Invalid IFSC code format.";
      }
      break;
  }
  return "";
};

export const validateStep = (step: number, formData: any, errors: any): boolean => {
  switch (step) {
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
        formData.identityDetails.panNumber &&
          formData.identityDetails.aadharNumber &&
          formData.identityDetails.panAttachment &&
          formData.identityDetails.aadharFront &&
          formData.identityDetails.aadharBack &&
          !errors.panNumber &&
          !errors.aadharNumber
      );
    case 4:
      return Boolean(
        formData.address.line1 &&
          formData.address.city &&
          formData.address.pincode &&
          !errors.pincode
      );
    case 5:
      return Boolean(
        formData.bankDetails.bankAccountNumber &&
          formData.bankDetails.ifscCode &&
          formData.bankDetails.bankBranchName &&
          formData.bankDetails.bankProof &&
          !errors.bankAccountNumber &&
          !errors.ifscCode
      );
    default:
      return false;
  }
};
