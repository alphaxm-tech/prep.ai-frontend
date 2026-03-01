import { useQuery } from "@tanstack/react-query";
import { ccgService } from "@/utils/services/ccg.service";
import { Course } from "@/utils/api/types/ccg.types";

export type GetAllCoursesResponse = {
  Courses: Course[];
};

export const useGetAllCourses = () => {
  return useQuery<GetAllCoursesResponse>({
    queryKey: ["ccg", "courses"],
    queryFn: ccgService.getAllCourses,
  });
};
