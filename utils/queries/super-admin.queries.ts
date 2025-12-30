import { useQuery } from "@tanstack/react-query";
import { superAdminService } from "@/utils/services/super-admin.service";
import { Course } from "@/utils/api/types/super-admin.types";

export type GetAllCoursesResponse = {
  Courses: Course[];
};

export const useGetAllCourses = () => {
  return useQuery<GetAllCoursesResponse>({
    queryKey: ["super-admin", "courses"],
    queryFn: superAdminService.getAllCourses,
  });
};
