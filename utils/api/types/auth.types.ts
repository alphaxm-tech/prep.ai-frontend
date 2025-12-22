export interface RegisterData {
  email: string;
  fullname: string;
  password: string;
  phoneNumber?: string; // optional if not required
}

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginWithOtpData {
  email: string;
}

export interface VerifyOtpForLogin {
  email: string;
  otp: string;
}

export interface VerifyUserEmailInput {
  email: string;
}

export type VerifyUserEmailResponse = {
  canLogin: boolean;
  email: string;
  emailVerified: boolean;
  exists: boolean;
  passswordExists: boolean;
  reason: string;
  userID: number;
  userDetails: boolean;
};

export interface AddUserDetailsRequest {
  email: string;
  full_name: string;
  phone_number: string;
  location: string;
}

export interface User {
  // userId: number;

  email: string;
  phoneNumber: string | null;
  fullName: string | null;
  passwordHash?: string | null;

  authProvider: string | null;
  roleId: number;
  ccgId: number;

  location: string | null;
  picture: string | null;
  portfolioWebsiteUrl: string | null;
  linkedInUrl: string | null;
  githubUrl: string | null;
  objective: string | null;

  emailVerified: boolean;
  phoneVerified: boolean;
  isActive: boolean;
  isSuspended: boolean;

  lastLogin: string | null; // ISO timestamp
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  deletedAt: string | null;
}
