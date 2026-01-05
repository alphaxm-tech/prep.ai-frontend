import api from "@/utils/api/axios";
import { BASE_API_URL, GET_USER_DETAILS_ALL, HOME } from "../api/endpoints";
import { GetUserDetailsAlldResponse } from "../api/types/home.types";

export const homeService = {
  getUserDetailsAll: async (): Promise<GetUserDetailsAlldResponse> => {
    const response = await api.get(
      `${BASE_API_URL}/${HOME}/${GET_USER_DETAILS_ALL}`
    );

    return response.data;
  },
  getUserServices: async (data: any) => {},
  getUserLearningPath: async (data: any) => {},
};
