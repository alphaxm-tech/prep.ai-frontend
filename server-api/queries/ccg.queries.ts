import { useQuery } from "@tanstack/react-query";
import { ccgService } from "@/server-api/services/ccg.service";
import { Course } from "@/server-api/api/types/ccg.types";

export type GetAllCoursesResponse = {
  data: Course[];
};

export const useGetAllCourses = () => {
  return useQuery<GetAllCoursesResponse>({
    queryKey: ["ccg", "courses"],
    queryFn: ccgService.getAllCourses,
  });
};

export const useGetAllGroups = (collegeId?: number) => {
  return useQuery({
    queryKey: ["ccg", "groups", collegeId ?? "all"],
    queryFn: () => ccgService.getAllGroups(collegeId),
  });
};
