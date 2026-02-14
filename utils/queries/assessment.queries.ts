import { useQuery } from "@tanstack/react-query";
import { assessmentService } from "../services/assessment.service";
import { QUERY_DEFAULTS } from "@/lib/queryClient";
import { GetAssessmentParams } from "../api/types/assessment.types";

export const useGetAllAssessments = (params: GetAssessmentParams) => {
  return useQuery({
    queryKey: ["assessments", params.groups, params.assessmentType],
    queryFn: () => assessmentService.getAssessments(params),
    enabled: !!params.groups?.length, // optional safety
  });
};
