import api from "@/server-api/api/axios";
import {
  ACCEPT,
  ADMIN,
  BASE_API_URL,
  QB_QUESTIONS,
  QUESTION_BANK,
  TAGS,
  UPLOAD,
  UPLOADS,
} from "@/constants/api-endpoints";
import {
  AcceptUploadJobRequest,
  AcceptUploadJobResponse,
  CreateQuestionRequest,
  GetQuestionsParams,
  GetQuestionsResponse,
  QuestionType,
  TagOption,
  UploadJobResponse,
  UploadJobStatusResponse,
} from "@/server-api/api/types/question-bank-admin.types";

export const questionBankAdminService = {
  listQuestions: async (params: GetQuestionsParams): Promise<GetQuestionsResponse> => {
    const response = await api.get<GetQuestionsResponse>(
      `${BASE_API_URL}/${QUESTION_BANK}/${QB_QUESTIONS}`,
      { params },
    );
    return response.data;
  },

  listTags: async (): Promise<TagOption[]> => {
    const response = await api.get<{ tags: TagOption[] }>(
      `${BASE_API_URL}/${QUESTION_BANK}/${ADMIN}/${TAGS}`,
    );
    return response.data.tags;
  },

  createQuestion: async (req: CreateQuestionRequest): Promise<void> => {
    await api.post(`${BASE_API_URL}/${QUESTION_BANK}/${ADMIN}/${QB_QUESTIONS}`, req);
  },

  uploadDocument: async (
    file: File,
    questionType: QuestionType,
    targetAssessmentId?: number,
  ): Promise<UploadJobResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("question_type", questionType);
    if (targetAssessmentId) {
      formData.append("target_assessment_id", String(targetAssessmentId));
    }

    const response = await api.post<{ job: UploadJobResponse }>(
      `${BASE_API_URL}/${QUESTION_BANK}/${ADMIN}/${UPLOAD}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return response.data.job;
  },

  listUploadJobs: async (): Promise<UploadJobStatusResponse[]> => {
    const response = await api.get<{ jobs: UploadJobStatusResponse[] }>(
      `${BASE_API_URL}/${QUESTION_BANK}/${ADMIN}/${UPLOADS}`,
    );
    return response.data.jobs;
  },

  getUploadJob: async (jobId: number): Promise<UploadJobStatusResponse> => {
    const response = await api.get<{ job: UploadJobStatusResponse }>(
      `${BASE_API_URL}/${QUESTION_BANK}/${ADMIN}/${UPLOADS}/${jobId}`,
    );
    return response.data.job;
  },

  acceptUploadJob: async (
    jobId: number,
    req: AcceptUploadJobRequest,
  ): Promise<AcceptUploadJobResponse> => {
    const response = await api.post<{ result: AcceptUploadJobResponse }>(
      `${BASE_API_URL}/${QUESTION_BANK}/${ADMIN}/${UPLOADS}/${jobId}/${ACCEPT}`,
      req,
    );
    return response.data.result;
  },
};
