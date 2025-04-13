export interface FormData {
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
  password: string;
  confirmPassword: string;
}

export interface Documents {
  panAttachment: string;
  aadharFront: string;
  aadharBack: string;
  bankProof: string;
}

export interface RequestBody {
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
