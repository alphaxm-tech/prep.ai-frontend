import api from "@/lib/axios";
import { BASE_API_URL, LOGIN_WITH_PASSWORD, REGISTER } from "../CONSTANTS";

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
};
