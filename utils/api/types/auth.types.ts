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
};
