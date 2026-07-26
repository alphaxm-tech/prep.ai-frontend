import api from "@/server-api/api/axios";
import {
  BASE_API_URL,
  ASSESSMENT_REPORTS,
  ASSESSMENTS,
  EXPORT,
} from "@/constants/api-endpoints";
import {
  AssessmentSummaryItem,
  AssessmentReportResponse,
} from "@/server-api/api/types/assessment-report.types";

export const assessmentReportService = {
  listAssessmentsForReport: async (
    collegeId: number,
    assessmentType?: string,
  ): Promise<AssessmentSummaryItem[]> => {
    const response = await api.get<{
      success: boolean;
      data: AssessmentSummaryItem[];
    }>(`${BASE_API_URL}/${ASSESSMENT_REPORTS}/${ASSESSMENTS}`, {
      params: {
        college_id: collegeId,
        assessment_type: assessmentType || undefined,
      },
    });
    return response.data.data;
  },

  getAssessmentReport: async (
    collegeId: number,
    assessmentId: number,
  ): Promise<AssessmentReportResponse> => {
    const response = await api.get<{
      success: boolean;
      data: AssessmentReportResponse;
    }>(`${BASE_API_URL}/${ASSESSMENT_REPORTS}/${ASSESSMENTS}/${assessmentId}`, {
      params: { college_id: collegeId },
    });
    return response.data.data;
  },

  exportAssessmentReport: async (
    collegeId: number,
    assessmentId: number,
    fallbackFilename: string,
  ): Promise<void> => {
    const response = await api.get<Blob>(
      `${BASE_API_URL}/${ASSESSMENT_REPORTS}/${ASSESSMENTS}/${assessmentId}/${EXPORT}`,
      { params: { college_id: collegeId }, responseType: "blob" },
    );

    const disposition = response.headers["content-disposition"] as
      | string
      | undefined;
    const match = disposition?.match(/filename="?([^"]+)"?/);
    const filename = match?.[1] || fallbackFilename;

    const url = URL.createObjectURL(response.data);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  },
};
