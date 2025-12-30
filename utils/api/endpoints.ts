export const BASE_API_URL = `http://localhost:8080/api/v1`;

export const RESUME = `resume`;
export const AIINTERVIEW = `ai-interview`;
export const AUTH = `auth`;
export const HOME = `home`;
export const SUPER_ADMIN = `super-admin`;

export const GET_RESUME_FORMATS = `get-resume-formats`;

/// AUTH endpoints ///
export const VERIFY_USER_EMAIL = `verify-user-email`;
export const ADD_USER_DETAILS = `add-user-details`;
export const LOGIN_WITH_PASSWORD = `login-with-password`;

export const REGISTER = `register`;
export const LOGIN_WITH_OTP = `auth/login-with-otp`;
export const VERIFY_LOGIN_OTP = `auth/verify-login-otp`;

/// HOME endpoints ///
export const GET_USER_DETAILS = `get-user-details`;
export const GET_USER_SERVICES = `get-user-services`;
export const GET_USER_LEARNING_PATH = `get-user-learningpath`;

// convert them to strings instead of functions

/// Super Admin endpoints ///
export const ADD_COLLEGE = `add-college`;
export const CREARE_NEW_COURSE = `create-new-course`;
export const GET_ALL_COURSES = `get-all-courses`;
