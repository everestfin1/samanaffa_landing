export interface FormData {
  // Step 1: Personal Information
  civilite: 'mr' | 'mme' | 'mlle';
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  statutEmploi: string;
  metiers: string;

  // Step 2: Identity Verification
  nationality: string;
  idType: 'cni' | 'passport';
  idNumber: string;
  idIssueDate: string;
  idExpiryDate: string;
  dateOfBirth: string;
  placeOfBirth: string;

  // Step 3: Address
  country: string;
  region: string;
  department: string;
  district: string;
  address: string;
  city: string;

  // Step 4: Document Upload
  selfieImage: File | null;
  idFrontImage: File | null;
  idBackImage: File | null;

  // Step 5: Terms and Security
  termsAccepted: boolean;
  privacyAccepted: boolean;
  marketingAccepted: boolean;
  signature: string;
  signatureFile: File | null;
}

export interface Step {
  id: number;
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  description: string;
}

export type ValidationStatus = 'error' | 'valid' | 'pending';

export interface StepValidationStatus {
  hasErrors: boolean;
  allFilled: boolean;
  status: ValidationStatus;
}
