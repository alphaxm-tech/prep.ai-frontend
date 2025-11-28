import api from "@/lib/axios";
import {
  BASE_API_URL,
  LOGIN_WITH_OTP,
  LOGIN_WITH_PASSWORD,
  REGISTER,
  VERIFY_LOGIN_OTP,
} from "../CONSTANTS";

interface RegisterData {
  email: string;
  fullname: string;
  password: string;
  phoneNumber?: string; // optional if not required
}

interface LoginData {
  email: string;
  password: string;
}

interface LoginWithOtpData {
  email: string;
}

interface VerifyOtpForLogin {
  email: string;
  otp: string;
}

export const authService = {
  loginWithPassword: async (data: LoginData) => {
    const response = await api.post(
      `${BASE_API_URL()}${LOGIN_WITH_PASSWORD()}`,
      data
    );
    return response.data;
  },

  registerWithPassword: async (data: RegisterData) => {
    const response = await api.post(`${BASE_API_URL()}${REGISTER()}`, data);
    return response.data;
  },

  sendOtpForLogin: async (data: LoginWithOtpData) => {
    const response = await api.post(
      `${BASE_API_URL()}${LOGIN_WITH_OTP()}?email=${data?.email}`
    );
    return response.data;
  },

  verifyOtpForLogin: async (data: VerifyOtpForLogin) => {
    const response = await api.patch(
      `${BASE_API_URL()}${VERIFY_LOGIN_OTP()}`,
      data
    );
    return response.data;
  },
};
