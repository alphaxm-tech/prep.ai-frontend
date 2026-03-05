import api from "@/utils/api/axios";
import { BASE_API_URL, GET_USER_DETAILS_ALL, HOME, ME } from "../api/endpoints";
import { GetUserDetailsAlldResponse } from "../api/types/home.types";

export const homeService = {
  getMeDetails: async (): Promise<any> => {
    const response = await api.get(`${BASE_API_URL}/${HOME}/${ME}`);

    return response.data;
  },
};
