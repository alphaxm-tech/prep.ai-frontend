import api from "@/server-api/api/axios";
import {
  ADMIN,
  ASSESSMENT,
  ASSESSMENTS,
  BASE_API_URL,
  STATUS,
} from "@/constants/api-endpoints";
import {
  AdminAssessmentResponse,
  AttachQuestionsToAssessmentRequest,
  CreateAssessmentAdminRequest,
  GetAssessmentsForAdminParams,
  UpdateAssessmentStatusRequest,
} from "@/server-api/api/types/assessment-admin.types";

export const assessmentAdminService = {
  getAssessmentsForAdmin: async (
    params: GetAssessmentsForAdminParams,
  ): Promise<{ assessments: AdminAssessmentResponse[]; total_count: number }> => {
    const response = await api.get(
      `${BASE_API_URL}/${ASSESSMENT}/${ADMIN}/${ASSESSMENTS}`,
      {
        params: {
          search: params.search || undefined,
          status: params.status && params.status !== "All" ? params.status : undefined,
          page_no: params.pageNo,
          count: params.count,
        },
      },
    );
    return response.data;
  },

  createAssessment: async (
    req: CreateAssessmentAdminRequest,
  ): Promise<{ assessment: { AssessmentID: number } }> => {
    const response = await api.post(
      `${BASE_API_URL}/${ASSESSMENT}/create-new-assessment`,
      req,
    );
    return response.data;
  },

  attachQuestions: async (req: AttachQuestionsToAssessmentRequest): Promise<void> => {
    await api.post(
      `${BASE_API_URL}/${ASSESSMENT}/attach-questions-to-assessment`,
      req,
    );
  },

  updateStatus: async (
    assessmentId: number,
    req: UpdateAssessmentStatusRequest,
  ): Promise<void> => {
    await api.patch(
      `${BASE_API_URL}/${ASSESSMENT}/${ADMIN}/${ASSESSMENTS}/${assessmentId}/${STATUS}`,
      req,
    );
  },

  deleteAssessment: async (assessmentId: number): Promise<void> => {
    await api.delete(
      `${BASE_API_URL}/${ASSESSMENT}/${ADMIN}/${ASSESSMENTS}/${assessmentId}`,
    );
  },
};
