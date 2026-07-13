import { useQuery } from "@tanstack/react-query";
import { assessmentAdminService } from "@/server-api/services/assessment-admin.service";
import { GetAssessmentsForAdminParams } from "@/server-api/api/types/assessment-admin.types";

export const useGetAssessmentsForAdmin = (params: GetAssessmentsForAdminParams) => {
  return useQuery({
    queryKey: [
      "assessment-admin",
      "list",
      params.search,
      params.status,
      params.pageNo,
      params.count,
    ],
    queryFn: () => assessmentAdminService.getAssessmentsForAdmin(params),
  });
};
