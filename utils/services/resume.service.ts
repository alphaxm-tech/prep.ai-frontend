import {
  BASE_API_URL,
  GET_RESUME_FORMATS,
  GET_SKILLS_MASTER,
  GET_USERS_ALL_RESUMES,
  POST_SAVE_RESUME,
  RESUME,
} from "../api/endpoints";
import api from "@/utils/api/axios";
import {
  AddResumeRequest,
  GetResumeFormatsResponse,
  GetSkillsMasterResponse,
  ResumeFormat,
  UsersResumeResponse,
} from "../api/types/resume.types";

export const resumeService = {
  getResumeFormats: async (): Promise<GetResumeFormatsResponse> => {
    const response = await api.get(
      `${BASE_API_URL}/${RESUME}/${GET_RESUME_FORMATS}`
    );
    return response.data;
  },

  saveResume: async (data: AddResumeRequest): Promise<void> => {
    const response = await api.post(
      `${BASE_API_URL}/${RESUME}/${POST_SAVE_RESUME}`,
      data
    );

    return response.data;
  },

  getSkillsMaster: async (): Promise<GetSkillsMasterResponse> => {
    const response = await api.get(
      `${BASE_API_URL}/${RESUME}/${GET_SKILLS_MASTER}`
    );
    return response.data;
  },

  getUsersAllResumes: async (): Promise<UsersResumeResponse> => {
    const response = await api.get(
      `${BASE_API_URL}/${RESUME}/${GET_USERS_ALL_RESUMES}`
    );

    return response.data;
  },
};
