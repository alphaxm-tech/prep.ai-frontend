import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { studentService } from "@/server-api/services/student.service";
import { ListStudentsParams } from "@/server-api/api/types/student.types";

export const useListStudents = (params: ListStudentsParams) => {
  return useQuery({
    queryKey: ["students", "list", params],
    queryFn: () => studentService.listStudents(params),
    enabled: !!params.college_id,
    placeholderData: keepPreviousData,
  });
};

export const useStudentFilterOptions = (collegeId: number) => {
  return useQuery({
    queryKey: ["students", "filter-options", collegeId],
    queryFn: () => studentService.getFilterOptions(collegeId),
    enabled: !!collegeId,
  });
};

export const useStudentProfile = (collegeId: number, userId: number) => {
  return useQuery({
    queryKey: ["students", "profile", collegeId, userId],
    queryFn: () => studentService.getStudentProfile(collegeId, userId),
    enabled: !!collegeId && !!userId,
  });
};
