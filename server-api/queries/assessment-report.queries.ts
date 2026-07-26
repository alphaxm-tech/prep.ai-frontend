import { useQuery } from "@tanstack/react-query";
import { assessmentReportService } from "@/server-api/services/assessment-report.service";

export const useAssessmentsForReport = (
  collegeId: number,
  assessmentType?: string,
) => {
  return useQuery({
    queryKey: ["assessment-reports", "assessments", collegeId, assessmentType],
    queryFn: () =>
      assessmentReportService.listAssessmentsForReport(
        collegeId,
        assessmentType,
      ),
    enabled: !!collegeId,
  });
};

export const useAssessmentReport = (
  collegeId: number,
  assessmentId: number | null,
) => {
  return useQuery({
    queryKey: ["assessment-reports", "report", collegeId, assessmentId],
    queryFn: () =>
      assessmentReportService.getAssessmentReport(
        collegeId,
        assessmentId as number,
      ),
    enabled: !!collegeId && !!assessmentId,
  });
};
