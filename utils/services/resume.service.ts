import api from "@/lib/axios";
import { BASE_API_URL, GET_RESUME_FORMATS } from "../CONSTANTS";

export const resumeService = {
  getResumeFormats: async () => {
    const response = await api.get(BASE_API_URL() + GET_RESUME_FORMATS());
    return response.data;
  },
};
