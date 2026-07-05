export enum UserRole {
  SUPER_ADMIN = "super_admin", // platform level access
  ADMIN = "college_admin", // college access
  STUDENT = "student",
}

export enum LoginErrors {
  PASSWORD_NOT_SET = "PASSWORD_NOT_SET",
  EMAIL_NOT_VERIFIED = "EMAIL_NOT_VERIFIED",
  ACCOUNT_SUSPENDED = "ACCOUNT_SUSPENDED",
  USER_INACTIVE = "USER_INACTIVE",

  USER_NOT_FOUND = "USER_NOT_FOUND",
  INTERNAL_ERROR = "INTERNAL_ERROR",
  ACCOUNT_DISABLED = "ACCOUNT_DISABLED",
  INVALID_OAUTH_STATE = "INVALID_OAUTH_STATE",
  INVALID_AUTHORIZATION_CODE = "INVALID_AUTHORIZATION_CODE",
  GOOGLE_AUTH_FAILED = "GOOGLE_AUTH_FAILED",
}

export enum LoginStates {
  EMAIL = "email",
  PROFIL = "profile",
  OTP = "otp",
  PASSWORD = "password",
  SET_PASSWORD = "setPassword",
  CHOOSE = "choose",
  RESET_PASSWORD = "resetPassword",
}

export enum ToastStates {
  SUCCESS = "success",
  ERROR = "error",
}
