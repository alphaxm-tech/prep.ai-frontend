import {
  BASE_API_URL,
  GET_RESUME_FORMATS,
  GET_SKILLS_MASTER,
  RESUME,
} from "../api/endpoints";
import api from "@/utils/api/axios";
import {
  GetResumeFormatsResponse,
  GetSkillsMasterResponse,
  ResumeFormat,
} from "../api/types/resume.types";
import { ResumeData } from "../api/types/education.types";

export const resumeService = {
  getResumeFormats: async (): Promise<GetResumeFormatsResponse> => {
    const response = await api.get(
      `${BASE_API_URL}/${RESUME}/${GET_RESUME_FORMATS}`
    );
    return response.data;
  },

  saveResume: async (data: ResumeData) => {
    const response = await api.post(
      `${BASE_API_URL}/${RESUME}/${GET_RESUME_FORMATS}`,
      data
    );
  },

  getSkillsMaster: async (): Promise<GetSkillsMasterResponse> => {
    const response = await api.get(
      `${BASE_API_URL}/${RESUME}/${GET_SKILLS_MASTER}`
    );
    return response.data;
  },
};
