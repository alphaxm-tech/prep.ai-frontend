import {
  BASE_API_URL,
  GET_COMPLETE_RESUME_BY_ID,
  GET_PENDING_SKILLS,
  GET_RESUME_FORMATS,
  GET_SKILLS_MASTER,
  GET_USERS_ALL_RESUMES,
  POST_REQUEST_SKILL,
  POST_SAVE_RESUME,
  RESUME,
  SKILLS_ADMIN,
} from "../../constants/api-endpoints";
import api from "@/server-api/api/axios";
import {
  AddResumeRequest,
  GetResumeFormatsResponse,
  GetSkillsMasterResponse,
  PendingSkillsResponse,
  RequestSkillResponse,
  ResumeFormat,
  ResumeResponse,
  UsersResumeResponse,
} from "../api/types/resume.types";

export const resumeService = {
  getResumeFormats: async (): Promise<GetResumeFormatsResponse> => {
    const response = await api.get(
      `${BASE_API_URL}/${RESUME}/${GET_RESUME_FORMATS}`,
    );
    return response.data;
  },

  saveResume: async (data: AddResumeRequest): Promise<void> => {
    const response = await api.post(
      `${BASE_API_URL}/${RESUME}/${POST_SAVE_RESUME}`,
      data,
    );

    return response.data;
  },

  getSkillsMaster: async (): Promise<GetSkillsMasterResponse> => {
    const response = await api.get(
      `${BASE_API_URL}/${RESUME}/${GET_SKILLS_MASTER}`,
    );
    return response.data;
  },

  getUsersAllResumes: async (): Promise<UsersResumeResponse> => {
    const response = await api.get(
      `${BASE_API_URL}/${RESUME}/${GET_USERS_ALL_RESUMES}`,
    );

    return response.data;
  },

  getCompleteResumeByID: async (resumeId: string): Promise<ResumeResponse> => {
    const response = await api.get(
      `${BASE_API_URL}/${RESUME}/${GET_COMPLETE_RESUME_BY_ID}/${resumeId}`,
    );
    return response.data;
  },

  requestSkill: async (name: string): Promise<RequestSkillResponse> => {
    const response = await api.post(
      `${BASE_API_URL}/${RESUME}/${POST_REQUEST_SKILL}`,
      { name },
    );
    return response.data;
  },

  getPendingSkills: async (): Promise<PendingSkillsResponse> => {
    const response = await api.get(
      `${BASE_API_URL}/${RESUME}/${GET_PENDING_SKILLS}`,
    );
    return response.data;
  },

  reviewSkill: async (params: {
    skillId: number;
    action: "approve" | "reject";
  }): Promise<{ message: string }> => {
    const response = await api.post(
      `${BASE_API_URL}/${RESUME}/${SKILLS_ADMIN}/${params.skillId}/review`,
      { action: params.action },
    );
    return response.data;
  },
};
