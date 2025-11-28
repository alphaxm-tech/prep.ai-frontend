export const BASE_API_URL = () => `http://localhost:8080/api/v1/`;

export const GET_RESUME_FORMATS = () => `resume/get-resume-formats`;

/// AUTH endpoints ///
export const REGISTER = () => `auth/register`;
export const LOGIN_WITH_PASSWORD = () => `auth/login`;
export const LOGIN_WITH_OTP = () => `auth/login-with-otp`;
export const VERIFY_LOGIN_OTP = () => `auth/verify-login-otp`;
