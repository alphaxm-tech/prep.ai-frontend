import api from "@/lib/axios";
import {
  ADD_USER_DETAILS,
  AUTH,
  BASE_API_URL,
  LOGIN_WITH_OTP,
  LOGIN_WITH_PASSWORD,
  REGISTER,
  VERIFY_LOGIN_OTP,
  VERIFY_USER_EMAIL,
} from "@/utils/api/endpoints";

import {
  VerifyUserEmailInput,
  LoginData,
  RegisterData,
  LoginWithOtpData,
  VerifyOtpForLogin,
  VerifyUserEmailResponse,
  AddUserDetailsRequest,
  User,
} from "@/utils/api/types/auth.types";

export const authService = {
  verifyUserEmail: async (
    data: VerifyUserEmailInput
  ): Promise<VerifyUserEmailResponse> => {
    const response = await api.get(
      `${BASE_API_URL}/${AUTH}/${VERIFY_USER_EMAIL}`,
      {
        params: { Email: data?.email },
      }
    );

    return response.data;
  },

  addUserDetails: async (data: AddUserDetailsRequest): Promise<User> => {
    const response = await api.post(
      `${BASE_API_URL}/${AUTH}/${ADD_USER_DETAILS}`,
      data
    );

    return response.data;
  },

  loginWithPassword: async (data: LoginData) => {
    const response = await api.post(
      `${BASE_API_URL}/${AUTH}/${LOGIN_WITH_PASSWORD}`,
      data
    );
    return response.data;
  },

  registerWithPassword: async (data: RegisterData) => {
    const response = await api.post(`${BASE_API_URL}${REGISTER}`, data);
    return response.data;
  },

  sendOtpForLogin: async (data: LoginWithOtpData) => {
    const response = await api.post(
      `${BASE_API_URL}${LOGIN_WITH_OTP}?email=${data?.email}`
    );
    return response.data;
  },

  verifyOtpForLogin: async (data: VerifyOtpForLogin) => {
    const response = await api.patch(
      `${BASE_API_URL}${VERIFY_LOGIN_OTP}`,
      data
    );
    return response.data;
  },
};
